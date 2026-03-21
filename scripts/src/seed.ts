import { db, postsTable, booksTable } from "@workspace/db";

const samplePosts = [
  {
    caseNumber: "CB-000001",
    title: "Senator Claims He Never Voted For The Bill He Voted For",
    slug: "senator-claims-never-voted-for-bill",
    teaser: "The Congressional Record does not care about your selective memory. Neither does ClownBinge.",
    body: `The Congressional Record is a merciless document. It does not forget. It does not forgive. It does not accept amendments retroactively.

On March 15, 2023, it captured Senator James Whitmore of Missouri doing exactly the thing he now insists he never did.

The vote was S.1247, the Rural Infrastructure Investment Act. It passed 61-39. Senator Whitmore's name appears in the official Senate roll call as a "YEA" vote. That is not an interpretation. That is a timestamp and a legal record of a congressional action.

Four months later, during a town hall in Springfield, Missouri, a constituent asked Whitmore directly about his vote on rural broadband funding. That provision was contained within S.1247. The Senator's response, captured on video by three separate attendees: "I never supported that bill. I voted against government overreach every single time."

The C-SPAN archive of the Senate floor that March afternoon tells a different story. The audio is clear. The timestamp is precise. The vote count is verified.

Senator Whitmore, at 2:47 PM Eastern, cast an affirmative vote for S.1247.

This is the anatomy of a political self-own. A public official operating under the assumption that his constituents do not have access to the same public records he generates. The assumption is wrong.

The pattern is not new. Whitmore has made similar claims about his vote on the American Rescue Plan (voted yes, now says no) and his 2019 position on farm subsidies (supported, now opposes). Each reversal is documented. Each document is public. Each denial is now archived here.

The receipts do not have a political agenda. They have dates.`,
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
    title: "Congressman Caught on C-SPAN Saying the Quiet Part Loud",
    slug: "congressman-caught-cspan-quiet-part-loud",
    teaser: "C-SPAN cameras are always on. This is a lesson some elected officials never learn.",
    body: `C-SPAN has been recording Congress since 1979. Forty-five years of floor speeches, committee hearings, and the kind of candid moments that occur when someone forgets the red light is blinking.

Congressman Dale Hartwick of Georgia forgot the red light on February 7, 2024.

The clip runs three minutes and forty-two seconds. It is timestamped, archived, and indexed in the C-SPAN database under House Judiciary Committee proceedings.

In it, Congressman Hartwick speaks to a colleague during what he believed was a recess break. He articulates a position on immigration enforcement that is substantially different from the one in his official press releases, his constituent newsletters, and his campaign website.

"It was taken out of context," his communications director told reporters on February 9th.

The C-SPAN clip contains no context gap. It is a continuous, unedited recording. The context is the context.

What Hartwick said on February 7th contradicts positions he has held in at least six documented public statements going back to 2021. ClownBinge has reviewed each statement.

The Congressional Record contains the floor speeches. The C-SPAN archive contains the committee appearances. The official website contains the press releases. They do not agree with each other or with the February 7th recording.

The public record covers everything from his 2022 primary campaign, during which he described himself as "the strongest border hawk in this delegation," to the February 7th moment when he described his own enforcement legislation as "political theater for the base."

These are not two interpretations of a complicated policy position. They are two contradictory statements from the same person, both captured on video, both entered into the public record.`,
    category: "clown_electeds" as const,
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
    title: "State AG Files Lawsuit Against Practice He Used Himself For Six Years",
    slug: "state-ag-files-lawsuit-practice-used-himself",
    teaser: "The lawsuit was filed March 3rd. His own department's records document the same practice from 2016 to 2022.",
    body: `Attorney General Rick Donahue of Texas filed a 47-page lawsuit on March 3, 2024, targeting a business practice he characterized as "a flagrant abuse of regulatory frameworks designed to protect working families."

The lawsuit, filed against a national insurance consortium, argues that the practice constitutes fraud under Texas consumer protection statutes.

Court records from Bexar County show that Donahue, while serving as a private attorney from 2016 to 2022, represented clients who engaged in the same practice described in his lawsuit. His firm billed for services related to structuring exactly the kind of arrangements now listed in paragraphs 12 through 28 of his complaint as "inherently deceptive."

The Texas State Bar Association's public database contains his firm's case filings from that period. They are not sealed. They have not been expunged. They include the names of the clients, the nature of the representation, and in several instances, detailed memos describing the practice's legal architecture. That same architecture his lawsuit now calls fraudulent.

Donahue's press release announcing the lawsuit describes it as "a historic action to protect Texas families from predatory corporate behavior."

The 2019 memo from his private firm, obtained through public records, describes the same behavior as "a legally sound structure consistent with industry standards and fully compliant with applicable state law."

Both documents are now in the public record. One was written by Rick Donahue the attorney. The other was filed by Rick Donahue the Attorney General. They represent irreconcilable positions on the same legal question, separated by four years and a change in professional interest.

The receipts do not adjudicate the legal merits of either position. They document that both positions belong to the same person.`,
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
    title: "Anti-Immigration Pastor Discovered to Have Immigrant Grandparents on Both Sides",
    slug: "anti-immigration-pastor-immigrant-grandparents",
    teaser: "The genealogical records predate the political position by about 80 years.",
    body: `Pastor Vernon Mills of Cornerstone Fellowship Church in Scottsdale, Arizona, has delivered seventeen documented sermons on immigration since 2020. ClownBinge has reviewed each one.

The consistent argument: America is a nation founded on specific principles of cultural continuity, and unrestricted immigration from certain regions constitutes a demographic threat to those principles.

The Maricopa County vital records and the Ellis Island database are not interested in Pastor Mills' theology. They are interested in dates and names.

Mills' paternal grandmother, Maria Elena Reyes de Mills, immigrated to the United States from Sonora, Mexico, in 1943. She entered through the Nogales port of entry on a temporary agricultural work visa and applied for permanent residency in 1947. She was naturalized in 1952.

Mills' maternal grandparents, Bogdan and Irena Kowalczyk, immigrated from Poland in 1951 as displaced persons following World War II. They arrived at Ellis Island in November of that year. Bogdan Kowalczyk is listed in the Displaced Persons Act admission records.

All four of Vernon Mills' grandparents were immigrants. Two entered on work visas. Two entered as refugees. All four became American citizens.

Vernon Mills is an American citizen because four immigrants were allowed into the United States of America.

His most recent sermon, delivered February 18, 2024, and archived on Cornerstone Fellowship's official YouTube channel, includes the following: "God did not build this nation for the whole world to walk into."

The genealogical records are public. The sermon is public. The contradiction is complete.`,
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
    title: "School Board Member Who Banned Diversity Books Has Daughter at Diversity-Focused University",
    slug: "school-board-bans-diversity-books-daughter-at-dei-university",
    teaser: "The same month the ban passed, enrollment deposits were due.",
    body: `The Palmetto County School Board voted 5-2 on August 14, 2023, to remove 23 books from district library shelves. Board member Patricia Holden was among the five affirmative votes.

The removal list includes titles related to civil rights history, LGBTQ+ experiences, and what the board's resolution describes as "ideologically targeted diversity programming."

The University of Southern California's Office of Admission published its Class of 2027 enrollment announcements in May 2023. Among the incoming students: Emma Holden of Palmetto County, South Carolina.

The university's website describes its first-year experience as including "a robust diversity and inclusion orientation curriculum" and "equity-focused residential programming."

Emma Holden's enrollment deposit was submitted April 14, 2023. That is four months before her mother's August vote on the library ban.

Patricia Holden's prepared statement at the August 14 meeting states: "The materials we are removing promote a value system that is fundamentally incompatible with the educational mission of this district and the values of this community."

The University of Southern California's 2023-2024 student handbook, which Emma Holden received upon enrollment, includes mandatory participation in diversity and inclusion programming as a condition of first-year housing.

Neither the school board resolution nor Emma Holden's USC enrollment is a secret. Both are public records. The timeline between them is three months and twenty-three days.

ClownBinge makes no judgment about Emma Holden, who is a private individual and is not the subject of this piece. The subject is Patricia Holden, a public official who made a public vote, and the documented relationship between that vote and her private family choices.`,
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
    title: "Afroman Sued His Own Harassers Into a Museum Exhibit",
    slug: "afroman-sued-harassers-into-museum-exhibit",
    teaser: "When police raided his home on a drug tip that yielded nothing, he turned the surveillance footage into art. Then merch. Then a lawsuit.",
    body: `On August 18, 2022, officers from the Adams County Sheriff's Office in Ohio executed a search warrant at the home of Joseph Foreman, known professionally as Afroman.

The officers were looking for evidence of drug trafficking and kidnapping. They found no drugs. They found no kidnapping victims. They found a man making music in his home.

What they did not find, but what Afroman had: extensive surveillance footage of the entire raid.

He used the footage. He released a series of music videos: "Lemon Pound Cake," "Will You Help Me Repair My Door," and "Poker Face." Each featured footage of the officers searching his home. The videos were nominated for Grammy awards.

That sentence is not a joke. The Recording Academy nominated surveillance footage of an unlawful raid, repurposed as music video content, for Grammy consideration.

The Adams County deputies appeared in the videos without their consent. They sued Afroman for invasion of privacy, emotional distress, and interference with potential future law enforcement employment.

They sued the man whose home they searched, using footage of themselves, taken in his home, during an unsuccessful operation.

The lawsuit was dismissed. Afroman counter-sued. Then he opened a store selling merch featuring the officers' images from the videos. Then he used footage from the raid in a museum exhibition about civil rights and police accountability.

The Adams County Sheriff's Office raided Afroman's home looking for contraband. They left behind a Grammy nomination, a civil rights museum exhibit, and the clearest example in recent American cultural history of what happens when institutional overreach meets an artist who knows exactly what to do with documentation.

The receipts were his surveillance footage all along.`,
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

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
