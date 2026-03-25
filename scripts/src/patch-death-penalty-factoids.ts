import { pool } from "@workspace/db";

const CASE_NUMBER = "CB-000062";

function wrapFactoid(body: string, anchor: string, href: string, title: string, summary: string): string {
  const idx = body.indexOf(anchor);
  if (idx === -1) {
    console.warn(`  WARNING: anchor not found -- "${anchor.slice(0, 60)}"`);
    return body;
  }
  const tag = `<a class="cb-factoid" href="${href}" data-title="${title.replace(/"/g, "&quot;")}" data-summary="${summary.replace(/"/g, "&quot;")}">${anchor}</a>`;
  return body.slice(0, idx) + tag + body.slice(idx + anchor.length);
}

const FACTOIDS: [string, string, string, string][] = [
  [
    "Death Penalty Information Center",
    "https://deathpenaltyinfo.org/policy-issues/innocence",
    "Death Penalty Information Center: Innocence and the Death Penalty",
    "The Death Penalty Information Center has tracked every exoneration from death row since capital punishment was reinstated. As of early 2024, 190 people have been exonerated from death row since 1973. The Center's database documents each case with supporting legal evidence and court records.",
  ],
  [
    "Austin Sarat and his colleagues at Amherst College",
    "https://www.sup.org/books/law/gruesome-spectacles",
    "Sarat (2014) -- Gruesome Spectacles: Botched Executions and America's Death Penalty, Stanford University Press",
    "Legal scholar Austin Sarat and colleagues at Amherst College analyzed 8,776 executions carried out in the United States between 1890 and 2010. They found that approximately 3 percent resulted in botched procedures -- one in thirty-three state executions caused prolonged, visible suffering. Published by Stanford University Press, 2014.",
  ],
  [
    "Teresa Zimmers and colleagues at Johns Hopkins University School of Medicine",
    "https://doi.org/10.1371/journal.pmed.0040156",
    "Zimmers et al. (2007) -- Lethal Injection for Execution: Chemical Asphyxiation? PLoS Medicine",
    "A peer-reviewed pharmacological study by Teresa Zimmers and colleagues at Johns Hopkins University School of Medicine concluded that the three-drug lethal injection protocol carries a substantial probability of causing a painful death while masking outward signs of distress. A paralytic agent in the sequence prevents movement, meaning intense pain may appear invisible. Published in PLoS Medicine, Vol. 4, No. 4, 2007.",
  ],
  [
    "Samuel Gross, Barbara O'Brien, Chen Hu, and Edward Kennedy",
    "https://doi.org/10.1073/pnas.1306417111",
    "Gross et al. (2014) -- Rate of False Conviction of Criminal Defendants Who Are Sentenced to Death, Proceedings of the National Academy of Sciences",
    "Using systematic statistical modeling applied to U.S. death sentence data, researchers Samuel Gross, Barbara O'Brien, Chen Hu, and Edward Kennedy estimated that at least 4.1 percent of defendants sentenced to death in the United States are factually innocent. Given more than 1,550 executions since 1976, this implies a minimum of approximately 63 innocent people executed by the U.S. government. Published in PNAS, Vol. 111, No. 20, 2014.",
  ],
  [
    "Columbia Human Rights Law Review",
    "https://hrlr.law.columbia.edu/hrlr/los-tocayos-carlos-an-anatomy-of-a-wrongful-execution/",
    "Columbia Human Rights Law Review (2012) -- Los Tocayos Carlos: An Anatomy of a Wrongful Execution",
    "A 2012 investigation published in the Columbia Human Rights Law Review examined the case of Carlos DeLuna, executed in Texas in 1989. Researchers identified a likely alternative perpetrator, documented eyewitness accounts that exculpated DeLuna, and found that the original police investigation was fundamentally flawed. The likely perpetrator, Carlos Hernandez, is known to have confessed to acquaintances before dying in prison in 1999.",
  ],
  [
    "McCleskey v. Kemp",
    "https://supreme.justia.com/cases/federal/us/481/279/",
    "McCleskey v. Kemp, 481 U.S. 279 (1987) -- Supreme Court of the United States",
    "The Supreme Court accepted the statistical validity of the Baldus study, which analyzed more than 2,000 murder cases in Georgia and found that Black defendants whose victims were white were 4.3 times more likely to receive a death sentence. The Court ruled 5 to 4 that this evidence did not prove unconstitutional discrimination in McCleskey's specific case. Justice Brennan dissented, writing that the majority's reasoning seemed to suggest a fear of too much justice. Warren McCleskey was executed in 1991.",
  ],
  [
    "Glenn Pierce and Michael Radelet",
    "https://scholarship.law.unc.edu/nclr/vol89/iss6/3/",
    "Pierce & Radelet (2011) -- Death Sentencing in North Carolina, 1980-2007, North Carolina Law Review",
    "Glenn Pierce and Michael Radelet examined capital sentencing in North Carolina over a 20-year period and found consistent, statistically significant evidence that the race of the victim influenced who received a death sentence, even after controlling for aggravating factors in the crime. The findings replicated the Baldus study in a different state with different data two decades later. Published in the North Carolina Law Review, Vol. 89, 2011.",
  ],
  [
    "NAACP Legal Defense and Educational Fund",
    "https://www.naacpldf.org/death-row-usa/",
    "NAACP Legal Defense and Educational Fund -- Death Row USA (Quarterly Report, 2024)",
    "The NAACP Legal Defense and Educational Fund publishes quarterly statistics on the U.S. death row population. As of 2024, Black Americans comprise approximately 41 percent of the death row population while representing roughly 13 percent of the general population. Hispanic defendants are similarly overrepresented relative to their share of the general population.",
  ],
  [
    "Foster v. Chatman",
    "https://supreme.justia.com/cases/federal/us/578/488/",
    "Foster v. Chatman, 578 U.S. 488 (2016) -- Supreme Court of the United States",
    "The U.S. Supreme Court found unanimously that Georgia prosecutors had struck Black jurors from a capital case based on race. Handwritten notes in prosecution files included the letter B next to the names of Black prospective jurors and a ranked list prepared to justify their removal if challenged. The defendant had been on death row since 1987.",
  ],
  [
    "National Research Council, the research arm of the National Academies of Sciences, Engineering, and Medicine",
    "https://doi.org/10.17226/13363",
    "National Research Council (2012) -- Deterrence and the Death Penalty, National Academies Press",
    "A comprehensive review by the National Research Council concluded unanimously that studies used to support a deterrent effect of the death penalty were fundamentally flawed and should not be used to inform policy judgments about homicide rates. The panel included leading economists, criminologists, and legal scholars. Published by the National Academies Press, 2012.",
  ],
  [
    "John Donohue of Yale Law School and Justin Wolfers of the Wharton School",
    "https://www.jstor.org/stable/40040213",
    "Donohue & Wolfers (2005) -- Uses and Abuses of Empirical Evidence in the Death Penalty Debate, Stanford Law Review",
    "John Donohue of Yale Law School and Justin Wolfers of the Wharton School conducted a detailed econometric analysis of death penalty deterrence claims and concluded the results were fragile, sensitive to minor model specification changes, and provide no reliable statistical evidence that capital punishment reduces homicide rates. Published in the Stanford Law Review, Vol. 58, No. 3, 2005.",
  ],
  [
    "Amnesty International documented",
    "https://www.amnesty.org/en/documents/act50/7952/2024/en/",
    "Amnesty International (2024) -- Death Sentences and Executions 2023",
    "Amnesty International documented state executions globally in 2023. Countries carrying out significant numbers of executions included China (thousands, estimated), Iran (at least 853), Saudi Arabia (at least 172), Somalia (at least 13), and the United States (24). Every member of the European Union has abolished the death penalty as a condition of membership.",
  ],
  [
    "United Nations General Assembly passed Resolution 62/149",
    "https://undocs.org/A/RES/62/149",
    "United Nations General Assembly Resolution 62/149 (2007) -- Moratorium on the Use of the Death Penalty",
    "The United Nations General Assembly passed Resolution 62/149 in 2007 calling for a global moratorium on the use of the death penalty, with 104 nations voting in favor. The United States voted against the resolution. As of 2024, 112 countries have abolished capital punishment in law or practice.",
  ],
  [
    "California Commission on the Fair Administration of Justice",
    "https://digitalcommons.law.scu.edu/cgi/viewcontent.cgi?article=1001&context=ccfaj",
    "California Commission on the Fair Administration of Justice (2008) -- Final Report",
    "The California Legislature established the California Commission on the Fair Administration of Justice, composed of judges, prosecutors, defense attorneys, and law enforcement officials, to study the administration of the death penalty. Its 2008 final report found that California's death penalty system cost $137 million per year more than a system imposing life imprisonment without the possibility of parole.",
  ],
  [
    "Kansas Judicial Council",
    "https://www.kansasjudicialcouncil.org/",
    "Kansas Judicial Council (2014) -- Kansas Death Penalty Assessment Report",
    "The Kansas Judicial Council's 2014 analysis found that capital cases cost on average 70 percent more than comparable non-capital cases, due to extended litigation timelines, mandatory appellate review, and the operational costs of death row housing.",
  ],
  [
    "Atkins v. Virginia",
    "https://supreme.justia.com/cases/federal/us/536/304/",
    "Atkins v. Virginia, 536 U.S. 304 (2002) -- Supreme Court of the United States",
    "The U.S. Supreme Court ruled that executing people with intellectual disabilities violates the Eighth Amendment's prohibition on cruel and unusual punishment, as the practice is incompatible with evolving standards of decency in a maturing society.",
  ],
  [
    "Roper v. Simmons",
    "https://supreme.justia.com/cases/federal/us/543/551/",
    "Roper v. Simmons, 543 U.S. 551 (2005) -- Supreme Court of the United States",
    "The U.S. Supreme Court ruled that executing individuals who committed crimes as juveniles violates the Eighth Amendment. The majority cited evolving standards of decency and near-universal consensus among peer nations, noting that the United States was one of the last countries in the world to permit juvenile executions.",
  ],
];

async function main() {
  const result = await pool.query(
    "SELECT body FROM posts WHERE case_number = $1",
    [CASE_NUMBER]
  );

  if (result.rows.length === 0) {
    console.error(`Post ${CASE_NUMBER} not found.`);
    process.exit(1);
  }

  let body: string = result.rows[0].body ?? "";

  // Strip the appended APA 7 section if present
  const cutMarker = '\n<hr style="margin-top: 3rem;';
  const cutIdx = body.indexOf(cutMarker);
  if (cutIdx !== -1) {
    body = body.slice(0, cutIdx);
    console.log("Stripped APA 7 section.");
  } else {
    console.log("No APA 7 section found to strip.");
  }

  // Wrap each factoid anchor
  for (const [anchor, href, title, summary] of FACTOIDS) {
    body = wrapFactoid(body, anchor, href, title, summary);
  }

  await pool.query(
    "UPDATE posts SET body = $1 WHERE case_number = $2",
    [body, CASE_NUMBER]
  );

  console.log(`Factoids applied to ${CASE_NUMBER}.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
