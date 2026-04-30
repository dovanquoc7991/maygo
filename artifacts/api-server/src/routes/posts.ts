import { Router, type IRouter } from "express";
import { and, eq, ilike, or, desc } from "drizzle-orm";
import { db, postsTable } from "@workspace/db";
import { serializePost } from "../lib/serializers";

const router: IRouter = Router();

router.get("/posts", async (req, res): Promise<void> => {
  const search =
    typeof req.query.search === "string" ? req.query.search : undefined;
  const conds = [eq(postsTable.published, true)] as ReturnType<typeof eq>[];
  if (search) {
    const like = `%${search}%`;
    const sc = or(
      ilike(postsTable.title, like),
      ilike(postsTable.excerpt, like),
    );
    if (sc) conds.push(sc as never);
  }
  const rows = await db
    .select()
    .from(postsTable)
    .where(and(...conds))
    .orderBy(desc(postsTable.publishedAt), desc(postsTable.createdAt));
  res.json(rows.map(serializePost));
});

router.get("/posts/:slug", async (req, res): Promise<void> => {
  const slug = String(req.params.slug);
  const [row] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.slug, slug));
  if (!row || !row.published) {
    res.status(404).json({ error: "Không tìm thấy bài viết" });
    return;
  }
  res.json(serializePost(row));
});

export default router;
