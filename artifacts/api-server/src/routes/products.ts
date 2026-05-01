import { Router, type IRouter } from "express";
import { and, eq, ilike, or, sql, desc } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import { serializeProduct } from "../lib/serializers";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      slug: productsTable.categorySlug,
      name: productsTable.categoryName,
      productCount: sql<number>`count(*)::int`,
    })
    .from(productsTable)
    .groupBy(productsTable.categorySlug, productsTable.categoryName)
    .orderBy(productsTable.categoryName);
  res.json(rows);
});

router.get("/products", async (req, res): Promise<void> => {
  const category =
    typeof req.query.category === "string" ? req.query.category : undefined;
  const search =
    typeof req.query.search === "string" ? req.query.search : undefined;
  const featuredRaw =
    typeof req.query.featured === "string" ? req.query.featured : undefined;
  const featured =
    featuredRaw === "true" ? true : featuredRaw === "false" ? false : undefined;

  const conds = [] as ReturnType<typeof eq>[];
  if (category) conds.push(eq(productsTable.categorySlug, category));
  if (featured !== undefined) conds.push(eq(productsTable.featured, featured));
  if (search) {
    const like = `%${search}%`;
    const searchCond = or(
      ilike(productsTable.name, like),
      ilike(productsTable.shortDescription, like),
      ilike(productsTable.brand, like),
    );
    if (searchCond) conds.push(searchCond as never);
  }

  const rows = await db
    .select()
    .from(productsTable)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(productsTable.featured), desc(productsTable.createdAt));
  res.json(rows.map(serializeProduct));
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.featured, true))
    .orderBy(desc(productsTable.createdAt))
    .limit(8);
  res.json(rows.map(serializeProduct));
});

router.get("/products/:slug", async (req, res): Promise<void> => {
  const slug = String(req.params.slug);
  const [row] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, slug));
  if (!row) {
    res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    return;
  }
  res.json(serializeProduct(row));
});

export default router;
