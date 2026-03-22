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

  // Founding documents / constitutional
  [/Declaration of Independence[^;/]*/gi,             "Declaration (1776)"],
  [/14th Amendment[^;/]*/gi,                          "14th Amend."],
  [/Fourteenth Amendment[^;/]*/gi,                    "14th Amend."],
  [/Fifth Amendment[^;/]*/gi,                         "5th Amend."],
  [/First Amendment[^;/]*/gi,                         "1st Amend."],
  [/Federalist No\.\s*51[^;/]*/gi,                    "Fed. No. 51"],
  [/Federalist No\.\s*\d+[^;/]*/gi,                   "Federalist Papers"],
  [/Federalist Papers?[^;/]*/gi,                      "Federalist Papers"],
  [/Marbury v\. Madison[^;/]*/gi,                     "Marbury v. Madison"],
  [/Federal Register[^;/]*/gi,                        "Fed. Register"],
  [/Library of Congress[^;/]*/gi,                     "Lib. of Congress"],
  [/National Archives[^;/]*/gi,                       "Natl. Archives"],
  [/Bureau of Justice Statistics[^;/]*/gi,            "BJS"],
  [/Vera Institute[^;/]*/gi,                          "Vera Inst."],
  [/Brookings Institution[^;/]*/gi,                   "Brookings"],
  [/Prison Policy Initiative[^;/]*/gi,                "PPI"],
  [/SCOTUSblog[^;/]*/gi,                              "SCOTUSblog"],
  [/U\.S\. Supreme Court[^;/]*/gi,                    "SCOTUS"],
  [/Supreme Court[^;/]*/gi,                           "SCOTUS"],
  [/Dominion v\. Fox[^;/]*/gi,                        "Dominion v. Fox"],

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

  // Human rights / civil society
  [/BSR\s+Human Rights Due Diligence Report[^;]*/gi,          "BSR Report"],
  [/Business\s+and\s+Human Rights Resource Centre[^;]*/gi,    "BHRRC"],
  [/Human Rights Watch[^;]*/gi,                               "HRW"],
  [/Amnesty International[^;]*/gi,                            "Amnesty Int'l"],
  [/Meta\s+Oversight Board[^;]*/gi,                           "Meta OB"],
  [/Drop Site News[^;]*/gi,                                   "Drop Site News"],
  [/BBC News Arabic[^;]*/gi,                                  "BBC Arabic"],
  [/BBC News[^;]*/gi,                                         "BBC"],
  [/\bBBC\b[^;]*/gi,                                          "BBC"],

  // Research / think tanks
  [/Pew Research Center[^;]*/gi,                              "Pew Research"],
  [/Indiana University[^;]*/gi,                               "Indiana Univ."],
  [/U\.S\.\s+PIRG[^;]*/gi,                                   "US PIRG"],
  [/\bUSPIRG\b[^;]*/gi,                                       "US PIRG"],

  // Congressional / government hearings
  [/House Energy and Commerce Committee[^;]*/gi,              "House E&C Cmte."],
  [/Facebook Papers[^;]*/gi,                                  "Facebook Papers"],

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
  [/Juicy Ecumenism[^;]*/gi,                          "Juicy Ecumenism"],
  [/NC Beat[^;]*/gi,                                  "NC Beat"],
  [/CBN News[^;]*/gi,                                 "CBN"],
  [/TBN\b[^;]*/gi,                                    "TBN"],
  [/Daystar[^;]*/gi,                                  "Daystar"],

  // Regional news outlets
  [/Tampa Bay Times[^;]*/gi,                          "Tampa Bay Times"],
  [/Tampa Bay[^;]*/gi,                                "Tampa Bay Times"],
  [/KERA News[^;]*/gi,                                "KERA News"],
  [/KERA\b[^;]*/gi,                                   "KERA News"],
  [/The Tennessean[^;]*/gi,                           "The Tennessean"],
  [/Chicago Tribune[^;]*/gi,                          "Chicago Tribune"],
  [/The Advocate[^;]*/gi,                             "The Advocate"],
  [/ABC Australia[^;]*/gi,                            "ABC Australia"],
  [/abc\.net\.au[^;]*/gi,                             "ABC Australia"],

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

  // Split on any common separator: semicolon, pipe, or slash
  const segments = raw.split(/[;|/]/).map(s => s.trim()).filter(Boolean);

  // Tile mode: first segment only, hard 38-char cap
  if (prefix) {
    let s = segments[0] || raw;
    for (const [pattern, abbr] of SOURCE_ABBREV) s = s.replace(pattern, abbr);
    s = s.replace(/\s+/g, " ").trim();
    if (s.length > 38) s = s.slice(0, 35).trimEnd() + "...";
    return `Source: ${s}`;
  }

  // Detail / non-tile: up to 2 segments, abbreviated
  const shortened = segments.slice(0, 2).map(seg => {
    let s = seg;
    for (const [pattern, abbr] of SOURCE_ABBREV) s = s.replace(pattern, abbr);
    return s.replace(/\s+/g, " ").trim();
  });
  return shortened.join(" / ");
}
