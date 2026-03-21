import { Router, type IRouter } from "express";
import { db, reactionsTable, postsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { AddReactionBody, GetReactionsParams } from "@workspace/api-zod";
import crypto from "crypto";

const router: IRouter = Router();

function getIpHash(req: any): string {
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  return crypto.createHash("sha256").update(ip).digest("hex");
}

router.post("/reactions", async (req, res) => {
  try {
    const body = AddReactionBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { postId, type } = body.data;
    const ipHash = getIpHash(req);

    await db
      .insert(reactionsTable)
      .values({ postId, type: type as any, ipHash })
      .onConflictDoNothing();

    const counts = await db
      .select({ type: reactionsTable.type, count: count() })
      .from(reactionsTable)
      .where(eq(reactionsTable.postId, postId))
      .groupBy(reactionsTable.type);

    res.json({
      postId,
      reactions: counts.map((c) => ({ type: c.type, count: Number(c.count) })),
    });
  } catch (err) {
    req.log.error({ err }, "Error adding reaction");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/reactions/:postId", async (req, res) => {
  try {
    const params = GetReactionsParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid parameters" });
      return;
    }

    const counts = await db
      .select({ type: reactionsTable.type, count: count() })
      .from(reactionsTable)
      .where(eq(reactionsTable.postId, params.data.postId))
      .groupBy(reactionsTable.type);

    res.json({
      postId: params.data.postId,
      reactions: counts.map((c) => ({ type: c.type, count: Number(c.count) })),
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching reactions");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
