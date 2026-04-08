import { Router } from "express";
import { db } from "@workspace/db";
import { membersTable } from "@workspace/db/schema";

import { requireMetricadiaAuth } from "../editor-routes";

const router = Router();

// Called from the frontend when a user signs in via Clerk
// Upserts the member record
router.post("/members/sync", async (req, res) => {
  try {
    const { clerkId, email, name, avatarUrl } = req.body;
    if (!clerkId || !email) {
      return res.status(400).json({ error: "clerkId and email are required" });
    }

    await db
      .insert(membersTable)
      .values({ clerkId, email, name: name ?? null, avatarUrl: avatarUrl ?? null, lastLoginAt: new Date() })
      .onConflictDoUpdate({
        target: membersTable.clerkId,
        set: {
          email,
          name: name ?? null,
          avatarUrl: avatarUrl ?? null,
          lastLoginAt: new Date(),
        },
      });

    return res.json({ ok: true });
  } catch (err) {
    console.error("[members/sync] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: list all members (Kemet8 access required)
router.get("/members", requireMetricadiaAuth, async (_req, res) => {
  try {
    const members = await db
      .select()
      .from(membersTable)
      .orderBy(membersTable.lastLoginAt);
    return res.json(members);
  } catch (err) {
    console.error("[members] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
