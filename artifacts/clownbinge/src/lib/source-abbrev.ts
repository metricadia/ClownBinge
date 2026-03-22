/**
 * Shared source abbreviation patterns.
 * Add new sources here -- both PostCard and PostDetail import from this file.
 * Order matters: more specific patterns before general ones.
 */
export const SOURCE_ABBREV: [RegExp, string][] = [
  // Government / Law enforcement
  [/U\.S\.\s+Department of Justice[^;]*/gi,          "DOJ"],
  [/Department of Justice[^;]*/gi,                    "DOJ"],
  [/DOJ\b[^;]*/gi,                                    "DOJ"],
  [/Internal Revenue Service[^;]*/gi,                 "IRS"],
  [/\bIRS\b[^;]*/gi,                                  "IRS"],
  [/Federal Bureau of Investigation[^;]*/gi,          "FBI"],
  [/\bFBI\b[^;]*/gi,                                  "FBI"],
  [/Securities and Exchange Commission[^;]*/gi,       "SEC"],
  [/\bSEC\b[^;]*/gi,                                  "SEC"],
  [/Federal Trade Commission[^;]*/gi,                 "FTC"],
  [/Federal Election Commission[^;]*/gi,              "FEC"],
  [/U\.S\. Citizenship and Immigration Services[^;]*/gi, "USCIS"],
  [/Congressional Budget Office[^;]*/gi,              "CBO"],
  [/Congressional Record[^;]*/gi,                     "Cong. Record"],
  [/Government Accountability Office[^;]*/gi,         "GAO"],
  [/Senate Vote #\d+[^;]*/gi,                         "GovTrack"],
  [/House Vote #\d+[^;]*/gi,                          "GovTrack"],
  [/GovTrack\b[^;]*/gi,                               "GovTrack"],
  [/senate\.gov[^;]*/gi,                              "senate.gov"],
  [/congress\.gov[^;]*/gi,                            "congress.gov"],

  // Courts / legal
  [/U\.S\. District Court[^;]*/gi,                    "Fed. Court"],
  [/United States District Court[^;]*/gi,             "Fed. Court"],
  [/Court Records?\b[^;]*/gi,                         "Court Records"],
  [/Bexar County[^;]*/gi,                             "Bexar Co. Courts"],
  [/Maricopa County[^;]*/gi,                          "Maricopa Co."],
  [/Palmetto County[^;]*/gi,                          "County Records"],
  [/State Bar of Texas[^;]*/gi,                       "TX State Bar"],
  [/House (Committee on the )?Judiciary[^;]*/gi,      "House Judiciary"],

  // Orgs
  [/American Library Association[^;]*/gi,             "ALA"],
  [/Ellis Island Foundation[^;]*/gi,                  "Ellis Island"],
  [/American Israel Public Affairs Committee[^;]*/gi, "AIPAC"],
  [/Recording Academy[^;]*/gi,                        "Grammy/RIAA"],
  [/OpenSecrets\b[^;]*/gi,                            "OpenSecrets"],

  // Social media / official posts
  [/official\s+(?:Senate|House|Congressional)\s+social media[^;]*/gi, "Official Posts"],
  [/\w+\s+official\s+Senate\s+social media[^;]*/gi,  "Official Posts"],
  [/YouTube[^;]*/gi,                                  "YouTube"],
  [/Twitter\b[^;]*/gi,                                "Twitter/X"],
  [/\bX\.com\b[^;]*/gi,                               "Twitter/X"],
  [/Facebook[^;]*/gi,                                 "Facebook"],
  [/Instagram[^;]*/gi,                                "Instagram"],

  // Presidential speeches
  [/(?:Biden|Trump|Obama|Bush|Clinton)\s+\w+\s+speech transcript[^;]*/gi, "Presidential Speech"],
  [/(?:Biden|Trump|Obama|Bush|Clinton)\s+speech transcript[^;]*/gi,        "Presidential Speech"],

  // Religious / faith journalism
  [/Christian Post[^;]*/gi,                           "Christian Post"],
  [/MinistryWatch[^;]*/gi,                            "MinistryWatch"],
  [/Religion News Service[^;]*/gi,                    "RNS"],
  [/Christianity Today[^;]*/gi,                       "Christianity Today"],
  [/The Christian Chronicle[^;]*/gi,                  "Christian Chronicle"],
  [/Church Militant[^;]*/gi,                          "Church Militant"],
  [/Baptist Press[^;]*/gi,                            "Baptist Press"],
  [/NC Beat[^;]*/gi,                                  "NC Beat"],
  [/CBN News[^;]*/gi,                                 "CBN"],
  [/TBN\b[^;]*/gi,                                    "TBN"],
  [/Daystar[^;]*/gi,                                  "Daystar"],

  // National news outlets
  [/C-SPAN[^;]*/gi,                                   "C-SPAN"],
  [/NBC News[^;]*/gi,                                 "NBC News"],
  [/ABC News[^;]*/gi,                                 "ABC News"],
  [/CBS News[^;]*/gi,                                 "CBS News"],
  [/CNN\b[^;]*/gi,                                    "CNN"],
  [/Fox News[^;]*/gi,                                 "Fox News"],
  [/MSNBC[^;]*/gi,                                    "MSNBC"],
  [/NPR\b[^;]*/gi,                                    "NPR"],
  [/The Hill[^;]*/gi,                                 "The Hill"],
  [/HuffPost[^;]*/gi,                                 "HuffPost"],
  [/Rolling Stone[^;]*/gi,                            "Rolling Stone"],
  [/Politico[^;]*/gi,                                 "Politico"],
  [/Washington Post[^;]*/gi,                          "Wash. Post"],
  [/New York Times[^;]*/gi,                           "NY Times"],
  [/Los Angeles Times[^;]*/gi,                        "LA Times"],
  [/Associated Press[^;]*/gi,                         "AP"],
  [/Reuters[^;]*/gi,                                  "Reuters"],
  [/ProPublica[^;]*/gi,                               "ProPublica"],
  [/The Guardian[^;]*/gi,                             "The Guardian"],
  [/Axios[^;]*/gi,                                    "Axios"],
  [/Newsweek[^;]*/gi,                                 "Newsweek"],
  [/Time Magazine[^;]*/gi,                            "Time"],
  [/BuzzFeed News[^;]*/gi,                            "BuzzFeed News"],
  [/The Intercept[^;]*/gi,                            "The Intercept"],
  [/Daily Beast[^;]*/gi,                              "Daily Beast"],
  [/Salon\b[^;]*/gi,                                  "Salon"],
  [/Slate\b[^;]*/gi,                                  "Slate"],
  [/Vice\b[^;]*/gi,                                   "Vice"],
  [/Mother Jones[^;]*/gi,                             "Mother Jones"],
  [/National Review[^;]*/gi,                          "National Review"],
  [/The Atlantic[^;]*/gi,                             "The Atlantic"],
  [/New Yorker[^;]*/gi,                               "New Yorker"],
];

export function abbreviateSource(raw: string | null | undefined, prefix = false): string {
  if (!raw) return prefix ? "Source: Verified Public Record" : "Verified Public Record";
  const segments = raw.split(/[;|]/).map(s => s.trim()).filter(Boolean);
  const shortened = segments.slice(0, 2).map(seg => {
    let s = seg;
    for (const [pattern, abbr] of SOURCE_ABBREV) s = s.replace(pattern, abbr);
    return s.replace(/\s+/g, " ").trim();
  });
  const result = shortened.join(" / ");
  return prefix ? `Source: ${result}` : result;
}
