import { pool } from "@workspace/db";

const pill = (score: number) => {
  const bg = score >= 4 ? "#16A34A" : score >= 2 ? "#D97706" : "#DC2626";
  const label = `${score}/5`;
  return `<span style="display:inline-block;padding:2px 9px;border-radius:999px;font-size:0.78em;font-weight:800;background:${bg};color:#fff;letter-spacing:0.03em;vertical-align:middle;margin-left:6px;">${label}</span>`;
};

const rows = [
  {
    dept: "Energy",
    obamaPerson: "Steven Chu, MIT / Stanford",
    obamaCred: "Ph.D. Physics (Nobel Prize winner)",
    obamaScore: 5,
    trumpPerson: "Rick Perry, Texas A&M",
    trumpCred: "B.S. Animal Science; forgot the dept. existed",
    trumpScore: 1,
    gap: "Academic / research depth vs. executive credential only",
  },
  {
    dept: "Education",
    obamaPerson: "John King &amp; Arne Duncan",
    obamaCred: "Ed.D. Columbia / Harvard; CEO of public schools",
    obamaScore: 5,
    trumpPerson: "Betsy DeVos; Linda McMahon (no degree)",
    trumpCred: "B.A. Business / WWE CEO; never attended a public school",
    trumpScore: 0,
    gap: "Zero public school experience vs. career educators",
  },
  {
    dept: "EPA",
    obamaPerson: "Lisa Jackson, Princeton",
    obamaCred: "M.S. Chemical Engineering; 16 years at EPA",
    obamaScore: 5,
    trumpPerson: "Scott Pruitt, Oklahoma AG",
    trumpCred: "J.D.; led 14 lawsuits <em>against</em> the EPA before leading it",
    trumpScore: 0,
    gap: "Scientific expertise vs. documented opposition to agency mission",
  },
  {
    dept: "HUD",
    obamaPerson: "Shaun Donovan; Julian Castro",
    obamaCred: "M.Arch + M.P.A. Harvard; career in housing policy",
    obamaScore: 5,
    trumpPerson: "Ben Carson, Yale / Johns Hopkins",
    trumpCred: "M.D. Pediatric Neurosurgery; no housing background",
    trumpScore: 2,
    gap: "Subject-matter alignment vs. prestigious but irrelevant credentials",
  },
  {
    dept: "HHS",
    obamaPerson: "Sylvia Burwell, Harvard / Oxford",
    obamaCred: "M.P.A.; managed Gates Foundation global health portfolio",
    obamaScore: 5,
    trumpPerson: "RFK Jr., Harvard / UVA Law",
    trumpCred: "J.D. Environmental Law; no public health credentials",
    trumpScore: 1,
    gap: "Health systems expertise vs. legal background in unrelated field",
  },
  {
    dept: "Attorney General",
    obamaPerson: "Eric Holder; Loretta Lynch",
    obamaCred: "J.D. Harvard; federal prosecutor; Deputy AG",
    obamaScore: 5,
    trumpPerson: "Matt Gaetz (withdrew before hearing)",
    trumpCred: "J.D. FSU; 3 House terms; zero prosecutorial experience",
    trumpScore: 1,
    gap: "Career prosecution experience vs. no law enforcement background",
  },
];

function buildTable(): string {
  const headerStyle = "padding:12px 14px;text-align:left;font-weight:800;border:none;font-size:0.88em;";
  const tdBase = "padding:11px 14px;border-bottom:1px solid #e2e8f0;vertical-align:top;font-size:0.88em;line-height:1.45;";
  const tdLast = "padding:11px 14px;border-bottom:none;vertical-align:top;font-size:0.88em;line-height:1.45;";

  const tableRows = rows.map((r, i) => {
    const isLast = i === rows.length - 1;
    const tdStyle = isLast ? tdLast : tdBase;
    const bg = i % 2 === 0 ? "background:#f8f9fe;" : "";
    return `    <tr style="${bg}">
      <td style="${tdStyle}font-weight:800;">${r.dept}</td>
      <td style="${tdStyle}">
        ${r.obamaCred}<br/>
        <em style="font-size:0.83em;color:#6b7280;">${r.obamaPerson}</em>
        ${pill(r.obamaScore)}
      </td>
      <td style="${tdStyle}">
        ${r.trumpCred}<br/>
        <em style="font-size:0.83em;color:#6b7280;">${r.trumpPerson}</em>
        ${pill(r.trumpScore)}
      </td>
      <td style="${tdStyle}color:#4b5563;">${r.gap}</td>
    </tr>`;
  }).join("\n");

  return `<h2>The Credential Comparison: At a Glance</h2>

<p>If you want to boil it down to a single receipt, here it is. Department by department. Side by side. Documented credentials with a subject-matter qualification score (0 = no relevant expertise; 5 = career-level domain mastery).</p>

<div style="overflow-x:auto;margin:2rem 0;">
<table style="width:100%;border-collapse:collapse;font-size:0.92em;line-height:1.5;">
  <thead>
    <tr style="background:#1A3A8F;color:#fff;">
      <th style="${headerStyle}">Department</th>
      <th style="${headerStyle}">Obama Appointee<br/><span style="font-weight:400;font-size:0.83em;opacity:0.8;">(DEI Era)</span></th>
      <th style="${headerStyle}">Trump Appointee<br/><span style="font-weight:400;font-size:0.83em;opacity:0.8;">(Anti-DEI Era)</span></th>
      <th style="${headerStyle}">The Gap</th>
    </tr>
  </thead>
  <tbody>
${tableRows}
  </tbody>
</table>
</div>

<p style="font-size:0.82em;color:#6b7280;font-style:italic;margin-top:-0.5rem;">Qualification score reflects documented subject-matter expertise directly relevant to the agency's core mission (0 = no relevant expertise; 5 = career-level domain mastery). Sources: U.S. Senate confirmation records, official agency biographies, Nobel Prize Committee archives, C-SPAN congressional archive.</p>`;
}

async function main() {
  const newSection = buildTable();

  const res = await pool.query(
    `SELECT body FROM posts WHERE case_number = 'CB-000061'`
  );
  const body: string = res.rows[0].body;

  const oldTableStart = "<h2>The Credential Comparison: At a Glance</h2>";
  const oldTableEnd = "<h2>What the Pattern Shows</h2>";

  const startIdx = body.indexOf(oldTableStart);
  const endIdx = body.indexOf(oldTableEnd);

  if (startIdx === -1 || endIdx === -1) {
    console.error("Could not find table markers in body");
    process.exit(1);
  }

  const newBody = body.slice(0, startIdx) + newSection + "\n\n" + body.slice(endIdx);

  await pool.query(
    `UPDATE posts SET body = $1 WHERE case_number = 'CB-000061'`,
    [newBody]
  );

  console.log("Updated CB-000061 with qualification pill table.");
  await pool.end();
}

main().catch(console.error);
