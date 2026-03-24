import { Router } from "express";
import { pool } from "@workspace/db";

const router = Router();

router.get("/sponsors/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const result = await pool.query(
      `SELECT sponsor_name, sponsor_url, logo_url, tagline
       FROM category_sponsors
       WHERE category = $1 AND active = true
       LIMIT 1`,
      [category]
    );
    if (result.rows.length === 0) {
      return res.json({ sponsor: null });
    }
    const row = result.rows[0];
    return res.json({
      sponsor: {
        sponsorName: row.sponsor_name,
        sponsorUrl: row.sponsor_url,
        logoUrl: row.logo_url ?? null,
        tagline: row.tagline ?? null,
      },
    });
  } catch (err: any) {
    if (err?.code === "42P01") {
      return res.json({ sponsor: null });
    }
    console.error("sponsors route error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
