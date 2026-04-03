/**
 * Editorial relationship map for ClownBinge internal cross-linking.
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
    "cb-000161-united-states-built-by-immigrants-record-confirms-it",
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
    "mark-driscoll-mars-hill-trinity-church-abuse-pattern",
  ],
  "brady-boyd-new-life-church-robert-morris-misconduct-resignation-2025": [
    "robert-morris-gateway-church-indicted-child-sex-abuse-oklahoma-2025",
    "robert-morris-gateway-church-guilty-plea-child-sex-abuse-2025",
  ],

  // --- Pastoral sexual misconduct ---
  // NOTE: john-mckinzie, greg-locke, carl-lentz, perry-noble not yet written — entries reserved for future articles
  "brian-houston-hillsong-founder-resigns-misconduct-investigation-2022": [
    "mark-driscoll-mars-hill-trinity-church-abuse-pattern",
    "robert-morris-gateway-church-guilty-plea-child-sex-abuse-2025",
  ],

  // --- Anti-gay preachers / same-sex conduct ---
  // NOTE: jonathan-shelley, ted-haggard not yet written — entries reserved for future articles
  "dillon-awes-stedfast-baptist-execution-sermon-church-split": [
    "eddie-long-new-birth-missionary-baptist-same-sex-marriage-lawsuits-2010",
    "mark-driscoll-mars-hill-trinity-church-abuse-pattern",
  ],
  "eddie-long-new-birth-missionary-baptist-same-sex-marriage-lawsuits-2010": [
    "dillon-awes-stedfast-baptist-execution-sermon-church-split",
    "brian-houston-hillsong-founder-resigns-misconduct-investigation-2022",
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
    "mitchell-summerfield-word-of-god-fellowship-ppp-fraud-guilty-plea-2025",
    "rony-denis-house-of-prayer-operation-false-profit-indictment-2025",
  ],

  // --- Religion / immigration hypocrisy ---
  "vernon-mills-anti-immigration-pastor-immigrant-grandparents": [
    "dale-hartwick-immigration-bill-political-theater-cspan",
    "cb-000161-united-states-built-by-immigrants-record-confirms-it",
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
  "cb-000161-united-states-built-by-immigrants-record-confirms-it": [
    "give-me-your-tired-us-foreign-policy-immigration-global-south",
    "dale-hartwick-immigration-bill-political-theater-cspan",
    "diversity-denial-primary-source-record-what-was-lost",
  ],
  "give-me-your-tired-us-foreign-policy-immigration-global-south": [
    "cb-000161-united-states-built-by-immigrants-record-confirms-it",
    "dale-hartwick-immigration-bill-political-theater-cspan",
    "vernon-mills-anti-immigration-pastor-immigrant-grandparents",
  ],

  // --- Diversity / DEI / demographics cluster ---
  "diversity-denial-primary-source-record-what-was-lost": [
    "arithmetic-of-presence-census-2020-2025-white-america",
    "cb-000161-united-states-built-by-immigrants-record-confirms-it",
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
    "cb-000161-united-states-built-by-immigrants-record-confirms-it",
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
    "cb-000161-united-states-built-by-immigrants-record-confirms-it",
  ],

  // --- Disarming Hate ---
  "america-not-taught-same-chapter-cross-racial-solidarity-documented-record": [
    "white-women-primary-beneficiaries-affirmative-action-federal-record",
    "they-did-not-have-to-primary-source-record-human-selflessness",
    "woke-is-not-a-slur-chronology-black-liberation-survival",
  ],
  "white-women-primary-beneficiaries-affirmative-action-federal-record": [
    "dei-label-clinical-cost-documented-inventory",
    "diversity-denial-primary-source-record-what-was-lost",
    "ketanji-brown-jackson-federal-record-confirmation-hearing",
  ],

  // --- Congressional appropriations & foreign policy ---
  "congress-appropriations-ukraine-palestine-yemen-syria-sudan": [
    "national-debt-military-spending-interest-payments-generational-cost",
    "give-me-your-tired-us-foreign-policy-immigration-global-south",
    "meta-anti-palestine-investigation-documents-bsr-hrw-drop-site",
  ],

  "they-did-not-have-to-primary-source-record-human-selflessness": [
    "first-nations-survival-census-record-us-history",
    "second-amendment-racial-disparity-philando-castile",
  ],

  // --- Law & Justice: Cash Bail / Pretrial Reform cluster ---
  "cash-bail-reform-states-recidivism-data-documented-record": [
    "mandatory-minimum-sentencing-reform-congressional-record-what-stopped-it",
    "prison-litigation-reform-act-plra-civil-rights-suits-barriers-documented",
    "qualified-immunity-reform-bills-congressional-votes-who-blocked-it",
  ],
  "mandatory-minimum-sentencing-reform-congressional-record-what-stopped-it": [
    "cash-bail-reform-states-recidivism-data-documented-record",
    "national-registry-exonerations-wrongful-conviction-race-data-documented",
    "prison-litigation-reform-act-plra-civil-rights-suits-barriers-documented",
  ],
  "national-registry-exonerations-wrongful-conviction-race-data-documented": [
    "jailhouse-informants-wrongful-convictions-documented-pattern-national-registry",
    "prison-litigation-reform-act-plra-civil-rights-suits-barriers-documented",
    "mandatory-minimum-sentencing-reform-congressional-record-what-stopped-it",
  ],
  "jailhouse-informants-wrongful-convictions-documented-pattern-national-registry": [
    "national-registry-exonerations-wrongful-conviction-race-data-documented",
    "prison-litigation-reform-act-plra-civil-rights-suits-barriers-documented",
  ],
  "prison-litigation-reform-act-plra-civil-rights-suits-barriers-documented": [
    "solitary-confinement-un-standards-nelson-mandela-rules-us-prison-practice-documented",
    "national-registry-exonerations-wrongful-conviction-race-data-documented",
    "cash-bail-reform-states-recidivism-data-documented-record",
  ],
  "solitary-confinement-un-standards-nelson-mandela-rules-us-prison-practice-documented": [
    "prison-litigation-reform-act-plra-civil-rights-suits-barriers-documented",
    "national-registry-exonerations-wrongful-conviction-race-data-documented",
  ],

  // --- Law & Justice: Voting Rights / Civil Rights cluster ---
  "shelby-county-v-holder-voting-restrictions-states-documented-record-2013-2024": [
    "hud-fair-housing-complaints-decade-data-race-disability-documented",
    "eeoc-employment-discrimination-charge-data-outcomes-documented-record",
    "qualified-immunity-reform-bills-congressional-votes-who-blocked-it",
  ],
  "hud-fair-housing-complaints-decade-data-race-disability-documented": [
    "eeoc-employment-discrimination-charge-data-outcomes-documented-record",
    "shelby-county-v-holder-voting-restrictions-states-documented-record-2013-2024",
  ],
  "eeoc-employment-discrimination-charge-data-outcomes-documented-record": [
    "hud-fair-housing-complaints-decade-data-race-disability-documented",
    "algorithmic-hiring-discrimination-eeoc-ai-tools-documented-cases-2023-2024",
  ],
  "qualified-immunity-reform-bills-congressional-votes-who-blocked-it": [
    "civil-asset-forfeiture-states-no-conviction-required-documented-record",
    "shelby-county-v-holder-voting-restrictions-states-documented-record-2013-2024",
    "no-fly-list-how-added-due-process-challenges-documented-record",
  ],
  "civil-asset-forfeiture-states-no-conviction-required-documented-record": [
    "qualified-immunity-reform-bills-congressional-votes-who-blocked-it",
    "prison-litigation-reform-act-plra-civil-rights-suits-barriers-documented",
  ],

  // --- Law & Justice: SCOTUS / Executive Power cluster ---
  "trump-v-united-states-presidential-immunity-ruling-text-documented": [
    "303-creative-v-elenis-supreme-court-ruling-what-it-actually-says",
    "students-fair-admissions-v-harvard-unc-ruling-what-it-permits-documented",
    "moody-v-netchoice-supreme-court-social-media-first-amendment-ruling-2024",
  ],
  "303-creative-v-elenis-supreme-court-ruling-what-it-actually-says": [
    "trump-v-united-states-presidential-immunity-ruling-text-documented",
    "students-fair-admissions-v-harvard-unc-ruling-what-it-permits-documented",
  ],
  "students-fair-admissions-v-harvard-unc-ruling-what-it-permits-documented": [
    "trump-v-united-states-presidential-immunity-ruling-text-documented",
    "shelby-county-v-holder-voting-restrictions-states-documented-record-2013-2024",
  ],
  "moody-v-netchoice-supreme-court-social-media-first-amendment-ruling-2024": [
    "section-230-communications-decency-act-what-it-says-what-it-does-not",
    "social-media-political-suppression-documented-cases-court-records-2020-2024",
  ],

  // --- Law & Justice: Surveillance / Due Process cluster ---
  "fisa-section-702-mass-surveillance-authority-documented-scope-reauthorization": [
    "stingray-cell-site-simulators-law-enforcement-warrantless-use-documented",
    "no-fly-list-how-added-due-process-challenges-documented-record",
    "clearview-ai-facial-recognition-federal-contracts-database-documented",
  ],
  "no-fly-list-how-added-due-process-challenges-documented-record": [
    "fisa-section-702-mass-surveillance-authority-documented-scope-reauthorization",
    "civil-asset-forfeiture-states-no-conviction-required-documented-record",
  ],
  "title-ix-2024-regulations-legal-challenges-what-changed-documented": [
    "students-fair-admissions-v-harvard-unc-ruling-what-it-permits-documented",
    "title-ix-athletic-programs-enrollment-opportunity-gap-documented-data-2024",
  ],

  // --- Technology: Surveillance / AI cluster ---
  "algorithmic-hiring-discrimination-eeoc-ai-tools-documented-cases-2023-2024": [
    "compas-algorithm-criminal-sentencing-propublica-analysis-bias-documented",
    "amazon-worker-surveillance-patents-monitoring-systems-documented-impact",
    "eeoc-employment-discrimination-charge-data-outcomes-documented-record",
  ],
  "stingray-cell-site-simulators-law-enforcement-warrantless-use-documented": [
    "clearview-ai-facial-recognition-federal-contracts-database-documented",
    "license-plate-readers-data-retention-sharing-courts-documented-record",
    "fisa-section-702-mass-surveillance-authority-documented-scope-reauthorization",
  ],
  "license-plate-readers-data-retention-sharing-courts-documented-record": [
    "stingray-cell-site-simulators-law-enforcement-warrantless-use-documented",
    "clearview-ai-facial-recognition-federal-contracts-database-documented",
  ],
  "clearview-ai-facial-recognition-federal-contracts-database-documented": [
    "stingray-cell-site-simulators-law-enforcement-warrantless-use-documented",
    "license-plate-readers-data-retention-sharing-courts-documented-record",
    "fisa-section-702-mass-surveillance-authority-documented-scope-reauthorization",
  ],
  "compas-algorithm-criminal-sentencing-propublica-analysis-bias-documented": [
    "algorithmic-hiring-discrimination-eeoc-ai-tools-documented-cases-2023-2024",
    "national-registry-exonerations-wrongful-conviction-race-data-documented",
  ],
  "amazon-worker-surveillance-patents-monitoring-systems-documented-impact": [
    "algorithmic-hiring-discrimination-eeoc-ai-tools-documented-cases-2023-2024",
    "digital-redlining-fcc-broadband-access-income-race-data-documented",
  ],
  "digital-redlining-fcc-broadband-access-income-race-data-documented": [
    "amazon-worker-surveillance-patents-monitoring-systems-documented-impact",
    "section-230-communications-decency-act-what-it-says-what-it-does-not",
  ],

  // --- Technology: Platform Power / AI Rights cluster ---
  "ai-training-data-copyright-lawsuits-new-york-times-openai-legal-theory": [
    "section-230-communications-decency-act-what-it-says-what-it-does-not",
    "social-media-content-moderation-disparities-documented-cases-race-politics",
  ],
  "section-230-communications-decency-act-what-it-says-what-it-does-not": [
    "moody-v-netchoice-supreme-court-social-media-first-amendment-ruling-2024",
    "ai-training-data-copyright-lawsuits-new-york-times-openai-legal-theory",
    "social-media-political-suppression-documented-cases-court-records-2020-2024",
  ],
  "social-media-content-moderation-disparities-documented-cases-race-politics": [
    "section-230-communications-decency-act-what-it-says-what-it-does-not",
    "ai-training-data-copyright-lawsuits-new-york-times-openai-legal-theory",
    "social-media-political-suppression-documented-cases-court-records-2020-2024",
  ],

  // --- Women & Girls cluster ---
  "maternal-mortality-dobbs-state-by-state-data-abortion-restrictions-documented": [
    "violence-against-women-act-vawa-coverage-funding-gaps-documented",
    "missing-murdered-indigenous-women-mmiw-doj-data-documentation-gap-documented",
  ],
  "title-ix-athletic-programs-enrollment-opportunity-gap-documented-data-2024": [
    "gender-pay-gap-female-dominated-professions-bls-data-by-industry-documented",
    "title-ix-2024-regulations-legal-challenges-what-changed-documented",
    "women-us-senate-full-history-1922-2025-primary-source-record",
  ],
  "gender-pay-gap-female-dominated-professions-bls-data-by-industry-documented": [
    "title-ix-athletic-programs-enrollment-opportunity-gap-documented-data-2024",
    "eeoc-employment-discrimination-charge-data-outcomes-documented-record",
  ],
  "violence-against-women-act-vawa-coverage-funding-gaps-documented": [
    "maternal-mortality-dobbs-state-by-state-data-abortion-restrictions-documented",
    "missing-murdered-indigenous-women-mmiw-doj-data-documentation-gap-documented",
  ],
  "women-us-senate-full-history-1922-2025-primary-source-record": [
    "title-ix-athletic-programs-enrollment-opportunity-gap-documented-data-2024",
    "gender-pay-gap-female-dominated-professions-bls-data-by-industry-documented",
  ],
  "missing-murdered-indigenous-women-mmiw-doj-data-documentation-gap-documented": [
    "violence-against-women-act-vawa-coverage-funding-gaps-documented",
    "maternal-mortality-dobbs-state-by-state-data-abortion-restrictions-documented",
  ],

  // --- War & Inhumanity cluster ---
  "yemen-un-panel-experts-siege-hudaydah-documented-civilian-impact": [
    "us-cluster-munitions-ukraine-decision-ccm-treaty-civilian-harm-documented",
    "drc-congo-mineral-extraction-un-group-experts-funding-conflict-documented",
  ],
  "drc-congo-mineral-extraction-un-group-experts-funding-conflict-documented": [
    "sudan-rsf-rapid-support-forces-atrocities-documented-record-2023-2025",
    "myanmar-military-coup-2021-un-independent-investigative-mechanism-documented",
  ],
  "sudan-rsf-rapid-support-forces-atrocities-documented-record-2023-2025": [
    "drc-congo-mineral-extraction-un-group-experts-funding-conflict-documented",
    "myanmar-military-coup-2021-un-independent-investigative-mechanism-documented",
  ],
  "us-cluster-munitions-ukraine-decision-ccm-treaty-civilian-harm-documented": [
    "yemen-un-panel-experts-siege-hudaydah-documented-civilian-impact",
    "myanmar-military-coup-2021-un-independent-investigative-mechanism-documented",
  ],
  "myanmar-military-coup-2021-un-independent-investigative-mechanism-documented": [
    "sudan-rsf-rapid-support-forces-atrocities-documented-record-2023-2025",
    "drc-congo-mineral-extraction-un-group-experts-funding-conflict-documented",
  ],

  // --- Anti-Racist Heroes cluster ---
  "bryan-stevenson-equal-justice-initiative-exonerations-policy-changes-documented": [
    "ida-b-wells-anti-lynching-journalism-primary-sources-federal-law-impact",
    "fannie-lou-hamer-democratic-convention-testimony-voting-rights-documented-impact",
    "national-registry-exonerations-wrongful-conviction-race-data-documented",
  ],
  "ida-b-wells-anti-lynching-journalism-primary-sources-federal-law-impact": [
    "bryan-stevenson-equal-justice-initiative-exonerations-policy-changes-documented",
    "fannie-lou-hamer-democratic-convention-testimony-voting-rights-documented-impact",
  ],
  "claudette-colvin-bus-arrest-before-rosa-parks-montgomery-documented-record": [
    "fannie-lou-hamer-democratic-convention-testimony-voting-rights-documented-impact",
    "fred-korematsu-overturning-supreme-court-case-coram-nobis-documented-record",
  ],
  "fred-korematsu-overturning-supreme-court-case-coram-nobis-documented-record": [
    "claudette-colvin-bus-arrest-before-rosa-parks-montgomery-documented-record",
    "trump-v-united-states-presidential-immunity-ruling-text-documented",
  ],
  "fannie-lou-hamer-democratic-convention-testimony-voting-rights-documented-impact": [
    "shelby-county-v-holder-voting-restrictions-states-documented-record-2013-2024",
    "ida-b-wells-anti-lynching-journalism-primary-sources-federal-law-impact",
    "claudette-colvin-bus-arrest-before-rosa-parks-montgomery-documented-record",
  ],

  // --- Censorship cluster ---
  "book-banning-florida-school-districts-documented-count-2022-2024": [
    "pen-america-index-book-challenges-organizations-states-patterns-2022-2024",
    "american-library-association-book-challenge-index-who-files-outcomes-documented",
    "lgbtq-content-bans-schools-state-by-state-record-2021-2025-documented",
  ],
  "pen-america-index-book-challenges-organizations-states-patterns-2022-2024": [
    "book-banning-florida-school-districts-documented-count-2022-2024",
    "american-library-association-book-challenge-index-who-files-outcomes-documented",
  ],
  "fire-campus-free-speech-academic-freedom-cases-2020-2024-documented": [
    "social-media-political-suppression-documented-cases-court-records-2020-2024",
    "pen-america-index-book-challenges-organizations-states-patterns-2022-2024",
  ],
  "social-media-political-suppression-documented-cases-court-records-2020-2024": [
    "section-230-communications-decency-act-what-it-says-what-it-does-not",
    "moody-v-netchoice-supreme-court-social-media-first-amendment-ruling-2024",
    "fire-campus-free-speech-academic-freedom-cases-2020-2024-documented",
  ],
  "lgbtq-content-bans-schools-state-by-state-record-2021-2025-documented": [
    "book-banning-florida-school-districts-documented-count-2022-2024",
    "pen-america-index-book-challenges-organizations-states-patterns-2022-2024",
  ],
  "american-library-association-book-challenge-index-who-files-outcomes-documented": [
    "pen-america-index-book-challenges-organizations-states-patterns-2022-2024",
    "book-banning-florida-school-districts-documented-count-2022-2024",
  ],
};
