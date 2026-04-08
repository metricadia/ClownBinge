import { Router } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { db } from "@workspace/db";
import { membersTable } from "@workspace/db/schema";
import { requireMetricadiaAuth } from "../editor-routes";

const router = Router();

// Called from the frontend when a user signs in via Clerk.
// All user data is fetched server-side from Clerk — nothing is trusted from the request body.
router.post("/members/sync", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Fetch verified user data from Clerk — never use client-supplied values
    const clerkUser = await clerkClient.users.getUser(userId);
    const primaryEmailId = clerkUser.primaryEmailAddressId;
    const email = clerkUser.emailAddresses.find(
      (e) => e.id === primaryEmailId,
    )?.emailAddress;

    if (!email) {
      return res.status(400).json({ error: "No verified email on Clerk account" });
    }

    const name = clerkUser.fullName || clerkUser.username || null;
    const avatarUrl = clerkUser.imageUrl || null;

    await db
      .insert(membersTable)
      .values({ clerkId: userId, email, name, avatarUrl, lastLoginAt: new Date() })
      .onConflictDoUpdate({
        target: membersTable.clerkId,
        set: { email, name, avatarUrl, lastLoginAt: new Date() },
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
