/**
 * Self-hosted JWT auth middleware for CB members.
 * Sets req.cbUser if a valid JWT cookie is present.
 */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface CbUser {
  id: number;
  email: string;
  name: string | null;
  emailVerified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      cbUser?: CbUser;
    }
  }
}

function getJwtSecret(): string {
  const s = process.env.JWT_SECRET || process.env.METRICADIA_TOKEN_SECRET;
  if (!s) throw new Error("JWT_SECRET env var is required");
  return s;
}

export function cbAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.cb_auth;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, getJwtSecret()) as CbUser & { sub: number };
    req.cbUser = {
      id: payload.sub ?? payload.id,
      email: payload.email,
      name: payload.name ?? null,
      emailVerified: payload.emailVerified ?? false,
    };
  } catch {
    // invalid/expired token — just no user attached
  }
  next();
}

export function requireCbAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.cbUser) return res.status(401).json({ error: "Not authenticated" });
  next();
}

export function signCbJwt(user: CbUser): string {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, emailVerified: user.emailVerified },
    getJwtSecret(),
    { expiresIn: "7d" },
  );
}
