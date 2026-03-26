import { pool } from "@workspace/db";

async function main() {
  const slug = "second-amendment-racial-disparity-philando-castile";

  const res = await pool.query("SELECT verified_source, locked FROM posts WHERE slug = $1", [slug]);
  const row = res.rows[0];
  const current: string = row.verified_source;

  const newEntry =
    "Minnesota Statutes Section 624.714: Carry of Pistols by Permit Holders" +
    " :: Minnesota Legislature, Office of the Revisor of Statutes. (2016)." +
    " Minnesota Statutes, Section 624.714. Office of the Revisor of Statutes," +
    " Saint Paul, Minnesota. Statute governing permit holders' duty to inform" +
    " law enforcement upon contact. In effect on July 6, 2016.";

  const updated = current + "; " + newEntry;

  await pool.query("UPDATE posts SET verified_source = $1, locked = true WHERE slug = $2", [
    updated,
    slug,
  ]);

  // Confirm count
  const check = await pool.query("SELECT verified_source FROM posts WHERE slug = $1", [slug]);
  const count = (check.rows[0].verified_source as string).split(/[;|]/).filter(Boolean).length;
  console.log(`Updated. Total APA 7 entries now: ${count}`);

  await pool.end();
}

main().catch(console.error);
