import { createHash, randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db, adminSessionsTable, adminUsersTable } from "@workspace/db";
import type { Request, Response, NextFunction } from "express";

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export type AuthedAdmin = {
  id: number;
  username: string;
  displayName: string;
};

export function getAdmin(res: Response): AuthedAdmin {
  const admin = (res.locals as { admin?: AuthedAdmin }).admin;
  if (!admin) {
    throw new Error("Admin not loaded — requireAdmin middleware missing");
  }
  return admin;
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const auth = req.header("authorization") ?? "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) {
    res.status(401).json({ error: "Thiếu token xác thực" });
    return;
  }
  const token = m[1].trim();
  const [session] = await db
    .select()
    .from(adminSessionsTable)
    .where(eq(adminSessionsTable.token, token));
  if (!session) {
    res.status(401).json({ error: "Token không hợp lệ" });
    return;
  }
  const [admin] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.id, session.adminId));
  if (!admin) {
    res.status(401).json({ error: "Tài khoản không tồn tại" });
    return;
  }
  res.locals.admin = {
    id: admin.id,
    username: admin.username,
    displayName: admin.displayName,
  } satisfies AuthedAdmin;
  next();
}
