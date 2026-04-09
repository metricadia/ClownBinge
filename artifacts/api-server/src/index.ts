import app from "./app";
import { logger } from "./lib/logger";
import { seedIfEmpty, insertNewArticles, insertFoundersPenArticles, updateNativeArticles, syncImprovedArticles, applyPremiumFlags, applyStaffPickFlags, applyCategoryOverrides, applyCaseNumberRenames } from "./seed";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  seedIfEmpty()
    .then(() => applyCaseNumberRenames())
    .then(() => insertNewArticles())
    .then(() => insertFoundersPenArticles())
    .then(() => updateNativeArticles())
    .then(() => syncImprovedArticles())
    .then(() => applyCategoryOverrides())
    .then(() => applyPremiumFlags())
    .then(() => applyStaffPickFlags())
    .catch((e) => logger.error({ err: e }, "Seed failed"));
});
