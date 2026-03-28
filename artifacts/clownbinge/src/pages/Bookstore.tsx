import { useState } from "react";
import { Layout } from "@/components/Layout";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import { BookOpen, ArrowRight, CheckCircle, Download, Package, Layers, X } from "lucide-react";

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
    subtitle: "Facebook, X, YouTube & TikTok as the World's Largest Disinformation Infrastructure",
    tag: "Investigations",
    bg: "#1A3A8F", fg: "#FFFFFF", accent: "#F5C518", accentFg: "#1A1A2E",
    coverDesign: "grid",
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
    pages: 140,
    price: "$39.95",
    chapters: [
      {
        isPreface: true,
        title: "Preface: What the Record Requires",
        description: "Why this book was written. The distinction between a religion and a political movement, and why it matters now.",
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
        description: "The definitional problem. What Judaism is, what Zionism is, and why the distinction matters forensically.",
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
        description: "Herzl's founding documents, congress proceedings, and the secular-nationalist framing in his own words.",
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
        description: "Neturei Karta, the American Council for Judaism, rabbinic rulings: opposition from within, documented since 1897.",
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
          "The receipts are 128 years old. They begin with rabbis. They continue with rabbis. They include scholars, philosophers, labor organizers, synagogue congregations, and Hasidic dynasties. The record is long because the opposition is long. The opposition is long because the primary sources of Judaism say what they say.",
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
      { title: "The Balfour Declaration", description: "A British foreign policy letter. Who wrote it, who received it, and what the Ottoman and Arab response was." },
      { title: "Land, Census, and Demographic Reality", description: "Ottoman land registries, British Mandate censuses, pre-1948 population distribution. The numbers as recorded." },
      { title: "The UN Record", description: "Resolution 3379 (1975) and its reversal (1991): the political context, the votes, the reasoning on all sides." },
      { title: "Israeli Law: Nation vs. Faith", description: "The legal distinction between Israeli nationality and Jewish nationality in Israeli civil law. Statutory text and court records." },
      { title: "The Conflation Strategy, Documented", description: "When and where equating anti-Zionism with antisemitism became organized policy. Lobbying records and legislative campaigns." },
      { title: "Voices From Within: Scholars, Rabbis, Organizations", description: "A sourced catalog of Jewish anti-Zionist intellectual and religious output, 1897 to present." },
      { title: "The Primary Source Verdict", description: "What the record actually says. No opinion added. No editorial conclusion. The documents stand alone." },
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

  if (book.coverImage) {
    return (
      <svg viewBox="0 0 240 360" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`fade-${book.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="40%" stopColor="#000000" stopOpacity="0.15" />
            <stop offset="72%" stopColor="#000000" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Black bg */}
        <rect width="240" height="360" fill="#000000" />
        {/* Full-bleed photo */}
        <image href={book.coverImage} x="0" y="0" width="240" height="360" preserveAspectRatio="xMidYMid slice" />
        {/* Fade photo into black */}
        <rect width="240" height="360" fill={`url(#fade-${book.id})`} />
        {/* Title — centered, mid-bottom */}
        <text x="120" y="240" fontSize="21" fill="#FFFFFF" fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2" textAnchor="middle">{line1}</text>
        <text x="120" y="263" fontSize="21" fill="#FFFFFF" fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2" textAnchor="middle">{line2}</text>
        {subtitleLines.map((l, i) => (
          <text key={i} x="120" y={284 + i * 13} fontSize="9.5" fill="#F5C518" fontFamily="'JetBrains Mono',monospace" fontWeight="700" letterSpacing="0.3" textAnchor="middle">{l}</text>
        ))}
        {/* Blue footer bar */}
        <rect x="0" y="326" width="240" height="34" fill={accent} />
        <text x="20" y="347" fontSize="8.5" fill={accentFg} fontFamily="'JetBrains Mono',monospace" letterSpacing="1.5" fontWeight="700">
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
  const [tab, setTab] = useState<"description" | "outline">("description");
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
            {hasOutline && (
              <div className="flex gap-0 border-b border-gray-200 mb-0">
                {(["description", "outline"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="px-4 py-2 text-xs font-bold tracking-wide capitalize transition-colors relative"
                    style={{
                      color: tab === t ? book.accent : "#9CA3AF",
                      borderBottom: tab === t ? `2px solid ${book.accent}` : "2px solid transparent",
                      marginBottom: "-1px",
                    }}
                  >
                    {t}
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

            {/* ── OUTLINE TAB ── */}
            {tab === "outline" && book.chapters && (
              <ol className="space-y-2 mb-6">
                {book.chapters.map((ch, i) => {
                  const chapterNum = ch.isPreface ? null : book.chapters!.filter((c, j) => !c.isPreface && j <= i).length;
                  const badge = ch.isPreface ? "P" : String(chapterNum);
                  const isOpen = expandedChapter === i;
                  const hasContent = ch.content && ch.content.length > 0;
                  return (
                    <li key={i} className="rounded-lg overflow-hidden border" style={{ borderColor: book.accent + "30" }}>
                      <button
                        className="w-full flex gap-3 items-start px-3 py-3 text-left transition-colors"
                        style={{ background: isOpen ? book.accent + "10" : "transparent" }}
                        onClick={() => setExpandedChapter(isOpen ? null : i)}
                      >
                        <span
                          className="mt-0.5 shrink-0 font-mono text-[10px] font-bold w-6 h-6 rounded flex items-center justify-center"
                          style={{ background: book.accent + "25", color: book.accent }}
                        >
                          {badge}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold leading-snug" style={{ color: book.accent }}>{ch.title}</p>
                          {!isOpen && <p className="text-xs leading-relaxed mt-0.5 text-gray-600">{ch.description}</p>}
                        </div>
                        {hasContent && (
                          <span className="shrink-0 text-[10px] font-mono mt-1" style={{ color: book.accent + "99" }}>
                            {isOpen ? "▲" : "▼"}
                          </span>
                        )}
                      </button>
                      {isOpen && hasContent && (
                        <div className="px-4 pb-5 pt-3 border-t" style={{ borderColor: book.accent + "20" }}>
                          {ch.content!.map((para, pi) => {
                            const isSectionHeader = /^SECTION \d+\.\d+:/.test(para);
                            return isSectionHeader ? (
                              <p key={pi} className="text-[10px] font-bold font-mono tracking-widest uppercase mt-5 mb-2 first:mt-0" style={{ color: book.accent }}>{para}</p>
                            ) : (
                              <p key={pi} className="text-sm leading-relaxed text-gray-800 mb-3 last:mb-0">{para}</p>
                            );
                          })}
                          {ch.sources && ch.sources.length > 0 && (
                            <div className="mt-5 pt-4 border-t" style={{ borderColor: book.accent + "20" }}>
                              <p className="text-[9px] font-bold font-mono tracking-widest uppercase mb-2" style={{ color: book.accent }}>APA 7 Primary Sources</p>
                              <ul className="space-y-1.5">
                                {ch.sources.map((src, si) => (
                                  <li key={si} className="text-[10px] leading-relaxed text-gray-500 font-mono">{src}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      {isOpen && !hasContent && (
                        <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: book.accent + "20" }}>
                          <p className="text-xs text-gray-400 italic">{ch.description}</p>
                          <p className="text-xs text-gray-300 mt-2">Full chapter content coming soon.</p>
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
          {BOOKS.map((book) => (
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
