/**
 * Admin OTP + One-Time Token System
 *
 * Flow:
 *   1. POST /api/admin/request-otp       — generates 6-digit OTP, emails it to ADMIN_EMAIL
 *   2. POST /api/admin/verify-otp        — verifies OTP (one-time), returns UUID token
 *   3. GET  /api/admin/activate/:uuid    — validates UUID (one-time, 15 min), issues admin session
 *                                          + returns brainPath: "/Brain-Instance-XXXXXXXX"
 *   4. GET  /api/admin/brain-instance/:token — validates + burns Brain-Instance token (one-time, 15 min)
 *
 * No static path grants access. Every admin session entry point is ephemeral.
 */

import { Router } from "express";
import { createTransport } from "nodemailer";
import { randomInt, randomUUID } from "crypto";
import rateLimit from "express-rate-limit";
import { generateToken, tokenToSessionId } from "../editor-routes";

const router = Router();

const ADMIN_EMAIL = process.env.ADMIN_OTP_DEST ?? "metricadia@pm.me";
const BRAIN_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

function generateBrainToken(): string {
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += BRAIN_CHARS[Math.floor(Math.random() * BRAIN_CHARS.length)];
  }
  return result;
}

// ── In-memory stores ─────────────────────────────────────────────────────────
const otpStore          = new Map<string, { otp: string; expiresAt: number }>();
const tokenStore        = new Map<string, { expiresAt: number; used: boolean }>();
const brainInstanceStore = new Map<string, { expiresAt: number; used: boolean }>();

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
  const otp = String(randomInt(100_000, 1_000_000));
  const expiresAt = Date.now() + 10 * 60 * 1_000;

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

  otpStore.delete("admin");

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

  entry.used = true;
  tokenStore.set(uuid, entry);

  req.session.regenerate((err) => {
    if (err) {
      console.error("[admin/activate] session regenerate error:", err);
      return res.status(500).json({ error: "Session error." });
    }

    (req.session as any).metricadiaAdmin = true;

    const adminToken = generateToken();
    const sessionId = req.session.id;
    tokenToSessionId.set(adminToken, sessionId);
    setTimeout(() => tokenToSessionId.delete(adminToken), 24 * 60 * 60 * 1_000);
    (req.session as any).adminToken = adminToken;

    // Generate one-time Brain-Instance URL (15 min TTL)
    const brainToken = generateBrainToken();
    const brainExpiry = Date.now() + 15 * 60 * 1_000;
    brainInstanceStore.set(brainToken, { expiresAt: brainExpiry, used: false });
    setTimeout(() => brainInstanceStore.delete(brainToken), 15 * 60 * 1_000);

    return res.json({
      ok: true,
      token: adminToken,
      brainPath: `/Brain-Instance-${brainToken}`,
    });
  });
});

// ── GET /api/admin/brain-instance/:token ─────────────────────────────────────
// Called by the frontend on first load of the Brain-Instance URL.
// Validates and permanently burns the one-time token.
// The admin session (established by activate/:uuid) is the ongoing auth gate.
router.get("/admin/brain-instance/:token", (req, res) => {
  const { token } = req.params;
  const entry = brainInstanceStore.get(token);

  if (!entry || entry.used || Date.now() > entry.expiresAt) {
    brainInstanceStore.delete(token);
    return res.status(401).json({ error: "Brain-Instance token invalid, already used, or expired." });
  }

  entry.used = true;
  brainInstanceStore.set(token, entry);

  return res.json({ ok: true });
});

export default router;
