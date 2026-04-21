#!/usr/bin/env node
/**
 * github-push.js
 * Push one or more local files to GitHub as a SINGLE commit via the Git Trees API.
 * One commit = one GitHub Actions deploy trigger, regardless of how many files.
 *
 * Usage:
 *   node scripts/github-push.js <file1> [file2] [file3] ...
 *
 * Requires: GITHUB_PERSONAL_ACCESS_TOKEN env var (already set in Replit secrets)
 */

import { readFileSync } from "fs";

const REPO   = "metricadia/ClownBinge";
const BRANCH = "main";
const TOKEN  = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const API    = `https://api.github.com/repos/${REPO}`;

if (!TOKEN) {
  console.error("ERROR: GITHUB_PERSONAL_ACCESS_TOKEN is not set.");
  process.exit(1);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node scripts/github-push.js <file1> [file2] ...");
  process.exit(1);
}

const h = {
  "Authorization": `Bearer ${TOKEN}`,
  "Accept": "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "Content-Type": "application/json",
};

async function gh(path, opts = {}) {
  const res = await fetch(`${API}${path}`, { headers: h, ...opts });
  return res.json();
}

// 1. Get current HEAD
const refData = await gh(`/git/ref/heads/${BRANCH}`);
const headSha = refData.object.sha;

// 2. Get current tree SHA
const commitData = await gh(`/git/commits/${headSha}`);
const baseTreeSha = commitData.tree.sha;

// 3. Create a blob for each file
const treeItems = [];
for (const localPath of files) {
  const content = readFileSync(localPath);
  const blobRes = await gh(`/git/blobs`, {
    method: "POST",
    body: JSON.stringify({ content: content.toString("base64"), encoding: "base64" }),
  });
  treeItems.push({ path: localPath, mode: "100644", type: "blob", sha: blobRes.sha });
  console.log(`  staged: ${localPath}`);
}

// 4. Create new tree
const newTree = await gh(`/git/trees`, {
  method: "POST",
  body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
});

// 5. Create single commit
const changedFiles = files.map(f => f.split("/").pop()).join(", ");
const newCommit = await gh(`/git/commits`, {
  method: "POST",
  body: JSON.stringify({
    message: `chore: update ${changedFiles}`,
    tree: newTree.sha,
    parents: [headSha],
  }),
});

// 6. Update branch ref
await gh(`/git/refs/heads/${BRANCH}`, {
  method: "PATCH",
  body: JSON.stringify({ sha: newCommit.sha }),
});

console.log(`\n✓ ${files.length} file(s) → single commit ${newCommit.sha.slice(0, 10)}`);
