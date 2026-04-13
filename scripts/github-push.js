#!/usr/bin/env node
/**
 * github-push.js
 * Push one or more local files to GitHub via the Contents API.
 * No git CLI. No credential store. No push failures.
 *
 * Usage:
 *   node scripts/github-push.js <file1> [file2] [file3] ...
 *
 * Requires: GITHUB_PERSONAL_ACCESS_TOKEN env var (already set in Replit secrets)
 * Repo / branch are hardcoded below — change if the project moves.
 */

import { readFileSync } from "fs";

const REPO   = "metricadia/ClownBinge";
const BRANCH = "main";
const TOKEN  = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const API    = `https://api.github.com/repos/${REPO}/contents`;

if (!TOKEN) {
  console.error("ERROR: GITHUB_PERSONAL_ACCESS_TOKEN is not set.");
  process.exit(1);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node scripts/github-push.js <file1> [file2] ...");
  process.exit(1);
}

const headers = {
  "Authorization": `Bearer ${TOKEN}`,
  "Accept":        "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "Content-Type":  "application/json",
};

async function getSha(path) {
  const res = await fetch(`${API}/${path}?ref=${BRANCH}`, { headers });
  if (res.status === 404) return null;
  const j = await res.json();
  return j.sha ?? null;
}

async function pushFile(localPath) {
  const content = readFileSync(localPath, "utf8");
  const encoded = Buffer.from(content).toString("base64");
  const sha     = await getSha(localPath);

  const body = {
    message: `Sync ${localPath.split("/").pop()} via GitHub API`,
    content: encoded,
    branch:  BRANCH,
    ...(sha ? { sha } : {}),
  };

  const res = await fetch(`${API}/${localPath}`, {
    method:  "PUT",
    headers,
    body:    JSON.stringify(body),
  });

  const j = await res.json();

  if (j.commit?.sha) {
    console.log(`✓ ${localPath}  →  commit ${j.commit.sha.slice(0, 10)}`);
  } else {
    console.error(`✗ ${localPath}  →  ${JSON.stringify(j.message ?? j).slice(0, 120)}`);
    process.exitCode = 1;
  }
}

for (const f of files) {
  await pushFile(f);
}
