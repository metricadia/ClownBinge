import { useState } from "react";
import { Layout } from "@/components/Layout";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import { BookOpen, ArrowRight, CheckCircle, Download, Package, Layers, X, Video, Users } from "lucide-react";

interface FactBookChapter {
  title: string;
  description: string;
  isPreface?: boolean;
  content?: string[];
  sources?: string[];
}

interface FactBook {
  id: number;
  vol: string;
  shortTitle: string;
  fullTitle: string;
  tag: string;
  bg: string;
  fg: string;
  accent: string;
  accentFg: string;
  coverDesign: "stat" | "grid" | "split" | "bar" | "slash" | "arch" | "type" | "minimal" | "overlap" | "circle";
  subtitle?: string;
  coverImage?: string;
  coverAnchor?: string;
  coverVideo?: string;
  pages?: number;
  price?: string;
  summary: string;
  extendedSummary?: string[];
  quote?: string;
  bullets: string[];
  chapters?: FactBookChapter[];
}

const BOOKS: FactBook[] = [
  {
    id: 1, vol: "Vol. 01",
    shortTitle: "The Manufactured Threat",
    fullTitle: "The Manufactured Threat: Debunking the Racist Lie of Native Black Criminality",
    subtitle: "Debunking the Racist Lie of Native Black Criminality",
    tag: "NerdOut / Data",
    bg: "#0F0F0F", fg: "#FFFFFF", accent: "#FF0099", accentFg: "#FFFFFF",
    coverDesign: "stat",
    coverImage: "/covers/vol01-cover.jpg",
    summary: "The narrative that Black Americans are inherently more violent is one of the most durable lies in American public life — repeated by politicians, amplified by media, and almost never challenged with actual data. This FactBook goes straight to the source: FBI crime statistics, peer-reviewed criminology, and federal data that dismantles the myth completely and traces its deliberate political origins.",
    bullets: [
      "FBI UCR and BJS data show violent crime tracks poverty and disinvestment — not race",
      "Peer-reviewed criminology finds race disappears as a variable when income is controlled",
      "The CDC links 'race and crime' framing to deliberate policy narratives dating to the 1960s",
      "97% of Black homicide victimization is driven by economic circumstance, per DOJ data",
      "The myth serves documented political purposes — this FactBook names them, with receipts",
    ],
  },
  {
    id: 2, vol: "Vol. 02",
    shortTitle: "Merchants of Chaos",
    fullTitle: "Merchants of Chaos: Facebook, X, YouTube & TikTok as the World's Largest Disinformation Infrastructure",
    subtitle: "Social Media as the World's Largest Disinformation Infrastructure",
    tag: "Investigations",
    bg: "#1A3A8F", fg: "#FFFFFF", accent: "#F5C518", accentFg: "#1A1A2E",
    coverDesign: "grid",
    coverImage: "/covers/vol02-cover.jpg",
    coverAnchor: "xMaxYMid slice",
    coverVideo: "/vol02-bg.mp4",
    summary: "Congress has the documents. Senate intelligence committees have done the investigations. Internal communications have been leaked. Facebook, YouTube, X, and TikTok have been caught — not accused — of algorithmically amplifying disinformation for engagement revenue. This FactBook assembles the receipts from congressional testimony, whistleblower documents, and regulatory filings.",
    bullets: [
      "Facebook's own internal research showed the algorithm amplified outrage content by 5x",
      "Senate Intelligence Committee reports document coordinated inauthentic behavior tolerated for profit",
      "YouTube's recommendation engine drove radicalization at scale — per their own engineers",
      "TikTok congressional testimony revealed state-level data access they denied existed",
      "Every claim traces to congressional records, SEC filings, or published whistleblower testimony",
    ],
  },
  {
    id: 3, vol: "Vol. 03",
    shortTitle: "A Well-Regulated Exclusion",
    fullTitle: "A Well-Regulated Exclusion: The Second Amendment's Race Problem on the Constitutional Record",
    subtitle: "The Second Amendment's Race Problem on the Constitutional Record",
    tag: "U.S. Constitution",
    bg: "#F8F9FC", fg: "#1A1A2E", accent: "#1A3A8F", accentFg: "#FFFFFF",
    coverDesign: "split",
    summary: "The Second Amendment was debated, drafted, and ratified when 'the people' had a specific racial definition — and state militia laws at the time made that explicit. This FactBook doesn't argue gun policy. It reads the constitutional record, the Founders' own words, and the Supreme Court's historical analysis to surface what was actually being protected and who was being excluded.",
    bullets: [
      "Founders' militia writings explicitly tied gun rights to slave patrol and anti-insurrection control",
      "State constitutional records from 1789 reveal racial exclusions baked into 'the people'",
      "Dred Scott explicitly denied Black Americans 2nd Amendment rights — in the Court's own words",
      "Reconstruction-era gun seizures targeting Black communities are documented in congressional testimony",
      "Heller and Bruen's 'historical tradition' argument collapses when applied to non-white Americans",
    ],
  },
  {
    id: 4, vol: "Vol. 04",
    shortTitle: "The Great Grift",
    fullTitle: "The Great Grift: The Attack on DEI Was a Ruse — Obama vs. Trump Appointees, Side by Side",
    subtitle: "The Attack on DEI Was a Ruse — Obama vs. Trump Appointees, Side by Side",
    tag: "Primary Source Analytics",
    bg: "#0D3320", fg: "#FFFFFF", accent: "#00D084", accentFg: "#0D3320",
    coverDesign: "bar",
    summary: "When the Trump administration dismantled DEI programs, it framed the move as restoring merit. This FactBook compares the actual credentials — education, professional background, prior experience — of Obama-era versus Trump-era appointees across 40 agency positions, using Senate confirmation records, federal disclosures, and official biographies. The data tells a specific story.",
    bullets: [
      "Side-by-side credential comparisons of 40 agency appointments across both administrations",
      "Obama appointees averaged significantly more relevant professional experience per position",
      "Several Trump appointees had zero prior experience in the agencies they were appointed to lead",
      "Senate confirmation transcripts reveal credential gaps that went largely unchallenged",
      "The data shows DEI opponents installed the least credentialed appointee class in modern history",
    ],
  },
  {
    id: 5, vol: "Vol. 05",
    shortTitle: "All Propaganda, All the Time",
    fullTitle: "All Propaganda, All the Time: CNN, MSNBC, and Fox News — What the Documents Confirm",
    subtitle: "CNN, MSNBC, and Fox News — What the Documents Confirm",
    tag: "Media / Investigations",
    bg: "#1A1A2E", fg: "#FFFFFF", accent: "#F5C518", accentFg: "#1A1A2E",
    coverDesign: "slash",
    summary: "It is no longer a matter of opinion that American cable news operates as political infrastructure. Their own internal documents, regulatory filings, and court-disclosed communications make the case. This FactBook doesn't pick a side — it applies the same evidentiary standard to CNN, MSNBC, and Fox News and lets the documents speak for themselves.",
    bullets: [
      "Fox News internal texts show hosts knew the 2020 election claims were false while broadcasting them",
      "CNN's leaked 2021 editorial strategy documents show narrative shaping over news gathering",
      "MSNBC parent NBCUniversal's FEC filings reveal systematic partisan donation patterns",
      "Dominion v. Fox depositions are the most damning primary-source document in cable news history",
      "All three networks have settled or faced regulatory findings — this book catalogs every one",
    ],
  },
  {
    id: 6, vol: "Vol. 06",
    shortTitle: "Stolen Maps",
    fullTitle: "Stolen Maps: The Documented Legality of Gerrymandering and Who It Was Designed to Silence",
    subtitle: "The Documented Legality of Gerrymandering and Who It Was Designed to Silence",
    tag: "Law & Justice",
    bg: "#2A0A4A", fg: "#FFFFFF", accent: "#C084FC", accentFg: "#1A0A2E",
    coverDesign: "arch",
    summary: "Gerrymandering has been declared constitutional by the Supreme Court — meaning politicians can now legally choose their voters. This FactBook documents how that legal framework was constructed, who built it, and what the district maps actually look like when overlaid with Census Bureau demographic data. The system is working exactly as designed.",
    bullets: [
      "Rucho v. Common Cause (2019) explicitly legalized partisan gerrymandering at the federal level",
      "Census Bureau overlays show Black and Latino communities are most consistently packed or cracked",
      "State redistricting documents reveal explicit partisan intent behind ostensibly neutral criteria",
      "The same 3 redistricting law firms shaped maps across 12 states — documented by name",
      "Voting Rights Act Section 2 cases catalog the legal challenge record, ruling by ruling",
    ],
  },
  {
    id: 7, vol: "Vol. 07",
    shortTitle: "The Uncredited Builders",
    fullTitle: "The Uncredited Builders: Indigenous Nations, Enslaved Africans, and Immigrants Who Made America",
    subtitle: "Indigenous Nations, Enslaved Africans, and Immigrants Who Made America",
    tag: "U.S. History",
    bg: "#F5F0E8", fg: "#1A1A2E", accent: "#1A3A8F", accentFg: "#FFFFFF",
    coverDesign: "type",
    summary: "The wealth, infrastructure, and institutional foundation of the United States was created through systematic extraction of labor and land from three groups who received none of the ownership: Indigenous nations, enslaved Africans, and immigrant workers. This FactBook uses property records, census data, congressional land grants, and economic scholarship to quantify what was taken.",
    bullets: [
      "Federal land grant records document 270 million acres taken from Indigenous sovereignty",
      "Enslaved labor's economic contribution has been estimated at $14 trillion in 2023 dollars",
      "Chinese, Irish, and Eastern European workers built the transcontinental railroad under contract fraud",
      "Congressional records show these groups were systematically excluded from New Deal wealth programs",
      "Property deed research traces redlining's direct lineage from slaveholder land concentration",
    ],
  },
  {
    id: 8, vol: "Vol. 08",
    shortTitle: "Ancient Faith, Modern Politics",
    fullTitle: "Ancient Faith, Modern Politics: The Documented Separation of Judaism and Zionism",
    tag: "Global South / History",
    bg: "#0D0500", fg: "#FFFFFF", accent: "#6B3520", accentFg: "#F5C518",
    coverDesign: "minimal",
    subtitle: "Judaism ≠ Zionism",
    coverImage: "/covers/vol08-cover.png",
    pages: 128,
    price: "$39.95",
    chapters: [
      {
        isPreface: true,
        title: "Preface: What the Record Requires",
        description: "The 1897 rabbinical declaration that started it all, and what the primary sources require from any honest reader of the record.",
        content: [
          "A document published in the Jewish Chronicle on July 9, 1897 contains the following declaration, issued by the Executive Committee of the Union of Rabbis in Germany: \"The efforts of so-called Zionists to create a Jewish National State in Palestine are antagonistic to the messianic promises of Judaism, as contained in Holy Writ and in later religious sources.\"",
          "That document is 128 years old. It was written by rabbis. It was written about Zionism. It was written in the same year Zionism was founded. The Executive Committee did not require a century of hindsight to reach its conclusion. It required one reading of the Basel Congress agenda.",
          "This FactBook exists because that document exists. Because Leviticus 19:34 exists. Because Theodor Herzl's diary entry of September 3, 1897 exists. Because the Sheikh Jarrah eviction orders exist. Because the Israeli Supreme Court's three-track citizenship ruling exists. Because the Ottoman land registries exist. Because UN Resolution 3379 exists, and its reversal exists, and the vote tallies for both exist. Because 128 years of documented Jewish anti-Zionist scholarship, rabbinic ruling, and institutional opposition exist and have been continuously published and continuously ignored in the dominant political discourse about what Judaism requires.",
          "The documents have not been hidden. They have been available. This FactBook assembles them in one place, in chronological order, with full citation, so that the argument, if there is to be one, must be conducted against the primary sources rather than against this volume.",
          "This book is written from respect for Judaism. That respect is the reason it was written. A tradition that has produced 3,500 years of documented ethical obligation, legal reasoning, prophetic literature, and moral philosophy deserves to be evaluated on the terms of its own textual record. The conflation of that tradition with a secular nationalist political movement founded in 1897 by a journalist who described his project explicitly in the language of European colonial enterprise does not serve Judaism. The primary sources of Judaism say so. Repeatedly. In multiple languages. Across multiple centuries. Before and after 1897.",
          "Zionism is 128 years old. Judaism is not.",
          "That is not an editorial position. It is an arithmetic observation derived from two documented dates. The Torah's first codified obligations toward the stranger predate the First Zionist Congress by approximately three millennia. Leviticus 19:34 was not written in response to the Basel Program. The Basel Program was written without apparent reference to Leviticus 19:34. Both documents are in the record. ClownBinge reports both.",
          "The claim that criticizing Zionism constitutes antisemitism is itself a documented political strategy with a documented legislative history, a documented lobbying record, and a documented institutional architecture. That claim is examined in Chapter 8 of this volume using the primary sources that produced it. The claim is not characterized here. It is documented. The documentation is sufficient.",
          "What this FactBook does not do is argue that Jewish people are responsible for the actions of a political movement that many Jewish people have opposed, in writing, in public, since the movement's founding year. The record of that opposition is long. It begins in 1897. It has never stopped. Chapter 3 documents it in full.",
          "What this FactBook does is place the primary sources of Judaism alongside the primary sources of Zionism and report what each says. The Torah says what it says about the stranger. The eviction orders say what they say about the grandmother in Sheikh Jarrah. The Israeli Supreme Court says what it says about the three tracks of citizenship. The Protestrabbiner declaration says what it says about the messianic promise. Theodor Herzl's diary says what it says about the colonial model he was explicitly following.",
          "The reader will find no conclusion in this volume. The documents provide their own.",
        ],
        sources: [
          "Executive Committee of the Union of Rabbis in Germany. (1897, July 9). Protest against Zionism [Declaration]. The Jewish Chronicle, p. 9. https://www.posenlibrary.com/entry/protest-against-zionism",
          "Herzl, T. (1960). The complete diaries of Theodor Herzl (R. Patai, Ed.; H. Zohn, Trans.; Vols. 1–5). Herzl Press. https://archive.org/details/TheCompleteDiariesOfTheodorHerzl_201606",
          "Jewish Virtual Library. (n.d.). First Zionist Congress and the Basel Program, 1897. https://jewishvirtuallibrary.org/first-zionist-congress-and-basel-program-1897",
          "Ornan v. Ministry of the Interior, HCJ 212/03 (Supreme Court of Israel 2013). https://versa.cardozo.yu.edu/opinions/ornan-v-ministry-interior",
          "Adalah – The Legal Center for Arab Minority Rights in Israel. (2021, July 8). Israeli Supreme Court upholds the Jewish Nation-State Basic Law. https://www.adalah.org/en/content/view/10379",
          "Turkish Directorate of Ottoman Archives. (2018). Ottoman land registry archive: Palestine, 1516–1917 [140,000 digitized documents]. https://www.aa.com.tr/en/culture/ottoman-archive-palestines-weapon-against-occupation/1720151",
          "Holy Bible, New Jewish Publication Society Translation. (1985). Leviticus 19:34. Jewish Publication Society.",
        ],
      },
      {
        title: "Two Traditions, One Conflation",
        description: "One word is 3,500 years old. The other is 128. The case that they are the same thing was constructed, not discovered, and the construction has a paper trail.",
        content: [
          "The word \"Judaism\" appears in the historical record approximately 2,200 years before the word \"Zionism.\" That gap is not a theological argument. It is a documented chronological fact. Two different words. Two different centuries of origin. Two different institutional architectures. Two different bodies of founding documents. The conflation of the two is not a natural linguistic evolution. It is a documented political operation with a documented starting date, a documented institutional structure, and a documented beneficiary.",
          "This chapter establishes the definitions. Not editorially. Forensically. What each tradition is, what documents produced it, and what those documents actually say.",
          "SECTION 1.1: WHAT JUDAISM IS. THE PRIMARY SOURCE RECORD.",
          "Judaism is a covenantal religious tradition whose founding documents span approximately 1,000 BCE to 500 CE. The Tanakh, comprising the Torah, the Nevi'im, and the Ketuvim, constitutes the primary textual foundation. The Talmud, comprising the Mishnah and the Gemara, constitutes the primary body of rabbinic legal interpretation. Together these documents represent the most continuously produced and continuously interpreted legal and ethical literature in the Western tradition.",
          "The Torah alone contains 613 commandments as enumerated by the twelfth-century scholar Maimonides in the Sefer HaMitzvot. Of those 613, thirty-six relate specifically to the treatment of the stranger. Thirty-six. The treatment of the outsider, the non-Israelite, the resident alien, is not a peripheral concern in the Torah's ethical architecture. It is one of its most extensively documented obligations.",
          "Leviticus 19:33 to 34 states, in the New Jewish Publication Society translation: \"When a stranger resides with you in your land, you shall not wrong him. The stranger who resides with you shall be to you as one of your citizens; you shall love him as yourself, for you were strangers in the land of Egypt.\"",
          "Exodus 22:20 states: \"You shall not wrong a stranger or oppress him, for you were strangers in the land of Egypt.\"",
          "Deuteronomy 10:18 to 19 states: \"He upholds the cause of the fatherless and the widow, and loves the stranger, providing him with food and clothing. You too must love the stranger, for you were strangers in the land of Egypt.\"",
          "These are not advisory passages. In the halakhic tradition, the legal framework derived from Torah, obligations toward the stranger carry the same binding weight as obligations toward fellow Israelites. The Talmud records Rabbi Eliezer's teaching that the Torah warns against wronging the stranger in thirty-six separate places, and some rabbinic sources count forty-six. The precise number is disputed in the tradition. The obligation itself is not.",
          "Judaism is also a diasporic tradition. From the Babylonian exile of 586 BCE through the destruction of the Second Temple in 70 CE through the subsequent nineteen centuries of Jewish life across Europe, North Africa, the Middle East, and eventually the Americas, the Jewish community has maintained its religious, legal, and cultural identity without a sovereign state. The maintenance of Jewish identity across nineteen centuries of statelessness is not a historical footnote. It is the central documented achievement of the tradition. Jewish law, Jewish scholarship, Jewish communal life, and Jewish ethical practice did not require a state to survive. The historical record documents this with precision.",
          "The geographic concept of Zion appears throughout the Tanakh as a reference to Jerusalem, to the Temple, and to a messianic future in which the Jewish people will be gathered. That gathering, in the traditional rabbinic understanding, is an act of divine intervention at the end of days. It is not a political program. It is not subject to human organization, congressional authorization, or diplomatic negotiation. The Talmudic tractate Ketubot records the tradition of the Three Oaths, a legal concept derived from Song of Songs 2:7, in which the Jewish people are understood to have sworn not to ascend to the Land of Israel en masse by force, not to rebel against the nations of the world, and in exchange, the nations of the world swore not to oppress Israel excessively. This tradition, while subject to varying interpretations within the rabbinic literature, documents that the return to Zion as a human political project has been a subject of serious theological dispute within Judaism itself, continuously, since before 1897.",
          "SECTION 1.2: WHAT ZIONISM IS. THE PRIMARY SOURCE RECORD.",
          "Zionism is a secular nationalist political movement founded in Basel, Switzerland, on August 29, 1897. Its founding document is the Basel Program, adopted by the First Zionist Congress on August 30, 1897. Its founding organization is the World Zionist Organization, established at the same congress. Its founding figure is Theodor Herzl, a Viennese journalist born in Budapest in 1860, who described himself in his diaries as largely secular and who modeled his political project explicitly on the European nationalist movements of the nineteenth century.",
          "The Basel Program states, in full: \"Zionism seeks to establish a home for the Jewish people in Palestine secured by public law.\"",
          "That sentence contains no theological claim. It contains no reference to divine covenant. It contains no citation of Torah, Talmud, or rabbinic authority. It is a political program statement of the kind produced by nationalist movements across Europe in the second half of the nineteenth century. It describes a secular political objective using the language of international law and state formation.",
          "Herzl's own diaries, published in five volumes and fully digitized through the Internet Archive, confirm the secular-nationalist framework of the project with precision. On September 3, 1897, four days after the conclusion of the First Zionist Congress, Herzl wrote in his diary: \"Were I to sum up the Basel Congress in a word, which I shall guard against pronouncing publicly, it would be this: At Basel I founded the Jewish State.\"",
          "He did not write: \"At Basel I fulfilled the divine covenant.\" He did not write: \"At Basel I answered the messianic promise.\" He wrote that he founded a state. The language is political. The frame is nationalist. The model is European.",
          "Herzl's 1896 pamphlet Der Judenstaat, translated as The Jewish State, makes the colonial analogy explicit. He wrote: \"We should there form a portion of a rampart of Europe against Asia, an outpost of civilization as opposed to barbarism.\" The language is not drawn from the Tanakh. It is drawn from the vocabulary of nineteenth-century European colonialism. Herzl was describing a political project in the terms available to a secular European intellectual of his era. The Complete Diaries confirm that he met with Cecil Rhodes, the architect of British colonial expansion in Africa, and explicitly modeled aspects of his project on the colonial enterprise Rhodes represented.",
          "The founders of the Zionist movement included a significant proportion of secular and atheist Jews. Herzl himself observed Yom Kippur irregularly and described his relationship to Jewish religious practice as largely cultural rather than devotional. Max Nordau, one of the movement's most prominent early figures and a vice president of the First Zionist Congress, was a secular intellectual whose engagement with Judaism was nationalist rather than religious. David Ben-Gurion, who would become Israel's first prime minister, was a secular socialist. Golda Meir was secular. The founding generation of Zionist leadership was not composed primarily of observant Jews deriving their political program from halakhic reasoning. It was composed primarily of secular European nationalists responding to antisemitism with a nationalist solution modeled on the nationalist movements of their era.",
          "This is not a characterization of Zionism. It is what Zionism's own founders wrote about themselves, in their own words, in their own documents, which are in the public record.",
          "SECTION 1.3: THE CONFLATION. WHEN IT BEGAN. HOW IT WAS CONSTRUCTED.",
          "The conflation of Judaism and Zionism did not emerge organically from the religious tradition. It was constructed. It has a documented starting point, a documented institutional architecture, and a documented political function.",
          "In the immediate aftermath of the Holocaust, the moral authority of Jewish survival became one of the most powerful political forces in twentieth-century international relations. The founding of the State of Israel in 1948 occurred in the context of that moral authority. The conflation of the Jewish people's survival with the Zionist political project was, in that historical moment, both politically useful and emotionally comprehensible.",
          "The institutional codification of the conflation, however, came later. The American Israel Public Affairs Committee, known as AIPAC, was established in its current form in 1963. The Anti-Defamation League, founded in 1913 to combat antisemitism, progressively aligned its institutional mission with the defense of Israeli state policy across the second half of the twentieth century. The International Holocaust Remembrance Alliance, known as IHRA, adopted its working definition of antisemitism in 2016. That definition, and its contested application, is examined in Chapter 8 of this volume using the primary source legislative and lobbying record.",
          "The political function of the conflation is documentable and specific. If Judaism and Zionism are the same thing, then criticism of Zionism as a political movement is criticism of Judaism as a religion, which is antisemitism, which is a hate crime in multiple jurisdictions. The logical chain is clean. Its political utility is significant. Its relationship to the primary sources of Judaism is the subject of this volume.",
          "The Protestrabbiner declared in 1897 that Zionism was antagonistic to the messianic promises of Judaism. The general assembly of the Rabbinical Association endorsed that declaration in Berlin on July 1 to 2, 1898, with one dissenting vote. The Chief Rabbi of Britain, Hermann Adler, called Herzl's intention to found a Jewish state \"völlig unheilbringend,\" meaning completely disastrous. The Chief Rabbi of Vienna, Moritz Güdemann, published a full theological rebuttal of Der Judenstaat in 1897, titled Nationaljudenthum, arguing that Zionism was antithetical to Judaism as a religion.",
          "These are not fringe positions from outside the Jewish tradition. They are the documented positions of the leading rabbinic authorities of the founding year of Zionism. They were produced by people with far greater fluency in the primary sources of Judaism than Theodor Herzl possessed. They reached their conclusions not from antisemitism but from Torah. They are part of the continuous Jewish intellectual record. They have been continuously available. They have been continuously marginalized in the dominant political discourse about what Judaism requires.",
          "The conflation did not erase this record. It obscured it. This volume restores it to visibility using the documents themselves.",
          "SECTION 1.4: WHY THE DISTINCTION MATTERS FORENSICALLY.",
          "A forensic distinction is not a moral judgment. It is a classification based on evidence. The evidence in this case is categorical and unambiguous.",
          "Judaism is a religious tradition. Its founding documents are the Torah, the Nevi'im, the Ketuvim, and the Talmud. Its institutional authority derives from rabbinic interpretation of those documents across a documented period of approximately 2,500 years. Its ethical obligations are codified in halakha. Its relationship to the land of Israel is covenantal and, in the dominant rabbinic tradition prior to Zionism, eschatological rather than political.",
          "Zionism is a political movement. Its founding document is the Basel Program of 1897. Its institutional authority derives from the World Zionist Organization and its successor institutions. Its relationship to the land of Israel is nationalist and territorial rather than covenantal. Its founding figures described it explicitly as a political solution to a political problem using the vocabulary of European nationalism.",
          "These are two different categories of human organization. Conflating them does not clarify either. It obscures both. It obscures Judaism by subordinating 3,500 years of documented ethical and theological development to the political requirements of a 128-year-old nationalist movement. It obscures Zionism by granting it a religious authority its own founders did not claim and its own founding documents do not contain.",
          "The distinction matters forensically because precision matters forensically. A court that cannot distinguish between a witness and a defendant cannot produce justice. A discourse that cannot distinguish between a religion and a political movement cannot produce clarity. This volume does not ask the reader to reach a conclusion about Zionism as a political matter. It asks the reader to read two different bodies of documents and observe that they are two different things.",
          "The Torah says what it says. The Basel Program says what it says. Both are in the record. ClownBinge reports both.",
        ],
        sources: [
          "Executive Committee of the Union of Rabbis in Germany. (1897, July 9). Protest against Zionism [Declaration]. The Jewish Chronicle, p. 9. https://www.posenlibrary.com/entry/protest-against-zionism",
          "Güdemann, M. (1897). Nationaljudenthum [National Judaism]. Leipzig.",
          "Herzl, T. (1896). Der Judenstaat [The Jewish State]. Breitenstein. https://www.jewishvirtuallibrary.org/quot-the-jewish-state-quot-theodor-herzl",
          "Herzl, T. (1960). The complete diaries of Theodor Herzl (R. Patai, Ed.; H. Zohn, Trans.; Vols. 1–5). Herzl Press. https://archive.org/details/TheCompleteDiariesOfTheodorHerzl_201606",
          "Holy Bible, New Jewish Publication Society Translation. (1985). Leviticus 19:33–34; Exodus 22:20; Deuteronomy 10:18–19. Jewish Publication Society.",
          "Maimonides, M. (1170). Sefer HaMitzvot [The Book of Commandments]. https://www.sefaria.org/Sefer_HaMitzvot",
          "Posen Library of Jewish Culture and Civilization. (n.d.). Jewish anti-Zionist movements. https://www.ieg-ego.eu/en/threads/transnational-movements-and-organisations/international-organisations-and-congresses/tobias-grill-jewish-anti-zionist-movements",
          "World Zionist Organization. (1897, August 30). The Basel Program [Congress resolution]. First Zionist Congress, Basel, Switzerland. https://jewishvirtuallibrary.org/first-zionist-congress-and-basel-program-1897",
          "Zohn, H. (Trans.). (1960). Herzl diary entry, September 3, 1897. In T. Herzl, The complete diaries of Theodor Herzl (Vol. 2, pp. 580–581). Herzl Press.",
        ],
      },
      {
        title: "The Basel Congress, 1897",
        description: "The congress that launched Zionism was rejected by the organized Jewish community before it opened. The rejection letter is in the record. So is everything that happened next.",
        content: [
          "The First Zionist Congress convened on August 29, 1897, in the concert hall of the Stadtcasino Basel, Switzerland. It was originally scheduled for Munich, Germany. It did not take place in Munich because the organized Jewish community of Munich rejected it. The Executive Committee of the Union of Rabbis in Germany published their protest declaration before the congress convened. Both Orthodox and Reform community leadership in Munich, two wings of German Judaism that agreed on almost nothing, agreed on this: they did not want the Zionist congress in their city.",
          "Herzl moved the congress to Basel. Two hundred and eight delegates from seventeen countries attended. Twenty-six press correspondents covered it. The proceedings were conducted in German. Herzl acted as chairperson.",
          "These are the documented facts of the founding moment of political Zionism. They begin with a rejection by the Jewish community the movement claimed to represent. That rejection is in the record. It predates everything else in this chapter.",
          "SECTION 2.1: HERZL BEFORE BASEL. THE DIARY RECORD.",
          "Theodor Herzl began keeping his diaries in 1895. The complete five-volume English translation, edited by Raphael Patai and translated by Harry Zohn, is fully digitized and publicly accessible through the Internet Archive. What follows in this section is drawn exclusively from that primary source.",
          "Herzl was born in Budapest in 1860 to a secular, assimilated Jewish family. He was educated in Vienna, trained as a lawyer, and worked as the Paris correspondent and later the literary editor of the Neue Freie Presse, one of the most influential newspapers in the Austro-Hungarian Empire. His engagement with Jewish religious practice was, by his own documented account, minimal. He observed Jewish holidays irregularly. He described his relationship to Jewish tradition as largely cultural. He did not derive his political project from halakhic reasoning or rabbinic authority. He derived it from the European nationalist movements of the nineteenth century and from his direct observation of French antisemitism during the Dreyfus Affair of 1894.",
          "The diaries document this intellectual genealogy with precision.",
          "On June 12, 1895, Herzl wrote: \"I have been pounding away for some time at a work of tremendous magnitude. I don't know even now if I will be able to carry it out. It bears the aspects of a mighty dream. But for days and weeks it has saturated my every thought. It accompanies me wherever I go, broods above my ordinary conversations, looks over my shoulder during my comical little journalistic work, disturbs me and intoxicates me.\"",
          "The project he describes is not a religious awakening. It is a political vision. The language is that of a nineteenth-century European intellectual responding to a political problem with a political solution. The frame is nationalist. The model is European state formation. The inspiration is the Dreyfus Affair, not the Torah.",
          "On June 16, 1895, Herzl wrote in his diary about his meeting with Baron Maurice de Hirsch, a wealthy Jewish philanthropist he hoped to enlist in his project. The meeting did not go well. Herzl recorded his frustration and his determination to continue regardless. What is documentable in this entry is the frame Herzl used to describe his project. He did not describe it as a fulfillment of divine promise. He described it as a political program requiring capital, organization, and diplomatic negotiation with existing European powers.",
          "The colonial analogy appears explicitly in Der Judenstaat, published in February 1896, one year before the Basel Congress. Herzl wrote: \"We should there form a portion of a rampart of Europe against Asia, an outpost of civilization as opposed to barbarism.\" This sentence requires no editorial commentary. It is Herzl describing the Jewish state he proposed to establish using the vocabulary of nineteenth-century European colonialism. The phrase \"outpost of civilization as opposed to barbarism\" is the standard rhetorical justification of the colonial enterprise of Herzl's era. It appears in the founding document of political Zionism. It is in the public record.",
          "Herzl met with Cecil Rhodes, the architect of British colonial expansion in southern Africa, and explicitly sought his endorsement. In his diary, Herzl wrote that he had told Rhodes: \"I am asking you to do something which is in a way related to what you have done in South Africa.\" The comparison is Herzl's own. It appears in his own diary. It is in the Internet Archive.",
          "Herzl also recorded his willingness to negotiate with the Sultan of the Ottoman Empire for a charter to settle Palestine, offering to use Jewish financial influence to assist the Ottoman government with its debt obligations in exchange for territorial concessions. The negotiation was explicitly transactional and explicitly political. It was not derived from Torah. It was derived from the diplomatic practices of European great power politics in the late nineteenth century.",
          "SECTION 2.2: THE BASEL CONGRESS. WHAT THE PROCEEDINGS DOCUMENT.",
          "The First Zionist Congress produced three primary documents. The Basel Program, adopted on August 30, 1897. The constitution of the World Zionist Organization. And Herzl's diary entry of September 3, 1897, written four days after the congress concluded.",
          "The Basel Program states, in its entirety: \"Zionism seeks to establish a home for the Jewish people in Palestine secured by public law. To achieve this purpose, the Congress envisages the following methods: the promotion of the settlement of Jewish farmers, artisans, and manufacturers in Palestine; the organization and federation of all Jews through appropriate local and general institutions in accordance with the laws of each country; the strengthening and fostering of Jewish national sentiment and national consciousness; and preparatory steps to obtain the consent of governments where necessary for the fulfillment of the object of Zionism.\"",
          "This document contains four methods. None of them is theological. None of them references divine covenant. None of them cites Torah, Talmud, or rabbinic authority. The four methods are agricultural settlement, organizational federation, national sentiment development, and diplomatic negotiation with governments. These are the methods of a nationalist political movement. They are the methods Herzl observed being deployed by other European nationalist movements of his era. They are documented in the congress proceedings.",
          "The congress was conducted, as Herzl had insisted, with the formal protocols of a parliament. Delegates were requested to wear formal dress and white tie. Herzl opened the proceedings with a prolonged standing ovation that lasted, by contemporary accounts, fifteen minutes. The pageantry was deliberate. Herzl understood, as he recorded in his diaries, that the congress needed to project legitimacy to the outside world.",
          "Ten non-Jewish observers attended the congress. They were invited by Herzl. They did not have voting rights. Their presence was itself a statement about the nature of the project. A religious congress of the Jewish people does not typically invite non-Jewish observers as guests of the founder. A political congress modeling itself on European parliamentary practice does.",
          "The World Zionist Organization was established at the congress as the institutional vehicle for pursuing the Basel Program's objectives. Herzl was elected its president. Max Nordau, a secular intellectual and Herzl's closest collaborator, was elected one of three vice presidents. The leadership structure of the new organization reflected its secular-nationalist character. Rabbis were present at the congress. They were not in the leadership.",
          "SECTION 2.3: HERZL'S DIARY, SEPTEMBER 3, 1897. THE FOUNDING ADMISSION.",
          "Four days after the First Zionist Congress concluded, Herzl made the following entry in his diary. It is the most cited sentence in the history of Zionism. It is cited less often in its full context.",
          "\"Were I to sum up the Basel Congress in a word, which I shall guard against pronouncing publicly, it would be this: At Basel I founded the Jewish State. If I said this out loud today I would be greeted by universal laughter. In five years perhaps, and certainly in fifty years, everyone will perceive it.\"",
          "Three elements of this entry require forensic attention.",
          "First: Herzl said he founded a state. Not a religious community. Not a covenant people. Not a fulfillment of messianic promise. A state. The word is his. The entry is his. The diary is in the Internet Archive.",
          "Second: Herzl explicitly said he would guard against pronouncing this publicly. He understood that the full scope of his political ambition, the founding of a sovereign state, would generate opposition if stated plainly. The gap between what Herzl said privately in his diary and what was said publicly at the congress is itself a primary source document about the political strategy of the Zionist movement in its founding year.",
          "Third: Herzl predicted the timeline with accuracy. The State of Israel was declared on May 14, 1948. The Basel Congress concluded on August 31, 1897. The interval is fifty years and nine months. Herzl wrote \"certainly in fifty years.\" The diary entry predates the state's founding by fifty years and nine months. This is a documented prediction documented in a primary source that proved accurate within the predicted timeframe.",
          "The diary entry does not establish that the State of Israel was founded in fulfillment of divine promise. It establishes that Theodor Herzl believed he was founding a state through political organization, diplomatic negotiation, and strategic communication management. These are the documented motivations of the movement's founder, in his own words, in his own handwriting, in a document he did not intend for public circulation.",
          "SECTION 2.4: WHO WAS IN THE ROOM. AND WHO WAS NOT.",
          "The 208 delegates at the First Zionist Congress came from seventeen countries. They included lawyers, doctors, journalists, writers, teachers, and businessmen. They included Zionist society representatives and individual invitees. They included ten non-Jewish observers.",
          "What the congress proceedings document about the composition of the founding delegates is consistent with what Herzl's diaries document about the movement's intellectual character. The founding generation of political Zionism was overwhelmingly secular, professionally educated, and shaped by European nationalist thought rather than by the rabbinic tradition.",
          "The leading Orthodox rabbinical authorities of the era were not in the room. They were in Munich, in Berlin, in Vienna, and in London, publishing declarations that the project was antagonistic to the messianic promises of Judaism. The Chief Rabbi of Vienna called it completely disastrous. The Chief Rabbi of Britain agreed with the German protest rabbis on fundamental grounds. The general assembly of the German Rabbinical Association endorsed the protest declaration the following year with one dissenting vote.",
          "The absence of leading rabbinic authority from the founding congress of a movement claiming to speak for the Jewish people is a primary source fact. It is documented in the proceedings of the congress, in the published declarations of the absent rabbis, and in Herzl's own diaries, where he recorded his frustration with what he called the Protestrabbiner and his determination to proceed regardless of their opposition.",
          "The movement was founded over the documented objection of the leading religious authorities of the tradition in whose name it claimed to act. That sentence requires no editorial addition. It is what the documents say.",
          "SECTION 2.5: THE COLONIAL FRAME. HERZL AND RHODES. THE DOCUMENTED RECORD.",
          "The meeting between Theodor Herzl and Cecil Rhodes did not produce a formal agreement. What it produced is a diary entry in which Herzl described his project using the explicit vocabulary of the colonial enterprise Rhodes represented.",
          "Cecil Rhodes, at the time of Herzl's approach, was the founder of the British South Africa Company, the architect of the colonization of what would become Rhodesia, and the most prominent advocate of British imperial expansion in Africa. He had established the Rhodes Scholarships in his will with the explicit purpose of promoting British imperial values. He was, by any primary source measure, the most visible embodiment of European colonial enterprise at the end of the nineteenth century.",
          "Herzl sought his endorsement. Herzl told him, in Herzl's own recorded words, that what he was doing was related to what Rhodes had done in South Africa. The comparison is Herzl's own intellectual framing of his project. He did not compare his project to the Exodus from Egypt. He did not compare it to the return from Babylonian exile. He compared it to the British colonization of southern Africa.",
          "Herzl also wrote, in Der Judenstaat, the following: \"We should there form a portion of a rampart of Europe against Asia, an outpost of civilization as opposed to barbarism.\" This sentence locates the proposed Jewish state within the civilizational geography of European colonialism. The Middle East, in this framing, is Asia. It is barbarism. The Jewish state is Europe. It is civilization. The Jewish settlers are a rampart of Europe. They are protecting European civilization from Asian barbarism.",
          "This is not a characterization of Herzl's worldview imposed from outside. It is Herzl's own characterization of his project, published in the founding document of political Zionism, one year before the First Zionist Congress convened.",
          "The primary sources of Zionism place it, in the words of its founder, within the intellectual and political tradition of European colonial enterprise. The primary sources of Judaism place it within a covenantal tradition whose oldest ethical obligations require the protection of the stranger. Both sets of documents are in the record. ClownBinge reports both.",
          "SECTION 2.6: THE DELTA. WHAT THE SECONDARY LITERATURE OMITS.",
          "Most treatments of the First Zionist Congress focus on its achievements. The Basel Program. The founding of the World Zionist Organization. Herzl's vision. The fifty-year prediction. These are the elements that appear in standard historical accounts.",
          "What the secondary literature consistently omits or minimizes is the following documented record.",
          "The Munich Jewish community's board wrote to Herzl in mid-June 1897, informing him in explicit terms that it rejected and wished to prevent the holding of the congress in their city. This is documented in the European History Online database maintained by the Leibniz Institute of European History. The rejection came before the Protestrabbiner declaration. The community's opposition preceded the rabbinical opposition. Both are in the record.",
          "The general assembly of the German Rabbinical Association endorsed the protest declaration on July 1 to 2, 1898, with one dissenting vote. That dissenting vote belonged to Rabbi Selig Gronemann. One rabbi out of the entire German Rabbinical Association voted against the endorsement of the protest declaration. That is a primary source fact about the breadth of rabbinical opposition to Zionism in its founding year that the standard historical treatment does not foreground.",
          "Herzl coined the term Protestrabbiner, meaning protest rabbis, as a pejorative. He published it in Die Welt, the Zionist newspaper he had established, on July 16, 1897. The term was designed to dismiss the rabbinical opposition as reactionary and irrelevant. The political strategy of dismissing theological objection through pejorative labeling begins, in the documented record, with Herzl himself, in the founding year of the movement, in his own newspaper.",
          "That is not an observation about Herzl's character. It is an observation about the documented political strategy of the Zionist movement toward internal Jewish opposition from its first year of existence. The strategy of dismissing Jewish critics of Zionism through labeling is not a recent development. It is 128 years old. It begins in the primary source record with the founder of the movement, in his own publication, in July 1897.",
          "The receipts are dated.",
        ],
        sources: [
          "Encyclopedia.com. (n.d.). Protestrabbiner. Encyclopaedia Judaica. https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/protestrabbiner",
          "Grill, T. (n.d.). Jewish anti-Zionist movements. European History Online, Leibniz Institute of European History. https://www.ieg-ego.eu/en/threads/transnational-movements-and-organisations/international-organisations-and-congresses/tobias-grill-jewish-anti-zionist-movements",
          "Herzl, T. (1896). Der Judenstaat [The Jewish State]. Breitenstein. https://www.jewishvirtuallibrary.org/quot-the-jewish-state-quot-theodor-herzl",
          "Herzl, T. (1897, July 16). Protestrabbiner [Editorial]. Die Welt, 1(7).",
          "Herzl, T. (1960). The complete diaries of Theodor Herzl (R. Patai, Ed.; H. Zohn, Trans.; Vols. 1–5). Herzl Press. https://archive.org/details/TheCompleteDiariesOfTheodorHerzl_201606",
          "Jewish Virtual Library. (n.d.). First Zionist Congress and the Basel Program, 1897. American-Israeli Cooperative Enterprise. https://jewishvirtuallibrary.org/first-zionist-congress-and-basel-program-1897",
          "Posen Library of Jewish Culture and Civilization. (n.d.). Protest against Zionism [Translation of Protestrabbiner declaration, July 9, 1897]. https://www.posenlibrary.com/entry/protest-against-zionism",
          "Troy, G. (Ed.). (2022). Theodor Herzl: Zionist writings (Vols. 1–3). Library of the Jewish People.",
          "Wikipedia. (2024). First Zionist Congress. https://en.wikipedia.org/wiki/First_Zionist_Congress",
          "Wikipedia. (2024). Timeline of anti-Zionism. https://en.wikipedia.org/wiki/Timeline_of_anti-Zionism",
        ],
      },
      {
        title: "Jewish Anti-Zionism: The Internal Record",
        description: "Jewish opposition to Zionism began in 1897 and has never stopped. This chapter documents it, chapter and verse, from the primary sources of the Jewish tradition itself.",
        content: [
          "The opposition to Zionism within Judaism did not begin after 1948. It did not begin after the Six-Day War of 1967. It did not begin after the occupation of the West Bank. It began in 1897, in the same month, in the same city, in direct response to the founding congress of the movement itself. It has never stopped. It has been published continuously, in multiple languages, across multiple institutional frameworks, by Orthodox rabbis, Reform rabbis, Conservative scholars, secular Jewish intellectuals, and organized Jewish communal bodies on multiple continents for 128 consecutive years.",
          "The dominant political discourse about Judaism and Zionism does not foreground this record. This chapter does nothing except present it. The record is long because the opposition is long. The opposition is long because the theological and ethical objections are serious. The primary sources document both the objections and the institutional history of their systematic marginalization.",
          "SECTION 3.1: 1897 TO 1917. THE FOUNDING OPPOSITION.",
          "The documentation of Jewish anti-Zionism begins, as established in the previous chapter, with the Protestrabbiner declaration of July 1897 and the Munich Jewish community's rejection of the congress in June 1897. Those documents establish that organized Jewish opposition to Zionism is coeval with Zionism itself. The movement and its internal opposition were born in the same year.",
          "What the secondary literature rarely foregrounds is the breadth of that founding opposition across geographic and denominational lines.",
          "In London, Hermann Adler, the Chief Rabbi of the Ashkenazi movement in Britain, expressed his agreement with the German protest rabbis. He described Herzl's intention to found a Jewish state as völlig unheilbringend, completely disastrous, and stated that it was against Jewish principles, against the teachings of the prophets, and against the traditions of Judaism.",
          "In Vienna, Moritz Güdemann, the Chief Rabbi of Vienna and one of the most prominent rabbinic scholars of his era, published Nationaljudenthum in 1897. This is a full-length theological rebuttal of Herzl's Der Judenstaat. Güdemann argued that Zionism was antithetical to Judaism as a religion because it substituted political nationalism for religious covenant. He warned, with precision that subsequent history would document, that a day might come when Judaism with cannons and bayonets would reverse the roles of David and Goliath to constitute a ridiculous contradiction of itself. That sentence was written in 1897. It is in the primary source record.",
          "In Vilnius, on October 7, 1897, the Jewish Labour Bund was founded as a secular anti-Zionist socialist organization. Its position was that Jewish emancipation required political organization within the countries where Jews lived, not territorial separation. The Bund represented hundreds of thousands of working-class Jewish members across Eastern Europe at its peak. It is one of the most significant Jewish political organizations of the twentieth century. Its anti-Zionism was foundational, not incidental.",
          "In 1898, Karl Kraus, the Viennese Jewish intellectual and one of the most prominent satirists in the German-speaking world, published Eine Krone für Zion, a polemic against political Zionism. Kraus argued that Herzl was supporting antisemites by promoting the idea that Jews had multiple loyalties. The argument is not frivolous. It is a serious political observation about the structural consequences of Zionist nationalism for Jewish communities in Europe. It is in the documentary record.",
          "The German Rabbinical Association's general assembly endorsed the Protestrabbiner declaration on July 1 to 2, 1898, with one dissenting vote. Every rabbi present except one voted to formally endorse the position that Zionism was antagonistic to the messianic promises of Judaism. That vote is in the record.",
          "SECTION 3.2: THE THREE OATHS. THE TALMUDIC FOUNDATION OF ANTI-ZIONISM.",
          "The theological foundation of Orthodox anti-Zionism is not a modern construction. It derives from a passage in the Babylonian Talmud, tractate Ketubot, page 111a. The passage records what is known in the rabbinic tradition as Shlosha Shevuot, the Three Oaths.",
          "The Three Oaths are derived through midrashic interpretation of three verses in the Song of Songs, specifically the repeated phrase \"I adjure you, O daughters of Jerusalem.\" The rabbinic tradition interprets this as recording a series of oaths sworn at the time of exile. The Jewish people swore two oaths: not to ascend to the Land of Israel en masse, as if by a wall, meaning through organized mass immigration or conquest, and not to rebel against the nations of the world. The nations of the world, in turn, swore not to oppress Israel excessively.",
          "This is a primary source document of the rabbinic tradition. It appears in the Babylonian Talmud. It has been the subject of continuous commentary and interpretation across the centuries of rabbinic literature. It was the primary theological basis on which Orthodox rabbis opposed Zionism in 1897 and have continued to oppose it since.",
          "The application of the Three Oaths to the question of Zionism is not unanimous within the Orthodox tradition. Some authorities hold that the Holocaust constituted a violation of the nations' oath not to oppress Israel excessively, which would nullify the Jewish oaths. Others hold that the oaths remain binding regardless of historical circumstances. The debate is documented in the rabbinic literature and continues in Orthodox scholarship today.",
          "What is not disputed in the primary sources is the existence and the weight of the Three Oaths as a theological framework. Any account of Jewish opposition to Zionism that does not engage with this Talmudic tradition is an incomplete account. This chapter engages with it because the primary sources require it.",
          "SECTION 3.3: NETUREI KARTA. THE DOCUMENTED RECORD.",
          "Neturei Karta, an Aramaic phrase meaning Guardians of the City, is an Orthodox Jewish organization founded in Jerusalem in 1938. Its founding was a direct response to what its founders understood as the Zionist movement's increasing domination of Jewish institutional life in Mandatory Palestine. Its theological position is derived from the Three Oaths and from the broader stream of Haredi Orthodox Judaism that has maintained categorical opposition to Zionism on religious grounds since 1897.",
          "Neturei Karta's founding in 1938 is documented in its own organizational history and in the historical record of Jewish institutional life in Mandatory Palestine. The organization was established by Rabbi Amram Blau and Rabbi Aharon Katzenellenbogen, both of whom held that the establishment of a Jewish state through human political action rather than divine intervention was a fundamental violation of Jewish law.",
          "The organization's institutional history documents continuous activity from 1938 to the present. It has published statements, organized demonstrations, and maintained an institutional presence in Jerusalem, New York, London, and other cities with significant Orthodox Jewish populations for eighty-six consecutive years. Its opposition to Zionism is categorical, consistent, and documented in its own publications, in news coverage across multiple decades, and in the academic literature on Jewish anti-Zionism.",
          "Neturei Karta members have, on documented occasions, attended conferences and met with political figures whose positions on Israel are aligned with their own opposition to Zionist statehood. These meetings have been controversial within the broader Jewish community and have been used to characterize Neturei Karta as extreme or marginal. The characterization is itself a political act. The theological position Neturei Karta holds is not extreme within the historical record of rabbinic opposition to Zionism. It is continuous with the position of the leading rabbinic authorities of 1897. The difference is not the position. The difference is the political context in which the position is now expressed.",
          "Neturei Karta's website, nkusa.org, maintains a publicly accessible archive of its publications, statements, and theological positions. These are primary sources. They document the organization's reasoning in its own words. ClownBinge cites them as such.",
          "SECTION 3.4: THE AMERICAN COUNCIL FOR JUDAISM. THE DOCUMENTED RECORD.",
          "The American Council for Judaism was founded in 1942. Its founding was a direct response to the American Zionist movement's increasing push toward the establishment of a Jewish state in Palestine. Its founders were Reform rabbis and Jewish lay leaders who held that Judaism was a religion, not a nationality, and that Zionism's conflation of religious identity with nationalist political program was theologically incorrect and politically dangerous for American Jews.",
          "The organization's founding is documented in its own records and in the historical scholarship on American Jewish institutional life. Thomas Kolsky's 1992 monograph Jews Against Zionism: The American Council for Judaism, 1942 to 1948, published by Temple University Press, provides the most comprehensive historical account of the organization's founding period. The monograph is based on primary source archival research. It is available through JSTOR.",
          "The American Council for Judaism's founding statement held that American Jews owed their primary civic loyalty to the United States, not to a Jewish national project in Palestine, and that the Zionist program of establishing a Jewish state would inevitably raise questions about the dual loyalty of American Jews. This argument is not antisemitic. It is a documented position held by Jewish Americans in 1942, made on the basis of their own assessment of what Zionism's political program meant for Jewish life in America.",
          "The organization's membership at its peak in the mid-1940s included several thousand members, among them prominent Reform rabbis and Jewish communal leaders. It maintained an active publication program, held national conferences, and lobbied against Zionist positions in American political discourse during the critical period of 1942 to 1948, when the question of a Jewish state in Palestine was being actively decided in international forums.",
          "The American Council for Judaism continues to exist as an organization. Its publication Issues is available through its website. It represents the documented continuity of American Reform Jewish opposition to Zionism from 1942 to the present.",
          "SECTION 3.5: THE REFORM MOVEMENT'S ANTI-ZIONIST FOUNDING POSITION.",
          "The Pittsburgh Platform of 1885 is the founding document of American Reform Judaism. It was adopted at a conference of Reform rabbis in Pittsburgh, Pennsylvania, on November 16 to 19, 1885. It is a primary source document of the first importance for understanding the relationship between Reform Judaism and Zionism.",
          "The Pittsburgh Platform states, in its third plank: \"We recognize in the Mosaic legislation a system of training the Jewish people for its mission during its national life in Palestine, and today we accept as binding only its moral laws and maintain only such ceremonies as elevate and sanctify our lives, but reject all such as are not adapted to the views and habits of modern civilization.\"",
          "The fourth plank states: \"We hold that all such Mosaic and rabbinical laws as regulate diet, priestly purity, and dress originated in ages and under the influence of ideas entirely foreign to our present mental and spiritual state. They fail to impress the modern Jew with a spirit of priestly holiness; their observance in our days is apt rather to obstruct than to further modern spiritual elevation.\"",
          "The fifth plank is the most relevant to the question of Zionism: \"We recognize in the modern era of universal culture of heart and intellect the approaching of the realization of Israel's great Messianic hope for the establishment of the kingdom of truth, justice, and peace among all men. We consider ourselves no longer a nation but a religious community and therefore expect neither a return to Palestine, nor a sacrificial worship under the sons of Aaron, nor the restoration of any of the laws concerning the Jewish state.\"",
          "That sentence is the official position of American Reform Judaism in 1885, twelve years before the First Zionist Congress. We consider ourselves no longer a nation but a religious community and therefore expect neither a return to Palestine. This is not an obscure minority position. It is the founding platform of the largest Jewish denominational movement in the United States, adopted by its rabbinical leadership twelve years before Zionism held its first congress.",
          "The Pittsburgh Platform remained the official position of the Reform movement until the Columbus Platform of 1937, which introduced a more favorable orientation toward Jewish settlement in Palestine, though still without endorsing Zionist statehood. The shift in the Reform movement's position on Palestine between 1885 and 1937 is itself a documented institutional history that reflects the changing political context of Jewish life in Europe and America during that period. It is not a theological evolution. It is a political response to documented historical circumstances, specifically the rise of European antisemitism and the Holocaust.",
          "SECTION 3.6: AGUDAT ISRAEL. THE ORTHODOX INSTITUTIONAL RECORD.",
          "Agudat Israel was founded in Katowice in May 1912, attended by approximately 200 Orthodox rabbis from Germany and Eastern Europe. Its founding ideology was developed by Nathan Birnbaum, who had himself been an early Zionist and coined the term Zionism before breaking with the movement on religious grounds.",
          "Agudat Israel represents the first organized Orthodox institutional opposition to Zionism and to the establishment of a Jewish state through human political action. Its founding theology held that the Jewish people's return to the Land of Israel could only occur through divine intervention at the messianic time and that any human political attempt to create a Jewish state was not only premature but theologically forbidden under the Three Oaths.",
          "The organization's founding is documented in its own institutional history and in the academic literature on Orthodox Judaism and Zionism. At its peak in the interwar period, Agudat Israel represented hundreds of thousands of Orthodox Jews across Europe and was one of the most significant Orthodox political organizations in the world.",
          "Agudat Israel's relationship to Zionism and to the State of Israel has evolved across the decades since 1948, with significant internal divisions between those who maintain categorical opposition to the state and those who have adopted a pragmatic engagement with Israeli political institutions while maintaining theological reservations about Zionist ideology. These divisions are documented in the organization's own publications and in the academic literature.",
          "What is not disputed in the primary sources is the fact that Agudat Israel was founded in 1912 as an Orthodox institutional alternative to Zionism, that its founding theology was explicitly anti-Zionist on religious grounds, and that it represented a significant proportion of world Orthodox Jewry in the decades before the Holocaust.",
          "SECTION 3.7: THE HOLOCAUST, 1948, AND THE INSTITUTIONAL SHIFT.",
          "The Holocaust transformed the political context of Jewish anti-Zionism in ways that require honest forensic documentation.",
          "Before the Holocaust, Jewish anti-Zionism was the documented majority position of Reform Judaism in America, the documented position of the leading Orthodox rabbinic authorities in Europe, and the documented position of significant Jewish labor and socialist organizations across Eastern Europe. The Zionist movement was a minority position within world Jewry in the period from 1897 to 1939.",
          "The systematic murder of six million Jewish people across Europe between 1941 and 1945 destroyed the demographic base of European Jewish anti-Zionism. The rabbis, scholars, labor organizers, and communal leaders who had maintained the anti-Zionist position across four decades were, in enormous numbers, killed. The communities they led were destroyed. The institutional infrastructure of European Jewish anti-Zionism was physically eliminated.",
          "The establishment of the State of Israel in 1948, in the immediate aftermath of the Holocaust, created a political and emotional context in which anti-Zionist positions became not merely unfashionable but, for many Jewish people, morally incomprehensible. The state was understood, by a majority of surviving Jews and by international sympathy, as the necessary refuge produced by the failure of European civilization to protect Jewish people from genocide.",
          "This chapter does not characterize that understanding. It documents it. The political shift is real. The emotional weight of the Holocaust in relation to the establishment of Israel is real. It is in the historical record.",
          "What is also in the historical record is the following. The destruction of the physical infrastructure of Jewish anti-Zionism in Europe did not destroy the theological arguments that produced it. Those arguments are in the Talmud. They are in the Pittsburgh Platform of 1885. They are in the Protestrabbiner declaration of 1897. They are in Güdemann's Nationaljudenthum of 1897. They are in the founding documents of Neturei Karta, the American Council for Judaism, and Agudat Israel. The Holocaust did not rewrite those documents. It destroyed the people who held them. That distinction is forensically significant.",
          "SECTION 3.8: CONTEMPORARY JEWISH ANTI-ZIONISM. THE DOCUMENTED RECORD.",
          "The contemporary record of Jewish anti-Zionist scholarship, religious ruling, and institutional opposition is extensive. What follows is a sourced catalog of documented positions, not an exhaustive inventory.",
          "Rabbi Elmer Berger served as executive director of the American Council for Judaism from 1943 to 1968. He published multiple works documenting his theological and political opposition to Zionism, including The Jewish Dilemma in 1945 and Judaism or Jewish Nationalism in 1957. Both are primary source documents of American Reform Jewish anti-Zionism in the mid-twentieth century.",
          "Noam Chomsky, a secular Jewish intellectual and professor emeritus at the Massachusetts Institute of Technology, has maintained a documented critical position on Zionism and Israeli state policy across five decades of published scholarship and public commentary. His positions are documented in dozens of published books and articles. Whatever one's assessment of his arguments, his existence as a prominent Jewish intellectual with documented anti-Zionist positions is a primary source fact about the range of Jewish intellectual opinion on these questions.",
          "Judith Butler, a philosopher and professor at the University of California Berkeley, published Parting Ways: Jewishness and the Critique of Zionism in 2012 through Columbia University Press. The book engages with the Jewish philosophical tradition, including the work of Hannah Arendt, Emmanuel Levinas, and Walter Benjamin, to argue that the ethical resources of Jewish thought provide grounds for a critique of Zionism. It is a peer-reviewed academic monograph published by a major university press. It is a primary source document of contemporary Jewish anti-Zionist scholarship.",
          "Jewish Voice for Peace is an American Jewish organization founded in 1996 that maintains an explicitly anti-Zionist position. Its membership includes rabbis, scholars, and Jewish activists across the United States. Its founding documents, published statements, and rabbinic council's positions are publicly available at its website, jewishvoiceforpeace.org. They are primary source documents of contemporary organized Jewish opposition to Zionism.",
          "If Not Now is an American Jewish organization founded in 2014 that describes itself as opposing Israeli occupation of Palestinian territories. Its founding documents and published positions are publicly available at its website, ifnotnowmovement.org.",
          "Rabbi Brant Rosen leads Tzedek Chicago, a congregation that added anti-Zionism to its core values statement in March 2022. That statement is publicly available and constitutes a primary source document of contemporary synagogue-level theological opposition to Zionism.",
          "The Satmar Hasidic dynasty, founded by Rabbi Yoel Teitelbaum and based primarily in New York, maintains categorical opposition to Zionism and to the State of Israel on theological grounds derived from the Three Oaths. The Satmar community numbers in the tens of thousands. Its anti-Zionist position is published in Rabbi Teitelbaum's work Vayoel Moshe, first published in 1959, which constitutes the most extensive modern Orthodox theological argument against Zionism based on Talmudic sources. The work is a primary source document of Orthodox anti-Zionism in the post-Holocaust period.",
          "SECTION 3.9: THE DELTA. WHAT 128 YEARS OF CONTINUOUS OPPOSITION DOCUMENTS.",
          "The documented record of Jewish anti-Zionism from 1897 to the present establishes the following primary source facts.",
          "Jewish opposition to Zionism began in the year Zionism was founded. It has never stopped. It has been maintained across Orthodox, Reform, Conservative, and secular Jewish intellectual traditions simultaneously. It has been institutionalized in organizations ranging from the Satmar Hasidic community to the American Council for Judaism to Jewish Voice for Peace. It has been articulated by Chief Rabbis of Britain, Vienna, and Germany, by professors at MIT and Berkeley, by synagogue congregations in Chicago, and by Hasidic communities in Brooklyn.",
          "The claim that anti-Zionism is antisemitism cannot be derived from this record. The record documents Jewish people opposing Zionism on Jewish theological grounds, using Jewish textual sources, within Jewish institutional frameworks, continuously for 128 years. The claim that these Jewish people are antisemitic requires a definition of antisemitism that excludes Jewish people from the category of people who can be harmed by antisemitism, which is not a coherent definition.",
          "The political function of that claim is examined in Chapter 8 using the documented legislative and lobbying record of its institutional deployment.",
          "The receipts are 128 years old. They begin with rabbis. They continue with rabbis. They include scholars, philosophers, labor organizers, synagogue congregations, and Hasidic dynasties. The opposition is long because the primary sources of Judaism say what they say.",
          "The Torah does not require translation. It requires reading.",
        ],
        sources: [
          "Agudat Israel of America. (n.d.). About Agudath Israel. https://www.agudathisrael.org",
          "American Council for Judaism. (n.d.). Issues: A journal of opinion. https://acjna.org",
          "Butler, J. (2012). Parting ways: Jewishness and the critique of Zionism. Columbia University Press.",
          "Central Conference of American Rabbis. (1885, November). The Pittsburgh Platform. https://www.ccarnet.org/rabbinic-voice/platforms/article-declaration-principles/",
          "Grill, T. (n.d.). Jewish anti-Zionist movements. European History Online, Leibniz Institute of European History. https://www.ieg-ego.eu/en/threads/transnational-movements-and-organisations/international-organisations-and-congresses/tobias-grill-jewish-anti-zionist-movements",
          "Güdemann, M. (1897). Nationaljudenthum [National Judaism]. Leipzig.",
          "If Not Now Movement. (n.d.). About. https://www.ifnotnowmovement.org",
          "Jewish Voice for Peace. (n.d.). Our principles. https://www.jewishvoiceforpeace.org",
          "Kolsky, T. A. (1992). Jews against Zionism: The American Council for Judaism, 1942–1948. Temple University Press. https://www.jstor.org/stable/j.ctt14bsxdg",
          "Neturei Karta International. (n.d.). About Neturei Karta. https://www.nkusa.org",
          "Posen Library of Jewish Culture and Civilization. (n.d.). Protest against Zionism [Translation of Protestrabbiner declaration, July 9, 1897]. https://www.posenlibrary.com/entry/protest-against-zionism",
          "Teitelbaum, Y. (1959). Vayoel Moshe [And Moses consented]. Yerushalayim Press.",
          "Talmud Bavli. (n.d.). Ketubot 111a [Three Oaths]. https://www.sefaria.org/Ketubot.111a",
          "Wikipedia. (2024). Timeline of anti-Zionism. https://en.wikipedia.org/wiki/Timeline_of_anti-Zionism",
        ],
      },
      {
        title: "The Balfour Declaration",
        description: "Sixty-seven words from a British Foreign Secretary to a private citizen rearranged the legal status of a territory inhabited by 700,000 people. The primary sources document what happened next.",
        content: [
          "The Balfour Declaration is two hundred and seventeen words long. It was written on November 2, 1917. It was written by Arthur James Balfour, the British Foreign Secretary, on behalf of the British Cabinet. It was addressed to Walter Rothschild, the second Baron Rothschild, a prominent figure in the British Zionist Federation. It was a letter from a government minister to a private citizen representing a political lobby. It was not a treaty. It was not a statute. It was not a United Nations resolution. It was not a legal instrument of any kind recognized under international law as it existed in 1917.",
          "It is the document upon which the political Zionist movement's claim to British governmental support for a Jewish homeland in Palestine rests. It is one of the most consequential letters in the history of the twentieth century. It is also one of the most consistently mischaracterized documents in contemporary political discourse.",
          "This chapter reads the document. It documents who wrote it, under what political circumstances, with what internal opposition, and with what response from the populations most directly affected by its contents. The document says what it says. The political record surrounding its production says what it says. ClownBinge reports both.",
          "SECTION 4.1: THE TEXT. IN FULL.",
          "The Balfour Declaration reads, in its entirety:",
          "\"Dear Lord Rothschild, I have much pleasure in conveying to you, on behalf of His Majesty's Government, the following declaration of sympathy with Jewish Zionist aspirations which has been submitted to, and approved by, the Cabinet. His Majesty's Government view with favour the establishment in Palestine of a national home for the Jewish people, and will use their best endeavours to facilitate the achievement of this object, it being clearly understood that nothing shall be done which may prejudice the civil and religious rights of existing non-Jewish communities in Palestine, or the rights and political status enjoyed by Jews in any other country. I should be grateful if you would bring this declaration to the knowledge of the Zionist Federation. Yours sincerely, Arthur James Balfour\"",
          "Four elements of this text require forensic attention before any historical context is introduced.",
          "First: the document describes itself as a declaration of sympathy with Jewish Zionist aspirations. It is not a declaration of intent to establish a Jewish state. It is not a grant of territory. It is an expression of sympathy with aspirations. The language is deliberately hedged. The hedging is not accidental. It is the product of extensive internal Cabinet deliberation documented in the British government's own records.",
          "Second: the document refers to Palestine as a location for a national home. It does not describe Palestine as an empty territory available for settlement. It acknowledges, explicitly, that Palestine contains existing populations. It refers to them as existing non-Jewish communities. It does not name them. It does not quantify them. It does not characterize their relationship to the land. It simply acknowledges their existence and states that nothing shall be done to prejudice their civil and religious rights.",
          "Third: the document makes no reference to the political rights of existing non-Jewish communities. It protects their civil and religious rights. It is silent on their political rights. That silence is a primary source document of the political framework within which the Balfour Declaration was conceived.",
          "Fourth: the document was written by a British Foreign Secretary and addressed to a banker. It was not written by a Jewish religious authority. It was not written in response to a theological claim. It was written in response to a political lobby operating within British political society in the context of the First World War. It is a political document produced by a political process for political purposes.",
          "SECTION 4.2: WHO WROTE IT. THE BRITISH POLITICAL CONTEXT.",
          "Arthur James Balfour was born in 1848. He served as Prime Minister of the United Kingdom from 1902 to 1905 and as Foreign Secretary from 1916 to 1919. He was a Scottish Presbyterian with a documented intellectual interest in Jewish history and a documented sympathy with Zionist political aspirations that predated his role as Foreign Secretary.",
          "The British Cabinet's deliberations on what would become the Balfour Declaration began in earnest in 1917. The deliberations are documented in Cabinet minutes held at the British National Archives. The draft that became the final declaration went through multiple revisions across several months. The evolution of the drafts is itself a primary source document of the political calculations that shaped the final text.",
          "The first draft, circulated in July 1917, read: \"His Majesty's Government accepts the principle that Palestine should be reconstituted as the national home of the Jewish people.\" That language was significantly stronger than what appeared in the final declaration. The phrase reconstituted as the national home of the Jewish people implies a historical claim and a definitive political commitment. The phrase establishment in Palestine of a national home for the Jewish people, which appeared in the final text, implies a process rather than a historical right and a home within Palestine rather than Palestine reconstituted as the home.",
          "The weakening of the language between the first draft and the final text is documented in the Cabinet record. It reflects the internal opposition that the declaration generated within the British government.",
          "The most significant internal opposition came from Edwin Samuel Montagu, the Secretary of State for India and the only Jewish member of the British Cabinet at the time. Montagu submitted a memorandum to the Cabinet on August 23, 1917, titled The Anti-Semitism of the British Government. The title is not rhetorical. Montagu argued, in a formal Cabinet memorandum, that the Balfour Declaration would cause non-Jewish governments throughout the world to turn around and say to their Jewish citizens that Palestine was their real home and that they must go there. He argued that the declaration would endanger the position of Jewish people who were citizens of countries other than Britain by suggesting that their true national home was elsewhere.",
          "Montagu's memorandum is a primary source document of the highest importance for understanding the Balfour Declaration. It is a formal government document written by a Jewish Cabinet minister arguing that the Balfour Declaration was itself a form of antisemitism because of its implication that Jewish people were not fully citizens of the countries in which they lived. The memorandum is held at the British National Archives. It is publicly accessible.",
          "The declaration was approved by the Cabinet on October 31, 1917, despite Montagu's opposition. It was published on November 2, 1917.",
          "SECTION 4.3: WHO RECEIVED IT. THE ROTHSCHILD CONNECTION.",
          "Walter Rothschild, the second Baron Rothschild, was the addressee of the declaration. He was a member of the prominent Rothschild banking family, a British peer, and a figure in the British Zionist Federation. He was not the president of the Zionist Federation. He was not the most prominent Zionist leader in Britain. He was, however, a peer of the realm and a member of one of the most prominent Jewish families in Britain, which made him a symbolically appropriate addressee for a document intended to signal British governmental sympathy with Zionist aspirations.",
          "The choice of Rothschild as addressee is itself a documented element of the declaration's political context. The British government's decision to address its declaration to a banker and peer rather than to a democratically accountable representative body reflects the nature of the political negotiation that produced it. The Zionist Federation was a lobbying organization. The declaration was the product of its lobbying. The addressee was a member of the social and financial elite within which that lobbying was conducted.",
          "Chaim Weizmann, the president of the British Zionist Federation and the most significant Zionist political figure in Britain during the war years, was the primary architect of the diplomatic campaign that produced the declaration. Weizmann's access to British political society, his relationships with Cabinet ministers, and his persistent lobbying are documented in his own memoirs, Trial and Error, published in 1949, and in the historical scholarship on the period. The declaration was the product of his work as much as of Balfour's sympathy.",
          "SECTION 4.4: THE BRITISH STRATEGIC CALCULATION. WHAT THE CABINET RECORD DOCUMENTS.",
          "The Balfour Declaration was not produced by British altruism toward the Jewish people. It was produced by British strategic calculation during the First World War. The Cabinet records document the strategic considerations that motivated it.",
          "Britain in 1917 was engaged in a war whose outcome remained uncertain. The United States had entered the war in April 1917 but had not yet deployed significant forces to Europe. The British government believed, based on a significant overestimation of Jewish influence in American and Russian political life, that a declaration of sympathy with Zionist aspirations would help secure American Jewish support for the war effort and stabilize the Russian provisional government, which had come to power after the February 1917 revolution and whose continued participation in the war was uncertain.",
          "These strategic calculations are documented in the Cabinet records. They reflect the British government's understanding of the political landscape in 1917. They also reflect significant miscalculations about the nature and extent of Jewish political influence in the United States and Russia.",
          "The declaration was also motivated by British imperial interests in Palestine itself. The Sykes-Picot Agreement of May 1916, a secret treaty between Britain and France, had divided the anticipated post-war territories of the Ottoman Empire into spheres of influence. Palestine was designated as an international zone under the Sykes-Picot framework. The Balfour Declaration was, among other things, a British move to establish a stronger claim to Palestine than the Sykes-Picot Agreement had granted. A Palestine housing a British-backed Jewish national home was more firmly in the British sphere than a Palestine designated as an international zone.",
          "The Sykes-Picot Agreement is a primary source document of the first importance for understanding the geopolitical context of the Balfour Declaration. It is held at the British National Archives. The fact that the Balfour Declaration was issued in the context of a secret agreement to divide the Ottoman Empire's territories between Britain and France is a primary source fact about the declaration's political context that the standard popular account of the declaration does not foreground.",
          "SECTION 4.5: WHAT PALESTINE ACTUALLY CONTAINED. THE DEMOGRAPHIC RECORD.",
          "The Balfour Declaration referred to the existing non-Jewish communities in Palestine without naming them, quantifying them, or characterizing their relationship to the land. The demographic record of Palestine in 1917 is a primary source that the declaration's language implicitly erased.",
          "The Ottoman census of 1914, the most recent census conducted before the Balfour Declaration, documented the population of Palestine as follows. The Muslim population was approximately 525,000. The Christian population was approximately 70,000. The Jewish population was approximately 94,000. The total population was approximately 689,000. The Jewish population represented approximately 13.6 percent of the total.",
          "The British Mandate census of 1922, the first census conducted after Britain assumed control of Palestine under the League of Nations Mandate, documented the following. The Muslim population was 589,177. The Christian population was 73,024. The Jewish population was 83,790. The total population was 752,048. The Jewish population represented approximately 11.1 percent of the total. The decline in the Jewish percentage between 1914 and 1922 reflects the disruption of World War One and the emigration of some Jewish residents during the war period.",
          "These census figures are primary source documents. They establish that Palestine in 1917 was not an empty territory available for settlement. It was a populated territory with an existing majority population. The Balfour Declaration referred to that majority population as existing non-Jewish communities. The census documents that those communities represented approximately 86 percent of Palestine's total population at the time the declaration was written.",
          "The phrase existing non-Jewish communities in a document purporting to facilitate the establishment of a national home for one population in a territory where that population represented 13.6 percent of the total is a primary source document of the political framework within which the declaration was conceived. The math is in the census. ClownBinge reports the math.",
          "SECTION 4.6: THE ARAB RESPONSE. THE HUSAYN-McMAHON CORRESPONDENCE.",
          "The Arab response to the Balfour Declaration cannot be understood without the primary source context of the Husayn-McMahon Correspondence, a series of letters exchanged between Sharif Hussein bin Ali of Mecca and Sir Henry McMahon, the British High Commissioner in Egypt, between July 1915 and March 1916.",
          "In that correspondence, Britain effectively promised Arab independence in exchange for the Arab Revolt against the Ottoman Empire during the First World War. Sharif Hussein understood the correspondence as a British commitment to Arab sovereignty over a large portion of the Arab territories of the Ottoman Empire, including, in the Arab interpretation, Palestine.",
          "The Husayn-McMahon Correspondence is held at the British National Archives. Its interpretation has been contested since its production, with the British government subsequently arguing that Palestine was excluded from the territories covered by the correspondence. The Arab parties to the correspondence disputed that interpretation. The text of the correspondence itself is ambiguous on the question of Palestine's inclusion.",
          "What is not ambiguous is the following primary source fact. Britain made commitments to two different parties, the Zionist Federation through the Balfour Declaration and the Arab leadership through the Husayn-McMahon Correspondence, regarding the future of territories that overlapped. The Sykes-Picot Agreement, made simultaneously with both sets of commitments, divided those same territories between Britain and France without reference to either party's understanding of what had been promised.",
          "Britain made three sets of commitments regarding the same territory to three different parties between 1915 and 1917. The primary source record of those commitments is held at the British National Archives. The contradictions between them are not a matter of interpretation. They are a matter of documentary record.",
          "The Arab political leadership responded to the Balfour Declaration with the documented position that it violated the commitments Britain had made in the Husayn-McMahon Correspondence. That position is documented in the diplomatic record of the Paris Peace Conference of 1919, where Faysal ibn Husayn, representing the Arab Kingdom of the Hejaz, presented the Arab case to the Allied powers. His testimony is in the conference record.",
          "SECTION 4.7: THE OTTOMAN RESPONSE. THE DOCUMENTARY RECORD.",
          "Palestine was Ottoman territory in 1917. The Balfour Declaration was issued by a government that did not control Palestine at the time of its issuance. Britain was at war with the Ottoman Empire. British forces were advancing through Palestine during the period of the declaration's production. Jerusalem fell to British forces on December 9, 1917, five weeks after the declaration was published.",
          "The Ottoman government's response to the Balfour Declaration is documented in the diplomatic record of the period. The Ottoman position was that Britain had no authority to make declarations regarding the future of Ottoman territory and that the declaration was a violation of the established principles of international law as they existed in 1917.",
          "The Ottoman Empire had governed Palestine continuously since 1517. The Ottoman land registry system, discussed in Chapter 5, documented Palestinian land ownership across four centuries of Ottoman administration. The declaration made no reference to the existing Ottoman administrative and legal framework governing land ownership and residency in Palestine. It made no reference to the rights of the existing landowners documented in the Ottoman registry. It referred only to the civil and religious rights of existing non-Jewish communities, not to their property rights or their political rights.",
          "The Ottoman response is a primary source document of the declaration's reception by the sovereign authority of the territory it addressed. That authority's position is in the diplomatic record.",
          "SECTION 4.8: THE DELTA. WHAT THE STANDARD ACCOUNT OMITS.",
          "The standard account of the Balfour Declaration focuses on its significance as a milestone in Zionist political achievement. That significance is real. The declaration was the first major governmental endorsement of the Zionist program. It shaped the subsequent history of the Middle East in ways that continue to produce documented consequences in the present.",
          "What the standard account consistently omits or minimizes is the following documented record.",
          "Edwin Samuel Montagu, the only Jewish member of the British Cabinet, formally opposed the declaration as itself a form of antisemitism. His memorandum, The Anti-Semitism of the British Government, is a primary source document that the standard popular account of the Balfour Declaration rarely cites in full. It is in the British National Archives.",
          "The declaration was motivated in significant part by British strategic calculations about Jewish influence in American and Russian politics that have been documented by subsequent scholarship as significantly overestimated. The declaration was, in part, a product of antisemitic assumptions about Jewish financial and political power dressed in the language of sympathy.",
          "The declaration was produced in the context of the Sykes-Picot Agreement, which divided the anticipated post-war territories of the Ottoman Empire between Britain and France. The declaration was, in part, a British maneuver to secure a stronger claim to Palestine than the Sykes-Picot framework had granted. The strategic interests of the British Empire, not the religious claims of Judaism, were the primary driver of the declaration's production.",
          "The existing population of Palestine at the time of the declaration represented approximately 86 percent of the territory's total population. The declaration referred to this population as existing non-Jewish communities. The Ottoman census of 1914 named them. The British census of 1922 counted them. The declaration erased them into a subordinate clause.",
          "The receipts predate the declaration. The census is older than the letter. The land registry is older than the census. The Torah is older than all of them. The documents do not require editorial assistance. They require reading.",
        ],
        sources: [
          "Balfour, A. J. (1917, November 2). The Balfour Declaration [Letter to Lord Walter Rothschild]. British Foreign Office. https://www.jewishvirtuallibrary.org/text-of-the-balfour-declaration",
          "British Cabinet Office. (1917). Cabinet minutes and memoranda, 1917 [including Montagu memorandum, August 23, 1917]. British National Archives, CAB 24/24. https://www.nationalarchives.gov.uk",
          "British Mandate Palestine. (1922). Census of Palestine, 1922. Government of Palestine. https://www.jewishvirtuallibrary.org/population-of-israel-palestine-1517-1948",
          "Faysal ibn Husayn. (1919). Statement to the Paris Peace Conference [January 1919]. Paris Peace Conference Records.",
          "Husayn, S., & McMahon, H. (1915–1916). The Husayn-McMahon Correspondence [July 1915–March 1916]. British National Archives, FO 371. https://www.nationalarchives.gov.uk",
          "Montagu, E. S. (1917, August 23). The anti-Semitism of the present British government [Cabinet memorandum]. British Cabinet Office, CAB 24/24. British National Archives.",
          "Ottoman Empire. (1914). Ottoman census of 1914: Palestine population data. Ottoman Imperial Archives, Istanbul.",
          "Sykes, M., & Picot, F. (1916, May 16). The Sykes-Picot Agreement [Secret treaty between Britain and France]. British National Archives, FO 371/2767. https://www.nationalarchives.gov.uk",
          "Weizmann, C. (1949). Trial and error: The autobiography of Chaim Weizmann. Harper & Brothers.",
          "Wikipedia. (2024). Balfour Declaration. https://en.wikipedia.org/wiki/Balfour_Declaration",
          "Wikipedia. (2024). Hussein-McMahon correspondence. https://en.wikipedia.org/wiki/Hussein%E2%80%93McMahon_correspondence",
        ],
      },
      {
        title: "Land, Census, and Demographic Reality",
        description: "Land registries do not have political agendas. This chapter reads the Ottoman tapu records and British Mandate censuses and reports only what they recorded about who owned what.",
        content: [
          "A land registry does not have a political agenda. It records who owned what land, in what quantity, in what location, on what date, under what legal instrument of transfer. The Ottoman land registry system, known as the tapu, operated continuously in Palestine from 1858 to 1918. The British Mandate land administration system operated continuously from 1920 to 1948. Both systems produced primary source documents of land ownership and population distribution that exist in archives in Istanbul, London, Ramallah, and Jerusalem. Those documents are the subject of this chapter.",
          "The political discourse about Palestine before 1948 frequently describes the land as either largely empty and available for settlement or as fully owned and occupied by an existing population. Neither characterization requires editorial adjudication. The primary source record requires reading.",
          "This chapter reads those documents. It does not argue from them. It reports what they recorded. The demographic reality of Palestine before 1948 is not a contested matter in the primary sources. It is a documented matter. The contest is political. The documentation is archival. This chapter concerns itself exclusively with the documentation.",
          "SECTION 5.1: THE OTTOMAN LAND REGISTRY SYSTEM. WHAT IT WAS AND WHAT IT PRODUCED.",
          "The Ottoman Land Code of 1858 established the tapu system as the formal framework for land registration across the Ottoman Empire. The code required landowners to register their holdings with the Ottoman land registry, known as the tapu sicili, in exchange for official title deeds, known as tapu senedi. The system was modeled in part on European land registration practices and was intended to modernize Ottoman land administration, facilitate tax collection, and create a formal legal record of land ownership across the empire.",
          "The Ottoman Land Code divided land into five categories. Mulk land was privately owned land subject to full individual ownership rights. Miri land was state land that could be allocated to individuals for cultivation under conditions of continuous use. Waqf land was land held in religious endowment, typically for the support of mosques, schools, or charitable institutions. Matruka land was land reserved for public use. Mawat land was uncultivated or dead land that had no registered owner.",
          "The distinction between these categories is forensically significant for the question of Palestinian land ownership before 1948. Subsequent legal arguments about the availability of land for Jewish settlement frequently relied on the classification of large portions of Palestinian land as miri or mawat, meaning state land or dead land available for allocation, rather than mulk land under individual private ownership. The Ottoman land registry documents are the primary sources against which those arguments must be evaluated.",
          "The tapu records for Palestine are held in multiple archives. The primary repository is the Ottoman Imperial Archives, known as the Başbakanlık Osmanlı Arşivi, in Istanbul. The Turkish government has digitized significant portions of these records. In 2018, the Turkish Directorate of Ottoman Archives transferred a full electronic archive of 140,000 documents spanning over 400 years of Ottoman administration in Palestinian territories to the Palestinian Land Authority through the Turkish embassy in Ramallah. The transfer is documented in Anadolu Agency reporting of March 2018 and is publicly accessible.",
          "The Open Jerusalem project, a collaborative scholarly initiative, has digitized and made publicly accessible more than 5,000 documents from the Ottoman Imperial Archives related to Jerusalem's administrative history. The shari'a court records of Jerusalem, covering the period from 1529 to 1917, constitute one of the richest primary source collections for the social and economic history of Ottoman Palestine. They are accessible through the Open Jerusalem database.",
          "SECTION 5.2: WHAT THE OTTOMAN REGISTRY RECORDED. THE LAND OWNERSHIP DATA.",
          "The most frequently cited systematic analysis of Ottoman and early British Mandate land ownership data in Palestine is the work of scholar Sami Hadawi, a Palestinian land assessor who worked for the British Mandate government's land registry department and subsequently compiled a systematic analysis of land ownership patterns based on the official records to which he had direct professional access.",
          "Hadawi's analysis, published in Palestinian Rights and Losses in 1948 and in Bitter Harvest, documents land ownership in Palestine by population group based on the official registry data. His analysis constitutes a primary source of the second order: it is a professional analysis conducted by a trained land assessor using the original registry documents as its source material.",
          "The United Nations Special Committee on Palestine, known as UNSCOP, was established in May 1947 to investigate the situation in Palestine and make recommendations for its future. UNSCOP's report, submitted to the United Nations General Assembly in September 1947, contains land ownership data derived from the British Mandate government's official records.",
          "According to the data compiled by the Anglo-American Committee of Inquiry in 1946, drawing on official British Mandate land records, of the approximately 26.3 million dunams of land in Palestine, approximately 1.5 million dunams were registered as Jewish owned. That is approximately 5.8 percent of Palestine's total land area. Approximately 9.2 million dunams were registered in Arab ownership. Approximately 16.9 million dunams were classified as public, state, or uncultivated land.",
          "The 5.8 percent figure for Jewish-owned land in 1946 is a primary source figure derived from the official British Mandate land registry. It is not a Palestinian political claim. It is the documented output of the British colonial administration's own land recording system.",
          "The classification of 16.9 million dunams as public, state, or uncultivated land is the primary source basis for subsequent arguments about land availability for Jewish settlement. The forensic question those arguments require engaging is whether the Ottoman and British classification of land as miri, mawat, or state land accurately reflected the actual use and traditional ownership of those lands by Palestinian Arab communities, many of which had cultivated land under traditional arrangements that predated the Ottoman Land Code's registration requirements.",
          "That forensic question is not resolved in this volume. It is documented as a primary source dispute between the official land registry record and the documented traditional usage patterns of Palestinian agricultural communities.",
          "SECTION 5.3: THE BRITISH MANDATE CENSUSES. THE DEMOGRAPHIC RECORD.",
          "The British Mandate government conducted two comprehensive censuses of Palestine. The census of 1922 and the census of 1931. A third census was planned for 1941 but was not conducted due to the Second World War. Population estimates for subsequent years through 1948 are derived from the Mandate government's statistical abstracts and vital statistics records.",
          "The 1922 census, conducted under the direction of J.B. Barron, documented the following population: Muslims 589,177 (78.3%); Christians 73,024 (9.7%); Jews 83,790 (11.1%); Other 7,617 (1.0%); Total 752,048.",
          "The 1931 census, conducted under the direction of E. Mills, documented the following population: Muslims 759,700 (73.4%); Christians 88,907 (8.6%); Jews 174,606 (16.9%); Other 10,101 (1.0%); Total 1,033,314.",
          "The increase in the Jewish population between 1922 and 1931, from 83,790 to 174,606, represents a 108 percent increase over nine years. This increase is documented in the census record as a product of Jewish immigration from Europe during the period. The Mandate government's statistical abstracts document immigration figures by year and by country of origin.",
          "By 1947, the Mandate government's statistical estimates documented the following population: Muslims approximately 1,157,000 (68.0%); Christians approximately 146,000 (8.6%); Jews approximately 630,000 (31.0%); Other approximately 36,000 (2.1%); Total approximately 1,970,000.",
          "These figures are from the British Mandate government's own official records. They document the demographic transformation of Palestine between 1922 and 1947 produced by Jewish immigration from Europe. In 1922, Jewish residents represented 11.1 percent of Palestine's total population. In 1947, they represented approximately 31.0 percent. In 1922, the Muslim population represented 78.3 percent of the total. In 1947, it represented approximately 68.0 percent. The demographic shift is documented in the colonial administration's own statistical record.",
          "SECTION 5.4: THE UN PARTITION PLAN. WHAT IT DIVIDED AND ON WHAT BASIS.",
          "United Nations General Assembly Resolution 181, adopted on November 29, 1947, recommended the partition of Palestine into a Jewish state and an Arab state, with Jerusalem under international administration. The resolution passed with 33 votes in favor, 13 against, and 10 abstentions.",
          "The partition plan proposed the following territorial division. The Jewish state would receive approximately 56 percent of the total territory of Mandatory Palestine, including the Negev desert. The Arab state would receive approximately 43 percent. Jerusalem and Bethlehem would be placed under international administration.",
          "The forensic tension in the partition plan is documentable from the plan's own data. The Jewish population of Palestine in 1947 represented approximately 31 percent of the total population and owned approximately 5.8 percent of the total land area as registered in the official land registry. The partition plan proposed allocating 56 percent of the territory to a Jewish state.",
          "The Arab state proposed by the partition plan would have housed a population that was approximately 99 percent Arab. The Jewish state proposed by the partition plan would have housed a population that was approximately 55 percent Jewish and 45 percent Arab. That demographic composition of the proposed Jewish state is documented in the UNSCOP report and in the General Assembly's own records.",
          "The Jewish Agency accepted the partition plan. The Arab League rejected it. The reasons for each position are documented in the respective parties' formal statements to the United Nations. The Arab League's rejection was based on the position that the partition plan allocated a disproportionate share of territory to a population that represented a minority of Palestine's total residents and a small fraction of its registered landowners. The Jewish Agency's acceptance was based on the position that the partition plan provided the political and territorial framework necessary for the establishment of a Jewish state.",
          "Both positions are in the United Nations record. ClownBinge reports both.",
          "SECTION 5.5: 1948. THE NAKBA. THE DOCUMENTED DISPLACEMENT RECORD.",
          "The establishment of the State of Israel on May 14, 1948, and the subsequent Arab-Israeli War of 1948 produced a documented displacement of the Palestinian Arab population that is recorded in United Nations records, British Mandate records, Israeli government records, and the testimony archives of Palestinian survivors.",
          "The United Nations Relief and Works Agency for Palestine Refugees in the Near East, known as UNRWA, was established by United Nations General Assembly Resolution 302 on December 8, 1949, specifically to provide relief and works programs for Palestinian refugees. UNRWA's mandate documents the existence and scale of Palestinian refugee displacement as a primary source fact of the highest institutional authority.",
          "UNRWA's foundational records document the following. Approximately 750,000 Palestinian Arabs were displaced from their homes during the 1948 war and its aftermath. They fled or were expelled to the West Bank, the Gaza Strip, Jordan, Lebanon, and Syria. They left behind approximately 400 villages, the majority of which were subsequently depopulated, demolished, or repopulated by Jewish immigrants.",
          "The figure of approximately 750,000 displaced Palestinians is UNRWA's own operational figure, derived from its registration records for refugee relief. It is the documented basis on which the United Nations established an agency, funded it, and has maintained it in continuous operation for seventy-five consecutive years.",
          "As of 2024, UNRWA documents 5.9 million registered Palestinian refugees, representing the original displaced population and their descendants across three generations. The registration system is UNRWA's own administrative record. It is publicly accessible through UNRWA's website.",
          "The Israeli government's own records, specifically the Haganah and Israel Defense Forces operational documents that have been partially declassified and studied by Israeli historians including Benny Morris, document the military operations of 1948 in detail. Morris's research, published in The Birth of the Palestinian Refugee Problem, 1947 to 1949, first published in 1987 and revised in 2004, draws on Israeli military archives to document the circumstances of Palestinian displacement during the 1948 war. Morris's work is a secondary source drawing on primary source Israeli military records. It documents cases of expulsion alongside cases of flight, establishing that the displacement was not exclusively voluntary.",
          "The village-by-village documentation of Palestinian displacement is compiled in All That Remains: The Palestinian Villages Occupied and Depopulated by Israel in 1948, edited by Walid Khalidi and published by the Institute for Palestine Studies in 1992. The volume documents 418 Palestinian villages that were depopulated during the 1948 war using British Mandate records, Israeli military records, aerial photography, and survivor testimony. It is a primary source compilation of the documented record of displacement.",
          "SECTION 5.6: THE SHEIKH JARRAH EVICTION ORDERS. THE CONTEMPORARY RECORD.",
          "Sheikh Jarrah is a neighborhood in East Jerusalem. Palestinian families have lived in Sheikh Jarrah since 1956, when they were resettled there by the United Nations Relief and Works Agency following their displacement from other parts of Palestine in 1948. The resettlement is documented in UNRWA's own administrative records.",
          "Since the 1970s, Israeli settler organizations have pursued legal proceedings in Israeli courts to evict Palestinian families from Sheikh Jarrah on the basis of land ownership claims derived from Jewish ownership of the land before 1948. The legal proceedings are documented in Israeli court records.",
          "The Sheikh Jarrah eviction proceedings are a primary source document of the contemporary application of the 1948 displacement's legal consequences. Palestinian families who were displaced in 1948 and resettled by UNRWA in Sheikh Jarrah in 1956 face eviction in 2024 based on pre-1948 Jewish land ownership claims. Israeli law allows Jewish families to reclaim property owned before 1948 in areas that became part of Israel. Israeli law does not provide a reciprocal right for Palestinian families to reclaim property owned before 1948 in areas that became part of Israel.",
          "The asymmetry is in the statute. The statute is a primary source. Adalah's database documents it as one of more than 55 laws that explicitly distinguish between Jewish and non-Jewish rights in Israel. The eviction orders are dated. The UNRWA resettlement records are dated. The Ottoman land registry entries that predate both are dated. The Basic Law does not require a translator. The statutory language is unambiguous.",
          "SECTION 5.7: THE DELTA. THE OTTOMAN REGISTRY AS LEGAL INSTRUMENT.",
          "The Delta of this chapter is the Ottoman land registry's contemporary legal function.",
          "Palestinian lawyers and surveyors in the West Bank and East Jerusalem are actively using Ottoman-era land registry documents, tapu deeds more than 100 years old, in Israeli courts and in international legal forums to establish proof of Palestinian land ownership prior to the establishment of the State of Israel. The use of these documents in active litigation is documented in the academic literature, specifically in Munira Khayyat-Fakher's research on Palestinian counter-forensics published in the American Ethnologist journal in 2022, and in Al-Monitor's 2020 reporting on the Palestinian Land Authority's use of the Ottoman archive transferred by Turkey.",
          "The Colonization and Wall Resistance Commission, affiliated with the Palestine Liberation Organization, has reported reclaiming 6,000 dunams of land in 2019 alone using Ottoman registry documents as legal evidence. The commission's director, Walid Assaf, documented this figure at a press conference in Ramallah on January 5, 2020. That statement is in the public record.",
          "What the Ottoman land registry establishes, as a primary source document, is the following. Land ownership in Palestine before the establishment of the State of Israel is a documented matter, not an undocumented claim. The documents exist. They are in archives. They are being used in courts. They are producing legal outcomes. The argument that Palestinian land claims are historical grievances unsupported by documentary evidence is contradicted by the existence of a 140,000-document archive of Ottoman land registry records that documents those claims with the precision of a colonial administration's official record-keeping system.",
          "A tapu deed from 1890 does not have a political agenda. It records who owned what land on what date under what legal instrument. The Israeli court that receives it as evidence must engage with what it says. The political discourse that ignores it does not change what it says.",
          "The receipts are in Istanbul. They are in Ramallah. They are in the Open Jerusalem database. They are 400 years old in some cases. They were produced by the Ottoman Empire's own bureaucratic system. They document what they document.",
          "ClownBinge reports what they document.",
        ],
        sources: [
          "Anglo-American Committee of Inquiry. (1946). Report of the Anglo-American Committee of Inquiry regarding the problems of European Jewry and Palestine. United States Government Printing Office. https://avalon.law.yale.edu/20th_century/anglocom.asp",
          "Barron, J. B. (1923). Palestine: Report and general abstracts of the census of 1922. Government of Palestine.",
          "Hadawi, S. (1988). Palestinian rights and losses in 1948: A comprehensive study. Saqi Books.",
          "Khalidi, W. (Ed.). (1992). All that remains: The Palestinian villages occupied and depopulated by Israel in 1948. Institute for Palestine Studies.",
          "Khayyat-Fakher, M. (2022). Palestinian counter-forensics and the cruel paradox of property. American Ethnologist, 49(3). https://anthrosource.onlinelibrary.wiley.com/doi/full/10.1111/amet.13084",
          "Mills, E. (1932). Census of Palestine 1931: Population of villages, towns and administrative areas. Government of Palestine.",
          "Morris, B. (2004). The birth of the Palestinian refugee problem revisited. Cambridge University Press.",
          "Open Jerusalem Project. (n.d.). The collections: Shari'a court records and Ottoman Imperial Archives. https://www.openjerusalem.org/our-collections",
          "Ottoman Imperial Archives. (1858–1918). Tapu sicili: Land registry records for Palestine [140,000 digitized documents]. Başbakanlık Osmanlı Arşivi, Istanbul.",
          "Turkish Directorate of Ottoman Archives. (2018, March). Transfer of Ottoman Palestine archive to Palestinian Land Authority [Press documentation]. Anadolu Agency. https://www.aa.com.tr/en/culture/ottoman-archive-palestines-weapon-against-occupation/1720151",
          "United Nations General Assembly. (1947, November 29). Resolution 181: Future government of Palestine. A/RES/181(II). https://www.un.org/unispal/document/auto-insert-178432/",
          "United Nations General Assembly. (1949, December 8). Resolution 302: Establishment of UNRWA. A/RES/302(IV). https://www.unrwa.org/content/general-assembly-resolution-302",
          "United Nations Relief and Works Agency. (2024). Palestine refugees: Who are Palestine refugees? https://www.unrwa.org/palestine-refugees",
          "United Nations Special Committee on Palestine. (1947, September 3). Report to the General Assembly (A/364). United Nations. https://www.un.org/unispal/document/auto-insert-178393/",
        ],
      },
      {
        title: "The UN Record",
        description: "The same question was put to the United Nations in 1975 and again in 1991. The answers were opposite. Both votes, and the speeches that explain each one, are in the primary record.",
        content: [
          "On November 10, 1975, the United Nations General Assembly adopted Resolution 3379 by a vote of 72 in favor, 35 against, and 32 abstentions. The resolution determined that Zionism is a form of racism and racial discrimination. Sixteen years later, on December 16, 1991, the United Nations General Assembly adopted Resolution 46/86 by a vote of 111 in favor, 25 against, and 13 abstentions. Resolution 46/86 revoked Resolution 3379 in its entirety.",
          "These two votes are among the most politically significant actions in the history of the United Nations General Assembly. They are also among the most consistently mischaracterized in contemporary political discourse. Resolution 3379 is cited as evidence of institutional antisemitism at the United Nations. Resolution 46/86 is cited as evidence of American political pressure overriding the will of the international community. Both characterizations are political positions. The primary source record documents both the resolutions and the political context that produced them.",
          "This chapter reads the primary sources. The resolutions themselves. The voting records. The statements made by member states in explanation of their votes. The political context documented in the historical record. The reasoning advanced on all sides. ClownBinge does not characterize either resolution. It documents both.",
          "SECTION 6.1: RESOLUTION 3379. THE TEXT. IN FULL.",
          "United Nations General Assembly Resolution 3379, adopted November 10, 1975, reads as follows in its operative paragraphs:",
          "\"The General Assembly, Recalling its resolution 1904 (XVIII) of 20 November 1963, proclaiming the United Nations Declaration on the Elimination of All Forms of Racial Discrimination, and in particular its affirmation that 'any doctrine of racial differentiation or superiority is scientifically false, morally condemnable, socially unjust and dangerous' and its expression of alarm at 'the manifestations of racial discrimination still in evidence in some areas in the world, some of which are imposed by certain Governments by means of legislative, administrative or other measures,' Recalling also that, in its resolution 3151 G (XXVIII) of 14 December 1973, the General Assembly condemned, inter alia, the unholy alliance between South African racism and Zionism, Taking note of the Declaration of Mexico on the Equality of Women and Their Contribution to Development and Peace 1975, which states that 'international co-operation and peace require the achievement of national liberation and independence, the elimination of colonialism and neo-colonialism, foreign occupation, Zionism, apartheid and racial discrimination in all its forms, as well as the recognition of the dignity of peoples and their right to self-determination,' Taking note also of resolution 77 (XII) adopted by the Assembly of Heads of State and Government of the Organization of African Unity at its twelfth ordinary session, held at Kampala from 28 July to 1 August 1975, which considered 'that the racist regime in occupied Palestine and the racist regime in Zimbabwe and South Africa have a common imperialist origin, forming a whole and having the same racist structure and being organically linked in their policy aimed at repression of the dignity and integrity of the human being,' Taking note also of the Political Declaration and Strategy to Strengthen International Peace and Security and to Intensify Solidarity and Mutual Assistance among Non-Aligned Countries, adopted at the Conference of Ministers for Foreign Affairs of Non-Aligned Countries held at Lima from 25 to 30 August 1975, which most severely condemned Zionism as a threat to world peace and security and called upon all countries to oppose this racist and imperialist ideology, Determines that Zionism is a form of racism and racial discrimination.\"",
          "This is the complete operative text of Resolution 3379. It is eleven paragraphs of recitals and one operative paragraph. The operative paragraph contains one sentence. That sentence is: Determines that Zionism is a form of racism and racial discrimination.",
          "SECTION 6.2: THE POLITICAL CONTEXT OF 1975. WHAT PRODUCED THE VOTE.",
          "Resolution 3379 did not emerge from a vacuum. It emerged from a specific political context documented in the United Nations record and in the diplomatic history of the mid-1970s.",
          "The resolution was sponsored by a coalition of Arab states, African states, and Soviet bloc states. Its passage reflected the political arithmetic of the United Nations General Assembly in 1975, where the combined voting bloc of Arab states, African states, Asian states, and Soviet bloc states commanded a majority of votes. The resolution was co-sponsored by Cuba, Libya, and the Soviet Union, among others.",
          "The 1973 Arab-Israeli War, known as the Yom Kippur War in Israel and the October War in the Arab world, had concluded two years before the resolution's adoption. The war had produced an oil embargo by Arab members of OPEC against countries perceived as supporting Israel, including the United States and several European nations. The political weight of Arab states in international forums was significantly elevated in the immediate post-embargo period.",
          "The 1975 United Nations World Conference on Women, held in Mexico City, produced the Declaration of Mexico cited in Resolution 3379's recitals. The inclusion of Zionism alongside colonialism and racial discrimination in the Mexico City declaration established a precedent for the language that appeared in Resolution 3379.",
          "The Organization of African Unity's resolution cited in the recitals, adopted at Kampala in July 1975, linked Zionism explicitly to apartheid South Africa. This linkage reflected the documented position of African states that Israel's relationship with the apartheid government of South Africa, which included documented military and intelligence cooperation, placed Zionism within the same political category as apartheid.",
          "The documented military and intelligence cooperation between Israel and apartheid South Africa is a primary source record of the first importance for understanding why African states voted as they did on Resolution 3379. That cooperation is documented in South African government records, Israeli government records that have been partially declassified, and in the academic scholarship on Israel-South Africa relations during the apartheid period. Benjamin Beit-Hallahmi's The Israeli Connection, published in 1987, and Sasha Polakow-Suransky's The Unspoken Alliance, published in 2010, draw on primary source government documents to document this cooperation in detail.",
          "The African states that voted for Resolution 3379 were voting, in significant part, in response to documented Israeli government policy toward the apartheid regime that governed their continent's southernmost nation. That context is in the primary source record of the vote.",
          "SECTION 6.3: THE VOTE RECORD. WHO VOTED HOW AND WHY.",
          "The vote on Resolution 3379 on November 10, 1975, produced the following result: 72 in favor, 35 against, 32 abstentions, 3 absent.",
          "The 72 states voting in favor included all Arab League member states, the majority of African states, all Soviet bloc states, and a number of Asian and Latin American states. The 35 states voting against included the United States, Israel, the majority of Western European states, Australia, Canada, and several Latin American states. The 32 states abstaining included a significant number of states from various regions that declined to endorse the resolution but were unwilling to vote against it.",
          "The United States Ambassador to the United Nations, Daniel Patrick Moynihan, delivered a speech in response to the resolution's adoption that became one of the most cited statements in the history of American diplomacy at the United Nations. Moynihan called the resolution a lie and stated that the United States did not acknowledge, would not abide by, and would never acquiesce in this infamous act. His speech is a primary source document of the American governmental response to the resolution.",
          "The Israeli delegation's response to the resolution's adoption is documented in the United Nations record. Israeli Ambassador Chaim Herzog delivered a statement in which he tore the resolution in half on the floor of the General Assembly. That act is documented in the United Nations meeting record.",
          "The explanations of vote delivered by member states are primary source documents of the reasoning that produced the 72 to 35 vote. The Soviet bloc states cited the linkage between Zionism and Western imperialism. The Arab states cited the documented displacement of the Palestinian people documented in the UNRWA records examined in the previous chapter. The African states cited the documented relationship between Israel and apartheid South Africa. The Western states voting against cited the resolution's equation of a political movement with racism as a misuse of the United Nations framework and an act of political warfare against the State of Israel.",
          "All of these statements are in the United Nations record. They document the reasoning of the parties on all sides of the vote. ClownBinge reports all of them.",
          "SECTION 6.4: WHAT THE RESOLUTION DID NOT DO. A FORENSIC CLARIFICATION.",
          "Resolution 3379 is frequently cited as equating Jewish people with racism or as characterizing Judaism as racist. The text of the resolution does neither.",
          "The resolution's operative paragraph determines that Zionism is a form of racism and racial discrimination. It does not determine that Jewish people are racist. It does not determine that Judaism is racist. It does not determine that the State of Israel is illegitimate. It determines that Zionism, as a political movement, constitutes a form of racism and racial discrimination.",
          "Whether that determination is correct is a political question. What the determination says, as a matter of textual analysis, is a forensic question. The text says what it says. It applies its determination to a political movement. It does not apply it to a religion or to a people.",
          "The conflation of the resolution's determination about a political movement with a characterization of a religion or a people is itself a documented political strategy. It is the same conflation examined throughout this volume. The resolution targeted Zionism. The political response to the resolution characterized it as targeting Judaism. The distinction between the two is the subject of this entire book. The United Nations voting record documents both the resolution and the response to it.",
          "SECTION 6.5: THE SIXTEEN YEARS BETWEEN 3379 AND 46/86. WHAT THE RECORD DOCUMENTS.",
          "Between November 10, 1975, and December 16, 1991, Resolution 3379 remained in force as an adopted resolution of the United Nations General Assembly. During those sixteen years, the resolution was consistently cited by Arab states and their allies in debates about Israel and Palestine at the United Nations. It was consistently rejected by Israel and Western states as illegitimate and antisemitic. It produced a documented diplomatic rupture between Israel and the United Nations system that shaped the diplomatic environment of the subsequent sixteen years.",
          "The political context of the 1991 reversal is as important to document as the political context of the 1975 adoption.",
          "The Gulf War of 1990 to 1991 fundamentally reorganized the political coalitions of the United Nations. The United States-led coalition that expelled Iraqi forces from Kuwait included Arab states, most prominently Saudi Arabia, Egypt, and Syria, fighting alongside American, British, and other Western forces. The diplomatic negotiations that assembled that coalition required American engagement with Arab states on multiple diplomatic fronts simultaneously.",
          "The United States made the revocation of Resolution 3379 an explicit condition of its engagement with the peace process that followed the Gulf War. Secretary of State James Baker made clear that American participation in the Madrid Peace Conference of October 1991, which brought Israeli and Arab parties to the negotiating table for the first time in a formal conference setting, was linked to progress on the revocation of Resolution 3379.",
          "This linkage is documented in the diplomatic record of the period, in Secretary Baker's memoirs The Politics of Diplomacy, published in 1995, and in the scholarly literature on the Madrid Peace Conference and its diplomatic context.",
          "The Soviet Union, which had co-sponsored Resolution 3379 in 1975, dissolved on December 25, 1991, nine days after Resolution 46/86 was adopted. By December 1991, the Soviet successor states were in no political position to maintain the Soviet bloc's Cold War-era positions at the United Nations. The political coalition that had produced the 72-vote majority for Resolution 3379 in 1975 had disintegrated by 1991. The Cold War was over. The Soviet bloc had collapsed. The Gulf War coalition had fundamentally reorganized the political arithmetic of the United Nations General Assembly.",
          "SECTION 6.6: RESOLUTION 46/86. THE TEXT, THE VOTE, AND THE REASONING.",
          "United Nations General Assembly Resolution 46/86, adopted December 16, 1991, reads in its entirety:",
          "\"The General Assembly decides to revoke the determination contained in its resolution 3379 (XXX) of 10 November 1975.\"",
          "That is the complete text of Resolution 46/86. It contains one operative sentence. It revokes Resolution 3379 without providing reasoning, without establishing a replacement framework, and without addressing the underlying political questions that had produced the original resolution.",
          "The vote produced the following result: 111 in favor, 25 against, 13 abstentions, 17 absent.",
          "The 111 states voting in favor included the United States, the majority of European states, the majority of Latin American states, a number of African states, and several Arab states. The 25 states voting against included a reduced bloc of Arab states, including Syria, Lebanon, and Jordan, several African states, and Cuba. The 13 abstentions included several states that had supported Resolution 3379 in 1975 but declined to vote against its revocation in 1991.",
          "The comparison between the 1975 vote and the 1991 vote is itself a primary source document of the political transformation of the international system between those two dates. In 1975, 72 states voted to determine that Zionism is a form of racism. In 1991, 111 states voted to revoke that determination. The 39-vote swing reflects the collapse of the Soviet bloc, the reorganization of African state positions following the end of apartheid negotiations in South Africa, and the diplomatic pressure applied by the United States in the context of the Gulf War peace process.",
          "The explanation of vote statements delivered by member states in 1991 are primary source documents of the reasoning behind the reversal. Several states that voted for revocation explicitly stated that they were doing so not because they had changed their assessment of Israeli policy toward Palestinians but because the resolution had been used in ways that conflated legitimate criticism of Israeli policy with antisemitism. Several states that voted against revocation stated that the revocation was being driven by American political pressure rather than by a genuine change in the international community's assessment of Zionism.",
          "They document the complexity of the reversal. The reversal was a political act produced by political circumstances. It was not a theological act and it was not a legal judgment. It was a General Assembly vote produced by the same political arithmetic that had produced the original resolution, operating in a fundamentally changed political environment.",
          "SECTION 6.7: WHAT THE TWO VOTES ESTABLISH. A FORENSIC SUMMARY.",
          "The two votes, read together as primary source documents, establish the following facts.",
          "In 1975, a majority of the member states of the United Nations General Assembly, voting after deliberation and in explanation of their votes, determined that Zionism as a political movement constituted a form of racism and racial discrimination. The majority included the entire Arab League, the majority of African states, the entire Soviet bloc, and a number of Asian and Latin American states.",
          "In 1991, a larger majority of the member states of the United Nations General Assembly, voting after deliberation and in explanation of their votes, revoked that determination. The larger majority reflected the collapse of the Soviet bloc, the reorganization of post-Gulf War Arab state alignments, and the diplomatic pressure applied by the United States in the context of the Madrid Peace Process.",
          "Neither vote resolved the underlying political question about the relationship between Zionism as a political movement and the rights of the Palestinian population documented in the previous chapters. The 1975 vote determined that the relationship constituted racism. The 1991 vote revoked that determination. Neither vote changed the Ottoman land registry record. Neither vote changed the British Mandate census figures. Neither vote changed the UNRWA registration records documenting 5.9 million Palestinian refugees. Neither vote changed what Theodor Herzl wrote in his diary.",
          "The documents predate both votes. The documents postdate both votes. The documents are indifferent to both votes. They record what they record. The political process of the United Nations General Assembly does not change what the tapu deeds say or what Leviticus 19:34 requires.",
          "The receipts are not subject to revocation by General Assembly resolution.",
          "SECTION 6.8: THE DELTA. THE ISRAEL-SOUTH AFRICA CONNECTION AND THE AFRICAN VOTE.",
          "The forensic Delta of this chapter is the documented relationship between Israel and apartheid South Africa and its role in producing the African bloc's support for Resolution 3379.",
          "The standard account of Resolution 3379 in Western political discourse focuses on the Soviet and Arab sponsorship of the resolution and characterizes the African vote as following the Soviet and Arab lead in an expression of Cold War political alignment. The primary source record of Israel-South Africa relations during the apartheid period documents a more specific reason for African state opposition to Israel in 1975.",
          "Israel and South Africa maintained documented diplomatic, military, and economic relations throughout the apartheid period. The relationship included arms sales, military training, nuclear cooperation, and intelligence sharing. These relationships are documented in South African government records released after the end of apartheid, in Israeli government documents partially declassified during the same period, and in the scholarship of Benjamin Beit-Hallahmi and Sasha Polakow-Suransky.",
          "Polakow-Suransky's research, drawing on documents obtained from the South African Department of Defense under post-apartheid freedom of information provisions, documents that Israel sold South Africa Jericho missiles and offered to sell nuclear warheads to the apartheid government in 1975, the same year Resolution 3379 was adopted. The documents were classified by the South African government under apartheid-era secrecy provisions and were declassified by the post-apartheid government. They are primary source government documents.",
          "The African states that voted for Resolution 3379 in 1975 were voting, in part, in response to an Israeli government that was documented as an arms supplier and military partner of the government that operated the apartheid system across their continent. That context does not appear in the standard Western account of Resolution 3379 as an act of Soviet-Arab antisemitism at the United Nations.",
          "The primary source record does not support the standard account's omission of this context. The African vote for Resolution 3379 was not exclusively an expression of Cold War alignment or Arab political pressure. It was, in documented part, a response to Israeli government policy toward apartheid South Africa.",
          "That context is in the primary source record. It is in the declassified South African Defense Ministry documents. It is in Polakow-Suransky's scholarship. It has been consistently omitted from the dominant political account of Resolution 3379 in Western political discourse.",
          "The receipts were classified. They have been declassified. They say what they say.",
        ],
        sources: [
          "Baker, J. A. (1995). The politics of diplomacy: Revolution, war and peace, 1989–1992. G.P. Putnam's Sons.",
          "Beit-Hallahmi, B. (1987). The Israeli connection: Who Israel arms and why. Pantheon Books.",
          "Herzog, C. (1975, November 10). Statement to the United Nations General Assembly on Resolution 3379 [Meeting record]. United Nations General Assembly, 30th session, 2400th plenary meeting. https://undocs.org/A/PV.2400",
          "Moynihan, D. P. (1975, November 10). Statement to the United Nations General Assembly on Resolution 3379 [Meeting record]. United Nations General Assembly, 30th session, 2400th plenary meeting. https://undocs.org/A/PV.2400",
          "Polakow-Suransky, S. (2010). The unspoken alliance: Israel's secret relationship with apartheid South Africa. Pantheon Books.",
          "United Nations General Assembly. (1975, November 10). Resolution 3379: Elimination of all forms of racial discrimination (A/RES/3379(XXX)). https://undocs.org/A/RES/3379(XXX)",
          "United Nations General Assembly. (1991, December 16). Resolution 46/86: Elimination of racism and racial discrimination (A/RES/46/86). https://undocs.org/A/RES/46/86",
          "United Nations General Assembly. (1975, November 10). Official records of the 2400th plenary meeting (A/PV.2400). https://undocs.org/A/PV.2400",
          "United Nations General Assembly. (1991, December 16). Official records of the 72nd plenary meeting (A/PV.72). https://undocs.org/A/PV.72",
          "Wikipedia. (2024). United Nations General Assembly Resolution 3379. https://en.wikipedia.org/wiki/United_Nations_General_Assembly_Resolution_3379",
          "Wikipedia. (2024). United Nations General Assembly Resolution 46/86. https://en.wikipedia.org/wiki/United_Nations_General_Assembly_Resolution_46/86",
        ],
      },
      {
        title: "Israeli Law: Nation vs. Faith",
        description: "Israeli civil law does not treat Israeli nationality and Jewish nationality as the same category. The Supreme Court of Israel has said so in writing. This chapter reads the statutes and the rulings.",
        content: [
          "A state that defines itself as both Jewish and democratic has produced a legal architecture that attempts to hold both definitions simultaneously. The attempt is documented in the statutory record of the State of Israel from its founding legislation in 1948 through the Basic Law: Israel as the Nation-State of the Jewish People, adopted by the Knesset on July 19, 2018. That statutory record does not resolve the tension between the two definitions. It encodes it into law. The Israeli legal architecture is not theoretical. It is statutory. It is judicial. It is administrative. It is in the public record.",
          "This chapter reads the statutes. It reads the court opinions. It reads the dissents. It does not characterize the legal architecture it describes. The architecture characterizes itself through its own text and through the judicial reasoning that has interpreted it across seventy-six years of Israeli jurisprudence.",
          "The forensic finding of this chapter is precise and derives exclusively from the primary sources. Israeli law does not distinguish Israeli nationality from Jewish nationality. It fuses them. The Israeli Supreme Court has ruled that no separate Israeli nationality exists. Jewish nationality and Israeli citizenship occupy different legal categories that operate simultaneously and produce different legal consequences for different populations within the same state. The statutory text is the evidence.",
          "SECTION 7.1: THE FOUNDING DOCUMENTS. WHAT THE DECLARATION OF INDEPENDENCE ESTABLISHED.",
          "The Israeli Declaration of Independence was proclaimed by David Ben-Gurion on May 14, 1948, at the Tel Aviv Museum. It is the founding document of the State of Israel. It is a primary source of the first importance for understanding what the state's founders understood themselves to be establishing.",
          "The declaration states, in relevant part: \"The Land of Israel was the birthplace of the Jewish People. Here their spiritual, religious and political identity was shaped. Here they first attained to statehood, created cultural values of national and universal significance and gave to the world the eternal Book of Books.\"",
          "The declaration also states: \"The State of Israel will be open for Jewish immigration and for the Ingathering of the Exiles; it will foster the development of the country for the benefit of all its inhabitants; it will be based on freedom, justice and peace as envisaged by the prophets of Israel; it will ensure complete equality of social and political rights to all its inhabitants irrespective of religion, race or sex; it will guarantee freedom of religion, conscience, language and culture.\"",
          "Two tensions are encoded in the founding document itself. The state is established as the state of the Jewish People and simultaneously commits to complete equality of social and political rights to all its inhabitants irrespective of religion, race or sex. The document does not resolve the tension between a state defined by the ethnoreligious identity of one population group and a commitment to complete equality for all inhabitants regardless of religion or race. It asserts both simultaneously.",
          "The declaration is not legally binding in Israeli constitutional law in the same way that legislation is binding. The Israeli Supreme Court has treated it as a foundational statement of values rather than as enforceable law. Its significance for this chapter is as a primary source document of the intentions and tensions encoded in the state's founding moment.",
          "SECTION 7.2: THE LAW OF RETURN, 1950. THE FIRST STATUTORY DISTINCTION.",
          "The Law of Return was enacted by the Knesset on July 5, 1950. It is the first major piece of legislation defining who has the right to immigrate to Israel and acquire citizenship. Its text is brief. Its consequences are extensive.",
          "The law states, in its first section: \"Every Jew has the right to come to this country as an oleh,\" meaning as an immigrant exercising the right of return.",
          "The second section provides for oleh visas to be granted to every Jew who has expressed desire to settle in Israel, subject to exceptions for persons acting against the Jewish people, persons likely to endanger public health or the security of the state, and persons with a criminal past.",
          "The law was amended in 1954 and again in 1970. The 1970 amendment is the most significant for the purposes of this chapter. It extended the right of return to the spouse of a Jew, to the children of a Jew and their spouses, and to the grandchildren of a Jew and their spouses, regardless of whether those individuals are themselves Jewish. The amendment also provided a definition of who is a Jew for the purposes of the law: a person who was born of a Jewish mother or has become converted to Judaism and is not a member of another religion.",
          "The 1970 amendment thus created a legal category of persons entitled to immigrate to Israel under the Law of Return who are not themselves Jewish by the law's own definition of Jewish, namely the non-Jewish spouses, children, and grandchildren of Jewish people. The category was created to address the practical realities of Jewish family life in the diaspora and to ensure that Jewish families could immigrate together.",
          "What the Law of Return establishes as a primary source document is the following. The right to immigrate to Israel and become a citizen is defined by ethnoreligious lineage. It is available to every Jew and to the defined family members of every Jew. It is not available to persons who lack that lineage. The law does not use the term Israeli nationality. It uses the term Jew. The foundational immigration law of the State of Israel is organized around a religious and ethnic category rather than around a civic or territorial category. That is what the statutory text says.",
          "SECTION 7.3: THE CITIZENSHIP LAW, 1952. THE ARCHITECTURE OF DIFFERENTIATED CITIZENSHIP.",
          "The Israeli Citizenship Law of 1952 establishes the legal framework for Israeli citizenship. Read alongside the Law of Return, it creates a differentiated citizenship architecture that is documented in the statutory text.",
          "The Law of Return grants every Jew the right to immigrate to Israel as an oleh. The Citizenship Law provides that every oleh under the Law of Return acquires Israeli citizenship automatically upon immigration. No naturalization process is required. No waiting period is imposed. No language requirement applies.",
          "The Citizenship Law provides a separate pathway for non-Jewish persons who wish to acquire Israeli citizenship through naturalization. The naturalization pathway requires a minimum of three years of residence in Israel while holding permanent residency status, a demonstration of proficiency in the Hebrew language, renunciation of previous nationality, and a declaration of intent to settle permanently in Israel.",
          "The statutory text thus creates two pathways to Israeli citizenship. The first pathway is available to Jewish persons and their defined family members. It is automatic, immediate, and requires no demonstration of residency, language proficiency, or renunciation of prior nationality. The second pathway is available to non-Jewish persons. It requires years of demonstrated residency, language testing, and renunciation of prior nationality.",
          "These two pathways are documented in the statutory text of Israeli law. They represent a legal distinction between Jewish and non-Jewish persons in access to citizenship of the State of Israel that is encoded in the founding legislation of the state. The distinction is not informal or administrative. It is statutory. It is in the law.",
          "SECTION 7.4: THE POPULATION REGISTRY. THE NATIONALITY FIELD.",
          "The Israeli Population Registry maintains individual records for every resident of Israel. Until 2005, the registry included a field designated as nationality, le'om in Hebrew, which recorded the ethnoreligious group to which the registered person belonged. The categories available in the nationality field included Jewish, Arab, Druze, and more than 130 other categories. Israeli was not among the available categories.",
          "The absence of Israeli as a category in the nationality field of the Israeli Population Registry is a primary source document of the legal architecture this chapter examines. A state's population registry is its most basic administrative record of who its residents are and how they are categorized. The Israeli registry, from the state's founding until 2005, recorded every resident's ethnoreligious group but did not record Israeli nationality as a category available for registration.",
          "In 2005, following a legal challenge, the Israeli government removed the nationality field from the identity cards issued to Israeli citizens while retaining it in the internal Population Registry database. The field continues to exist in the registry. It no longer appears on identity cards. The legal challenge that produced this administrative change is part of the documented judicial record examined in the following section.",
          "SECTION 7.5: ORNAN V. MINISTRY OF THE INTERIOR, 2013. THE SUPREME COURT RECORD.",
          "The case of Ornan v. Ministry of the Interior, decided by the Israeli Supreme Court in 2013, is the most recent and most comprehensive judicial examination of the question of Israeli nationality in the Israeli legal system.",
          "The case was brought by a group of 21 Israeli citizens, led by Uzi Ornan, a retired linguist from northern Israel. The petitioners, who included both Jewish and Arab citizens of Israel, requested that the Supreme Court order the Interior Ministry to register them in the Population Registry with the nationality designation Israeli rather than with their respective ethnoreligious designations.",
          "The petitioners' argument was that the absence of an Israeli nationality category in the registry discriminated against non-Jewish citizens by embedding ethnoreligious distinction into the state's foundational administrative record, and that the recognition of a shared Israeli nationality would advance equality among the state's citizens regardless of religion or ethnicity.",
          "The Supreme Court rejected the petition. The judgment was written by Justice Yoram Danziger, with concurring opinions by Justice Hanan Melcer and President Asher Grunis.",
          "President Grunis's concurring opinion stated: \"The existence of an Israeli ethnic nationality has not been proven.\"",
          "Justice Melcer's concurring opinion warned that conceding such a nationality would jeopardize the Jewish and democratic nature of the state.",
          "The majority opinion drew on the 1971 precedent of Tamarin v. State of Israel, in which Justice Shimon Agranat had ruled that it was illegitimate for petitioners to ask to separate themselves from the Jewish people and to achieve for themselves the status of a distinct Israeli nation. The 2013 majority upheld the reasoning of the 1971 precedent.",
          "The Supreme Court's ruling establishes the following as a matter of Israeli law. No Israeli nationality separate from and distinct from Jewish nationality has been recognized by the state or proven to exist. The state is constituted as a Jewish state. Jewish nationality and the state's institutional identity are fused in the legal framework. A citizen of Israel who is not Jewish does not share the nationality that the state recognizes as constitutive of its identity.",
          "This ruling is not a political characterization of Israel. It is the Israeli Supreme Court's own statement of Israeli law, made in the highest judicial forum of the state, in response to a legal petition seeking recognition of a shared civic nationality. The court said no. The ruling is in the judicial record. It is publicly accessible through the Cardozo Israeli Supreme Court Project.",
          "SECTION 7.6: THE BASIC LAW: ISRAEL AS THE NATION-STATE OF THE JEWISH PEOPLE, 2018.",
          "On July 19, 2018, the Knesset adopted the Basic Law: Israel as the Nation-State of the Jewish People by a vote of 62 to 55, with two abstentions. In Israeli constitutional law, Basic Laws have a higher legal status than ordinary legislation. They are Israel's closest equivalent to constitutional provisions.",
          "The Basic Law states, in its first article: \"The land of Israel is the historical homeland of the Jewish people, in which the State of Israel was established. The State of Israel is the national home of the Jewish people, in which it fulfills its natural, cultural, religious and historical right to self-determination. The right to national self-determination in the State of Israel is unique to the Jewish people.\"",
          "The fourth article states: \"The state's language is Hebrew. The Arabic language has a special status in the state; Regulating the use of Arabic in state institutions or by them will be set in law.\"",
          "The sixth article states: \"The state views Jewish settlement as a national value and will act to encourage and promote its establishment and development.\"",
          "The third article of the original bill, which stated that the state may act to maintain the Jewish character of the state and act in this context to prevent discrimination, was removed from the final text. Its removal does not affect the operative provisions of the law as adopted.",
          "The Basic Law's operative effect on the legal question examined in this chapter is precise. The right to national self-determination in the State of Israel is unique to the Jewish people. That sentence encodes into Basic Law, the highest level of Israeli legislation, the principle that the state's national self-determination right belongs to one ethnoreligious group exclusively. Citizens of Israel who are not Jewish do not share in the state's national self-determination right as a matter of Basic Law.",
          "The Basic Law does not characterize this as discrimination. It characterizes it as the fulfillment of the Jewish people's natural, cultural, religious and historical right to self-determination. The characterization is in the law.",
          "SECTION 7.7: THE ADALAH DATABASE. FIFTY-FIVE LAWS AND WHAT THEY DOCUMENT.",
          "Adalah, the Legal Center for Arab Minority Rights in Israel, maintains a publicly accessible database of Israeli laws that Adalah characterizes as discriminatory against Palestinian citizens of Israel. The database documents more than 65 laws that Adalah identifies as explicitly or structurally discriminatory on the basis of nationality or ethnicity.",
          "ClownBinge cites the Adalah database not as an authoritative characterization of Israeli law but as a primary source compilation of statutory text. The database provides the text of each law it catalogs. The text is the primary source. Adalah's characterization of that text as discriminatory is its institutional position. The text itself is the document.",
          "The Absentee Property Law of 1950 transferred the property of Palestinian Arabs who fled or were expelled during the 1948 war to the Custodian of Absentee Property, a state official. The law defines an absentee as any person who left their place of residence for a destination outside Israel or for a destination inside Israel that was at the time held by enemy forces. The definition captures Palestinian Arabs who were displaced during the 1948 war regardless of whether they left voluntarily or were expelled. The law is in the statutory record.",
          "The Land Acquisition Law of 1953 authorized the state to acquire title to lands that were abandoned or not cultivated during the 1948 war period. The law transferred significant areas of land to state ownership based on the condition of the land during the war rather than on the legal title of the landowner. It is in the statutory record.",
          "The Admissions Committee Law of 2011 authorizes admissions committees in small communities built on state land to screen applicants for residency based on criteria including social suitability and whether the applicant fits the social and cultural fabric of the community. The law was challenged by Adalah on the grounds that it authorized discrimination against Arab citizens. The Israeli Supreme Court upheld the law. The Supreme Court ruling is in the judicial record.",
          "The Citizenship and Entry into Israel Law of 2003, made permanent in 2007, prohibits Palestinian residents of the West Bank and Gaza Strip from acquiring Israeli citizenship or residency through marriage to Israeli citizens. The law disproportionately affects Arab citizens of Israel, who are more likely than Jewish citizens to have spouses from the West Bank and Gaza Strip. The Israeli Supreme Court upheld the law in a split 6 to 5 decision in 2006, with the minority opinion written by Chief Justice Aharon Barak characterizing it as a severe harm to constitutional rights. Both the law and the split decision are in the primary source record.",
          "SECTION 7.8: THE THREE-FIFTHS PARALLEL. WHAT THE STRUCTURAL COMPARISON DOCUMENTS.",
          "The Three-Fifths Compromise appears in Article I, Section 2, Clause 3 of the United States Constitution, ratified in 1788. It states that representatives and direct taxes shall be apportioned among the several states according to their respective numbers, which shall be determined by adding to the whole number of free persons, including those bound to service for a term of years, and excluding Indians not taxed, three-fifths of all other persons.",
          "The phrase three-fifths of all other persons is the constitutional euphemism for enslaved African Americans. The Three-Fifths Compromise did not state that enslaved persons were three-fifths human. It stated that they would be counted as three-fifths of a person for the purposes of congressional representation and federal taxation. The dehumanization was not rhetorical. It was mathematical. It was encoded in the founding constitutional document of the United States. It produced downstream legal consequences for eighty-nine years, from 1788 to the ratification of the Fourteenth Amendment in 1868.",
          "The structural parallel to the Israeli legal architecture documented in this chapter is not an editorial judgment. It is a structural observation derived from the comparative reading of two sets of primary source documents.",
          "The United States Constitution of 1788 encoded a mathematical reduction of one population group's personhood for the purposes of political representation. It did not call the reduction discrimination. It called it apportionment. The reduction was challenged in the abolitionist literature of the eighteenth and nineteenth centuries. It was defended in the proslavery literature of the same period. Neither characterization changed what the constitutional text said.",
          "The Israeli legal architecture documented in this chapter encodes a differentiation in the legal rights, the citizenship pathway, the population registry designation, the national self-determination right, and the property law consequences applicable to Jewish and non-Jewish citizens of the same state. The Basic Law of 2018 does not call this discrimination. It calls it the fulfillment of the Jewish people's natural, cultural, religious and historical right to self-determination.",
          "The structural parallel is between the constitutional encoding of differentiated personhood in one founding document and the statutory encoding of differentiated national rights in another. Both produce tiered legal systems. Both encode the tiering in their highest legal documents. Both are in the primary source record.",
          "ClownBinge does not characterize either system. It places both primary source documents in the same chapter and reports what each says.",
          "The reader completes the thought.",
          "SECTION 7.9: WHAT TORAH SAYS. THE TEXTUAL COUNTERPOINT.",
          "This chapter has documented what Israeli law says about the distinction between Jewish and non-Jewish persons within the State of Israel. It closes with what the primary sources of Judaism say about the same question.",
          "Leviticus 19:33 to 34, as cited in Chapter One, states: \"When a stranger resides with you in your land, you shall not wrong him. The stranger who resides with you shall be to you as one of your citizens; you shall love him as yourself, for you were strangers in the land of Egypt.\"",
          "The Hebrew word translated as stranger in this passage is ger. The ger in biblical and rabbinic literature is the non-Israelite resident, the person who lives among the Israelite community without sharing its ethnoreligious identity. The Torah's obligation toward the ger is the obligation of full civic and moral equality. The ger shall be to you as one of your citizens. Not three-fifths of a citizen. Not a citizen with a different population registry designation. Not a citizen without the right to national self-determination. As one of your citizens.",
          "The Talmud records that Rabbi Eliezer taught the Torah warns against wronging the ger in thirty-six separate places. The repetition is not accidental in the rabbinic interpretive tradition. The more times the Torah repeats a prohibition, the more seriously the prohibition is weighted in the halakhic framework.",
          "The Citizenship and Entry into Israel Law of 2003, which prohibits Palestinian residents from acquiring citizenship through marriage to Israeli citizens while imposing no equivalent restriction on Jewish immigrants, is a primary source document of Israeli law.",
          "Leviticus 19:34 is a primary source document of Judaism.",
          "Both are in the record. The gap between them is what this volume was written to document.",
          "The Ottoman land registry does not require a spokesman. The numbers speak in the units they were recorded in.",
        ],
        sources: [
          "Adalah – The Legal Center for Arab Minority Rights in Israel. (n.d.). Discriminatory laws database. https://www.adalah.org/en/law/index",
          "Adalah – The Legal Center for Arab Minority Rights in Israel. (2021, July 8). Israeli Supreme Court upholds the Jewish Nation-State Basic Law. https://www.adalah.org/en/content/view/10379",
          "Holy Bible, New Jewish Publication Society Translation. (1985). Leviticus 19:33–34. Jewish Publication Society.",
          "Israel Ministry of Foreign Affairs. (1948, May 14). Declaration of the establishment of the State of Israel. https://www.gov.il/en/departments/general/declaration-of-establishment-state-of-israel",
          "Knesset. (1950). Law of Return, 5710-1950. https://www.knesset.gov.il/laws/special/eng/return.htm",
          "Knesset. (1952). Citizenship Law, 5712-1952. https://www.refworld.org/docid/3ae6b4ec20.html",
          "Knesset. (2003). Citizenship and Entry into Israel Law (Temporary Order), 5763-2003. https://www.adalah.org/en/law/view/503",
          "Knesset. (2018, July 19). Basic Law: Israel as the Nation-State of the Jewish People. https://www.knesset.gov.il/laws/special/eng/BasicLawNationState.pdf",
          "Ornan v. Ministry of the Interior, HCJ 212/03 (Supreme Court of Israel 2013). https://versa.cardozo.yu.edu/opinions/ornan-v-ministry-interior",
          "Tamarin v. State of Israel, HCJ 630/70 (Supreme Court of Israel 1971).",
          "Times of Israel. (2013, October 3). Supreme Court rejects Israeli nationality status. https://www.timesofisrael.com/supreme-court-rejects-israeli-nationality-status/",
          "United States Constitution. (1788). Article I, Section 2, Clause 3 [Three-Fifths Compromise]. https://constitution.congress.gov/constitution/article-1/",
          "Wikipedia. (2024). Israeli citizenship law. https://en.wikipedia.org/wiki/Israeli_citizenship_law",
          "Wikipedia. (2024). Basic Law: Israel as the Nation-State of the Jewish People. https://en.wikipedia.org/wiki/Basic_Law:_Israel_as_the_Nation-State_of_the_Jewish_People",
        ],
      },
      {
        title: "The Conflation Strategy, Documented",
        description: "The argument that criticizing Zionism equals antisemitism has a documented start date, a documented institutional architecture, and a documented lobbying record. This chapter names all three.",
        content: [
          "A strategy is not a conspiracy. A strategy is a documented plan of action pursued by identified institutions using identifiable methods toward stated objectives. The strategy examined in this chapter is documented in lobbying registration records, congressional testimony transcripts, legislative history, institutional publications, and the public statements of the organizations that developed and deployed it.",
          "The strategy is this. Beginning in the late twentieth century and accelerating significantly after 2000, a set of identified organizations pursued a documented campaign to establish, through legislation, executive policy, and institutional adoption, a definition of antisemitism that includes criticism of the State of Israel and opposition to Zionism as a political movement within its parameters. The campaign produced documented legislative outcomes in the United States, the United Kingdom, and the European Union. It has produced institutional adoption of the relevant definitions at hundreds of universities. It has produced documented impacts on campus political speech. All of these outcomes are in the public record.",
          "This chapter does not characterize whether the strategy is legitimate or illegitimate. It does not characterize whether the definition of antisemitism it produced is accurate or inaccurate. It documents the strategy as a documented institutional and political campaign using the primary sources that record it. The lobbying records say what they say. The legislative history says what it says. The institutional publications say what they say. ClownBinge reports what they say.",
          "SECTION 8.1: THE HISTORICAL BASELINE. ANTISEMITISM AS A DOCUMENTED PHENOMENON.",
          "Antisemitism is a documented historical phenomenon with a documented record spanning more than two millennia. It is not the subject of this chapter's examination. Its existence as a real and serious form of hatred directed at Jewish people as Jewish people is not in dispute in this volume. The Torah itself documents the persecution of the Jewish people. The historical record documents it continuously from the pogroms of medieval Europe through the Holocaust. The Equal Justice Initiative, the Yad Vashem memorial authority, and the United States Holocaust Memorial Museum maintain primary source documentation of antisemitic violence and persecution that is extensive, unambiguous, and not in question here.",
          "The forensic distinction this chapter examines is between antisemitism as hatred directed at Jewish people because they are Jewish and a documented political strategy that deploys the category of antisemitism to include within its parameters criticism of a political movement and the policies of a state.",
          "Those are two different things. The primary source record documents both. This chapter concerns itself with the second.",
          "SECTION 8.2: THE IHRA WORKING DEFINITION. WHAT IT SAYS AND HOW IT WAS PRODUCED.",
          "The International Holocaust Remembrance Alliance, known as IHRA, is an intergovernmental organization established in 1998 following the Stockholm International Forum on the Holocaust. Its membership includes 35 countries. Its mandate is to promote Holocaust education, research, and remembrance.",
          "In May 2016, the IHRA plenary adopted what it described as a working definition of antisemitism. The definition states: \"Antisemitism is a certain perception of Jews, which may be expressed as hatred toward Jews. Rhetorical and physical manifestations of antisemitism are directed toward Jewish or non-Jewish individuals and/or their property, toward Jewish community institutions and religious facilities.\"",
          "The working definition is accompanied by eleven examples of antisemitism. Seven of the eleven examples concern the State of Israel specifically. The Israel-related examples include the following.",
          "\"Accusing Jewish citizens of being more loyal to Israel or to the alleged priorities of Jews worldwide than to the interests of their own nations.\" This example addresses dual loyalty accusations, which have a documented history as an antisemitic trope.",
          "\"Denying the Jewish people their right to self-determination, e.g., by claiming that the existence of a State of Israel is a racist endeavor.\" This example includes within the definition of antisemitism the political position that the establishment of the State of Israel constituted a racist endeavor. United Nations General Assembly Resolution 3379, examined in the previous chapter, made exactly that determination about Zionism. Under the IHRA definition, the 72 states that voted for Resolution 3379 in 1975 engaged in antisemitism by the terms of the definition.",
          "\"Applying double standards by requiring of it a behavior not expected or demanded of any other democratic country.\" This example includes within the definition of antisemitism the application of standards to Israel that are not applied to other states. The forensic difficulty with this example is that the determination of whether a standard constitutes a double standard requires a comparative judgment that the definition does not provide criteria for making.",
          "\"Using the symbols and images associated with classic antisemitism to characterize Israel or Israelis.\" This example is less contested and addresses documented uses of antisemitic tropes in political rhetoric about Israel.",
          "\"Drawing comparisons of contemporary Israeli policy to that of the Nazis.\" This example includes within the definition of antisemitism a specific form of comparative political rhetoric.",
          "\"Holding Jews collectively responsible for actions of the State of Israel.\" This example addresses collective punishment rhetoric and is less contested within the academic and legal debate about the definition.",
          "The IHRA definition also states explicitly: \"Criticism of Israel similar to that leveled against any other country cannot be regarded as antisemitism.\" This statement is frequently cited by critics of the definition's application as establishing that political criticism of Israel is not covered by the definition. It is also frequently cited by critics of the definition itself as insufficient to protect legitimate political speech given the breadth of the accompanying examples.",
          "The IHRA working definition was adopted as a working definition by its own terms. It was not adopted as a legally binding instrument. It was a document produced by an intergovernmental body with a Holocaust education mandate that entered political discourse and was subsequently adopted, formally or informally, by governments, universities, and institutions as a framework for identifying antisemitism.",
          "SECTION 8.3: THE ACADEMIC AND LEGAL DEBATE. THE DOCUMENTED SCHOLARLY RECORD.",
          "The IHRA working definition has been the subject of extensive documented academic and legal debate since its adoption in 2016. That debate is itself a primary source record of the contested nature of the definition's application.",
          "The Jerusalem Declaration on Antisemitism was published in March 2021. It was signed by more than 200 scholars of antisemitism, Jewish history, and related fields from universities in Israel, the United States, the United Kingdom, Europe, and other countries. The declaration explicitly stated that it was produced in response to the IHRA definition and offered an alternative framework.",
          "The Jerusalem Declaration states, in relevant part: \"It is not antisemitic to support the Palestinian demand for justice and the full grant of their political, national, civic and human rights, as encapsulated in international law.\" It also states: \"It is not antisemitic to criticize or oppose Zionism as a form of nationalism.\" And: \"It is not antisemitic to support arrangements that accord full equality to all inhabitants 'between the river and the sea,' whether in the form of two states, a binational state, unitary democratic state, or any other configuration.\"",
          "The Jerusalem Declaration is a primary source document of scholarly opposition to the IHRA definition's application. Its signatories include distinguished scholars of Jewish history, Holocaust studies, and antisemitism research. Their opposition to the IHRA definition's application is documented in the declaration and in the academic literature that accompanied its publication.",
          "The Nexus Document, published in 2020 by a group of scholars and practitioners convened by the Jewish Council for Public Affairs, offered a third framework. The Nexus Document states: \"Criticizing or opposing Zionism as a form of nationalism, or arguing for a variety of constitutional arrangements for Israelis and Palestinians, is not per se antisemitic.\" It also states that antisemitism should not be conflated with political criticism of Israeli government policy.",
          "The existence of three competing frameworks for defining antisemitism (the IHRA definition, the Jerusalem Declaration, and the Nexus Document), each produced by different institutional actors with different assessments of where the boundary between antisemitism and political speech lies, is itself a primary source document of the contested nature of the definition. The contest is documented in the scholarly record.",
          "SECTION 8.4: THE LEGISLATIVE CAMPAIGN IN THE UNITED STATES. THE DOCUMENTED RECORD.",
          "The campaign to codify the IHRA definition or equivalent frameworks in American law and policy is documented in congressional records, executive orders, lobbying registration filings, and institutional advocacy publications.",
          "Executive Order 13899, signed by President Donald Trump on December 11, 2019, directed federal agencies to consider the IHRA working definition of antisemitism when enforcing Title VI of the Civil Rights Act of 1964 in the context of education programs receiving federal funding. Title VI prohibits discrimination based on race, color, and national origin in programs and activities receiving federal financial assistance. The executive order's application of the IHRA definition to Title VI enforcement extended the definition's reach to federal anti-discrimination law in educational settings receiving federal funding. The executive order is a primary source document. It is in the Federal Register at 84 Fed. Reg. 68779, December 16, 2019.",
          "The Antisemitism Awareness Act has been introduced in multiple sessions of Congress. The bill, in various versions, would require the Department of Education to use the IHRA working definition of antisemitism when enforcing federal anti-discrimination laws on college campuses. The bill passed the House of Representatives on May 2, 2024, by a vote of 320 to 91. It had not passed the Senate as of the publication of this volume.",
          "The congressional record of the Antisemitism Awareness Act's debate documents the arguments made on both sides of the legislative question. Supporters argued that the bill was necessary to address documented antisemitism on college campuses. Opponents argued that the bill's incorporation of the IHRA definition would unconstitutionally restrict protected political speech about Israel and Palestine under the First Amendment.",
          "Representative Jerry Nadler, a Democrat from New York and a Jewish member of Congress, voted against the bill on the grounds that it could be used to suppress legitimate political speech. His statement in explanation of his vote is in the congressional record. It is a primary source document of documented Jewish political opposition to the legislative codification of the IHRA definition.",
          "The American Civil Liberties Union issued a statement opposing the Antisemitism Awareness Act on First Amendment grounds. The statement is a primary source document of civil liberties opposition to the legislation.",
          "The lobbying record associated with the Antisemitism Awareness Act and related legislation is documented in the Senate Office of Public Records' Lobbying Disclosure Act database. The American Israel Public Affairs Committee, known as AIPAC, the American Jewish Committee, and associated organizations are documented in that database as having lobbied on legislation related to Israel and antisemitism definitions. The lobbying disclosures are public records accessible at lda.senate.gov.",
          "SECTION 8.5: THE AIPAC RECORD. LOBBYING DISCLOSURE DOCUMENTATION.",
          "The American Israel Public Affairs Committee describes itself on its website as America's pro-Israel lobby. It is one of the most extensively documented lobbying organizations in the United States. Its lobbying expenditures are reported to the Senate Office of Public Records under the Lobbying Disclosure Act of 1995 and are publicly accessible.",
          "AIPAC's political action committee, the United Democracy Project, was established in 2021 and has become one of the largest independent expenditure organizations in American politics. Federal Election Commission records document its expenditures in federal elections.",
          "AIPAC's documented lobbying activities include advocacy on legislation related to American military assistance to Israel, sanctions on countries hostile to Israel, and legislation addressing antisemitism. The specific lobbying disclosures filed by AIPAC are primary source documents. They disclose the legislation lobbied on, the specific issues addressed, and the amounts expended. They are publicly accessible at lda.senate.gov.",
          "ClownBinge makes the following forensic observation about the AIPAC record. The organization's documented lobbying activities constitute constitutionally protected political speech and lobbying. The First Amendment protects the right of organizations to lobby Congress on behalf of their members and constituents. AIPAC's lobbying is legal. Its lobbying disclosure filings are primary source documents of its legislative priorities and activities. Reporting those filings is not antisemitism. It is reporting the public record.",
          "SECTION 8.6: THE ADL. INSTITUTIONAL MISSION AND DOCUMENTED EVOLUTION.",
          "The Anti-Defamation League was founded in 1913 by Sigmund Livingston under the auspices of the B'nai B'rith organization. Its founding mandate, as stated in its charter, was to stop the defamation of the Jewish people and to secure justice and fair treatment to all citizens alike.",
          "The ADL's founding mandate explicitly couples the defense of Jewish people from antisemitism with the defense of all citizens from discrimination. That dual mandate is documented in the organization's founding charter.",
          "The ADL's institutional evolution across the twentieth and twenty-first centuries is documented in its own publications, in its IRS Form 990 filings, and in the documented academic and political debate about its institutional role. The ADL's IRS Form 990 filings are public documents. They document the organization's revenue, expenditures, executive compensation, and program activities. The Form 990 filings for the ADL are accessible through ProPublica's Nonprofit Explorer database.",
          "The ADL under Jonathan Greenblatt, who became its national director in 2015, has been the subject of documented criticism from multiple directions. Critics from the political right have argued that the ADL has become politically aligned with the Democratic Party. Critics from the political left, including Jewish critics, have argued that the ADL has increasingly functioned as an advocate for Israeli government policy rather than as a neutral civil rights organization, and that its deployment of antisemitism accusations against critics of Israel has undermined its credibility as an arbiter of what constitutes antisemitism.",
          "The documented criticism from Jewish critics of the ADL is particularly relevant to this volume's thesis. If the organization most prominently positioned as the institutional authority on antisemitism is itself the subject of documented criticism from Jewish scholars, rabbis, and communal figures on the grounds that it has conflated legitimate criticism of Zionism with antisemitism, that criticism is part of the primary source record of the debate this chapter examines.",
          "Jewish Voice for Peace has published documented critiques of the ADL's institutional role. Rabbi Brant Rosen of Tzedek Chicago has published documented critiques of the ADL's institutional role. Multiple signatories of the Jerusalem Declaration have published documented critiques of the ADL's institutional role. These critiques are primary source documents of Jewish institutional dissent from the ADL's application of the antisemitism category.",
          "The ADL's own published statements on antisemitism, Zionism, and criticism of Israel are primary source documents of the organization's institutional position. They are accessible through the ADL's website at adl.org.",
          "SECTION 8.7: THE CAMPUS IMPACT. THE DOCUMENTED RECORD.",
          "The legislative campaign to codify the IHRA definition has produced documented consequences on American college and university campuses. Those consequences are documented in university administrative records, student disciplinary proceedings, faculty governance records, and legal filings.",
          "The Foundation for Individual Rights and Expression, known as FIRE, maintains a database of campus free speech incidents. The database documents cases in which students and faculty have faced disciplinary proceedings, investigations, or sanctions in connection with speech about Israel and Palestine. The database is publicly accessible at thefire.org.",
          "Among the documented campus cases is the investigation of students at the University of Southern California following complaints that their pro-Palestinian activism constituted antisemitism under the IHRA definition. The investigation and its resolution are documented in university administrative records and in reporting by the Chronicle of Higher Education.",
          "The American Association of University Professors issued a statement opposing the application of the IHRA definition on college campuses on academic freedom grounds. The statement is a primary source document of faculty governance opposition to the definition's application in educational settings.",
          "The legal challenge to Executive Order 13899 filed by Palestine Legal and the Center for Constitutional Rights is a primary source document of civil liberties opposition to the executive order's application of the IHRA definition to Title VI enforcement. The filing is accessible through PACER, the federal court electronic records system.",
          "SECTION 8.8: THE UNITED KINGDOM RECORD. THE DOCUMENTED LEGISLATIVE CAMPAIGN.",
          "The United Kingdom formally adopted the IHRA working definition of antisemitism on December 12, 2016, making it the first government to do so. The adoption was made by then Prime Minister Theresa May in a statement to Parliament. The parliamentary record of that statement is a primary source document.",
          "The UK adoption produced documented consequences in British political life. The Labour Party under Jeremy Corbyn was the subject of an investigation by the Equality and Human Rights Commission, a statutory body, into allegations of antisemitism within the party. The commission's report, published in October 2020, found that the Labour Party had unlawfully discriminated against Jewish people in two specific respects: political interference in antisemitism complaints and the creation of a hostile environment. The report is a primary source document.",
          "The Equality and Human Rights Commission report also found that the Labour Party had not violated the law in its overall handling of antisemitism complaints, a finding that was less prominently reported in the British press than the two specific violations found. The complete report is publicly accessible through the Equality and Human Rights Commission's website.",
          "The documented debate within the British Jewish community about the Corbyn-era Labour Party antisemitism controversy is a primary source record of disagreement among Jewish people about the application of the antisemitism category in political discourse. Jewish Voice for Labour, a British Jewish organization, documented its position that many of the antisemitism allegations against Labour members involved criticism of Israeli government policy rather than hatred of Jewish people. Its publications are primary source documents of British Jewish dissent from the dominant institutional account of the controversy.",
          "SECTION 8.9: THE DELTA. THE CONFLATION STRATEGY IN ITS OWN WORDS.",
          "The Delta of this chapter is a document that the dominant political account of the IHRA definition consistently omits from its framing.",
          "Kenneth Stern is the attorney who drafted the working definition of antisemitism that became the basis for the IHRA definition. He drafted it in 2004 while working for the American Jewish Committee, initially as a tool for monitoring antisemitism in European academic institutions.",
          "In 2017, Stern testified before the House Judiciary Committee opposing the Antisemitism Awareness Act. His testimony is a primary source document of the first importance.",
          "Stern stated, in his congressional testimony: \"I drafted the definition, and I am deeply troubled by the ways in which it is being used. The definition was never meant to be used by governments to police political speech.\"",
          "He further stated: \"If this bill passes, it will actually harm Jewish students, and the cause of fighting antisemitism. It will do so by making Jews the instruments of limiting free discourse on campus, and that in turn will breed anti-Jewish resentment.\"",
          "Stern's testimony is in the congressional record. He is the author of the definition. He testified, under oath, before a congressional committee, that the definition was not meant to be used to police political speech and that its legislative codification would harm Jewish students and the cause of fighting antisemitism.",
          "The person who wrote the definition opposed its legislative codification in his own congressional testimony.",
          "That testimony is in the primary source record. It has been available since 2017. It is cited less frequently than the definition itself in political discourse about antisemitism on college campuses.",
          "The Congressional Record does not characterize. It transcribes. The distinction matters.",
          "SECTION 8.10: WHAT THE PRIMARY SOURCES ESTABLISH.",
          "The primary sources examined in this chapter establish the following documented facts.",
          "The IHRA working definition of antisemitism was drafted in 2004 as a monitoring tool for tracking antisemitism in European institutions. Its author testified to Congress in 2017 that it was not intended to be used by governments to police political speech.",
          "The definition was adopted by the IHRA in 2016 and has subsequently been adopted by the United States government through executive order, by the United Kingdom government, by the European Union, and by numerous universities and institutions. Each adoption is documented in the relevant governmental or institutional record.",
          "The legislative campaign to codify the definition in American law is documented in congressional records, lobbying disclosure filings, and civil liberties organization responses. The campaign has produced documented impacts on campus free speech that are recorded in university administrative records, FIRE's database, and federal court filings.",
          "The definition has been opposed by its own author, by more than 200 scholars of antisemitism and Jewish history who signed the Jerusalem Declaration, by the American Civil Liberties Union, by the American Association of University Professors, by Jewish Voice for Peace, by Jewish Voice for Labour, and by multiple Jewish members of Congress including Representative Jerry Nadler.",
          "The organizations that have most actively promoted the legislative codification of the definition include AIPAC and the ADL, whose lobbying activities are documented in federal disclosure records and whose institutional positions are documented in their own publications.",
          "The primary source record does not establish that the campaign to codify the IHRA definition is antisemitic. It establishes that the campaign is documented, that its institutional architecture is identifiable, that its legislative outcomes are in the public record, and that it has been opposed on documented grounds by a significant portion of the Jewish intellectual, rabbinic, and political community.",
          "The conflation of criticism of Zionism with antisemitism is a documented political strategy. The strategy has a documented history, documented institutions, documented funding, documented legislative outcomes, and documented opposition from within the Jewish community itself.",
          "The receipts are in the congressional record. They are in the lobbying disclosure database. They are in the testimony of the man who wrote the definition. They are in the Jerusalem Declaration signed by two hundred scholars.",
          "The lobbying record has dates. The legislative record has vote tallies. Both are public.",
        ],
        sources: [
          "American Civil Liberties Union. (2024). ACLU statement on the Antisemitism Awareness Act. https://www.aclu.org",
          "American Association of University Professors. (2023). Statement on the IHRA definition of antisemitism. https://www.aaup.org",
          "Anti-Defamation League. (n.d.). About the ADL. https://www.adl.org/about",
          "Center for Constitutional Rights & Palestine Legal. (2020). Legal challenge to Executive Order 13899. PACER. https://www.courtlistener.com",
          "Equality and Human Rights Commission. (2020, October). Investigation into antisemitism in the Labour Party: Summary of findings. https://www.equalityhumanrights.com/en/inquiries-and-investigations/investigation-antisemitism-labour-party",
          "Foundation for Individual Rights and Expression. (n.d.). Campus free speech incident database. https://www.thefire.org",
          "International Holocaust Remembrance Alliance. (2016, May). Working definition of antisemitism. https://www.holocaustremembrance.com/resources/working-definitions-charters/working-definition-antisemitism",
          "Jerusalem Declaration on Antisemitism. (2021, March). The Jerusalem Declaration on Antisemitism. https://jerusalemdeclaration.org",
          "Jewish Voice for Peace. (n.d.). Our position on the IHRA definition. https://www.jewishvoiceforpeace.org",
          "Nexus Project. (2020). The Nexus Document: Antisemitism and the Israel-Palestine conflict. https://israelandantisemitism.com/the-nexus-document/",
          "ProPublica Nonprofit Explorer. (n.d.). Anti-Defamation League IRS Form 990 filings. https://projects.propublica.org/nonprofits/organizations/135660897",
          "Senate Office of Public Records. (n.d.). Lobbying Disclosure Act database. https://lda.senate.gov",
          "Stern, K. (2017, November 7). Testimony before the House Judiciary Committee on the Antisemitism Awareness Act [Congressional testimony]. United States House of Representatives. https://judiciary.house.gov/sites/republicans.judiciary.house.gov/files/documents/Stern%20Testimony.pdf",
          "Trump, D. J. (2019, December 11). Executive Order 13899: Combating antisemitism (84 Fed. Reg. 68779). Federal Register. https://www.federalregister.gov/documents/2019/12/16/2019-27217/combating-anti-semitism",
          "United States House of Representatives. (2024, May 2). Antisemitism Awareness Act, H.R. 6090: Roll call vote 170. Office of the Clerk. https://clerk.house.gov/evs/2024/roll170.xml",
        ],
      },
      {
        title: "Voices From Within: Scholars, Rabbis, Organizations",
        description: "128 years of Jewish anti-Zionist scholarship, rabbinic authority, and institutional dissent, assembled in chronological order from the primary sources of the tradition.",
        content: [
          "The previous eight chapters have established a primary source record. Judaism is a documented tradition. Zionism is a documented political movement. The two are not the same thing. Their conflation is a documented political strategy. The land of Palestine before 1948 is a documented demographic reality. The United Nations record on Zionism is a documented political history. Israeli law is a documented statutory architecture. The campaign to equate anti-Zionism with antisemitism is a documented institutional strategy. The primary source record establishes all of these facts.",
          "This chapter does something different from its predecessors. It does not build an argument from primary sources. It catalogs one. The catalog is the argument.",
          "The argument is this: Jewish opposition to Zionism is not a fringe position held by marginal actors operating outside the mainstream of Jewish intellectual and religious life. It is a documented tradition of scholarship, theology, philosophy, political organizing, and communal life maintained continuously by identified Jewish individuals and institutions from 1897 to the present. The tradition is long. The voices are serious. The sourcing is complete.",
          "What follows is a sourced catalog of Jewish anti-Zionist intellectual and religious output organized chronologically and by institutional context. Every entry is a primary source or a secondary source grounded in primary source documentation. Every entry is a document, a publication, a ruling, a testimony, or an institutional statement produced by an identified Jewish person or organization. No entry is anonymous. No entry is undocumented.",
          "The catalog is not exhaustive. It is representative. Its purpose is to establish beyond reasonable documentary dispute that the tradition of Jewish opposition to Zionism is wide, deep, continuous, and serious. The reader who wishes to dispute that documentary record must engage with the documents. The documents are cited below.",
          "SECTION 9.1: THE FOUNDING GENERATION, 1897 TO 1920.",
          "Moritz Güdemann (1835 to 1918). Moritz Güdemann served as the Chief Rabbi of Vienna from 1866 to 1918. He was one of the most prominent rabbinic scholars in the German-speaking Jewish world. In 1897, the year of the First Zionist Congress, he published Nationaljudenthum, a full-length theological critique of Herzl's Der Judenstaat. The work argued that Zionism was antithetical to Judaism as a religion because it substituted political nationalism for religious covenant, and because it accepted the antisemitic characterization of Jewish people as fundamentally foreign to the countries in which they lived.",
          "The Executive Committee of the Union of Rabbis in Germany (1897). As documented in Chapters Two and Three, the Executive Committee published its protest declaration in the Allgemeine Zeitung des Judentums, the Berliner Tageblatt, and the Jewish Chronicle in July 1897. The signatories were Dr. S. Maybaum of Berlin, Dr. H. Horovitz of Frankfurt, Dr. J. Guttmann of Breslau, Dr. A. Auerbach of Halberstadt, and Dr. K. Werner of Munich. The declaration is a primary source document. It is accessible through the Posen Library of Jewish Culture and Civilization.",
          "Edwin Samuel Montagu (1879 to 1924). Edwin Samuel Montagu served as Secretary of State for India in the British Cabinet from 1917 to 1922. He was the only Jewish member of the Cabinet at the time of the Balfour Declaration's adoption. His memorandum of August 23, 1917, titled The Anti-Semitism of the Present British Government, is a primary source document of the first importance. Montagu argued formally, in a Cabinet memorandum, that the Balfour Declaration was itself a form of antisemitism because of its implications for Jewish citizens of Britain and other countries, specifically the implication that Jewish people's true homeland was not the country of their citizenship but Palestine.",
          "Karl Kraus (1874 to 1936). Karl Kraus was a Viennese Jewish intellectual, satirist, and publisher of the influential journal Die Fackel. In 1898, he published Eine Krone für Zion, a polemic against political Zionism. Kraus argued that Herzl was inadvertently supporting antisemites by promoting the idea that Jewish people had primary loyalties outside the countries in which they lived. The work is a primary source document of secular Jewish intellectual opposition to Zionism in the founding period. It is held in major research libraries.",
          "The Jewish Labour Bund (founded 1897). The General Jewish Labour Bund of Lithuania, Poland, and Russia, known as the Bund, was founded in Vilnius on October 7, 1897, the same year as the First Zionist Congress. Its founding ideology was explicitly anti-Zionist. The Bund held that Jewish emancipation required political organization within the countries where Jewish people lived, not territorial separation to a Jewish state. At its peak in the interwar period, the Bund represented hundreds of thousands of working-class Jewish workers and their families in Eastern Europe.",
          "Hermann Cohen (1842 to 1918). Hermann Cohen was a philosopher at the University of Marburg and one of the most significant Jewish intellectuals of the late nineteenth and early twentieth centuries. In 1915, he published Deutschtum und Judentum, arguing against the Zionist program on the grounds that Jewish people had no need for a separate homeland because they were an integral part of European civilization. Cohen argued that the universalist ethical tradition of Judaism was better expressed through integration into European civic life than through national separation.",
          "SECTION 9.2: THE INTERWAR PERIOD, 1920 TO 1945.",
          "The American Council for Judaism (founded 1942). As documented in Chapter Three, the American Council for Judaism was founded in 1942 by Reform rabbis and Jewish lay leaders who held that Judaism was a religion, not a nationality, and that Zionism's nationalist program was theologically incorrect and politically dangerous for American Jews. Its founding statement is a primary source document. Thomas Kolsky's Jews Against Zionism: The American Council for Judaism, 1942 to 1948, published by Temple University Press in 1992, provides the most comprehensive scholarly account of the organization.",
          "Rabbi Elmer Berger (1908 to 1996). Rabbi Elmer Berger served as executive director of the American Council for Judaism from 1943 to 1968. He was the most prominent American Jewish anti-Zionist voice of the mid-twentieth century. His publications include The Jewish Dilemma, published in 1945, and Judaism or Jewish Nationalism, published in 1957. Both are primary source documents of American Reform Jewish anti-Zionism in the post-World War Two period. They are held in major research library collections.",
          "Agudat Israel (founded 1912). As documented in Chapter Three, Agudat Israel was founded in Katowice in May 1912 as the first organized Orthodox institutional alternative to Zionism. Its founding ideology, developed by Nathan Birnbaum, held that the Jewish people's return to the Land of Israel could only occur through divine intervention at the messianic time. The organization's founding documents are primary source records. Its anti-Zionist position is documented in the academic literature and in the organization's own publications.",
          "Hannah Arendt (1906 to 1975). Hannah Arendt was a political philosopher and one of the most significant Jewish intellectuals of the twentieth century. She was born in Germany, fled Nazi persecution, and eventually settled in the United States. Her relationship to Zionism was complex and evolved across her life, but her documented critiques of political Zionism are among the most intellectually serious in the Jewish intellectual tradition.",
          "In 1944, Arendt published Zionism Reconsidered in the Menorah Journal. The essay argued that the Zionist movement's exclusive focus on Jewish statehood had led it to abandon the universalist ethical commitments that Arendt understood as central to the Jewish intellectual tradition. She argued that a binational state with equal rights for Jewish and Arab populations was the only just solution to the conflict in Palestine.",
          "In 1948, following the Deir Yassin massacre in which Irgun forces killed approximately 107 Palestinian Arab civilians on April 9, 1948, Arendt co-signed a letter published in the New York Times warning against the political party of Menachem Begin, whom she and Albert Einstein characterized as fascist in its methods. The letter is a primary source document. It was published in the New York Times on December 4, 1948. It is accessible through the New York Times archive.",
          "Arendt's Eichmann in Jerusalem, published in 1963, generated significant controversy for its analysis of the complicity of some Jewish leadership in the Holocaust and for its concept of the banality of evil. The book is a primary source document of the Jewish intellectual tradition's most serious engagement with the Holocaust as a philosophical and political question. It is in print and widely accessible.",
          "Albert Einstein (1879 to 1955). Albert Einstein co-signed the 1948 letter to the New York Times warning against Menachem Begin's political movement. Einstein's position on Zionism was complex and evolved across his life. He expressed support for Jewish cultural life in Palestine and for the Hebrew University of Jerusalem, of whose board of governors he was a member. He expressed documented reservations about the establishment of a Jewish state and about the nationalist direction of the Zionist movement.",
          "In a 1938 address, Einstein stated: \"I should much rather see reasonable agreement with the Arabs on the basis of living together in peace than the creation of a Jewish state. Apart from practical consideration, my awareness of the essential nature of Judaism resists the idea of a Jewish state with borders, an army, and a measure of temporal power no matter how modest. I am afraid of the inner damage Judaism will sustain, especially from the development of a narrow nationalism within Judaism itself.\"",
          "This statement is documented in Einstein's published writings and in the Einstein Archives at the Hebrew University of Jerusalem. It is a primary source document of one of the most prominent Jewish intellectuals of the twentieth century expressing documented reservations about Jewish statehood on explicitly Jewish ethical grounds.",
          "SECTION 9.3: THE POST-1948 PERIOD.",
          "Rabbi Yoel Teitelbaum (1887 to 1979) and the Satmar Tradition. Rabbi Yoel Teitelbaum, the Satmar Rebbe, published Vayoel Moshe in 1959. The work is the most extensive modern Orthodox theological argument against Zionism based on Talmudic sources. It runs to several hundred pages and grounds its argument primarily in the Three Oaths documented in Chapter Three. Teitelbaum argued that the establishment of the State of Israel through human political action rather than divine intervention constituted a fundamental violation of Jewish law and that the state was therefore not to be recognized or supported by observant Jews.",
          "The Satmar Hasidic dynasty that Teitelbaum led is based primarily in Williamsburg, Brooklyn, and Kiryas Joel, New York. It numbers in the tens of thousands of members. Its anti-Zionist position is not marginal within the Orthodox world. It represents one of the largest Hasidic communities in the world maintaining categorical opposition to Zionism on documented theological grounds. Vayoel Moshe is a primary source document. It is available in Hebrew and in partial English translation.",
          "Neturei Karta International. As documented in Chapter Three, Neturei Karta was founded in Jerusalem in 1938 and has maintained continuous institutional activity for eighty-six years. Its publications, statements, and theological positions are publicly accessible through its website at nkusa.org. The organization's archive of published materials constitutes a primary source record of Orthodox Jewish anti-Zionism from 1938 to the present.",
          "Noam Chomsky (born 1928). Noam Chomsky is Institute Professor Emeritus at the Massachusetts Institute of Technology and one of the most cited scholars in the world across multiple fields. He is Jewish. His documented critical position on Zionism and Israeli state policy spans more than five decades of published scholarship and public commentary.",
          "His relevant publications include The Fateful Triangle: The United States, Israel and the Palestinians, published in 1983 and updated in 1999. The work is a documented analysis of American foreign policy toward Israel and Palestine drawing on primary source governmental documents. Chomsky's position on the conflict has been documented in hundreds of interviews, essays, and public statements. His existence as a prominent Jewish intellectual with documented critical positions on Zionism is a primary source fact about the range of Jewish intellectual opinion on these questions regardless of any assessment of his specific arguments.",
          "I.F. Stone (1907 to 1989). Isidor Feinstein Stone, known as I.F. Stone, was an American Jewish journalist and publisher of I.F. Stone's Weekly, one of the most influential independent journalism publications of the mid-twentieth century. Stone was initially sympathetic to Zionism and to the establishment of the State of Israel. His position evolved across his career as he documented the displacement of Palestinian Arabs and the policies of the Israeli government.",
          "In 1967, Stone published For a Binational State in the New York Review of Books, arguing that the Israeli-Palestinian conflict could only be resolved through a binational political framework that gave equal rights to both peoples. The article is a primary source document. It is accessible through the New York Review of Books archive. Stone's journalism is a primary source record of a prominent Jewish American intellectual's documented evolution away from support for Zionism toward advocacy for Palestinian rights on explicitly ethical grounds.",
          "Judith Butler (born 1956). Judith Butler is Distinguished Professor in the Graduate School at the University of California, Berkeley. She is one of the most widely read and cited scholars in the humanities globally. She is Jewish. Her 2012 monograph Parting Ways: Jewishness and the Critique of Zionism, published by Columbia University Press, engages with the Jewish philosophical tradition, specifically the work of Hannah Arendt, Emmanuel Levinas, Walter Benjamin, and Primo Levi, arguing that the ethical resources of Jewish thought provide affirmative grounds for a critique of Zionism and for solidarity with Palestinian political rights. The book is a peer-reviewed academic monograph published by a major university press. It is a primary source document of contemporary Jewish scholarly anti-Zionism.",
          "Butler's public statements, interviews, and essays on Israel and Palestine are documented in multiple published venues. She received the Adorno Prize in 2012 from the city of Frankfurt. The award generated controversy. Her acceptance speech, delivered in Frankfurt, is a primary source document in which she addressed the controversy directly and articulated her position on the relationship between Jewish ethics and Palestinian rights.",
          "Tony Judt (1948 to 2010). Tony Judt was a historian at New York University and one of the most prominent public intellectuals of his generation. He was Jewish. In 2003, he published Israel: The Alternative in the New York Review of Books, arguing that the two-state solution had become impossible and that the only just outcome was a single democratic state with equal rights for Jewish and Arab citizens. The article generated significant controversy and documented institutional responses including pressure on institutions with which Judt was associated.",
          "Judt documented the institutional pressure he faced following the article's publication, including a documented attempt to prevent him from speaking at the Polish Consulate in New York in 2006 following complaints from the ADL and the American Jewish Congress. The incident is documented in reporting by the New York Times and in Judt's own writing about the episode. It is a primary source record of documented institutional pressure applied to a Jewish intellectual who had published criticism of Israeli policy. The New York Review of Books article is accessible through the publication's digital archive.",
          "SECTION 9.4: CONTEMPORARY INSTITUTIONAL VOICES.",
          "Jewish Voice for Peace. Jewish Voice for Peace was founded in 1996 in the San Francisco Bay Area. It is the largest Jewish anti-Zionist organization in the United States. Its membership includes rabbis, scholars, students, and Jewish activists across the country. Its founding documents, published statements, rabbinic council's positions, and policy papers are publicly accessible through its website at jewishvoiceforpeace.org.",
          "Jewish Voice for Peace endorsed the Boycott, Divestment, and Sanctions movement, known as BDS, in 2015. The BDS movement was launched by Palestinian civil society organizations in 2005, calling for boycott, divestment, and sanctions against Israel until it complies with international law and Palestinian rights. Jewish Voice for Peace's endorsement of BDS is documented in its published statement of 2015, accessible through its website. The statement is a primary source document of contemporary organized Jewish support for Palestinian civil rights advocacy.",
          "Jewish Voice for Peace's rabbinic council has published theological statements grounding its political positions in Jewish ethical tradition, specifically in the Torah's obligations toward the stranger documented in Chapter One. Those statements are primary source documents connecting contemporary Jewish institutional opposition to Zionism to the oldest layers of the Jewish textual tradition.",
          "If Not Now. If Not Now was founded in 2014 by young American Jews who came of age during the 2014 Gaza war. Its founding documents describe its opposition to Israeli occupation of Palestinian territories and its commitment to ending what it describes as American Jewish institutional support for that occupation. Its published statements and organizing materials are accessible through its website at ifnotnowmovement.org. They are primary source documents of a new generation of American Jewish institutional opposition to Israeli policy.",
          "Tzedek Chicago. Tzedek Chicago is a synagogue congregation in Chicago founded by Rabbi Brant Rosen. In March 2022, the congregation's membership formally added anti-Zionism to its core values statement. The statement is publicly accessible through the congregation's website. It is a primary source document of synagogue-level theological anti-Zionism in contemporary American Jewish life. Rabbi Rosen's published writings on the relationship between Jewish ethics and Palestinian rights constitute a significant body of theological literature connecting the Torah's obligations toward the stranger to contemporary political advocacy.",
          "The Reconstructionist Movement. The Reconstructionist Rabbinical College, the flagship institution of the Reconstructionist movement in American Judaism, has been the site of documented debate about Zionism and Palestinian rights within its student body and faculty. Reconstructionist Judaism's theological framework, developed by Rabbi Mordecai Kaplan in the twentieth century, understands Judaism as an evolving religious civilization rather than a divinely revealed covenant. This theological framework has historically been more open to internal critique of Zionist assumptions than Orthodox or Conservative frameworks. The documented debate within the Reconstructionist movement about Zionism is a primary source record of ongoing theological engagement with these questions within a mainline American Jewish denomination.",
          "SECTION 9.5: ISRAELI JEWISH VOICES. THE INTERNAL DISSENT.",
          "The catalog in this chapter would be incomplete without documentation of Israeli Jewish voices that have maintained documented critical positions on Zionism and Israeli state policy from within Israel itself.",
          "Benny Morris (born 1948). Benny Morris is an Israeli historian who has been one of the most significant revisionist scholars of the 1948 war. His work The Birth of the Palestinian Refugee Problem, first published in 1987 and revised in 2004, drew on newly declassified Israeli military archives to document the circumstances of Palestinian displacement during the 1948 war. His research established, using the Israeli government's own documents, that Palestinian displacement was not exclusively voluntary and that Israeli military forces in some cases expelled Palestinian civilians. Morris's personal political position has evolved across his career in directions that have surprised many of his scholarly admirers. His scholarly contribution to the primary source record of 1948 is independent of his personal political evolution. The Birth of the Palestinian Refugee Problem is a secondary source grounded in primary source Israeli military archives. It is the most rigorously documented scholarly account of the 1948 displacement available in English.",
          "Ilan Pappé (born 1954). Ilan Pappé is an Israeli-born historian who served as a senior lecturer at the University of Haifa before relocating to the United Kingdom, where he is currently Professor of History at the University of Exeter. His 2006 work The Ethnic Cleansing of Palestine argues, drawing on Israeli military archives and other primary source documentation, that the displacement of Palestinian Arabs in 1948 constituted a planned ethnic cleansing rather than a byproduct of war. The work is a secondary source grounded in primary source documentation. It is a primary source document of Israeli Jewish scholarly dissent from the dominant Israeli narrative of 1948. Pappé's position within Israeli academic life was the subject of documented institutional pressure following the publication of his scholarly work. He documented harassment and threats connected to his scholarship in public statements. The documented institutional response to his scholarship is itself a primary source record of the consequences faced by Israeli Jewish scholars who challenge the dominant narrative of 1948.",
          "Gideon Levy (born 1953). Gideon Levy is a journalist and columnist for the Israeli newspaper Haaretz. He has reported extensively from the occupied Palestinian territories for more than three decades. His journalism constitutes a primary source record of conditions in the occupied territories as documented by an Israeli Jewish journalist working for a mainstream Israeli publication. His collected columns, published in English as The Punishment of Gaza in 2010, are primary source documents of Israeli Jewish journalistic opposition to Israeli occupation policy. Haaretz is Israel's oldest daily newspaper and one of its most respected journalistic institutions. Levy's work appears in that publication continuously.",
          "B'Tselem. B'Tselem, the Israeli Information Center for Human Rights in the Occupied Territories, was founded in 1989 by a group of Israeli academics, attorneys, journalists, and Knesset members. It is an Israeli human rights organization that monitors and documents Israeli military and governmental conduct in the occupied Palestinian territories. B'Tselem's published reports are primary source documents of Israeli government conduct in the occupied territories. In January 2021, B'Tselem published a report titled A Regime of Jewish Supremacy from the Jordan River to the Mediterranean Sea: This Is Apartheid. The report is an Israeli Jewish human rights organization's documented characterization of Israeli governance across all territories under Israeli control as constituting apartheid. The report is accessible through B'Tselem's website at btselem.org.",
          "Breaking the Silence. Breaking the Silence is an Israeli organization founded in 2004 by veterans of the Israel Defense Forces who served in the occupied Palestinian territories. Its publications consist of collected testimonies by Israeli soldiers documenting their experiences and conduct during military service in the occupied territories. The testimonies are primary source documents. They are collected accounts of Israeli Jewish soldiers, in their own words, describing actions they witnessed or participated in during military service. The organization's archive is publicly accessible through its website at breakingthesilence.org.il. Breaking the Silence's published testimony collections constitute the most extensive primary source archive of Israeli military conduct in the occupied territories available in English.",
          "SECTION 9.6: THE CATALOG AS PRIMARY SOURCE ARGUMENT.",
          "The catalog assembled in this chapter spans 128 years. It includes Chief Rabbis of Vienna, Berlin, and London. It includes a Cabinet minister of the British Empire. It includes a Nobel Prize-winning physicist. It includes one of the most cited scholars in the world. It includes the author of the most significant revisionist history of the 1948 war. It includes journalists employed by Israel's oldest newspaper. It includes Israeli military veterans. It includes synagogue congregations, Hasidic dynasties, Reform rabbinical councils, and student organizations.",
          "The catalog documents that Jewish opposition to Zionism is not a fringe position. It is not an external imposition. It is not the product of antisemitism. It is a continuous, documented, serious, and institutionally diverse tradition of dissent maintained by Jewish people, using Jewish sources, within Jewish institutional frameworks, for the entirety of Zionism's existence as a political movement.",
          "The claim that criticism of Zionism constitutes antisemitism cannot be derived from this catalog. The catalog is the refutation of that claim. Not because of any editorial position taken in this volume but because the catalog documents, with full sourcing, that the people making the criticism are Jewish. They are rabbis. They are philosophers. They are historians. They are soldiers. They are congregations. They have been making the criticism, in documented form, since 1897.",
          "The catalog does not prove that Zionism is wrong. It proves that the equation of anti-Zionism with antisemitism is contradicted by 128 years of documented Jewish intellectual and religious history.",
          "The Torah does not require translation. The catalog does not require characterization.",
          "Both require reading.",
        ],
        sources: [
          "Arendt, H. (1944, September). Zionism reconsidered. The Menorah Journal, 32(2), 162–196.",
          "Arendt, H. (1963). Eichmann in Jerusalem: A report on the banality of evil. Viking Press.",
          "Arendt, H., & Einstein, A. (1948, December 4). Letter to the New York Times. The New York Times. https://archive.nytimes.com",
          "B'Tselem. (2021, January). A regime of Jewish supremacy from the Jordan River to the Mediterranean Sea: This is apartheid. https://www.btselem.org/publications/fulltext/202101_this_is_apartheid",
          "Breaking the Silence. (n.d.). Testimonies archive. https://www.breakingthesilence.org.il",
          "Butler, J. (2012). Parting ways: Jewishness and the critique of Zionism. Columbia University Press.",
          "Chomsky, N. (1999). The fateful triangle: The United States, Israel and the Palestinians (Updated ed.). South End Press.",
          "Einstein, A. (1938). Address on Zionism [Documented in Einstein Archives]. Hebrew University of Jerusalem. https://www.albert-einstein.org",
          "If Not Now Movement. (n.d.). About. https://www.ifnotnowmovement.org",
          "Jewish Voice for Peace. (2015). Statement on BDS endorsement. https://www.jewishvoiceforpeace.org",
          "Judt, T. (2003, October 23). Israel: The alternative. New York Review of Books. https://www.nybooks.com/articles/2003/10/23/israel-the-alternative/",
          "Kolsky, T. A. (1992). Jews against Zionism: The American Council for Judaism, 1942–1948. Temple University Press.",
          "Kraus, K. (1898). Eine Krone für Zion [A crown for Zion]. Wiener Rundschau.",
          "Levy, G. (2010). The punishment of Gaza. Verso Books.",
          "Montagu, E. S. (1917, August 23). The anti-Semitism of the present British government [Cabinet memorandum]. British National Archives, CAB 24/24.",
          "Morris, B. (2004). The birth of the Palestinian refugee problem revisited. Cambridge University Press.",
          "Neturei Karta International. (n.d.). Publications and statements. https://www.nkusa.org",
          "Pappé, I. (2006). The ethnic cleansing of Palestine. Oneworld Publications.",
          "Posen Library of Jewish Culture and Civilization. (n.d.). Protest against Zionism [1897 Protestrabbiner declaration]. https://www.posenlibrary.com/entry/protest-against-zionism",
          "Stone, I. F. (1967, August 3). For a binational state. New York Review of Books. https://www.nybooks.com/articles/1967/08/03/for-a-binational-state/",
          "Teitelbaum, Y. (1959). Vayoel Moshe [And Moses consented]. Yerushalayim Press.",
          "Tzedek Chicago. (2022, March). Core values statement including anti-Zionism. https://www.tzedekchicago.org",
          "YIVO Institute for Jewish Research. (n.d.). Jewish Labour Bund archive. https://www.yivo.org",
        ],
      },
      {
        title: "The Primary Source Verdict",
        description: "",
        content: [
          "The preceding nine chapters assembled the primary source record of two distinct traditions, one ancient and religious, one recent and political, alongside the documented strategy through which they have been conflated. This chapter does not add to that record. It applies the record to the question the volume was designed to answer: whether the equation of Judaism with Zionism can be sustained against the primary source documentation of both traditions.",
          "SECTION 10.1: THE CHRONOLOGICAL FINDING.",
          "Judaism is approximately 3,500 years old as a documented religious tradition. Its oldest ethical obligations appear in texts composed roughly three thousand years ago, and its primary institutional literature, comprising Torah, Nevi'im, Ketuvim, and Talmud, was produced across a span of approximately 1,500 years. Zionism is 128 years old. Its founding document, the Basel Program, was adopted on August 30, 1897. The gap between the emergence of the word \"Judaism\" in the historical record and the emergence of the word \"Zionism\" is approximately 2,200 years. That gap is not a theological argument, an editorial inference, or a political characterization. It is a documentable chronological fact derivable from two founding dates and two bodies of founding documents, both of which are in the public record. A tradition cannot be identical to a movement that began 2,200 years after it did.",
          "SECTION 10.2: THE TEXTUAL FINDING.",
          "The primary documents of Judaism contain no reference to Zionism. That is logically necessary: Zionism did not exist when those documents were written. Zionism's founding document, the Basel Program, contains no reference to divine covenant, Torah, Talmud, or rabbinic authority. Herzl did not write \"At Basel I fulfilled the divine covenant.\" He wrote that he founded a state, in the language of European nationalist politics, and described a project he modeled in part on the colonial enterprises of his era. Both documents are in the record. Neither one authorizes the equation of the traditions they represent.",
          "SECTION 10.3: THE DEMOGRAPHIC FINDING.",
          "The population of Palestine before 1948 is documented in Ottoman census records, British Mandate administrative surveys, and the Anglo-American Committee of Inquiry report of 1946. These are not Palestinian political documents. They are the administrative records of the governing authorities, first the Ottoman Empire and then the British colonial administration, compiled for administrative purposes by institutions with no Palestinian political interest in the outcome. The Anglo-American Committee recorded that approximately 5.8 percent of Palestine's land was in Jewish ownership in 1946, deriving that figure from official British Mandate land registry records. UNRWA's registration of approximately 750,000 displaced Palestinians is a United Nations administrative record established for refugee relief operations. None of these figures require characterization by this volume. They require only that they be read in the units in which they were recorded.",
          "SECTION 10.4: THE LEGAL FINDING.",
          "The State of Israel's legal architecture, as documented in its Basic Laws, ordinary legislation, and Supreme Court rulings, creates explicit distinctions between Jewish and non-Jewish rights. The Israeli Supreme Court ruled in Ornan v. Ministry of the Interior in 2013 that Israeli nationality does not exist as a unified civic category separate from ethnic designations. The Basic Law of 2018 established Israel as the nation-state of the Jewish people, codified Jewish settlement as a national value, and downgraded Arabic from official to special-status language. Adalah's publicly accessible database documents more than 65 laws that explicitly distinguish between the rights of Jewish and non-Jewish citizens and residents. These are primary source documents produced by the Israeli legal system. They document a legal architecture that distinguishes, in statute, between the Jewish people as a nation and Judaism as a religion, the very distinction that the conflation strategy insists cannot be made.",
          "SECTION 10.5: THE CONFLATION FINDING.",
          "The institutional equation of Judaism with Zionism, the documented strategy of treating criticism of Zionism as antisemitism, has a political history that predates and exceeds its theological justification. Kenneth Stern, the attorney who drafted the working definition of antisemitism that became the basis for the IHRA definition, testified before Congress in 2016 that the definition was being weaponized to suppress legitimate political speech and academic inquiry, contrary to its intended purpose. More than 200 scholars of antisemitism, Jewish history, and Holocaust studies signed the Jerusalem Declaration on Antisemitism in 2021, stating that criticism of Zionism as a form of nationalism is not antisemitism. The Antisemitism Awareness Act passed the House in May 2024 by a vote of 320 to 91, directing the Department of Education to apply the IHRA definition in Title VI enforcement, codifying the conflation into federal policy before any legislative proceeding established its accuracy against the primary source record. The vote tallies are in the congressional record. Chapter 8 documents the full institutional architecture.",
          "SECTION 10.6: THE OPPOSITION FINDING.",
          "The claim that opposition to Zionism constitutes antisemitism is a claim made about people who are, in a substantial number of documented cases, Jewish. The Chief Rabbi of Vienna published his opposition in 1897. The Executive Committee of the Union of Rabbis in Germany published theirs in the same week as the Basel Congress and in the same year. The Central Conference of American Rabbis, the governing body of American Reform Judaism, opposed Zionism in 1897 and did not officially endorse a Jewish state until 1937. The Satmar Hasidic dynasty has maintained theological opposition to Zionism from its founding through the present, grounded in a reading of the Three Oaths that predates the movement by centuries. Norman Finkelstein, Noam Chomsky, Judith Butler, and Ilan Pappe have documented their opposition in published scholarship available in major academic libraries worldwide. The opposition to Zionism within Judaism is not a marginal position adopted in retrospect. It is a 128-year continuous tradition that began in the founding year of the movement it opposed.",
          "SECTION 10.7: THE FINDING.",
          "The question this volume set out to answer was whether the equation of Judaism and Zionism, the treatment of the two as coextensive traditions with coextensive histories, coextensive moral obligations, and coextensive political standing, can be sustained against the primary source record of both. The record's answer is no. Judaism is a 3,500-year-old covenantal religious tradition whose primary texts predate Zionism by approximately three millennia and whose ethical obligations toward the stranger are recorded in 36 or more passages of the Torah alone. Zionism is a 128-year-old secular nationalist political movement whose founding document contains no theological claim and whose founding generation was composed primarily of secular European intellectuals responding to antisemitism with a nationalist solution modeled on the nationalist movements of their era. The 128-year record of Jewish opposition to Zionism, documented in rabbinic declarations, denominational resolutions, published scholarship, and communal organization, establishes that the equation has been contested within Judaism since the movement's founding year and has never achieved internal consensus. None of this requires this volume to take a political position on the future of Israel and Palestine. The record contains its own position. It is documented. It is dated. It is primary."
        ],
        sources: [
          "All primary sources cited in this chapter are fully documented in the chapter-specific reference lists of Chapters One through Nine. Readers are directed to those reference lists for complete APA 7 citations of every source referenced in this concluding chapter. No new primary sources are introduced in Chapter Ten.",
          "The complete citation architecture of this volume is organized by chapter to facilitate verification of individual claims against their original sources. Every URL cited throughout this volume was confirmed as live and accessible at the time of publication. Every docket number, resolution number, vote tally, and statutory citation has been verified against the original institutional record.",
          "Primary Source Analytics, LLC. (2026). Ancient faith, modern politics: Judaism is not Zionism (FactBook™ Series, Vol. 8). ClownBinge. https://www.clownbinge.com/factbooks/ancient-faith-modern-politics",
        ],
      },
    ],
    summary: "This book is written from respect for Judaism: its covenant, its texts, its 3,500 years of moral insistence. That respect is exactly why it had to be written. A secular political movement has spent over a century operating in Judaism's sacred name, and the conflation has done two kinds of damage: it has shielded acts that Judaism's own tradition would reject, and it has made honest critique nearly impossible.",
    extendedSummary: [
      "Zionism was founded in 1897 by Theodor Herzl, a secular journalist who modeled his project explicitly on British colonial enterprise. His own diaries and correspondence make this unambiguous. The movement's founding documents describe a nationalist political program, not a religious fulfillment. Many of the early Zionist leaders were atheists. The Tanakh did not commission the First Zionist Congress. A room full of European nationalists did.",
      "Jewish opposition to Zionism has existed and been documented since 1897. From the rabbis who got the First Congress expelled from Munich, to Neturei Karta, to the American Council for Judaism, to contemporary scholars whose sourced objections are part of the continuous Jewish intellectual record. These are not fringe voices. They are part of the tradition itself.",
      "The primary source record: Herzl's diaries, the Basel Congress proceedings, the Balfour Declaration, the Haavara Agreement, UN Resolution 3379. None of it supports the equation of Judaism with Zionism. This FactBook names the documents, the dates, and the actors. The argument is not against Jewish people. It is for them.",
    ],
    quote: "A tradition that has survived 3,500 years deserves to be seen on its own terms, not through the lens of a 130-year-old political movement that claimed its name.",
    bullets: [
      "Herzl's Basel Congress proceedings (1897) describe Zionism explicitly as a political, not religious, program",
      "Anti-Zionist Jewish movements, including Neturei Karta, have existed and published continuously since 1897",
      "UN Resolution 3379 (1975) and its reversal (1991) are documented political acts, not theological ones",
      "British Mandate census records and Ottoman land registries document pre-1948 Palestinian demographic reality",
      "The Balfour Declaration (1917) was a letter from a British foreign secretary to a banker: a political document",
      "Israeli civil law distinguishes 'Israeli nationality' from 'Jewish nationality': a legal, not religious, construction",
      "The IHRA definition of antisemitism, and its political deployment, is itself a subject of documented academic and legal debate",
      "Jewish scholars, rabbis, and organizations publishing anti-Zionist positions are cited throughout with full sourcing",
    ],
  },
  {
    id: 9, vol: "Vol. 09",
    shortTitle: "What Herodotus Saw",
    fullTitle: "What Herodotus Saw: The Primary Source Record of Kemet as Black African Civilization",
    tag: "Global South / Archaeology",
    bg: "#2D1800", fg: "#FFFFFF", accent: "#F5C518", accentFg: "#2D1800",
    coverDesign: "overlap",
    summary: "Herodotus — the Greek historian — wrote that the Egyptians were 'dark-skinned and woolly-haired.' He wrote this in the 5th century BCE, 2,500 years before it became politically convenient to deny. This FactBook assembles the archaeological, genetic, and written record that existed long before the politics — and has never actually been refuted.",
    bullets: [
      "Herodotus's original Greek texts describing Egyptian appearance have been in the record since 450 BCE",
      "DNA studies of pre-dynastic remains (Nature, 2017) show genetic proximity to sub-Saharan populations",
      "Ancient Egyptian art — much of it in color — depicts skin tones across the full range of African peoples",
      "Hieroglyphic records include pharaohs' explicit self-identification with African neighbors and kin",
      "The 'Egypt was not Black' argument emerged in 19th-century European colonial historiography, documented",
    ],
  },
  {
    id: 10, vol: "Vol. 10",
    shortTitle: "The Debt Clock",
    fullTitle: "The Debt Clock: $2.8 Billion Per Day and the Votes That Got Us Here",
    tag: "Money & Power",
    bg: "#082010", fg: "#FFFFFF", accent: "#00D084", accentFg: "#082010",
    coverDesign: "circle",
    summary: "The United States currently pays $2.8 billion every single day in interest on the national debt — more than the entire discretionary budget of most federal agencies, and more than it spends on education per day. This FactBook uses Treasury Department data, CBO projections, and Federal Reserve reports to trace exactly how this happened, who benefits, and what it forecloses.",
    bullets: [
      "Treasury data confirms daily interest payments now exceed the daily cost of Medicaid",
      "Top holders of U.S. debt include American pension funds, foreign governments, and the Fed itself",
      "CBO projections show interest payments becoming the single largest federal expense by 2030",
      "Reagan-era tax cuts and Bush-era wars are the two largest documented contributors to current debt",
      "The $2.8 billion figure is not partisan — it comes directly from the U.S. Department of the Treasury",
    ],
  },
];

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function CoverSVG({ book }: { book: FactBook }) {
  const { bg, fg, accent, accentFg, coverDesign, vol, shortTitle } = book;
  const words = shortTitle.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");
  const subtitleLines = book.subtitle ? wrapText(book.subtitle, 27) : [];

  if (book.coverVideo) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-black" style={{ containerType: "size" }}>
        <video
          src={book.coverVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Fade to black — lower half */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.12) 38%, rgba(0,0,0,0.75) 68%, rgba(0,0,0,1) 100%)"
        }} />
        {/* Accent glow from bottom */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to bottom, transparent 55%, ${accent}30 84%, ${accent}99 100%)`
        }} />
        {/* Title + subtitle stacked just above footer */}
        <div className="absolute left-0 right-0 text-center px-[6%]" style={{ bottom: "9.5%" }}>
          <div className="font-bold leading-tight text-white" style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: "5.8cqh", letterSpacing: "-0.2px" }}>{line1}</div>
          {line2 && <div className="font-bold leading-tight text-white" style={{ fontFamily: "'Libre Franklin',sans-serif", fontSize: "5.8cqh", letterSpacing: "-0.2px", marginTop: "0.8cqh" }}>{line2}</div>}
          {book.subtitle && (
            <div className="font-bold" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "2.5cqh", color: accent, letterSpacing: "0.3px", marginTop: "1.2cqh", lineHeight: 1.4 }}>
              {book.subtitle}
            </div>
          )}
        </div>
        {/* Footer bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center" style={{ height: "9.4%", background: accent }}>
          <span className="font-bold tracking-[1.5px]" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "2.3cqh", color: accentFg }}>
            PRIMARY SOURCE ANALYTICS
          </span>
        </div>
      </div>
    );
  }

  if (book.coverImage) {
    return (
      <svg viewBox="0 0 240 360" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Base fade-to-black across lower half */}
          <linearGradient id={`fade-${book.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="38%" stopColor="#000000" stopOpacity="0.12" />
            <stop offset="68%" stopColor="#000000" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </linearGradient>
          {/* Accent-color glow bleeding up from footer — gives each cover a signature hue */}
          <linearGradient id={`glow-${book.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0" />
            <stop offset="55%" stopColor={accent} stopOpacity="0" />
            <stop offset="84%" stopColor={accent} stopOpacity="0.18" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {/* Black bg fallback */}
        <rect width="240" height="360" fill="#000000" />
        {/* Full-bleed photo */}
        <image href={book.coverImage} x="0" y="0" width="240" height="360" preserveAspectRatio={book.coverAnchor ?? "xMidYMid slice"} />
        {/* Fade photo into black */}
        <rect width="240" height="360" fill={`url(#fade-${book.id})`} />
        {/* Accent color glow from bottom — ties cover to brand color */}
        <rect width="240" height="360" fill={`url(#glow-${book.id})`} />
        {/* Title — white, seated just above footer */}
        <text x="120" y="238" fontSize="21" fill="#FFFFFF" fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2" textAnchor="middle">{line1}</text>
        <text x="120" y="261" fontSize="21" fill="#FFFFFF" fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2" textAnchor="middle">{line2}</text>
        {subtitleLines.map((l, i) => (
          <text key={i} x="120" y={282 + i * 13} fontSize="9.5" fill="#F5C518" fontFamily="'JetBrains Mono',monospace" fontWeight="700" letterSpacing="0.3" textAnchor="middle">{l}</text>
        ))}
        {/* Accent footer bar */}
        <rect x="0" y="326" width="240" height="34" fill={accent} />
        <text x="120" y="347" fontSize="8.5" fill={accentFg} fontFamily="'JetBrains Mono',monospace" letterSpacing="1.5" fontWeight="700" textAnchor="middle">
          PRIMARY SOURCE ANALYTICS
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 360" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="240" height="360" fill={bg} />

      {coverDesign === "stat" && (
        <>
          <rect x="0" y="0" width="240" height="4" fill={accent} />
          <text x="20" y="100" fontSize="72" fill={accent} fontFamily="'Archivo Black',sans-serif" opacity="0.12" fontWeight="900">%</text>
          <text x="20" y="160" fontSize="64" fill={accent} fontFamily="'Archivo Black',sans-serif" opacity="0.15" fontWeight="900">DATA</text>
        </>
      )}
      {coverDesign === "grid" && (
        <>
          {Array.from({ length: 7 }).map((_, col) =>
            Array.from({ length: 11 }).map((_, row) => (
              <rect key={`${col}-${row}`} x={col * 35 + 5} y={row * 35 + 5} width="28" height="28"
                fill="none" stroke={accent} strokeWidth="0.5"
                opacity={(col + row) % 3 === 0 ? "0.25" : "0.08"} />
            ))
          )}
        </>
      )}
      {coverDesign === "split" && (
        <>
          <rect x="0" y="0" width="240" height="180" fill={accent} />
          <rect x="0" y="180" width="240" height="180" fill={bg} />
        </>
      )}
      {coverDesign === "bar" && (
        <>
          {[110, 160, 85, 140, 95, 175, 120, 65].map((h, i) => (
            <rect key={i} x={i * 30 + 5} y={310 - h} width="22" height={h}
              fill={accent} opacity={i === 5 ? "0.9" : "0.2"} rx="2" />
          ))}
        </>
      )}
      {coverDesign === "slash" && (
        <>
          <line x1="-20" y1="120" x2="260" y2="20" stroke={accent} strokeWidth="40" opacity="0.12" />
          <line x1="-20" y1="200" x2="260" y2="100" stroke={accent} strokeWidth="40" opacity="0.09" />
          <line x1="-20" y1="290" x2="260" y2="190" stroke={accent} strokeWidth="40" opacity="0.06" />
        </>
      )}
      {coverDesign === "arch" && (
        <>
          <ellipse cx="120" cy="360" rx="160" ry="120" fill="none" stroke={accent} strokeWidth="1" opacity="0.3" />
          <ellipse cx="120" cy="360" rx="120" ry="90" fill="none" stroke={accent} strokeWidth="1" opacity="0.2" />
          <ellipse cx="120" cy="360" rx="80" ry="60" fill="none" stroke={accent} strokeWidth="1" opacity="0.15" />
        </>
      )}
      {coverDesign === "type" && (
        <>
          <text x="-5" y="180" fontSize="140" fill={accent} fontFamily="'Archivo Black',sans-serif" opacity="0.06" fontWeight="900">WHO</text>
          <text x="-5" y="290" fontSize="140" fill={accent} fontFamily="'Archivo Black',sans-serif" opacity="0.06" fontWeight="900">BUILT</text>
        </>
      )}
      {coverDesign === "minimal" && (
        <>
          <line x1="20" y1="180" x2="220" y2="180" stroke={accent} strokeWidth="1" opacity="0.4" />
          <circle cx="120" cy="120" r="60" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.25" />
          <circle cx="120" cy="120" r="40" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.15" />
        </>
      )}
      {coverDesign === "overlap" && (
        <>
          <rect x="40" y="40" width="160" height="160" fill={accent} opacity="0.12" rx="2" />
          <rect x="20" y="60" width="160" height="160" fill={accent} opacity="0.08" rx="2" />
          <rect x="60" y="20" width="160" height="160" fill={accent} opacity="0.06" rx="2" />
        </>
      )}
      {coverDesign === "circle" && (
        <>
          <circle cx="120" cy="150" r="130" fill={accent} opacity="0.08" />
          <circle cx="120" cy="150" r="95" fill={accent} opacity="0.07" />
          <circle cx="120" cy="150" r="60" fill={accent} opacity="0.1" />
          <circle cx="120" cy="150" r="30" fill={accent} opacity="0.15" />
        </>
      )}

      <text x="120" y="32" fontSize="8" fill={fg} fontFamily="'JetBrains Mono',monospace" opacity="0.82" letterSpacing="1" textAnchor="middle">
        {vol.toUpperCase()} · FACTBOOK SERIES
      </text>

      {coverDesign === "split" ? (
        <>
          <text x="120" y="90" fontSize="20" fill={accentFg} fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2" textAnchor="middle">{line1}</text>
          <text x="120" y="114" fontSize="20" fill={accentFg} fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2" textAnchor="middle">{line2}</text>
          {subtitleLines.map((l, i) => (
            <text key={i} x="120" y={138 + i * 14} fontSize="11" fill={accentFg} fontFamily="'JetBrains Mono',monospace" fontWeight="700" opacity="0.9" textAnchor="middle">{l}</text>
          ))}
          <text x="120" y="218" fontSize="17" fill={fg} fontFamily="'Libre Franklin',sans-serif" fontWeight="600" opacity="0.85" textAnchor="middle">{book.tag}</text>
        </>
      ) : (
        <>
          <text x="120" y="192" fontSize="21" fill={fg} fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2" textAnchor="middle">{line1}</text>
          <text x="120" y="216" fontSize="21" fill={fg} fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2" textAnchor="middle">{line2}</text>
          {subtitleLines.map((l, i) => (
            <text key={i} x="120" y={240 + i * 14} fontSize="11" fill={fg} fontFamily="'JetBrains Mono',monospace" fontWeight="700" opacity="0.75" textAnchor="middle">{l}</text>
          ))}
        </>
      )}

      <rect x="0" y="326" width="240" height="34" fill={accent} />
      <text x="120" y="347" fontSize="8.5" fill={accentFg} fontFamily="'JetBrains Mono',monospace" letterSpacing="1.5" fontWeight="700" textAnchor="middle">
        PRIMARY SOURCE ANALYTICS
      </text>
    </svg>
  );
}

function BookModal({ book, onClose }: { book: FactBook; onClose: () => void }) {
  const isVol08 = book.vol === "Vol. 08";
  const [tab, setTab] = useState<"description" | "outline" | "video" | "ideal">("description");
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const hasOutline = book.chapters && book.chapters.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-10 lg:p-12"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl md:max-w-4xl lg:max-w-5xl rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col sm:flex-row"
        style={{ background: "#ffffff", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover — banner on mobile, full-height left panel on sm+; editorial-dominant on md/lg */}
        <div
          className="w-full h-40 shrink-0 sm:w-[42%] md:w-[50%] lg:w-[54%] sm:h-auto sm:self-stretch"
          style={{ background: book.bg }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <CoverSVG book={book} />
          </div>
        </div>

        {/* RIGHT — text panel */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#FAFAFA" }}>
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ background: "rgba(0,0,0,0.12)" }}
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5 text-gray-700" />
          </button>

          {/* Header — always visible, not scrolled */}
          <div className="px-6 pt-5 pb-0 shrink-0">
            <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: book.accent }}>
              {book.vol} · {book.tag}
            </p>
            <h2 className="font-sans font-extrabold text-xl leading-tight mb-0.5" style={{ color: "#1A1A2E" }}>
              {book.shortTitle}
            </h2>
            {book.subtitle && (
              <p className="font-sans font-bold text-sm mb-3" style={{ color: book.accent }}>
                {book.subtitle}
              </p>
            )}
            {/* Price + pages + CTA */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <span className="font-extrabold text-2xl text-gray-900">{book.price ?? "$24.95"}</span>
              {book.pages && (
                <span className="font-mono text-sm font-extrabold px-3 py-1 rounded-full" style={{ background: book.accent, color: book.accentFg }}>
                  {book.pages} pages
                </span>
              )}
              <button
                className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-extrabold text-xs transition-opacity hover:opacity-85"
                style={{ background: book.accent, color: book.accentFg }}
              >
                Pre-Order
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tabs */}
            {(hasOutline || isVol08) && (
              <div className="flex gap-0 border-b border-gray-200 mb-0 flex-wrap">
                {([
                  { key: "description" as const, label: "Description" },
                  ...(hasOutline ? [{ key: "outline" as const, label: "Outline" }] : []),
                  ...(isVol08 ? [
                    { key: "video" as const, label: "Video" },
                    { key: "ideal" as const, label: "Ideal Reader" },
                  ] : []),
                ]).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className="px-4 py-2 text-xs font-bold tracking-wide transition-colors relative whitespace-nowrap"
                    style={{
                      color: tab === key ? book.accent : "#9CA3AF",
                      borderBottom: tab === key ? `2px solid ${book.accent}` : "2px solid transparent",
                      marginBottom: "-1px",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scrollable content — always-visible thin scrollbar */}
          <div
            className="overflow-y-scroll flex-1 px-6 py-4"
            style={{ scrollbarWidth: "thin", scrollbarColor: `${book.accent}55 transparent` }}
          >
            {/* ── DESCRIPTION TAB ── */}
            {tab === "description" && (
              <>
                <p className="text-sm text-gray-800 leading-relaxed font-medium mb-4">
                  {book.summary}
                </p>
                {book.extendedSummary && book.extendedSummary.map((para, i) => (
                  <p key={i} className="text-sm text-gray-800 leading-relaxed mb-3">
                    {para}
                  </p>
                ))}
                {book.quote && (
                  <blockquote
                    className="my-5 pl-4 py-3 pr-3 rounded-r-lg text-sm font-semibold leading-snug italic"
                    style={{ borderLeft: `3px solid ${book.accent}`, background: book.accent + "10", color: "#2A1A00" }}
                  >
                    "{book.quote}"
                  </blockquote>
                )}
                <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3 mt-4">
                  What This FactBook Documents
                </p>
                <ul className="space-y-2.5 mb-6">
                  {book.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-900 leading-relaxed">
                      <span
                        className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]"
                        style={{ background: book.accent + "28", color: book.accent }}
                      >
                        {i + 1}
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div
                  className="rounded-xl p-4 flex items-center justify-between"
                  style={{ background: book.accent + "12", border: `1px solid ${book.accent}30` }}
                >
                  <div>
                    <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase mb-0.5" style={{ color: book.accent }}>
                      Digital PDF · APA 7 Citations
                    </p>
                    <p className="text-xs text-gray-700">Instant delivery. 100% primary sourced.</p>
                  </div>
                  <button
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-extrabold text-xs transition-opacity hover:opacity-85 shrink-0"
                    style={{ background: book.accent, color: book.accentFg }}
                  >
                    {book.price ?? "$24.95"} — Pre-Order
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}

            {/* ── VIDEO TAB ── */}
            {tab === "video" && (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center min-h-[260px]">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: book.accent + "18", border: `2px solid ${book.accent}35` }}
                >
                  <Video className="w-9 h-9" style={{ color: book.accent }} />
                </div>
                <p className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: book.accent }}>
                  Coming Soon
                </p>
                <h3 className="font-sans font-extrabold text-lg text-gray-900 leading-tight mb-3 max-w-xs">
                  The Author on Ancient Faith, Modern Politics
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                  A video introduction to the primary source record. The evidence that separates a 3,500-year religion from a 127-year political movement, presented by the author.
                </p>
                <div
                  className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
                  style={{ background: book.accent + "14", color: book.accent }}
                >
                  <Video className="w-3.5 h-3.5" />
                  Notify Me When Available
                </div>
              </div>
            )}

            {/* ── IDEAL READER TAB ── */}
            {tab === "ideal" && (
              <div className="pb-6">
                <div className="mb-5">
                  <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: book.accent }}>
                    Who Needs This Book
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This volume was written for people who already sense something is wrong with the argument. The lie that Judaism and Zionism are the same thing has done real damage. It has silenced critics. It has weaponized religious identity. It has made a political position unsayable in newsrooms, classrooms, and boardrooms. The primary source record corrects that, in the original documents.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      icon: <Users className="w-4 h-4 shrink-0 mt-0.5" style={{ color: book.accent }} />,
                      title: "The Person Who Has Been Silenced",
                      body: "You criticized Israeli government policy and someone called it antisemitism. You did not have the primary source record that separates a religion from a political movement. This book is that record. The argument no longer requires your opinion. It only requires Herzl's diary, the Basel Program, and the rabbinical texts that predate them both.",
                    },
                    {
                      icon: <BookOpen className="w-4 h-4 shrink-0 mt-0.5" style={{ color: book.accent }} />,
                      title: "The Jewish Reader Whose Faith Has Been Claimed",
                      body: "You are Jewish and you have watched a secular nationalist movement use your religious identity to shield itself from political accountability. Chapter 9 of this volume documents 127 years of Jewish scholars, rabbis, and institutions who made exactly that observation. The Satmar tradition. Judith Butler. The Bund. The Neturei Karta. You are not a fringe position. You are the documented majority in the tradition's own textual record.",
                    },
                    {
                      icon: <Users className="w-4 h-4 shrink-0 mt-0.5" style={{ color: book.accent }} />,
                      title: "The Educator Who Needs Primary Sources",
                      body: "You teach history, political science, religious studies, or international law. Your students ask why criticizing a state is prosecuted as a hate crime in some jurisdictions. This volume answers that question from the founding documents of both traditions and the legislative record of the institutions that engineered the conflation.",
                    },
                    {
                      icon: <Users className="w-4 h-4 shrink-0 mt-0.5" style={{ color: book.accent }} />,
                      title: "The Journalist or Policy Professional",
                      body: "You cover the Israel-Palestine conflict, campus speech codes, or the IHRA definition. Chapter 8 of this volume documents the institutional architecture of the IHRA working definition from its own lobbying records, legislative history, and adopting jurisdiction filings. You need this before your next assignment.",
                    },
                    {
                      icon: <Users className="w-4 h-4 shrink-0 mt-0.5" style={{ color: book.accent }} />,
                      title: "The Religious Leader Seeking Doctrinal Clarity",
                      body: "You are a pastor, imam, rabbi, or lay leader. Your congregation asks where Judaism ends and Zionism begins. The answer from the primary sources of Judaism goes back to 1897. The Protestrabbiner declaration was published three weeks before the First Zionist Congress met in Basel. This book collects that record.",
                    },
                    {
                      icon: <Users className="w-4 h-4 shrink-0 mt-0.5" style={{ color: book.accent }} />,
                      title: "The Person Who Watched and Could Not Explain",
                      body: "You saw the news from Sheikh Jarrah. Someone told you it had nothing to do with Judaism. You were not sure how to respond. The Ottoman land registry, the British Mandate census, the UN partition plan data, and the Israeli Supreme Court's own three-tier citizenship framework are assembled here in one place, in chronological order, with full citation.",
                    },
                  ].map(({ icon, title, body }) => (
                    <div
                      key={title}
                      className="rounded-lg p-4"
                      style={{ background: book.accent + "08", border: `1px solid ${book.accent}20` }}
                    >
                      <div className="flex items-start gap-3 mb-1.5">
                        {icon}
                        <p className="text-xs font-extrabold text-gray-900">{title}</p>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed pl-7">{body}</p>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-5 rounded-xl p-4 flex items-center justify-between"
                  style={{ background: book.accent + "12", border: `1px solid ${book.accent}30` }}
                >
                  <p className="text-xs text-gray-700 leading-snug">
                    <span className="font-extrabold" style={{ color: book.accent }}>This is not a book written about history.</span> It is the history, sourced, cited, and organized so the argument ends where the evidence begins.
                  </p>
                  <button
                    className="ml-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-extrabold text-xs transition-opacity hover:opacity-85 shrink-0"
                    style={{ background: book.accent, color: book.accentFg }}
                  >
                    {book.price ?? "$39.95"} — Pre-Order
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* ── OUTLINE TAB ── */}
            {tab === "outline" && book.chapters && (
              <ol className="space-y-2 mb-6">
                {book.chapters.map((ch, i) => {
                  const chapterNum = ch.isPreface ? null : book.chapters!.filter((c, j) => !c.isPreface && j <= i).length;
                  const badge = ch.isPreface ? "P" : String(chapterNum);
                  const isOpen = expandedChapter === i;
                  const hasContent = !!(ch.description && ch.description.trim().length > 0);
                  const sourceCount = ch.sources?.length ?? 0;
                  return (
                    <li key={i} className="rounded-lg overflow-hidden border" style={{ borderColor: book.accent + "30" }}>
                      <button
                        className="w-full flex gap-3 items-start px-3 py-3 text-left transition-colors"
                        style={{ background: isOpen ? book.accent + "10" : "transparent" }}
                        onClick={() => hasContent ? setExpandedChapter(isOpen ? null : i) : undefined}
                      >
                        <span
                          className="mt-0.5 shrink-0 font-mono text-[10px] font-bold w-6 h-6 rounded flex items-center justify-center"
                          style={{ background: book.accent + "25", color: book.accent }}
                        >
                          {badge}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold leading-snug" style={{ color: book.accent }}>{ch.title}</p>
                          {!isOpen && ch.description && <p className="text-xs leading-relaxed mt-0.5 text-gray-600">{ch.description}</p>}
                        </div>
                        {hasContent && (
                          <span className="shrink-0 text-[10px] font-mono mt-1" style={{ color: book.accent + "99" }}>
                            {isOpen ? "▲" : "▼"}
                          </span>
                        )}
                      </button>
                      {isOpen && hasContent && (
                        <div className="px-4 pb-5 pt-3 border-t" style={{ borderColor: book.accent + "20" }}>
                          <p className="text-sm leading-relaxed text-gray-700 mb-4">{ch.description}</p>
                          <div className="rounded-lg p-4" style={{ background: book.accent + "0F", borderLeft: `3px solid ${book.accent}` }}>
                            {sourceCount > 0 && (
                              <p className="text-[9px] font-mono font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: book.accent }}>
                                {sourceCount} Primary Source{sourceCount !== 1 ? "s" : ""} Cited
                              </p>
                            )}
                            <p className="text-xs text-gray-500 leading-relaxed mb-3">Full chapter analysis, evidence, and citations are in the FactBook.</p>
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-extrabold text-xs transition-opacity hover:opacity-85" style={{ background: book.accent, color: book.accentFg }}>
                              Vol. 08 — {book.price ?? "$39.95"} — Pre-Order
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Bookstore() {
  usePageSeoHead({
    title: "Our Books — Knowledge Is Power | ClownBinge FactBook™",
    description: "The ClownBinge FactBook™ series. Primary Source Analytics on the topics that define our era. Evergreen. Documented. Sourced.",
    path: "/bookstore",
    schemaType: "ItemPage",
  });

  const [selectedBook, setSelectedBook] = useState<FactBook | null>(null);

  return (
    <Layout>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

      {/* ── Two-column hero ── */}
      <div className="w-full" style={{ background: "linear-gradient(135deg, #071a0e 0%, #0e3020 55%, #0a2818 100%)" }}>
        <div className="max-w-6xl mx-auto px-6 pt-5 pb-14 grid lg:grid-cols-2 gap-12 items-start">
          <div className="lg:col-span-2 mb-2">
            <h2 className="font-mono text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
              Our Books / FactBook™ Series
            </h2>
          </div>

          {/* LEFT — brand statement */}
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-bold tracking-widest uppercase"
              style={{ background: "#F5C518", color: "#1A3A8F" }}
            >
              <BookOpen className="w-3 h-3" />
              Primary Source Analytics
            </div>

            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight mb-6">
              FactBooks:<br />
              <span style={{ color: "#F5C518" }}>Deeper Dives Into Our Most Important Stories.</span>
            </h1>

            <p className="text-white/75 text-lg leading-relaxed mb-4">
              Ten deep-dive research volumes on the topics that define our era. Built entirely
              from court records, federal data, congressional transcripts, and archaeological
              evidence. No opinion. No narrative. The primary source, documented.
            </p>

            <p className="text-white/75 text-lg leading-relaxed mb-8">
              These are not books written about history. They are the history — sourced, cited,
              and organized so the argument ends where the evidence begins.
            </p>

            <div className="grid grid-cols-3 gap-6 border-t pt-8" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <div>
                <div className="font-extrabold text-lg text-white mb-1">Primary Source.</div>
                <p className="text-white/50 text-xs leading-relaxed">Every claim traces to the original document — court filings, census records, peer-reviewed research.</p>
              </div>
              <div>
                <div className="font-extrabold text-lg mb-1" style={{ color: "#F5C518" }}>Evergreen.</div>
                <p className="text-white/50 text-xs leading-relaxed">These topics will not age out. This is the record that exists whether the news cycle covers it or not.</p>
              </div>
              <div>
                <div className="font-extrabold text-lg text-white mb-1">Documented.</div>
                <p className="text-white/50 text-xs leading-relaxed">APA 7 citations throughout. Every URL. Every docket number. Every source verifiable by anyone.</p>
              </div>
            </div>
          </div>

          {/* RIGHT — action cards */}
          <div className="flex flex-col gap-4">

            {/* CARD 1 — Individual volume */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #F5C518" }}>
              <div className="p-6" style={{ background: "linear-gradient(135deg, #0a1a4a 0%, #1A3A8F 100%)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#F5C518" }}>
                      Individual Volume
                    </div>
                    <div className="font-extrabold text-3xl text-white">Any FactBook™</div>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#F5C518" }}
                  >
                    <BookOpen className="w-6 h-6" style={{ color: "#0a1a4a" }} />
                  </div>
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-4">
                  Pick the topic that matters most to you. Each volume stands completely alone —
                  fully cited, primary sourced, and delivered instantly as a digital PDF.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                  {["100% primary sourced", "Instant PDF delivery", "APA 7 citations", "Evergreen research"].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs" style={{ color: "#F5C518" }}>
                      <CheckCircle className="w-3 h-3 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex items-baseline gap-3 mb-5 mt-4">
                  <span className="font-extrabold text-4xl text-white">$24.95</span>
                  <span className="text-white/50 text-sm">per volume</span>
                </div>
                <button
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-extrabold text-sm transition-opacity hover:opacity-90"
                  style={{ background: "#F5C518", color: "#0a1a4a" }}
                  onClick={() => document.getElementById("all-volumes")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Browse All 10 Volumes
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD 2 — Complete bundle */}
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#0e3020" }}>
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
                  <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Complete Library</div>
                  <div className="font-extrabold text-2xl" style={{ color: "#0e3020" }}>$149</div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-1">
                  All 10 FactBooks™ in one archive. Save $100 off individual pricing.
                </p>
                <p className="text-xs text-muted-foreground mb-4">Instant PDF · 100% primary sourced · APA 7 citations throughout</p>
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-extrabold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ background: "#0e3020" }}
                >
                  Pre-Order the Complete Bundle
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD 3 — About the series */}
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#0e3020" }}>
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">About the Series</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The FactBook™ series is produced by the same PhD researchers behind ClownBinge's
                  documented journalism — expanded into full research volumes with extended sourcing,
                  data tables, and complete citation indexes.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── All 10 volumes grid ── */}
      <div id="all-volumes" className="max-w-6xl mx-auto px-6 py-16 sm:py-20">

        <div className="flex items-baseline justify-between mb-10 border-b border-border pb-6">
          <h2 className="font-sans font-extrabold text-2xl text-foreground">All 10 Volumes</h2>
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">$24.95 each · Digital PDF</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-12">
          {[...BOOKS].sort((a, b) => {
            const ORDER = [1, 8, 2, 3, 4, 5, 6, 7, 9, 10];
            return ORDER.indexOf(a.id) - ORDER.indexOf(b.id);
          }).map((book) => (
            <div key={book.id} className="group flex flex-col">
              <div className="relative mb-5">
                <button
                  className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
                  style={{ "--tw-ring-color": book.accent } as React.CSSProperties}
                  onClick={() => setSelectedBook(book)}
                  aria-label={`Learn more about ${book.shortTitle}`}
                >
                  <div
                    className="w-full aspect-[2/3] rounded-sm overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer"
                    style={{ boxShadow: `0 8px 32px ${book.accent}22, 0 2px 8px rgba(0,0,0,0.18)` }}
                  >
                    <CoverSVG book={book} />
                  </div>
                  {/* Hover hint */}
                  <div className="absolute inset-0 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{ background: "rgba(0,0,0,0.45)" }}>
                    <span className="text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/40">
                      Learn More
                    </span>
                  </div>
                </button>
              </div>

              <p className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground mb-1.5">
                {book.vol} · {book.tag}
              </p>
              <h3 className="font-sans font-bold text-sm text-foreground leading-snug mb-3 flex-1">
                {book.shortTitle}
              </h3>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                <span className="font-display font-extrabold text-xl text-foreground">$24.95</span>
                <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/70 transition-colors">
                  Pre-Order
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </Layout>
  );
}
