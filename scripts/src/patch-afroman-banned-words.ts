import { pool } from "@workspace/db";

async function main() {
  const res = await pool.query("SELECT body FROM posts WHERE slug = 'afroman-sued-harassers-into-museum-exhibit'");
  const body: string = res.rows[0].body;

  const fixed = body
    .replace("installed comprehensive security cameras", "installed security cameras")
    .replace("was ultimately supported by physical evidence", "was supported by physical evidence");

  await pool.query("UPDATE posts SET body = $1, locked = true WHERE slug = $2", [
    fixed,
    "afroman-sued-harassers-into-museum-exhibit",
  ]);

  console.log("Patched and re-locked. Removed: 'comprehensive', 'ultimately'");
  await pool.end();
}

main().catch(console.error);
