import { db, postsTable, booksTable } from "@workspace/db";

const samplePosts = [
  {
    caseNumber: "CB-000001",
    title: "Sen. James Whitmore Claims He Never Voted For The Bill He Voted For",
    slug: "senator-claims-never-voted-for-bill",
    teaser: "The Congressional Record does not care about your selective memory. Neither does ClownBinge.",
    body: `<p>There is a document called the <a href="https://www.congress.gov/congressional-record" class="cb-factoid" data-title="The Congressional Record" data-summary="The official daily record of the proceedings and debates of the U.S. Congress, published by the U.S. Government Publishing Office. Every vote, every speech, and every procedural motion is logged with a timestamp and a member's name." target="_blank" rel="noopener noreferrer">Congressional Record</a>. It has been published continuously since 1873. It is the official journal of what Congress actually does, as opposed to what members of Congress tell their donors they did. It does not accept corrections after the fact. It does not offer a comment period. It simply records what happened, when it happened, and who was responsible.</p>

<p>Senator James Whitmore of Missouri apparently believes this document does not exist, or perhaps that his constituents lack the literacy and internet access required to locate it. On the basis of that assumption, he has constructed a comfortable narrative about his own voting record. The Congressional Record has constructed a different one. The Congressional Record's version has dates attached.</p>

<p>On March 15, 2023, the United States Senate voted on <a href="https://www.congress.gov" class="cb-factoid" data-title="S.1247 — Rural Infrastructure Investment Act" data-summary="Senate legislation providing $4.2 billion in rural broadband, road, and water infrastructure funding. Passed 61-39 on March 15, 2023. Full text and roll call vote available at Congress.gov." target="_blank" rel="noopener noreferrer">S.1247, the Rural Infrastructure Investment Act</a>. The bill allocated $4.2 billion toward rural broadband expansion, road repair, and water system upgrades across fourteen states, including Missouri. The bill passed 61 to 39. Senator Whitmore's name appears in the official Senate roll call record under "YEA." That is a legal term meaning he voted for it. Not "in favor of portions of it." Not "present." For it.</p>

<p>The vote is logged with a time. It is logged with a date. It is logged with the senator's name spelled correctly. There is no ambiguity in a roll call vote. You either cast one or you do not. Senator Whitmore cast one.</p>

<p>Four months later, at a town hall in Springfield, Missouri, a constituent asked Whitmore a direct question about rural broadband funding — specifically, why he had not supported efforts to bring high-speed internet to underserved communities in the state. The constituent had read about the bill. She had not, apparently, read the roll call.</p>

<p>Senator Whitmore's response, captured on video by three separate attendees and later uploaded to social media: "I never supported that bill. I voted against government overreach every single time. That's what this district sent me to Washington to do."</p>

<p>The C-SPAN archive of the <a href="https://www.c-span.org" class="cb-factoid" data-title="C-SPAN Congressional Archive" data-summary="C-SPAN has recorded and archived Congressional proceedings since 1979. The archive includes floor votes, committee hearings, and press conferences. All footage is publicly accessible and timestamped." target="_blank" rel="noopener noreferrer">Senate floor proceedings</a> from March 15, 2023, is publicly accessible. The audio of the vote is clear. The timestamp is precise. At 2:47 PM Eastern, the clerk called Whitmore's name. At 2:47 PM Eastern, Whitmore responded "Aye." At 2:47 PM Eastern, the Congressional Record logged a YEA vote from Senator James Whitmore of Missouri on S.1247.</p>

<p>His communications team, reached for comment after the town hall video circulated, said the senator's vote had been "mischaracterized." The Congressional Record does not characterize. It transcribes. The distinction matters.</p>

<p>This is not an isolated instance. ClownBinge has reviewed Senator Whitmore's public statements against his voting record going back to 2019. The pattern is consistent. He voted yes on the American Rescue Plan in 2021 and told a local radio station in 2022 that he had "always opposed wasteful pandemic spending." He voted in favor of a 2019 farm subsidy reauthorization and described it on his campaign website as a "bloated entitlement program he proudly voted against."</p>

<p>Each of these reversals follows the same structure. A vote is cast. Time passes. Political circumstances shift. The vote is retroactively described as something else. The Congressional Record, indifferent to political circumstances, continues to say what it said the day the vote was taken.</p>

<p>The self-own here is structural. Whitmore is not operating in a pre-internet era where constituent access to primary documents required a trip to a federal depository library. The Congressional Record is searchable online. The C-SPAN archive is free to access. The Senate roll call database is a public website. Anyone with a phone and curiosity can find the vote in approximately ninety seconds.</p>

<p>Senator Whitmore is a sitting member of the United States Senate. He generates the very public records he is now contradicting. That is not a tragic irony. That is a choice. And it is now documented here.</p>

<p>The receipts do not have a political agenda. They have dates.</p>`,
    category: "self_owned" as const,
    subjectName: "James Whitmore",
    subjectTitle: "U.S. Senator",
    subjectParty: "Republican",
    verifiedSource: "Congressional Record",
    hasVideo: false,
    selfOwnScore: 9,
    tags: ["senate", "self-owned", "congressional record", "voting record", "missouri"],
    status: "published" as const,
    dateOfIncident: "2023-07-22",
    publishedAt: new Date("2024-01-15"),
  },
  {
    caseNumber: "CB-000002",
    title: "Rep. Dale Hartwick Caught on C-SPAN Calling His Own Immigration Bill 'Political Theater for the Base'",
    slug: "congressman-caught-cspan-quiet-part-loud",
    teaser: "C-SPAN cameras are always on. This is a lesson some elected officials never learn.",
    body: `<p><a href="https://www.c-span.org" class="cb-factoid" data-title="C-SPAN — America's Network" data-summary="C-SPAN has provided unfiltered, gavel-to-gavel coverage of Congress since 1979. Cameras are placed throughout hearing rooms and chambers. All footage is archived and publicly searchable at c-span.org." target="_blank" rel="noopener noreferrer">C-SPAN</a> has been recording Congress since 1979. That is forty-five years of floor speeches, committee hearings, confirmation battles, and the kind of candid moments that occur when a public official forgets that the red recording light means the camera is running. The network does not editorialize. It does not crop. It does not cut away at inconvenient moments. It simply records what is happening in rooms that belong to the American public.</p>

<p>Congressman Dale Hartwick of Georgia forgot the red light on February 7, 2024.</p>

<p>The clip in question runs three minutes and forty-two seconds. It is timestamped, indexed, and archived in the <a href="https://www.c-span.org/congress/" class="cb-factoid" data-title="C-SPAN Congressional Archive" data-summary="Searchable database of C-SPAN footage dating to 1979, including committee hearings, floor debates, and press availability. Footage is indexed by date, member name, committee, and topic." target="_blank" rel="noopener noreferrer">C-SPAN database</a> under House Judiciary Committee proceedings, February 7, 2024. In it, Congressman Hartwick is visible speaking to a colleague during what he believed was a recess break. The committee had not formally recessed. The cameras had not been turned off. Both of these facts were apparently unknown to him.</p>

<p>What Hartwick said during those three minutes and forty-two seconds articulates a position on immigration enforcement substantially different from the one he has articulated in his official press releases, his constituent newsletters, his campaign mailers, and his public remarks on the House floor. In the clip, he describes his own signature immigration legislation as "political theater for the base" and characterizes his public statements on border security as "what you have to say to get through a primary."</p>

<p>His communications director issued a statement on February 9th. It said the clip had been "taken out of context."</p>

<p>The C-SPAN clip contains no context gap. It is a continuous, unedited recording beginning before Hartwick starts speaking and ending after he finishes. The context is the entire clip. The clip is the context.</p>

<p>What Hartwick said on February 7th contradicts positions he has held in at least six documented public statements going back to 2021. ClownBinge has reviewed each of those statements. The <a href="https://www.congress.gov/congressional-record" class="cb-factoid" data-title="Congressional Record — Official Proceedings" data-summary="The daily record of Congressional debate, votes, and proceedings. Member floor speeches are printed in full. All content is public record under the Federal Records Act." target="_blank" rel="noopener noreferrer">Congressional Record</a> contains three floor speeches in which he described his immigration enforcement bill as a sincere and urgent response to a genuine national crisis. The C-SPAN archive contains two committee appearances in which he used language indistinguishable from those floor speeches. His official website contains a press release calling the legislation "my proudest achievement in office."</p>

<p>None of those documents agree with the February 7th recording. The February 7th recording appears to be the only instance in which Hartwick described what he actually believes about the legislation he authored.</p>

<p>The gap between Hartwick's public statements and his private assessment of those statements is not a policy disagreement. It is not a nuance. It is a documented, timestamped, publicly accessible record of a sitting member of Congress telling a colleague that his public statements are performance and his private assessment is the opposite of those statements.</p>

<p>The <a href="https://judiciary.house.gov" class="cb-factoid" data-title="House Committee on the Judiciary" data-summary="One of the oldest standing committees in the U.S. House of Representatives, with jurisdiction over federal courts, constitutional amendments, immigration law, and civil liberties. Committee hearings are public record." target="_blank" rel="noopener noreferrer">House Judiciary Committee</a>, on which Hartwick sits, has jurisdiction over the immigration enforcement legislation he describes as political theater. He continues to serve on that committee. He continues to advocate publicly for that legislation. The C-SPAN archive continues to exist.</p>

<p>The primary source here is a U.S. Representative's own voice, in a U.S. government building, recorded by cameras his own institution invited into that building. There is no secondary interpretation required. There is no anonymous source. There is no leaked document. There is a man saying one thing in public and the opposite thing in private, and a camera that was running the whole time.</p>

<p>These are not two interpretations of a complicated policy position. They are two contradictory statements from the same person, both captured on video, both entered into the permanent public record. One of them is true. The congressman's own behavior on February 7th tells us which one.</p>`,
    category: "self_owned" as const,
    subjectName: "Dale Hartwick",
    subjectTitle: "U.S. Representative",
    subjectParty: "Republican",
    verifiedSource: "C-SPAN",
    hasVideo: true,
    videoUrl: null,
    videoThumbnail: null,
    selfOwnScore: 8,
    tags: ["cspan", "congress", "immigration", "hypocrisy", "georgia"],
    status: "published" as const,
    dateOfIncident: "2024-02-07",
    publishedAt: new Date("2024-02-10"),
  },
  {
    caseNumber: "CB-000003",
    title: "Texas AG Rick Donahue Is Suing Companies For What His Own Law Firm Did For Six Years",
    slug: "state-ag-files-lawsuit-practice-used-himself",
    teaser: "The lawsuit was filed March 3rd. His own department's records document the same practice from 2016 to 2022.",
    body: `<p>On March 3, 2024, Texas Attorney General Rick Donahue filed a 47-page civil lawsuit against a national insurance consortium. The lawsuit's central argument: the consortium had engaged in a pattern of fraudulent business practices that exploited regulatory frameworks meant to protect working families. Donahue called a press conference. He used words like "predatory," "deceptive," and "accountability."</p>

<p>The <a href="https://statutes.capitol.texas.gov/Docs/BC/htm/BC.17.htm" class="cb-factoid" data-title="Texas Deceptive Trade Practices Act (DTPA)" data-summary="Texas Business and Commerce Code §17.41-17.63. The DTPA prohibits false, misleading, or deceptive acts or practices in the conduct of any trade or commerce. It is the primary consumer protection statute in Texas and is frequently invoked by the AG's office." target="_blank" rel="noopener noreferrer">Texas Deceptive Trade Practices Act</a>, under which the lawsuit was filed, prohibits exactly the kind of business structuring described in Donahue's complaint. The complaint is detailed. It names specific practices. It cites specific statutes. It asks the court for specific remedies including disgorgement, civil penalties, and injunctive relief.</p>

<p>What the complaint does not mention: from 2016 to 2022, Rick Donahue was a private attorney at the firm Donahue, Kellar and Associates in San Antonio. During that period, according to <a href="https://www.texasbar.com" class="cb-factoid" data-title="State Bar of Texas — Attorney Records" data-summary="The State Bar of Texas maintains a public directory of all licensed attorneys in the state, including their case history, disciplinary records, and areas of practice. Records are searchable at texasbar.com." target="_blank" rel="noopener noreferrer">State Bar of Texas</a> records and Bexar County court filings, his firm represented clients engaged in the same business practice now described in paragraphs 12 through 28 of his complaint as "inherently deceptive."</p>

<p>The Bexar County filings are public record. They include case numbers, client names, and the nature of the legal representation. In several instances, the filings include detailed memoranda authored by Donahue's firm describing the practice's legal architecture and recommending it to clients as compliant with state law. These memoranda were part of the public record before Rick Donahue became Attorney General. They remain part of the public record now that he is.</p>

<p>His press release from March 3rd describes the lawsuit as "a historic action to protect Texas families from predatory corporate behavior." A 2019 client memorandum from his private practice, obtained through a public records request to <a href="https://www.bexar.org/2730/District-Courts" class="cb-factoid" data-title="Bexar County District Courts — Public Records" data-summary="Bexar County, Texas maintains public access to district court filings including civil case documents, attorney appearances, and case memoranda. Records can be requested through the Bexar County District Clerk's office." target="_blank" rel="noopener noreferrer">Bexar County District Courts</a>, describes the same behavior as "a legally sound structure consistent with industry standards and fully compliant with applicable state law."</p>

<p>Both documents describe the same business practice. One was written by Rick Donahue the private attorney billing $450 per hour to structure it. The other was filed by Rick Donahue the Attorney General charging it as a consumer fraud scheme. They are irreconcilable. They are both public record. They both have his name on them.</p>

<p>The legal question of whether the practice is fraudulent is one for the courts. ClownBinge does not adjudicate law. What ClownBinge adjudicates is the documented gap between what a public official says in public and what the public record shows they did in private. In this case, that gap spans six years, two careers, and one spectacular flip that appears to have been timed to a statewide election campaign.</p>

<p>Donahue was elected Attorney General in November 2022. His first major consumer protection lawsuit, filed sixteen months into office, targets a practice his former clients paid him to facilitate. His former clients' names appear in the Bexar County filings. His name also appears in the Bexar County filings, identified as their attorney of record.</p>

<p>There is a word in law for when a lawyer's prior representation creates a conflict with their current position. That word is "conflict." The State Bar of Texas has a process for reviewing such conflicts. Whether that process has been engaged in this matter is a question for the Bar. The question for ClownBinge is simpler: did Rick Donahue build a legal practice doing the exact thing he is now suing other people for doing?</p>

<p>The public record says yes. The public record has case numbers.</p>`,
    category: "political" as const,
    subjectName: "Rick Donahue",
    subjectTitle: "State Attorney General",
    subjectParty: "Republican",
    verifiedSource: "Court Records",
    hasVideo: false,
    selfOwnScore: 9,
    tags: ["attorney general", "texas", "hypocrisy", "court records", "self-owned"],
    status: "published" as const,
    dateOfIncident: "2024-03-03",
    publishedAt: new Date("2024-03-05"),
  },
  {
    caseNumber: "CB-000004",
    title: "Pastor Vernon Mills Preaches Against Immigration. Public Records Show All Four of His Grandparents Were Immigrants.",
    slug: "anti-immigration-pastor-immigrant-grandparents",
    teaser: "The genealogical records predate the political position by about 80 years.",
    body: `<p>Pastor Vernon Mills of Cornerstone Fellowship Church in Scottsdale, Arizona, has delivered seventeen documented sermons on immigration since January 2020. ClownBinge has reviewed each one. The transcripts are available on Cornerstone Fellowship's official YouTube channel, archived in full with timestamps. The argument across all seventeen sermons is consistent: unrestricted immigration from certain regions of the world constitutes a demographic and cultural threat to what Pastor Mills calls "the foundational character of this nation."</p>

<p>The <a href="https://www.libertyellisfoundation.org/passenger-search" class="cb-factoid" data-title="Ellis Island Foundation — Passenger Search" data-summary="The Ellis Island Foundation maintains a searchable database of more than 65 million records of immigrants who passed through Ellis Island and the Port of New York between 1892 and 1957. Records include arrival dates, countries of origin, and ship manifests." target="_blank" rel="noopener noreferrer">Ellis Island Foundation's passenger records database</a> is not interested in Pastor Mills' theology. It is interested in names, dates, and countries of origin. And it has information about Vernon Mills' family that Vernon Mills has apparently chosen not to share with his congregation.</p>

<p>Mills' maternal grandparents are Bogdan and Irena Kowalczyk, who immigrated from Poland in November 1951 as displaced persons following World War II. They arrived at the Port of New York aboard the SS General R.M. Blatchford. Bogdan Kowalczyk's name appears in the <a href="https://www.govinfo.gov/content/pkg/STATUTE-62/pdf/STATUTE-62-Pg1009.pdf" class="cb-factoid" data-title="Displaced Persons Act of 1948" data-summary="Public Law 80-774. The Displaced Persons Act authorized the admission of approximately 400,000 European displaced persons to the United States between 1948 and 1952. It was one of the largest refugee resettlement programs in American history." target="_blank" rel="noopener noreferrer">Displaced Persons Act</a> admission records maintained by the National Archives. Irena Kowalczyk's name appears beside his. Both were admitted to the United States as refugees. Both became American citizens.</p>

<p>Mills' paternal grandmother is Maria Elena Reyes de Mills, who immigrated to the United States from Sonora, Mexico, in 1943. She entered through the Nogales port of entry on a temporary agricultural work visa under the Bracero Program and applied for permanent residency in 1947. She was naturalized in 1952. Her <a href="https://www.uscis.gov/records/genealogy-research" class="cb-factoid" data-title="USCIS Genealogy Records" data-summary="U.S. Citizenship and Immigration Services maintains historical immigration records including naturalization files, alien registration records, and visa petitions. Records can be requested for genealogical research through the USCIS Genealogy Program." target="_blank" rel="noopener noreferrer">naturalization record</a> is filed with U.S. Citizenship and Immigration Services.</p>

<p>All four of Vernon Mills' grandparents were immigrants. Two entered as refugees from war-torn Europe under a federal program designed specifically to bring displaced persons into the United States. One entered on a work visa from Mexico. All four eventually became American citizens. Vernon Mills is an American citizen because the United States government allowed four immigrants into the country in the 1940s and 1950s.</p>

<p>His sermon from February 18, 2024, archived on Cornerstone Fellowship's official YouTube channel and available to anyone with an internet connection, includes this passage: "God did not build this nation for the whole world to walk into. This is a nation of a specific people, a specific heritage, a specific covenant, and we are obligated to protect that covenant from being diluted by those who do not share it."</p>

<p>He delivered this sermon as a man whose maternal grandmother entered the United States from Mexico on a work visa, whose maternal grandparents entered as Polish refugees, and whose own existence is a direct product of the immigration policies he now describes from the pulpit as a threat to national identity.</p>

<p>The genealogical records are not accusatory documents. They are vital records maintained by county offices, federal agencies, and nonprofit archives. They record births, deaths, arrivals, and naturalization dates. They do not make arguments. They document facts about families. The argument here makes itself.</p>

<p>Cornerstone Fellowship Church has not responded to a request for comment. Pastor Mills' sermons remain publicly archived on the church's YouTube channel. The Ellis Island records remain publicly searchable. The Maricopa County vital records remain public documents. The contradiction between them is complete, documented, and now archived here at ClownBinge alongside the receipts.</p>

<p>The genealogical records predate the political position by about eighty years. Time, it turns out, keeps receipts too.</p>`,
    category: "religious" as const,
    subjectName: "Vernon Mills",
    subjectTitle: "Pastor, Cornerstone Fellowship Church",
    subjectParty: null,
    verifiedSource: "Maricopa County Records / Ellis Island Database",
    hasVideo: false,
    selfOwnScore: 10,
    tags: ["immigration", "religion", "hypocrisy", "ancestry", "arizona"],
    status: "published" as const,
    dateOfIncident: "2024-02-18",
    publishedAt: new Date("2024-02-20"),
  },
  {
    caseNumber: "CB-000005",
    title: "Patricia Holden Voted to Ban Diversity Books. Her Daughter Was Already Enrolled in USC's Mandatory DEI Program.",
    slug: "school-board-bans-diversity-books-daughter-at-dei-university",
    teaser: "The same month the ban passed, enrollment deposits were due.",
    body: `<p>On August 14, 2023, the Palmetto County School Board voted 5 to 2 to remove 23 books from district library shelves. Board member Patricia Holden was one of the five affirmative votes. The removal list, entered into the official meeting minutes and available through the district's public records office, includes titles related to civil rights history, LGBTQ+ youth experiences, and what the board's resolution describes as "ideologically targeted diversity programming."</p>

<p>The board's action drew national media coverage. Patricia Holden gave multiple interviews. In each one, she framed the removals as a principled stand for parental rights and what she called "age-appropriate" educational content. She appeared on three cable news programs. She was quoted in the Associated Press. She was described, by herself and others, as a defender of community values.</p>

<p>Four months before that vote, in April 2023, enrollment deposits for the University of Southern California's Class of 2027 were due. Among the students submitting deposits: Emma Holden of Palmetto County, South Carolina, daughter of Patricia Holden.</p>

<p>The <a href="https://diversity.usc.edu" class="cb-factoid" data-title="USC Office of Diversity, Equity and Inclusion" data-summary="The University of Southern California's Division for Diversity, Equity and Inclusion oversees campus-wide programming, mandatory first-year orientation components, and residential life programming focused on equity and inclusion. Information is publicly available at diversity.usc.edu." target="_blank" rel="noopener noreferrer">University of Southern California's Office of Diversity, Equity and Inclusion</a> maintains a publicly accessible website describing its programming. The university's first-year experience, as described on that website, includes a mandatory diversity and inclusion orientation curriculum and equity-focused residential programming. These are not elective courses. They are required components of the first-year experience.</p>

<p>Emma Holden's enrollment deposit was submitted April 14, 2023. The Palmetto County School Board vote removing 23 books was taken August 14, 2023. The deposit preceded the vote by exactly four months. The USC 2023-2024 student handbook, a public document available on the university's website, describes mandatory first-year participation in diversity programming as a condition of on-campus housing.</p>

<p>Patricia Holden's prepared statement at the August 14 meeting, entered into the official board minutes, states: "The materials we are removing promote a value system that is fundamentally incompatible with the educational mission of this district and the values of this community."</p>

<p>At the time she read that statement, her daughter had been enrolled at an institution whose publicly stated educational mission centers the exact value system Holden described as incompatible with her community's values. Her daughter was living in USC housing whose occupancy required participation in programming Holden's resolution characterized as ideologically inappropriate for students in her district.</p>

<p>ClownBinge reviewed the <a href="https://ala.org/advocacy/bbooks" class="cb-factoid" data-title="American Library Association — Book Ban Tracker" data-summary="The ALA's Office for Intellectual Freedom tracks book challenges and bans in schools and public libraries across the United States. Their annual reports document the most frequently challenged titles and the stated reasons for each challenge." target="_blank" rel="noopener noreferrer">American Library Association's documentation</a> of the Palmetto County book removals. Several of the removed titles appear on USC's recommended first-year reading lists for incoming students.</p>

<p>ClownBinge makes no judgment about Emma Holden. She is a private individual, a student, and the subject of nothing on this platform. The subject of this piece is her mother, a public official who exercised public authority to remove materials she described as incompatible with community values while simultaneously enrolling her own child in an institution that has made those values a formal requirement of attendance.</p>

<p>The school board meeting minutes are public record. The USC enrollment information is verifiable through public statements. The student handbook is publicly available. The timeline between these documents is one hundred and twenty-three days.</p>

<p>The receipts were filed in two different states, four months apart, by the same family.</p>`,
    category: "cultural" as const,
    subjectName: "Patricia Holden",
    subjectTitle: "School Board Member",
    subjectParty: "Republican",
    verifiedSource: "Palmetto County Board Records",
    hasVideo: false,
    selfOwnScore: 8,
    tags: ["school board", "books", "diversity", "hypocrisy", "south carolina"],
    status: "published" as const,
    dateOfIncident: "2023-08-14",
    publishedAt: new Date("2024-01-20"),
  },
  {
    caseNumber: "CB-000006",
    title: "Adams County Deputies Raided Afroman's Home, Found Nothing, Then Sued Him. He Made Grammy-Nominated Art About It.",
    slug: "afroman-sued-harassers-into-museum-exhibit",
    teaser: "When police raided his home on a drug tip that yielded nothing, he turned the surveillance footage into art. Then merch. Then a lawsuit.",
    body: `<p>On August 18, 2022, officers from the Adams County Sheriff's Office in Ohio executed a search warrant at the home of Joseph Foreman, known professionally as Afroman, in Licking County. The officers were acting on a tip alleging drug trafficking and kidnapping. The warrant authorized them to search the premises. They searched it thoroughly.</p>

<p>They found no drugs. They found no kidnapping victims. They found a recording artist working in his home studio, which is, by most legal and artistic standards, exactly what he is supposed to be doing there.</p>

<p>What they also found, though they did not appear to account for this in their operational planning, was that Afroman had installed comprehensive security cameras throughout the property. The cameras were recording. They recorded everything. When the officers left, the footage remained.</p>

<p>Afroman, who has spent his career finding creative utility in whatever materials life provides, applied the <a href="https://www.copyright.gov/fair-use/" class="cb-factoid" data-title="17 U.S.C. § 107 — Fair Use Doctrine" data-summary="The fair use doctrine, codified at 17 U.S.C. § 107, allows the use of copyrighted material without permission for purposes such as commentary, criticism, news reporting, and artistic transformation. Courts weigh four factors including purpose, nature, amount used, and market effect." target="_blank" rel="noopener noreferrer">principle of artistic transformation</a> to approximately ninety minutes of surveillance footage depicting law enforcement officers conducting an unsuccessful search of his property. He released a series of music videos.</p>

<p>"Lemon Pound Cake," "Will You Help Me Repair My Door," and "Poker Face" each featured footage of Adams County Sheriff's deputies searching Afroman's home, moving his belongings, and generally occupying his property in connection with a search that produced no evidence of any crime. The videos were posted to YouTube. They accumulated millions of views. They were then submitted for Grammy consideration.</p>

<p>The <a href="https://www.grammy.com" class="cb-factoid" data-title="The Recording Academy — Grammy Awards" data-summary="The Recording Academy, founded in 1957, administers the Grammy Awards, the recording industry's most prestigious honor. Nominations are determined by academy members across 86 categories. The 2024 Grammy nominations were announced in November 2023." target="_blank" rel="noopener noreferrer">Recording Academy</a> nominated them. That is not a metaphor or an exaggeration. Surveillance footage of an unsuccessful police raid on an artist's home, repurposed as music video content, received nominations from the organization that gives out the most prestigious awards in the American recording industry. This happened.</p>

<p>The Adams County Sheriff's deputies who appeared in the videos then took legal action. Several officers filed a civil lawsuit against Afroman alleging invasion of privacy, emotional distress, and interference with potential future law enforcement employment. The lawsuit was filed on behalf of officers who had appeared, on camera, in a government building executing a government-issued warrant at a civilian's home.</p>

<p>To be precise about the legal posture here: law enforcement officers, acting in their official capacity pursuant to a <a href="https://www.law.cornell.edu/wex/search_warrant" class="cb-factoid" data-title="Search Warrant — Legal Definition" data-summary="A search warrant is a court order issued by a judge or magistrate that authorizes law enforcement to search a specific location for specific items. Under the Fourth Amendment, searches conducted under a valid warrant are constitutionally authorized government actions, making the officers agents of the state." target="_blank" rel="noopener noreferrer">court-issued search warrant</a>, in a home that was not theirs, conducting an operation that yielded no evidence of criminal activity, sued the homeowner for recording them doing so.</p>

<p>The lawsuit was dismissed.</p>

<p>Afroman counter-sued. He then opened an online store selling merchandise featuring the officers' images from the footage, including coffee mugs, t-shirts, and campaign materials he used in a subsequent run for public office. He then developed a museum installation using footage from the raid as part of an exhibition about civil rights and police accountability that has traveled to multiple venues.</p>

<p>The Adams County Sheriff's Office conducted a raid that was intended to produce evidence of serious criminal activity. Instead, it produced a Grammy nomination, a merchandise line, a museum exhibition, a counter-lawsuit, and a case study in what happens when the assumption of impunity collides with a fully documented creative process and an artist who understands the legal and artistic concept of fair use better than the people who raided his home.</p>

<p>The receipts were his surveillance footage all along. He was ready. They were not.</p>`,
    category: "anti_racist_hero" as const,
    subjectName: "Afroman (Joseph Foreman)",
    subjectTitle: "Recording Artist",
    subjectParty: null,
    verifiedSource: "Court Records / Recording Academy",
    hasVideo: false,
    selfOwnScore: null,
    tags: ["afroman", "anti-racist hero", "police accountability", "grammys", "ohio"],
    status: "published" as const,
    dateOfIncident: "2022-08-18",
    publishedAt: new Date("2024-01-10"),
  },
];

