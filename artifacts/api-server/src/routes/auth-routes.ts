/**
 * Self-hosted member auth routes.
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/logout
 * GET  /api/auth/me
 * GET  /api/auth/verify-email?token=...
 * POST /api/auth/resend-verification
 */
import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import rateLimit from "express-rate-limit";
import { createTransport } from "nodemailer";
import { db } from "@workspace/db";
import { cbMembersTable } from "@workspace/db/schema";
import { signCbJwt, cbAuthMiddleware, requireCbAuth } from "../middlewares/auth-middleware";

const router = Router();

const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

const CB_DOMAIN = process.env.CB_DOMAIN ?? "https://clownbinge.com";

function makeTransport() {
  return createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function setCbCookie(res: import("express").Response, token: string) {
  res.cookie("cb_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post("/auth/register", authLimit, async (req, res) => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const normalEmail = email.trim().toLowerCase();

  const existing = await db.select({ id: cbMembersTable.id }).from(cbMembersTable).where(eq(cbMembersTable.email, normalEmail));
  if (existing.length > 0) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const verifyToken = randomBytes(32).toString("hex");
  const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  const [member] = await db.insert(cbMembersTable).values({
    email: normalEmail,
    passwordHash,
    name: name?.trim() || null,
    emailVerified: false,
    emailVerifyToken: verifyToken,
    verifyTokenExpiresAt: verifyExpiry,
    lastLoginAt: new Date(),
  }).returning();

  // Send verification email (fire-and-forget — don't block registration)
  try {
    const transport = makeTransport();
    const verifyUrl = `${CB_DOMAIN}/api/auth/verify-email?token=${verifyToken}`;
    await transport.sendMail({
      from: process.env.SMTP_FROM ?? "noreply@clownbinge.com",
      to: normalEmail,
      subject: "Verify your ClownBinge account",
      text: [
        `Welcome to ClownBinge${name ? `, ${name.trim()}` : ""}!`,
        ``,
        `Please verify your email address by visiting:`,
        `${verifyUrl}`,
        ``,
        `This link expires in 24 hours.`,
        ``,
        `If you did not create an account, you can ignore this email.`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[auth/register] email error:", err);
  }

  const token = signCbJwt({ id: member.id, email: member.email, name: member.name ?? null, emailVerified: false });
  setCbCookie(res, token);

  return res.status(201).json({
    ok: true,
    user: { id: member.id, email: member.email, name: member.name, emailVerified: false },
  });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post("/auth/login", authLimit, async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalEmail = email.trim().toLowerCase();
  const [member] = await db.select().from(cbMembersTable).where(eq(cbMembersTable.email, normalEmail));

  if (!member || !member.passwordHash) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const valid = await bcrypt.compare(password, member.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  await db.update(cbMembersTable).set({ lastLoginAt: new Date() }).where(eq(cbMembersTable.id, member.id));

  const token = signCbJwt({
    id: member.id,
    email: member.email,
    name: member.name ?? null,
    emailVerified: member.emailVerified,
  });
  setCbCookie(res, token);

  return res.json({
    ok: true,
    user: { id: member.id, email: member.email, name: member.name, emailVerified: member.emailVerified },
  });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post("/auth/logout", (_req, res) => {
  res.clearCookie("cb_auth", { path: "/" });
  return res.json({ ok: true });
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get("/auth/me", cbAuthMiddleware, requireCbAuth, (req, res) => {
  return res.json({ user: req.cbUser });
});

// ── GET /api/auth/verify-email?token=... ─────────────────────────────────────
router.get("/auth/verify-email", async (req, res) => {
  const { token } = req.query as { token?: string };
  if (!token) return res.status(400).send("Missing token.");

  const [member] = await db.select().from(cbMembersTable).where(eq(cbMembersTable.emailVerifyToken, token));

  if (!member) return res.status(400).send("Invalid or already-used verification link.");
  if (member.verifyTokenExpiresAt && member.verifyTokenExpiresAt < new Date()) {
    return res.status(400).send("Verification link has expired. Please request a new one.");
  }

  await db.update(cbMembersTable).set({
    emailVerified: true,
    emailVerifyToken: null,
    verifyTokenExpiresAt: null,
  }).where(eq(cbMembersTable.id, member.id));

  // Redirect to account page with success
  return res.redirect(`${CB_DOMAIN}/account?verified=1`);
});

// ── POST /api/auth/resend-verification ───────────────────────────────────────
router.post("/auth/resend-verification", authLimit, cbAuthMiddleware, requireCbAuth, async (req, res) => {
  const [member] = await db.select().from(cbMembersTable).where(eq(cbMembersTable.id, req.cbUser!.id));
  if (!member) return res.status(404).json({ error: "Account not found." });
  if (member.emailVerified) return res.json({ ok: true, message: "Already verified." });

  const verifyToken = randomBytes(32).toString("hex");
  const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.update(cbMembersTable).set({
    emailVerifyToken: verifyToken,
    verifyTokenExpiresAt: verifyExpiry,
  }).where(eq(cbMembersTable.id, member.id));

  try {
    const transport = makeTransport();
    const verifyUrl = `${CB_DOMAIN}/api/auth/verify-email?token=${verifyToken}`;
    await transport.sendMail({
      from: process.env.SMTP_FROM ?? "noreply@clownbinge.com",
      to: member.email,
      subject: "Verify your ClownBinge account",
      text: `Verify your email:\n\n${verifyUrl}\n\nThis link expires in 24 hours.`,
    });
  } catch (err) {
    console.error("[auth/resend-verification] email error:", err);
    return res.status(500).json({ error: "Failed to send email." });
  }

  return res.json({ ok: true });
});

export default router;
