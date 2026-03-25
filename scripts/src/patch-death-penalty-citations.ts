import { pool } from "@workspace/db";

const CASE_NUMBER = "CB-000062";

const CITATIONS_HTML = `
<hr style="margin-top: 3rem; margin-bottom: 2rem; border: none; border-top: 2px solid #1A3A8F;">

<section style="margin-top: 2rem;">
  <h2 style="font-size: 1rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #1A3A8F; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #dbeafe;">Primary Sources</h2>
  <p style="font-size: 0.8rem; color: #6b7280; font-style: italic; margin-bottom: 1.25rem;">All citations formatted in APA 7th edition. Sources are peer-reviewed, government-issued, or primary legal records unless otherwise noted.</p>
  <ol style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem;">

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Amnesty International. (2024). <em>Death sentences and executions 2023</em> (ACT 50/7952/2024). <a href="https://www.amnesty.org/en/documents/act50/7952/2024/en/" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://www.amnesty.org/en/documents/act50/7952/2024/en/</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Atkins v. Virginia, 536 U.S. 304 (2002). <a href="https://supreme.justia.com/cases/federal/us/536/304/" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://supreme.justia.com/cases/federal/us/536/304/</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Baldus, D. C., Pulaski, C. A., &amp; Woodworth, G. (1990). <em>Equal justice and the death penalty: A legal and empirical analysis</em>. Northeastern University Press.
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      California Commission on the Fair Administration of Justice. (2008). <em>Final report</em>. <a href="https://digitalcommons.law.scu.edu/cgi/viewcontent.cgi?article=1001&amp;context=ccfaj" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://digitalcommons.law.scu.edu/cgi/viewcontent.cgi?article=1001&context=ccfaj</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Death Penalty Information Center. (2024). <em>Innocence and the death penalty</em>. <a href="https://deathpenaltyinfo.org/policy-issues/innocence" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://deathpenaltyinfo.org/policy-issues/innocence</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Donohue, J. J., &amp; Wolfers, J. (2005). Uses and abuses of empirical evidence in the death penalty debate. <em>Stanford Law Review, 58</em>(3), 791-846. <a href="https://www.jstor.org/stable/40040213" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://www.jstor.org/stable/40040213</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Federal Bureau of Investigation. (2022). <em>Crime in the United States: Uniform crime reports</em>. U.S. Department of Justice. <a href="https://ucr.fbi.gov/crime-in-the-u.s/2019/crime-in-the-u.s.-2019/home" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://ucr.fbi.gov/</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Foster v. Chatman, 578 U.S. 488 (2016). <a href="https://supreme.justia.com/cases/federal/us/578/488/" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://supreme.justia.com/cases/federal/us/578/488/</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Gross, S. R., O'Brien, B., Hu, C., &amp; Kennedy, E. H. (2014). Rate of false conviction of criminal defendants who are sentenced to death. <em>Proceedings of the National Academy of Sciences, 111</em>(20), 7230-7235. <a href="https://doi.org/10.1073/pnas.1306417111" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://doi.org/10.1073/pnas.1306417111</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Kansas Judicial Council. (2014). <em>Kansas death penalty assessment report</em>. <a href="https://www.kansasjudicialcouncil.org/Documents/Studies%20and%20Reports/Death%20Penalty/Death%20Penalty%20Cost%20Report%20Final%20October%202014.pdf" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://www.kansasjudicialcouncil.org/</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      McCleskey v. Kemp, 481 U.S. 279 (1987). <a href="https://supreme.justia.com/cases/federal/us/481/279/" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://supreme.justia.com/cases/federal/us/481/279/</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      NAACP Legal Defense and Educational Fund. (2024). <em>Death row USA</em> (Quarterly report). <a href="https://www.naacpldf.org/death-row-usa/" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://www.naacpldf.org/death-row-usa/</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      National Research Council. (2012). <em>Deterrence and the death penalty</em>. The National Academies Press. <a href="https://doi.org/10.17226/13363" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://doi.org/10.17226/13363</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Pierce, G. L., &amp; Radelet, M. L. (2011). Death sentencing in North Carolina, 1980-2007. <em>North Carolina Law Review, 89</em>(6), 1888-1930. <a href="https://scholarship.law.unc.edu/nclr/vol89/iss6/3/" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://scholarship.law.unc.edu/nclr/vol89/iss6/3/</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Roper v. Simmons, 543 U.S. 551 (2005). <a href="https://supreme.justia.com/cases/federal/us/543/551/" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://supreme.justia.com/cases/federal/us/543/551/</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Sarat, A. (2014). <em>Gruesome spectacles: Botched executions and America's death penalty</em>. Stanford University Press.
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Scheck, B., Neufeld, P., &amp; Dwyer, J. (2000). <em>Actual innocence: Five days to execution, and other dispatches from the wrongly convicted</em>. Doubleday. [foundational Innocence Project documentation; see also <a href="https://innocenceproject.org/all-cases/" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://innocenceproject.org/all-cases/</a>]
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      United Nations General Assembly. (2007). <em>Moratorium on the use of the death penalty</em> (Resolution 62/149). <a href="https://undocs.org/A/RES/62/149" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://undocs.org/A/RES/62/149</a>
    </li>

    <li style="font-size: 0.875rem; line-height: 1.65; color: #374151; padding-left: 2rem; text-indent: -2rem;">
      Zimmers, T. A., Sheldon, J., Lubarsky, D. A., Lopez-Munoz, F., Waterman, L., Weisman, R., &amp; Koniaris, L. G. (2007). Lethal injection for execution: Chemical asphyxiation? <em>PLoS Medicine, 4</em>(4), e156. <a href="https://doi.org/10.1371/journal.pmed.0040156" target="_blank" rel="noopener noreferrer" style="color: #1A3A8F; text-decoration: underline;">https://doi.org/10.1371/journal.pmed.0040156</a>
    </li>

  </ol>
</section>
`;

async function main() {
  const result = await pool.query(
    "SELECT body FROM posts WHERE case_number = $1",
    [CASE_NUMBER]
  );

  if (result.rows.length === 0) {
    console.error(`Post ${CASE_NUMBER} not found.`);
    process.exit(1);
  }

  const currentBody: string = result.rows[0].body ?? "";

  if (currentBody.includes("Primary Sources")) {
    console.log("Citations section already present. Skipping.");
    await pool.end();
    return;
  }

  const updatedBody = currentBody + CITATIONS_HTML;

  await pool.query(
    "UPDATE posts SET body = $1 WHERE case_number = $2",
    [updatedBody, CASE_NUMBER]
  );

  console.log(`Citations appended to ${CASE_NUMBER}.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