const sampleBooks = [
  {
    title: "Illegal, Who?",
    slug: "illegal-who",
    description: "200 documented cases of public officials caught on the wrong side of the very laws they claim to protect. Court records. Congressional Record. C-SPAN. All verified. All receipted. The most comprehensive archive of political hypocrisy ever assembled in one volume.",
    priceUsd: "21.95",
    language: "en",
    active: true,
  },
  {
    title: "ClownBinge Greatest Hits Vol. 1",
    slug: "clownbinge-greatest-hits-vol-1",
    description: "The 50 best Self-Owned moments from the ClownBinge archive. Politicians, preachers, and public figures caught in the act of contradicting their own documented records. Curated. Devastating. Sourced.",
    priceUsd: "9.00",
    language: "en",
    active: true,
  },
];

async function seed() {
  console.log("Seeding database...");

  for (const post of samplePosts) {
    await db
      .insert(postsTable)
      .values(post as any)
      .onConflictDoUpdate({
        target: postsTable.caseNumber,
        set: {
          title: post.title,
          teaser: post.teaser,
          body: post.body,
          updatedAt: new Date(),
        },
      });
  }
  console.log(`Seeded ${samplePosts.length} posts`);

  for (const book of sampleBooks) {
    await db
      .insert(booksTable)
      .values(book as any)
      .onConflictDoNothing();
  }
  console.log(`Seeded ${sampleBooks.length} books`);

  // CB-000007
  await db
    .insert(postsTable)
    .values({
      caseNumber: "CB-000007",
      title: "Absurd: Sen. Ted Cruz Claims 'Christ is King' is Anti-Jewish. Yes He Actually Said it. Except, Of Course, Jesus Was Jewish.",
      slug: "ted-cruz-christ-is-king-antisemitic-aipac",
      teaser: "In a March 2026 CBN News interview, the Texas senator told a Christian audience that one of Christianity's oldest theological affirmations is, in his words, 'I hate the Jews.' His evangelical base responded immediately. So did the FEC records.",
      body: `<p>Absurd is not an editorial position. It is a description of what happened. On March 12, 2026, Senator Ted Cruz of Texas sat down with <a href="https://cbn.com/news/politics/ted-cruz-warns-rising-antisemitism-inside-church-says-tucker-carlson-targeting" class="cb-factoid" data-title="CBN News Interview — Ted Cruz, March 12, 2026" data-summary="CBN News (Christian Broadcasting Network) is a major evangelical Christian media outlet. The interview was conducted by CBN political correspondent David Brody and published March 12, 2026. It covered Iran, Tucker Carlson, and antisemitism in the Republican Party.">CBN News</a>, the Christian Broadcasting Network, a media outlet whose primary audience is evangelical Christians, and told them that the phrase "Christ is King" is, in his words, "being used online in a way that is meant to say, 'screw you, Jew.'" He continued: "It is being used in a context very directly to say, 'I hate Jews' and that's almost an online code word. 'Christ is King' is 'I hate the Jews.'" These are direct quotes. They are on video. The Christian Broadcasting Network published them. There is no paraphrase here. A sitting United States senator, in an interview with the most prominent evangelical Christian broadcast outlet in America, told that outlet's audience that their theological affirmation of Jesus Christ's sovereignty is functionally equivalent to a slur against Jewish people. That is what happened. That is what he said.</p>

<p>To understand why this is a receipt and not merely a gaffe, it helps to understand who Ted Cruz has spent the last fifteen years telling evangelical Christians he is. He launched his 2016 presidential campaign at <a href="https://www.liberty.edu" class="cb-factoid" data-title="Liberty University — Lynchburg, Virginia" data-summary="Liberty University is the largest Christian university in the United States, founded by the late Reverend Jerry Falwell Sr. It has been a traditional launching point for Republican candidates seeking evangelical credibility. Cruz chose it as the venue for his 2016 presidential announcement.">Liberty University</a>, the flagship institution of American evangelical higher education, explicitly because the audience there represented the base he needed. He was baptized at age eight at Clay Road Baptist Church in Houston by Pastor Gaylon Wiley. He attended Second Baptist High School. He has described his Christian faith in hundreds of interviews, speeches, and campaign materials as foundational to his identity and his politics. His 2016 campaign distributed formal press releases titled "Ted Cruz's Pastors Speak Out About His Faith," available in the archives of the <a href="https://www.presidency.ucsb.edu/documents/cruz-campaign-press-release-ted-cruzs-pastors-speak-out-about-his-faith" class="cb-factoid" data-title="American Presidency Project — Cruz Campaign Faith Press Release" data-summary="The American Presidency Project at UC Santa Barbara maintains a comprehensive archive of presidential campaign documents. The Cruz campaign's formal pastor endorsement press release is archived there, documenting his explicit use of evangelical credentials as a campaign tool.">American Presidency Project</a>. For fifteen years, Ted Cruz's political identity has been inseparable from his evangelical Christian identity. And on March 12, 2026, he told evangelical Christians that a central affirmation of their faith is, in practice, Jew-hatred. He then suggested they might consider saying "Jesus loves you" or "Jesus saves" instead. He said he had never heard "Christ is King" in church growing up. This, from a man who attended Second Baptist High School and has cited his faith as foundational in more interviews than most pastors give in a career.</p>

<p>Now to the empirical section, because the CBN interview does not exist in a financial vacuum. According to <a href="https://www.opensecrets.org/members-of-congress/ted-cruz/summary?cid=N00033085" class="cb-factoid" data-title="OpenSecrets — Ted Cruz Campaign Finance Summary" data-summary="OpenSecrets (formerly the Center for Responsive Politics) is a nonpartisan nonprofit that tracks money in U.S. politics using FEC filings. Their database is the standard reference for campaign contribution research and is regularly cited by journalists, academics, and courts.">OpenSecrets campaign finance data</a>, covering FEC filings through early 2025, the <a href="https://www.opensecrets.org/orgs/american-israel-public-affairs-cmte/summary?id=D000000815" class="cb-factoid" data-title="AIPAC — American Israel Public Affairs Committee" data-summary="AIPAC is America's largest pro-Israel lobbying organization, founded in 1954. It advocates for strong U.S.-Israel relations before Congress. In 2021 it launched the United Democracy Project, its official super PAC for direct candidate contributions. AIPAC's annual conference regularly draws sitting presidents, vice presidents, and congressional leaders of both parties.">American Israel Public Affairs Committee (AIPAC)</a> contributed $562,593 to Ted Cruz in the 2019 to 2024 election cycle. That figure represents the single largest organizational donation to Cruz in that period, exceeding all other single-source contributions. Over his Senate career spanning 2012 through 2024, Cruz has received approximately $1.87 million in total contributions from pro-Israel industry sources, including AIPAC-affiliated donors, pro-Israel PACs, and bundled individual contributions. In the 2024 cycle alone, approximately $1.3 million of Cruz's PAC funding originated from Israel-affiliated donors, representing roughly 22 percent of his total PAC receipts that cycle. It is worth noting that <a href="https://www.opensecrets.org/political-action-committees/united-democracy-project" class="cb-factoid" data-title="United Democracy Project — AIPAC Super PAC" data-summary="AIPAC launched the United Democracy Project in 2021 as its official super PAC vehicle for direct independent expenditures in federal elections. Prior to 2021, AIPAC coordinated bundled individual donations rather than contributing directly through a PAC. The UDP has become one of the largest independent expenditure committees in recent election cycles.">AIPAC did not begin operating a direct super PAC</a>, the United Democracy Project, until 2021. Before that, the organization coordinated bundled individual contributions, which means historical totals undercount the full scope of the financial relationship. None of this is hidden. It is all filed with the Federal Election Commission. OpenSecrets compiles it into searchable public tables. The numbers are what they are.</p>

<p>There is a theological point worth making precisely, because Cruz made a theological argument and it deserves a theological response on the merits. "Christ is King" is not a new phrase. It is not an internet phenomenon. It predates the United States by approximately 1,900 years. The affirmation appears in the New Testament across multiple books: Revelation 19:16 describes Jesus as "King of Kings and Lord of Lords." Philippians 2:11 declares that "every tongue shall confess that Jesus Christ is Lord." 1 Timothy 6:15 calls him "the blessed and only Sovereign, the King of kings and Lord of lords." These are not fringe citations. They are core doctrinal texts from which the phrase derives directly. The <a href="https://www.ncri.io" class="cb-factoid" data-title="Network Contagion Research Institute (NCRI) — Rutgers University" data-summary="The Network Contagion Research Institute is a Rutgers University-affiliated research organization that studies online extremism and social media manipulation. A 2025 NCRI report found instances of 'Christ is King' being used in antisemitic online contexts, which Cruz cited as supporting his position.">Network Contagion Research Institute</a>, a Rutgers-affiliated research group cited in Cruz's defense, did publish a 2025 report documenting instances of the phrase appearing in online antisemitic content. That report exists. It is real. It also does not establish that a phrase used by millions of Christians in liturgy, hymnody, and personal devotion for two millennia is itself an antisemitic code word. Cruz's argument requires collapsing the distinction between a phrase's theological origin and its misuse by a subset of online accounts. That is a significant collapse. One could find virtually any Christian theological statement appearing alongside hateful content somewhere on the internet. That is not what defines the statement.</p>

<p>The self-own here is structural, not incidental. Ted Cruz built his political career on the evangelical Christian vote. He declared his faith publicly and repeatedly as a qualification for office. He launched his presidential campaign at the institution most associated with American evangelical credibility. He is now, in an interview with the most prominent evangelical Christian broadcast network in the country, telling that network's audience that their shared theological language is functionally antisemitic. His evangelical base, on the same day, described him as a heretic. His AIPAC contributors, over the course of his Senate career, have provided $1.87 million toward his campaigns. The <a href="https://www.fec.gov" class="cb-factoid" data-title="Federal Election Commission (FEC)" data-summary="The Federal Election Commission is the independent regulatory agency charged with enforcing campaign finance law in the United States. All federal campaign contributions above $200 must be disclosed and are publicly searchable in the FEC database at fec.gov.">Federal Election Commission</a> records those contributions. The CBN News transcript records the quote. Both documents are public. Both are searchable. Both have Senator Cruz's name on them. The receipts in this case were filed simultaneously in two different formats: campaign finance disclosure forms and the transcript of a Christian television interview. ClownBinge simply put them in the same room.</p>`,
      category: "self_owned" as const,
      subjectName: "Ted Cruz",
      subjectTitle: "U.S. Senator",
      subjectParty: "Republican",
      verifiedSource: "CBN News / OpenSecrets / FEC",
      hasVideo: false,
      selfOwnScore: 10,
      tags: ["ted cruz", "christ is king", "antisemitism", "aipac", "evangelical", "texas", "senate"],
      status: "published" as const,
      dateOfIncident: "2026-03-12",
      publishedAt: new Date("2026-03-16"),
    } as any)
    .onConflictDoUpdate({
      target: postsTable.caseNumber,
      set: {
        title: "Absurd: Sen. Ted Cruz Claims 'Christ is King' is Anti-Jewish. Yes He Actually Said it. Except, Of Course, Jesus Was Jewish.",
        slug: "ted-cruz-christ-is-king-antisemitic-aipac",
        teaser: "In a March 2026 CBN News interview, the Texas senator told a Christian audience that one of Christianity's oldest theological affirmations is, in his words, 'I hate the Jews.' His evangelical base responded immediately. So did the FEC records.",
        body: `<p>Absurd is not an editorial position. It is a description of what happened. On March 12, 2026, Senator Ted Cruz of Texas sat down with <a href="https://cbn.com/news/politics/ted-cruz-warns-rising-antisemitism-inside-church-says-tucker-carlson-targeting" class="cb-factoid" data-title="CBN News Interview — Ted Cruz, March 12, 2026" data-summary="CBN News (Christian Broadcasting Network) is a major evangelical Christian media outlet. The interview was conducted by CBN political correspondent David Brody and published March 12, 2026. It covered Iran, Tucker Carlson, and antisemitism in the Republican Party.">CBN News</a>, the Christian Broadcasting Network, a media outlet whose primary audience is evangelical Christians, and told them that the phrase "Christ is King" is, in his words, "being used online in a way that is meant to say, 'screw you, Jew.'" He continued: "It is being used in a context very directly to say, 'I hate Jews' and that's almost an online code word. 'Christ is King' is 'I hate the Jews.'" These are direct quotes. They are on video. The Christian Broadcasting Network published them. There is no paraphrase here. A sitting United States senator, in an interview with the most prominent evangelical Christian broadcast outlet in America, told that outlet's audience that their theological affirmation of Jesus Christ's sovereignty is functionally equivalent to a slur against Jewish people. That is what happened. That is what he said.</p>

<p>To understand why this is a receipt and not merely a gaffe, it helps to understand who Ted Cruz has spent the last fifteen years telling evangelical Christians he is. He launched his 2016 presidential campaign at <a href="https://www.liberty.edu" class="cb-factoid" data-title="Liberty University — Lynchburg, Virginia" data-summary="Liberty University is the largest Christian university in the United States, founded by the late Reverend Jerry Falwell Sr. It has been a traditional launching point for Republican candidates seeking evangelical credibility. Cruz chose it as the venue for his 2016 presidential announcement.">Liberty University</a>, the flagship institution of American evangelical higher education, explicitly because the audience there represented the base he needed. He was baptized at age eight at Clay Road Baptist Church in Houston by Pastor Gaylon Wiley. He attended Second Baptist High School. He has described his Christian faith in hundreds of interviews, speeches, and campaign materials as foundational to his identity and his politics. His 2016 campaign distributed formal press releases titled "Ted Cruz's Pastors Speak Out About His Faith," available in the archives of the <a href="https://www.presidency.ucsb.edu/documents/cruz-campaign-press-release-ted-cruzs-pastors-speak-out-about-his-faith" class="cb-factoid" data-title="American Presidency Project — Cruz Campaign Faith Press Release" data-summary="The American Presidency Project at UC Santa Barbara maintains a comprehensive archive of presidential campaign documents. The Cruz campaign's formal pastor endorsement press release is archived there, documenting his explicit use of evangelical credentials as a campaign tool.">American Presidency Project</a>. For fifteen years, Ted Cruz's political identity has been inseparable from his evangelical Christian identity. And on March 12, 2026, he told evangelical Christians that a central affirmation of their faith is, in practice, Jew-hatred. He then suggested they might consider saying "Jesus loves you" or "Jesus saves" instead. He said he had never heard "Christ is King" in church growing up. This, from a man who attended Second Baptist High School and has cited his faith as foundational in more interviews than most pastors give in a career.</p>

<p>Now to the empirical section, because the CBN interview does not exist in a financial vacuum. According to <a href="https://www.opensecrets.org/members-of-congress/ted-cruz/summary?cid=N00033085" class="cb-factoid" data-title="OpenSecrets — Ted Cruz Campaign Finance Summary" data-summary="OpenSecrets (formerly the Center for Responsive Politics) is a nonpartisan nonprofit that tracks money in U.S. politics using FEC filings. Their database is the standard reference for campaign contribution research and is regularly cited by journalists, academics, and courts.">OpenSecrets campaign finance data</a>, covering FEC filings through early 2025, the <a href="https://www.opensecrets.org/orgs/american-israel-public-affairs-cmte/summary?id=D000000815" class="cb-factoid" data-title="AIPAC — American Israel Public Affairs Committee" data-summary="AIPAC is America's largest pro-Israel lobbying organization, founded in 1954. It advocates for strong U.S.-Israel relations before Congress. In 2021 it launched the United Democracy Project, its official super PAC for direct candidate contributions. AIPAC's annual conference regularly draws sitting presidents, vice presidents, and congressional leaders of both parties.">American Israel Public Affairs Committee (AIPAC)</a> contributed $562,593 to Ted Cruz in the 2019 to 2024 election cycle. That figure represents the single largest organizational donation to Cruz in that period, exceeding all other single-source contributions. Over his Senate career spanning 2012 through 2024, Cruz has received approximately $1.87 million in total contributions from pro-Israel industry sources, including AIPAC-affiliated donors, pro-Israel PACs, and bundled individual contributions. In the 2024 cycle alone, approximately $1.3 million of Cruz's PAC funding originated from Israel-affiliated donors, representing roughly 22 percent of his total PAC receipts that cycle. It is worth noting that <a href="https://www.opensecrets.org/political-action-committees/united-democracy-project" class="cb-factoid" data-title="United Democracy Project — AIPAC Super PAC" data-summary="AIPAC launched the United Democracy Project in 2021 as its official super PAC vehicle for direct independent expenditures in federal elections. Prior to 2021, AIPAC coordinated bundled individual donations rather than contributing directly through a PAC. The UDP has become one of the largest independent expenditure committees in recent election cycles.">AIPAC did not begin operating a direct super PAC</a>, the United Democracy Project, until 2021. Before that, the organization coordinated bundled individual contributions, which means historical totals undercount the full scope of the financial relationship. None of this is hidden. It is all filed with the Federal Election Commission. OpenSecrets compiles it into searchable public tables. The numbers are what they are.</p>

<p>There is a theological point worth making precisely, because Cruz made a theological argument and it deserves a theological response on the merits. "Christ is King" is not a new phrase. It is not an internet phenomenon. It predates the United States by approximately 1,900 years. The affirmation appears in the New Testament across multiple books: Revelation 19:16 describes Jesus as "King of Kings and Lord of Lords." Philippians 2:11 declares that "every tongue shall confess that Jesus Christ is Lord." 1 Timothy 6:15 calls him "the blessed and only Sovereign, the King of kings and Lord of lords." These are not fringe citations. They are core doctrinal texts from which the phrase derives directly. The <a href="https://www.ncri.io" class="cb-factoid" data-title="Network Contagion Research Institute (NCRI) — Rutgers University" data-summary="The Network Contagion Research Institute is a Rutgers University-affiliated research organization that studies online extremism and social media manipulation. A 2025 NCRI report found instances of 'Christ is King' being used in antisemitic online contexts, which Cruz cited as supporting his position.">Network Contagion Research Institute</a>, a Rutgers-affiliated research group cited in Cruz's defense, did publish a 2025 report documenting instances of the phrase appearing in online antisemitic content. That report exists. It is real. It also does not establish that a phrase used by millions of Christians in liturgy, hymnody, and personal devotion for two millennia is itself an antisemitic code word. Cruz's argument requires collapsing the distinction between a phrase's theological origin and its misuse by a subset of online accounts. That is a significant collapse. One could find virtually any Christian theological statement appearing alongside hateful content somewhere on the internet. That is not what defines the statement.</p>

<p>The self-own here is structural, not incidental. Ted Cruz built his political career on the evangelical Christian vote. He declared his faith publicly and repeatedly as a qualification for office. He launched his presidential campaign at the institution most associated with American evangelical credibility. He is now, in an interview with the most prominent evangelical Christian broadcast network in the country, telling that network's audience that their shared theological language is functionally antisemitic. His evangelical base, on the same day, described him as a heretic. His AIPAC contributors, over the course of his Senate career, have provided $1.87 million toward his campaigns. The <a href="https://www.fec.gov" class="cb-factoid" data-title="Federal Election Commission (FEC)" data-summary="The Federal Election Commission is the independent regulatory agency charged with enforcing campaign finance law in the United States. All federal campaign contributions above $200 must be disclosed and are publicly searchable in the FEC database at fec.gov.">Federal Election Commission</a> records those contributions. The CBN News transcript records the quote. Both documents are public. Both are searchable. Both have Senator Cruz's name on them. The receipts in this case were filed simultaneously in two different formats: campaign finance disclosure forms and the transcript of a Christian television interview. ClownBinge simply put them in the same room.</p>`,
      },
    });

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
