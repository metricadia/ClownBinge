/**
 * Editorial relationship map for Citatious internal cross-linking.
 * Max 3 per article. Only genuine thematic connections -- never forced.
 * Maps slug -> [related slugs in priority order].
 */
export const RELATED_ARTICLES: Record<string, string[]> = {

  // --- Self-Owned / Congressional voting record ---
  "james-whitmore-voted-for-bill-he-publicly-denied": [
    "bob-corker-tax-cuts-jobs-act-deficit-vote-flip",
    "tommy-tuberville-broadband-infrastructure-vote-biden-mockery",
    "rick-donahue-texas-ag-suing-companies-own-law-firm-did",
  ],
  "dale-hartwick-immigration-bill-political-theater-cspan": [
    "vernon-mills-anti-immigration-pastor-immigrant-grandparents",
    "cb-000041-united-states-built-by-immigrants-record-confirms-it",
    "give-me-your-tired-us-foreign-policy-immigration-global-south",
  ],
  "rick-donahue-texas-ag-suing-companies-own-law-firm-did": [
    "james-whitmore-voted-for-bill-he-publicly-denied",
    "tommy-tuberville-broadband-infrastructure-vote-biden-mockery",
  ],
  "patricia-holden-diversity-book-ban-daughter-dei-university": [
    "diversity-denial-primary-source-record-what-was-lost",
    "dei-label-clinical-cost-documented-inventory",
  ],
  "afroman-sued-harassers-into-museum-exhibit": [
    "fbi-crime-data-race-what-it-actually-says",
    "second-amendment-racial-disparity-philando-castile",
  ],
  "ted-cruz-christ-is-king-antisemitic-aipac": [
    "judaism-zionism-distinction-documented-record-2026",
    "paula-white-angel-prayer-election-2020-africa-south-america",
  ],
  "bob-corker-tax-cuts-jobs-act-deficit-vote-flip": [
    "james-whitmore-voted-for-bill-he-publicly-denied",
    "tommy-tuberville-broadband-infrastructure-vote-biden-mockery",
    "national-debt-military-spending-interest-payments-generational-cost",
  ],
  "tommy-tuberville-broadband-infrastructure-vote-biden-mockery": [
    "james-whitmore-voted-for-bill-he-publicly-denied",
    "bob-corker-tax-cuts-jobs-act-deficit-vote-flip",
    "national-debt-military-spending-interest-payments-generational-cost",
  ],

  // --- Clergy financial fraud cluster ---
  "brian-carn-false-prophecy-irs-guilty-plea-sexual-misconduct": [
    "mitchell-summerfield-word-of-god-fellowship-ppp-fraud-guilty-plea-2025",
    "paul-mitchell-brooklyn-pastor-tax-evasion-guilty-plea-2025",
    "rony-denis-house-of-prayer-operation-false-profit-indictment-2025",
  ],
  "mitchell-summerfield-word-of-god-fellowship-ppp-fraud-guilty-plea-2025": [
    "paul-mitchell-brooklyn-pastor-tax-evasion-guilty-plea-2025",
    "tony-spell-life-tabernacle-ppp-loan-government-authority-hypocrisy",
    "brian-carn-false-prophecy-irs-guilty-plea-sexual-misconduct",
  ],
  "paul-mitchell-brooklyn-pastor-tax-evasion-guilty-plea-2025": [
    "mitchell-summerfield-word-of-god-fellowship-ppp-fraud-guilty-plea-2025",
    "brian-carn-false-prophecy-irs-guilty-plea-sexual-misconduct",
    "creflo-dollar-65-million-gulfstream-jet-fundraiser-2015",
  ],
  "rony-denis-house-of-prayer-operation-false-profit-indictment-2025": [
    "brian-carn-false-prophecy-irs-guilty-plea-sexual-misconduct",
    "mitchell-summerfield-word-of-god-fellowship-ppp-fraud-guilty-plea-2025",
  ],

  // --- Robert Morris / Gateway Church arc ---
  "robert-morris-gateway-church-indicted-child-sex-abuse-oklahoma-2025": [
    "robert-morris-gateway-church-guilty-plea-child-sex-abuse-2025",
    "brady-boyd-new-life-church-robert-morris-misconduct-resignation-2025",
    "mark-driscoll-mars-hill-trinity-church-abuse-pattern",
  ],
  "robert-morris-gateway-church-guilty-plea-child-sex-abuse-2025": [
    "robert-morris-gateway-church-indicted-child-sex-abuse-oklahoma-2025",
    "brady-boyd-new-life-church-robert-morris-misconduct-resignation-2025",
    "john-mckinzie-hope-fellowship-frisco-second-pastor-resignation-sexual-sin-2025",
  ],
  "brady-boyd-new-life-church-robert-morris-misconduct-resignation-2025": [
    "robert-morris-gateway-church-indicted-child-sex-abuse-oklahoma-2025",
    "robert-morris-gateway-church-guilty-plea-child-sex-abuse-2025",
  ],

  // --- Pastoral sexual misconduct ---
  "john-mckinzie-hope-fellowship-frisco-second-pastor-resignation-sexual-sin-2025": [
    "robert-morris-gateway-church-guilty-plea-child-sex-abuse-2025",
    "greg-locke-divorce-remarriage-secretary-global-vision-bible-church-2022",
    "carl-lentz-hillsong-new-york-fired-infidelity-sexual-coercion-2020",
  ],
  "greg-locke-divorce-remarriage-secretary-global-vision-bible-church-2022": [
    "john-mckinzie-hope-fellowship-frisco-second-pastor-resignation-sexual-sin-2025",
    "carl-lentz-hillsong-new-york-fired-infidelity-sexual-coercion-2020",
    "perry-noble-newspring-church-fired-alcohol-abuse-2016",
  ],
  "carl-lentz-hillsong-new-york-fired-infidelity-sexual-coercion-2020": [
    "brian-houston-hillsong-founder-resigns-misconduct-investigation-2022",
    "john-mckinzie-hope-fellowship-frisco-second-pastor-resignation-sexual-sin-2025",
    "greg-locke-divorce-remarriage-secretary-global-vision-bible-church-2022",
  ],
  "brian-houston-hillsong-founder-resigns-misconduct-investigation-2022": [
    "carl-lentz-hillsong-new-york-fired-infidelity-sexual-coercion-2020",
    "mark-driscoll-mars-hill-trinity-church-abuse-pattern",
  ],
  "perry-noble-newspring-church-fired-alcohol-abuse-2016": [
    "greg-locke-divorce-remarriage-secretary-global-vision-bible-church-2022",
    "james-macdonald-harvest-bible-chapel-fired-fraud-hunting-ranch-2019",
  ],

  // --- Anti-gay preachers / same-sex conduct ---
  "dillon-awes-stedfast-baptist-execution-sermon-church-split": [
    "jonathan-shelley-stedfast-baptist-death-penalty-homosexuality-prostitution-scandal",
    "eddie-long-new-birth-missionary-baptist-same-sex-marriage-lawsuits-2010",
  ],
  "jonathan-shelley-stedfast-baptist-death-penalty-homosexuality-prostitution-scandal": [
    "dillon-awes-stedfast-baptist-execution-sermon-church-split",
    "eddie-long-new-birth-missionary-baptist-same-sex-marriage-lawsuits-2010",
    "ted-haggard-male-escort-meth-nae-resignation-2006",
  ],
  "eddie-long-new-birth-missionary-baptist-same-sex-marriage-lawsuits-2010": [
    "ted-haggard-male-escort-meth-nae-resignation-2006",
    "dillon-awes-stedfast-baptist-execution-sermon-church-split",
  ],
  "ted-haggard-male-escort-meth-nae-resignation-2006": [
    "eddie-long-new-birth-missionary-baptist-same-sex-marriage-lawsuits-2010",
    "jonathan-shelley-stedfast-baptist-death-penalty-homosexuality-prostitution-scandal",
  ],

  // --- Prosperity gospel / private jets / wealth ---
  "kenneth-copeland-covid-wind-of-god-blow-televised-2020": [
    "rodney-howard-browne-arrested-covid-church-services-tampa-2020",
    "jesse-duplantis-fourth-private-jet-54-million-fundraising-2018",
    "creflo-dollar-65-million-gulfstream-jet-fundraiser-2015",
  ],
  "jesse-duplantis-fourth-private-jet-54-million-fundraising-2018": [
    "creflo-dollar-65-million-gulfstream-jet-fundraiser-2015",
    "kenneth-copeland-covid-wind-of-god-blow-televised-2020",
    "paul-mitchell-brooklyn-pastor-tax-evasion-guilty-plea-2025",
  ],
  "creflo-dollar-65-million-gulfstream-jet-fundraiser-2015": [
    "jesse-duplantis-fourth-private-jet-54-million-fundraising-2018",
    "kenneth-copeland-covid-wind-of-god-blow-televised-2020",
  ],
  "paula-white-angel-prayer-election-2020-africa-south-america": [
    "ted-cruz-christ-is-king-antisemitic-aipac",
    "kenneth-copeland-covid-wind-of-god-blow-televised-2020",
  ],

  // --- COVID defiance / government authority ---
  "tony-spell-life-tabernacle-ppp-loan-government-authority-hypocrisy": [
    "mitchell-summerfield-word-of-god-fellowship-ppp-fraud-guilty-plea-2025",
    "rodney-howard-browne-arrested-covid-church-services-tampa-2020",
    "kenneth-copeland-covid-wind-of-god-blow-televised-2020",
  ],
  "rodney-howard-browne-arrested-covid-church-services-tampa-2020": [
    "kenneth-copeland-covid-wind-of-god-blow-televised-2020",
    "tony-spell-life-tabernacle-ppp-loan-government-authority-hypocrisy",
  ],

  // --- Megachurch abuse of power / institutional fraud ---
  "mark-driscoll-mars-hill-trinity-church-abuse-pattern": [
    "brian-houston-hillsong-founder-resigns-misconduct-investigation-2022",
    "james-macdonald-harvest-bible-chapel-fired-fraud-hunting-ranch-2019",
    "robert-morris-gateway-church-indicted-child-sex-abuse-oklahoma-2025",
  ],
  "james-macdonald-harvest-bible-chapel-fired-fraud-hunting-ranch-2019": [
    "mark-driscoll-mars-hill-trinity-church-abuse-pattern",
    "perry-noble-newspring-church-fired-alcohol-abuse-2016",
    "mitchell-summerfield-word-of-god-fellowship-ppp-fraud-guilty-plea-2025",
  ],

  // --- Religion / immigration hypocrisy ---
  "vernon-mills-anti-immigration-pastor-immigrant-grandparents": [
    "dale-hartwick-immigration-bill-political-theater-cspan",
    "cb-000041-united-states-built-by-immigrants-record-confirms-it",
    "give-me-your-tired-us-foreign-policy-immigration-global-south",
  ],

  // --- Media accountability cluster ---
  "social-media-disinformation-platforms-facebook-x-youtube-tiktok-receipts": [
    "cable-news-binary-media-bias-cnn-msnbc-fox-documented-record-2026",
    "meta-anti-palestine-investigation-documents-bsr-hrw-drop-site",
    "cnn-vanishing-act-wbd-debt-eeoc-audit",
  ],
  "meta-anti-palestine-investigation-documents-bsr-hrw-drop-site": [
    "social-media-disinformation-platforms-facebook-x-youtube-tiktok-receipts",
    "cable-news-binary-media-bias-cnn-msnbc-fox-documented-record-2026",
    "cnn-vanishing-act-wbd-debt-eeoc-audit",
  ],
  "cable-news-binary-media-bias-cnn-msnbc-fox-documented-record-2026": [
    "social-media-disinformation-platforms-facebook-x-youtube-tiktok-receipts",
    "meta-anti-palestine-investigation-documents-bsr-hrw-drop-site",
    "cnn-vanishing-act-wbd-debt-eeoc-audit",
  ],
  "cnn-vanishing-act-wbd-debt-eeoc-audit": [
    "cable-news-binary-media-bias-cnn-msnbc-fox-documented-record-2026",
    "social-media-disinformation-platforms-facebook-x-youtube-tiktok-receipts",
    "dei-label-clinical-cost-documented-inventory",
  ],

  // --- Judaism / Zionism / antisemitism ---
  "judaism-zionism-distinction-documented-record-2026": [
    "ted-cruz-christ-is-king-antisemitic-aipac",
    "cable-news-binary-media-bias-cnn-msnbc-fox-documented-record-2026",
  ],

  // --- Race, crime, and law enforcement data ---
  "fbi-crime-data-race-what-it-actually-says": [
    "arithmetic-of-presence-census-2020-2025-white-america",
    "second-amendment-racial-disparity-philando-castile",
    "afroman-sued-harassers-into-museum-exhibit",
  ],
  "second-amendment-racial-disparity-philando-castile": [
    "we-hold-these-truths-2026-constitutional-record",
    "fbi-crime-data-race-what-it-actually-says",
    "afroman-sued-harassers-into-museum-exhibit",
  ],

  // --- Constitution / rights ---
  "we-hold-these-truths-2026-constitutional-record": [
    "second-amendment-racial-disparity-philando-castile",
    "ketanji-brown-jackson-federal-record-confirmation-hearing",
    "national-debt-military-spending-interest-payments-generational-cost",
  ],
  "ketanji-brown-jackson-federal-record-confirmation-hearing": [
    "gentleman-lady-chivalry-history-primary-source-american-women",
    "we-hold-these-truths-2026-constitutional-record",
    "fbi-crime-data-race-what-it-actually-says",
  ],
  "gentleman-lady-chivalry-history-primary-source-american-women": [
    "ketanji-brown-jackson-federal-record-confirmation-hearing",
    "diversity-denial-primary-source-record-what-was-lost",
  ],

  // --- Fiscal / government spending ---
  "national-debt-military-spending-interest-payments-generational-cost": [
    "bob-corker-tax-cuts-jobs-act-deficit-vote-flip",
    "tommy-tuberville-broadband-infrastructure-vote-biden-mockery",
    "we-hold-these-truths-2026-constitutional-record",
  ],

  // --- Immigration / US history ---
  "cb-000041-united-states-built-by-immigrants-record-confirms-it": [
    "give-me-your-tired-us-foreign-policy-immigration-global-south",
    "dale-hartwick-immigration-bill-political-theater-cspan",
    "diversity-denial-primary-source-record-what-was-lost",
  ],
  "give-me-your-tired-us-foreign-policy-immigration-global-south": [
    "cb-000041-united-states-built-by-immigrants-record-confirms-it",
    "dale-hartwick-immigration-bill-political-theater-cspan",
    "vernon-mills-anti-immigration-pastor-immigrant-grandparents",
  ],

  // --- Diversity / DEI / demographics cluster ---
  "diversity-denial-primary-source-record-what-was-lost": [
    "arithmetic-of-presence-census-2020-2025-white-america",
    "cb-000041-united-states-built-by-immigrants-record-confirms-it",
    "dei-label-clinical-cost-documented-inventory",
  ],
  "arithmetic-of-presence-census-2020-2025-white-america": [
    "diversity-denial-primary-source-record-what-was-lost",
    "fbi-crime-data-race-what-it-actually-says",
    "first-nations-survival-census-record-us-history",
  ],
  "dei-label-clinical-cost-documented-inventory": [
    "diversity-denial-primary-source-record-what-was-lost",
    "fake-news-foucault-durkheim-trump-prophetic-roots",
    "arithmetic-of-presence-census-2020-2025-white-america",
  ],

  // --- NerdOut academic analysis ---
  "fake-news-foucault-durkheim-trump-prophetic-roots": [
    "dei-label-clinical-cost-documented-inventory",
    "cnn-vanishing-act-wbd-debt-eeoc-audit",
    "diversity-denial-primary-source-record-what-was-lost",
  ],

  // --- Human selflessness across difference ---
  "they-did-not-have-to-primary-source-record-human-selflessness": [
    "a-roadmap-home-requiem-american-statesman",
    "ketanji-brown-jackson-federal-record-confirmation-hearing",
    "the-strongest-thing-research-love-healing-long-life",
  ],

  // --- American statesman / bipartisan governance ---
  "a-roadmap-home-requiem-american-statesman": [
    "woke-is-not-a-slur-chronology-black-liberation-survival",
    "we-hold-these-truths-2026-constitutional-record",
    "ketanji-brown-jackson-federal-record-confirmation-hearing",
  ],

  // --- Woke: Black liberation and language reclamation ---
  "woke-is-not-a-slur-chronology-black-liberation-survival": [
    "diversity-denial-primary-source-record-what-was-lost",
    "dei-label-clinical-cost-documented-inventory",
    "ketanji-brown-jackson-federal-record-confirmation-hearing",
  ],

  // --- Healing / well-being: placed after heavy reads ---
  "the-strongest-thing-research-love-healing-long-life": [
    "beyond-social-security-what-to-build-before-the-clock-runs-out",
    "ketanji-brown-jackson-federal-record-confirmation-hearing",
    "columbus-george-washington-illegal-american-chronology-displacement",
  ],
  "columbus-george-washington-illegal-american-chronology-displacement": [
    "the-strongest-thing-research-love-healing-long-life",
    "cb-000041-united-states-built-by-immigrants-record-confirms-it",
    "first-nations-survival-census-record-us-history",
  ],

  // --- First Nations companion pieces ---
  "first-nations-survival-census-record-us-history": [
    "first-nations-knowledge-inventory-medicine-ecology-engineering",
    "diversity-denial-primary-source-record-what-was-lost",
    "arithmetic-of-presence-census-2020-2025-white-america",
  ],
  "first-nations-knowledge-inventory-medicine-ecology-engineering": [
    "first-nations-survival-census-record-us-history",
    "diversity-denial-primary-source-record-what-was-lost",
    "cb-000041-united-states-built-by-immigrants-record-confirms-it",
  ],

  // --- Congressional appropriations & foreign policy ---
  "congress-appropriations-ukraine-palestine-yemen-syria-sudan": [
    "national-debt-military-spending-interest-payments-generational-cost",
    "give-me-your-tired-us-foreign-policy-immigration-global-south",
    "meta-anti-palestine-investigation-documents-bsr-hrw-drop-site",
  ],
};
