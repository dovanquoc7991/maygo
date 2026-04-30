import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, postsTable, productsTable } from "@workspace/db";
import { serializePost, serializeProduct } from "../lib/serializers";

const router: IRouter = Router();

router.get("/home/summary", async (_req, res): Promise<void> => {
  const [featuredProducts, latestPosts, categories, totalRow] =
    await Promise.all([
      db
        .select()
        .from(productsTable)
        .where(eq(productsTable.featured, true))
        .orderBy(desc(productsTable.createdAt))
        .limit(6),
      db
        .select()
        .from(postsTable)
        .where(eq(postsTable.published, true))
        .orderBy(desc(postsTable.publishedAt), desc(postsTable.createdAt))
        .limit(4),
      db
        .select({
          slug: productsTable.categorySlug,
          name: productsTable.categoryName,
          productCount: sql<number>`count(*)::int`,
        })
        .from(productsTable)
        .groupBy(productsTable.categorySlug, productsTable.categoryName)
        .orderBy(productsTable.categoryName),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(productsTable),
    ]);

  res.json({
    featuredProducts: featuredProducts.map(serializeProduct),
    latestPosts: latestPosts.map(serializePost),
    categories,
    totalProducts: totalRow[0]?.count ?? 0,
  });
});

export default router;
