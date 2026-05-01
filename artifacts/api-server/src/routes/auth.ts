import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, adminUsersTable, adminSessionsTable } from "@workspace/db";
import { AdminLoginBody } from "@workspace/api-zod";
import { hashPassword, generateToken, requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, password } = parsed.data;
  const [admin] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.username, username));
  if (!admin || admin.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: "Sai tên đăng nhập hoặc mật khẩu" });
    return;
  }
  const token = generateToken();
  await db
    .insert(adminSessionsTable)
    .values({ token, adminId: admin.id });
  res.json({
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      displayName: admin.displayName,
    },
  });
});

router.get("/auth/me", requireAdmin, async (_req, res): Promise<void> => {
  const admin = (res.locals as { admin: { id: number; username: string; displayName: string } }).admin;
  res.json(admin);
});

export default router;
