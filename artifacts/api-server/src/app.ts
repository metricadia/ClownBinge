import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "path";
import router from "./routes";
import { registerMetricadiaRoutes } from "./editor-routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";

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
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

// Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

// Cache-Control for locked records (GET only — never cache mutating requests)
app.use((req, res, next) => {
  if (req.method === "GET" && (req.path.includes("/api/posts/") || req.path.includes("/api/list"))) {
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
  }
  next();
});

app.use("/api", router);

registerMetricadiaRoutes(app);

export default app;
