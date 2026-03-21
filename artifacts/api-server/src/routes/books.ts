import { Router, type IRouter } from "express";
import { db, booksTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/books", async (req, res) => {
  try {
    const books = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.active, true));

    res.json({
      books: books.map((b) => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        description: b.description,
        priceUsd: Number(b.priceUsd),
        stripeId: b.stripeId,
        coverUrl: b.coverUrl,
        language: b.language,
        active: b.active,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Error listing books");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
