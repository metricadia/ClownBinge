import { Router, type IRouter } from "express";
import { db, subscribersTable } from "@workspace/db";
import { SubscribeBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/subscribers", async (req, res) => {
  try {
    const body = SubscribeBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }

    await db
      .insert(subscribersTable)
      .values({ email: body.data.email, source: body.data.source })
      .onConflictDoNothing();

    res.json({ success: true, message: "You're on the list. The receipts will find you." });
  } catch (err: any) {
    if (err?.code === "23505") {
      res.status(409).json({ error: "Already subscribed" });
      return;
    }
    req.log.error({ err }, "Error subscribing");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
