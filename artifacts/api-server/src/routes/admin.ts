import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, postsTable, productsTable } from "@workspace/db";
import {
  CreateProductBody,
  UpdateProductBody,
  CreatePostBody,
  UpdatePostBody,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";
import { serializePost, serializeProduct } from "../lib/serializers";

const router: IRouter = Router();

router.use("/admin", requireAdmin);

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [pRow] = await db
    .select({
      totalProducts: sql<number>`count(*)::int`,
      featuredProducts: sql<number>`sum(case when ${productsTable.featured} then 1 else 0 end)::int`,
      outOfStockProducts: sql<number>`sum(case when ${productsTable.inStock} = false then 1 else 0 end)::int`,
    })
    .from(productsTable);
  const [poRow] = await db
    .select({
      totalPosts: sql<number>`count(*)::int`,
      publishedPosts: sql<number>`sum(case when ${postsTable.published} then 1 else 0 end)::int`,
    })
    .from(postsTable);
  const [catRow] = await db
    .select({
      totalCategories: sql<number>`count(distinct ${productsTable.categorySlug})::int`,
    })
    .from(productsTable);

  res.json({
    totalProducts: pRow?.totalProducts ?? 0,
    featuredProducts: pRow?.featuredProducts ?? 0,
    outOfStockProducts: pRow?.outOfStockProducts ?? 0,
    totalPosts: poRow?.totalPosts ?? 0,
    publishedPosts: poRow?.publishedPosts ?? 0,
    totalCategories: catRow?.totalCategories ?? 0,
  });
});

router.get("/admin/products", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .orderBy(desc(productsTable.createdAt));
  res.json(rows.map(serializeProduct));
});

function toDbProduct(input: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...input };
  if (typeof out.price === "number") out.price = String(out.price);
  if (typeof out.salePrice === "number") out.salePrice = String(out.salePrice);
  if (typeof out.powerKw === "number") out.powerKw = String(out.powerKw);
  if (typeof out.weightKg === "number") out.weightKg = String(out.weightKg);
  return out;
}

router.post("/admin/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [row] = await db
      .insert(productsTable)
      .values(toDbProduct(parsed.data) as never)
      .returning();
    res.status(201).json(serializeProduct(row));
  } catch (err: unknown) {
    req.log.error({ err }, "Create product failed");
    res.status(400).json({ error: "Slug đã tồn tại hoặc dữ liệu không hợp lệ" });
  }
});

router.patch("/admin/products/:id", async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "ID không hợp lệ" });
    return;
  }
  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [row] = await db
      .update(productsTable)
      .set(toDbProduct(parsed.data) as never)
      .where(eq(productsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Không tìm thấy sản phẩm" });
      return;
    }
    res.json(serializeProduct(row));
  } catch (err: unknown) {
    req.log.error({ err }, "Update product failed");
    res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  }
});

router.delete("/admin/products/:id", async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "ID không hợp lệ" });
    return;
  }
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.sendStatus(204);
});

router.get("/admin/posts", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(postsTable)
    .orderBy(desc(postsTable.createdAt));
  res.json(rows.map(serializePost));
});

router.post("/admin/posts", async (req, res): Promise<void> => {
  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const values = {
      ...parsed.data,
      publishedAt: parsed.data.published ? new Date() : null,
    };
    const [row] = await db
      .insert(postsTable)
      .values(values as never)
      .returning();
    res.status(201).json(serializePost(row));
  } catch (err: unknown) {
    req.log.error({ err }, "Create post failed");
    res.status(400).json({ error: "Slug đã tồn tại hoặc dữ liệu không hợp lệ" });
  }
});

router.patch("/admin/posts/:id", async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "ID không hợp lệ" });
    return;
  }
  const parsed = UpdatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [existing] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Không tìm thấy bài viết" });
      return;
    }
    const updates: Record<string, unknown> = { ...parsed.data };
    if (
      parsed.data.published === true &&
      !existing.published &&
      !existing.publishedAt
    ) {
      updates.publishedAt = new Date();
    }
    const [row] = await db
      .update(postsTable)
      .set(updates as never)
      .where(eq(postsTable.id, id))
      .returning();
    res.json(serializePost(row));
  } catch (err: unknown) {
    req.log.error({ err }, "Update post failed");
    res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  }
});

router.delete("/admin/posts/:id", async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "ID không hợp lệ" });
    return;
  }
  await db.delete(postsTable).where(eq(postsTable.id, id));
  res.sendStatus(204);
});

export default router;
