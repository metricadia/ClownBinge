import { Router, type IRouter, type Request, type Response } from "express";
import { db, subscriberTokensTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

const COOKIE_NAME = "cb_sub";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

router.get("/subscription/status", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      res.json({ isSubscriber: false });
      return;
    }

    const [row] = await db
      .select({ active: subscriberTokensTable.active, expiresAt: subscriberTokensTable.expiresAt })
      .from(subscriberTokensTable)
      .where(eq(subscriberTokensTable.token, token))
      .limit(1);

    if (!row) {
      res.clearCookie(COOKIE_NAME, { path: "/" });
      res.json({ isSubscriber: false });
      return;
    }

    if (!row.active) {
      res.clearCookie(COOKIE_NAME, { path: "/" });
      res.json({ isSubscriber: false, reason: "revoked" });
      return;
    }

    if (row.expiresAt && row.expiresAt < new Date()) {
      res.clearCookie(COOKIE_NAME, { path: "/" });
      res.json({ isSubscriber: false, reason: "expired" });
      return;
    }

    res.json({ isSubscriber: true });
  } catch (err) {
    req.log?.error({ err }, "subscription status error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/subscription/activate", async (req: Request, res: Response) => {
  try {
    const { token } = req.body as { token?: string };
    if (!token || typeof token !== "string" || token.length < 10) {
      res.status(400).json({ error: "Invalid token" });
      return;
    }

    const [row] = await db
      .select()
      .from(subscriberTokensTable)
      .where(and(eq(subscriberTokensTable.token, token), eq(subscriberTokensTable.active, true)))
      .limit(1);

    if (!row) {
      res.status(404).json({ error: "Token not found or inactive" });
      return;
    }

    if (row.expiresAt && row.expiresAt < new Date()) {
      res.status(410).json({ error: "Token has expired" });
      return;
    }

    res
      .cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      })
      .json({ success: true, label: row.label });
  } catch (err) {
    req.log?.error({ err }, "subscription activate error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/subscription/deactivate", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: "/" }).json({ success: true });
});

export default router;
