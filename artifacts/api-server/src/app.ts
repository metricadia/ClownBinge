import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import pinoHttp from "pino-http";
import helmet from "helmet";
import path from "path";
import router from "./routes";
import { registerMetricadiaRoutes } from "./editor-routes";
import publishRouter from "./publish-routes";
import { logger } from "./lib/logger";
import { cbAuthMiddleware } from "./middlewares/auth-middleware";

const app: Express = express();

// Trust the first proxy hop (Replit's load balancer) so rate limiting and
// secure cookies work correctly with X-Forwarded-For and X-Forwarded-Proto.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Security headers — must be before routes
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false,
  })
);

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session for Metricadia admin (Kemet8) OTP auth
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("[App] FATAL: SESSION_SECRET env var must be set in production.");
  }
  console.error("[App] WARNING: SESSION_SECRET not set — using dev fallback. Set this before deploying.");
}
app.use(
  session({
    secret: SESSION_SECRET ?? "metricadia-admin-secret-dev-only",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Self-hosted CB member JWT auth
app.use(cbAuthMiddleware);

// Serve uploaded images
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads")),
);

// Cache-Control for locked records (GET only)
app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    (req.path.includes("/api/posts/") || req.path.includes("/api/list"))
  ) {
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
  }
  next();
});

app.use("/api", router);
app.use("/api", publishRouter);

registerMetricadiaRoutes(app);

export default app;
