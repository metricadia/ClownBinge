/**
 * Admin OTP + One-Time Token System
 *
 * Flow:
 *   1. POST /api/admin/request-otp  — generates 6-digit OTP, emails it to ADMIN_EMAIL
 *   2. POST /api/admin/verify-otp   — verifies OTP (one-time), returns UUID token
 *   3. GET  /api/admin/activate/:uuid — validates UUID (one-time, 15 min), issues admin session
 *
 * No static path grants access.  /Kemet8 requires a live session.
 */

import { Router } from "express";
import { createTransport } from "nodemailer";
import { randomInt, randomUUID } from "crypto";
import rateLimit from "express-rate-limit";
import { generateToken, tokenToSessionId } from "../editor-routes";

const router = Router();

const ADMIN_EMAIL = process.env.ADMIN_OTP_DEST ?? "metricadia@pm.me";

// ── In-memory stores ────────────────────────────────────────────────────────
// OTP store: single entry keyed to "admin" (only one admin)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// UUID token store: keyed to UUID string
const tokenStore = new Map<string, { expiresAt: number; used: boolean }>();

// ── Rate limits ──────────────────────────────────────────────────────────────
const requestOtpLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many OTP requests. Try again later." },
});
const verifyOtpLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many verify attempts. Try again later." },
});

// ── Nodemailer transport factory ─────────────────────────────────────────────
function makeTransport() {
  return createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ── POST /api/admin/request-otp ──────────────────────────────────────────────
router.post("/admin/request-otp", requestOtpLimit, async (_req, res) => {
  const otp = String(randomInt(100_000, 1_000_000)); // 6-digit
  const expiresAt = Date.now() + 10 * 60 * 1_000;    // 10 min

  otpStore.set("admin", { otp, expiresAt });
  setTimeout(() => otpStore.delete("admin"), 10 * 60 * 1_000);

  try {
    const transport = makeTransport();
    await transport.sendMail({
      from: process.env.SMTP_FROM ?? "admin@clownbinge.com",
      to: ADMIN_EMAIL,
      subject: "ClownBinge Admin Access Code",
      text: [
        `Your one-time admin access code:`,
        ``,
        `  ${otp}`,
        ``,
        `This code expires in 10 minutes.`,
        `If you did not request this, ignore this email.`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[admin/request-otp] email error:", err);
    otpStore.delete("admin");
    return res.status(500).json({ error: "Failed to send OTP email. Check SMTP configuration." });
  }

  return res.json({ ok: true });
});

// ── POST /api/admin/verify-otp ───────────────────────────────────────────────
router.post("/admin/verify-otp", verifyOtpLimit, (req, res) => {
  const { otp } = req.body as { otp?: string };
  if (!otp?.trim()) return res.status(400).json({ error: "OTP required." });

  const entry = otpStore.get("admin");
  if (!entry || Date.now() > entry.expiresAt) {
    otpStore.delete("admin");
    return res.status(401).json({ error: "OTP expired or not issued." });
  }

  if (entry.otp !== otp.trim()) {
    return res.status(401).json({ error: "Invalid OTP." });
  }

  // Consume immediately — cannot reuse
  otpStore.delete("admin");

  // Generate UUID one-time token (15 min TTL)
  const uuid = randomUUID();
  const tokenExpiry = Date.now() + 15 * 60 * 1_000;
  tokenStore.set(uuid, { expiresAt: tokenExpiry, used: false });
  setTimeout(() => tokenStore.delete(uuid), 15 * 60 * 1_000);

  return res.json({ ok: true, token: uuid });
});

// ── GET /api/admin/activate/:uuid ────────────────────────────────────────────
router.get("/admin/activate/:uuid", (req, res) => {
  const { uuid } = req.params;
  const entry = tokenStore.get(uuid);

  if (!entry || entry.used || Date.now() > entry.expiresAt) {
    tokenStore.delete(uuid);
    return res.status(401).json({ error: "Token invalid, already used, or expired." });
  }

  // Burn the token immediately
  entry.used = true;
  tokenStore.set(uuid, entry);

  // Create admin session + bearer token
  req.session.regenerate((err) => {
    if (err) {
      console.error("[admin/activate] session regenerate error:", err);
      return res.status(500).json({ error: "Session error." });
    }

    (req.session as any).metricadiaAdmin = true;

    const adminToken = generateToken();
    const sessionId = req.session.id;
    tokenToSessionId.set(adminToken, sessionId);
    // 24-hour bearer token
    setTimeout(() => tokenToSessionId.delete(adminToken), 24 * 60 * 60 * 1_000);
    (req.session as any).adminToken = adminToken;

    return res.json({ ok: true, token: adminToken });
  });
});

export default router;
