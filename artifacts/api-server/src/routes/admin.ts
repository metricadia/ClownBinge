import { Router } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import rateLimit from "express-rate-limit";

const router = Router();

const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — try again later." },
});

const ADMIN_EMAILS = [
  ...(process.env.ADMIN_CLERK_EMAILS ?? "").split(","),
  ...(process.env.CB_ALLOWED_EMAIL ?? "").split(","),
]
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Auto-grant Kemet8 admin session to whitelisted Clerk users.
// Email is fetched SERVER-SIDE from Clerk — never trusted from the request body.
router.post("/admin/clerk-login", adminRateLimit, async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated with Clerk" });
    }

    // Resolve verified email directly from Clerk — ignore any client-supplied value
    const clerkUser = await clerkClient.users.getUser(userId);
    const primaryEmailId = clerkUser.primaryEmailAddressId;
    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === primaryEmailId,
    )?.emailAddress;

    if (!primaryEmail || !ADMIN_EMAILS.includes(primaryEmail.toLowerCase())) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Regenerate session to prevent session fixation
    req.session.regenerate((err) => {
      if (err) {
        console.error("[admin/clerk-login] session regenerate error:", err);
        return res.status(500).json({ error: "Session error" });
      }
      (req.session as any).metricadiaAdmin = true;
      return res.json({ ok: true });
    });
  } catch (err) {
    console.error("[admin/clerk-login] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
