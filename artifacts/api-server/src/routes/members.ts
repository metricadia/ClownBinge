import { Router } from "express";
import { db } from "@workspace/db";
import { cbMembersTable } from "@workspace/db/schema";
import { requireMetricadiaAuth } from "../editor-routes";

const router = Router();

// Admin: list all members (Kemet8 access required)
router.get("/members", requireMetricadiaAuth, async (_req, res) => {
  try {
    const members = await db
      .select()
      .from(cbMembersTable)
      .orderBy(cbMembersTable.lastLoginAt);
    return res.json(members);
  } catch (err) {
    console.error("[members] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
