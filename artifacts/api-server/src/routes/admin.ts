import { Router } from "express";
import { getAuth } from "@clerk/express";

const router = Router();

// Merge ADMIN_CLERK_EMAILS and CB_ALLOWED_EMAIL env vars into one whitelist
const ADMIN_EMAILS = [
  ...(process.env.ADMIN_CLERK_EMAILS ?? "").split(","),
  ...(process.env.CB_ALLOWED_EMAIL ?? "").split(","),
]
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Auto-grant Kemet8 admin session to whitelisted Clerk users
// Server verifies Clerk session is active, then checks email whitelist
router.post("/admin/clerk-login", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated with Clerk" });
    }

    const { email } = req.body as { email?: string };
    if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
      return res.status(403).json({ error: "Not authorized" });
    }

    (req.session as any).metricadiaAdmin = true;
    return res.json({ ok: true });
  } catch (err) {
    console.error("[admin/clerk-login] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
