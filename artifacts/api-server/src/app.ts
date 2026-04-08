import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import pinoHttp from "pino-http";
import path from "path";
import router from "./routes";
import { registerMetricadiaRoutes } from "./editor-routes";
import { logger } from "./lib/logger";
import { clerkMiddleware } from "@clerk/express";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
} from "./middlewares/clerkProxyMiddleware";

const app: Express = express();

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

// Clerk proxy — must be before body parsers
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// express-session retained for Metricadia admin (Kemet8) auth
app.use(
  session({
    secret: process.env.SESSION_SECRET || "metricadia-admin-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  }),
);

// Clerk auth middleware
app.use(clerkMiddleware());

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

registerMetricadiaRoutes(app);

export default app;
