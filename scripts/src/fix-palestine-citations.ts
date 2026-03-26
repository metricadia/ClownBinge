import { pool } from "@workspace/db";

const slug = "jericho-9000-bce-archaeological-record-palestinian-civilization";

const verifiedSource = [
  "UNESCO World Heritage: Tell es-Sultan/Ancient Jericho (2023) :: UNESCO World Heritage Committee. (2023). Tell es-Sultan/Ancient Jericho. United Nations Educational, Scientific and Cultural Organization, Paris, France. Inscription decision citing archaeological record extending to the 10th millennium BCE.",
  "UNESCO World Heritage: Church of the Nativity, Bethlehem (2012) :: UNESCO World Heritage Committee. (2012). Birthplace of Jesus: Church of the Nativity and the Pilgrimage Route, Bethlehem. United Nations Educational, Scientific and Cultural Organization, Paris, France.",
  "UNESCO World Heritage: Cultural Landscape, Battir (2014) :: UNESCO World Heritage Committee. (2014). Palestine: Land of Olives and Vines, Cultural Landscape of Southern Jerusalem, Battir. United Nations Educational, Scientific and Cultural Organization, Paris, France.",
  "UNESCO Intangible Cultural Heritage: Palestinian Embroidery, Tatriz (2021) :: UNESCO. (2021). Palestinian Embroidery, Tatriz. Representative List of the Intangible Cultural Heritage of Humanity. United Nations Educational, Scientific and Cultural Organization, Paris, France.",
  "Kenyon, Kathleen M.: Tell es-Sultan Excavation Reports (1952-1958) :: Kenyon, K. M. (1957). Digging Up Jericho. Ernest Benn Limited, London, United Kingdom. British School of Archaeology in Jerusalem field excavation reports, Tell es-Sultan, 1952-1958.",
  "Merenptah Stele (1208 BCE): Egyptian Museum, Cairo :: Egyptian Museum, Cairo. (1208 BCE). Merenptah Stele, Victory Stele of Merneptah. Cairo, Egypt. Earliest known extrabiblical written reference to the Levantine territory by a foreign state power.",
  "Amarna Letters (14th century BCE): British Museum, Vorderasiatisches Museum, Egyptian Museum :: British Museum, Vorderasiatisches Museum Berlin, and Egyptian Museum Cairo. (c. 1360-1332 BCE). Amarna Letters, EA Tablets. Diplomatic correspondence from Canaanite city-state administrators in Akkadian cuneiform script.",
  "Al-Muqaddasi: Ahsan al-Taqasim fi Marifat al-Aqalim (985 CE) :: Al-Muqaddasi, M. A. (985 CE). Ahsan al-Taqasim fi Marifat al-Aqalim, The Best Divisions for Knowledge of the Regions. Author born Jerusalem, c. 945 CE. Primary geographic record of Palestinian urban centers including Jerusalem, Gaza, and Ramla.",
  "British Mandatory Authorities: Village Statistics (1945) :: Government of Palestine, British Mandatory Administration. (1945). Village Statistics 1945, A Classification of Land and Area Ownership in Palestine. British Mandatory Administration, Jerusalem, Palestine. Documents 1,350 Palestinian villages.",
  "Herodotus: Histories (c. 440 BCE) :: Herodotus. (c. 440 BCE). The Histories, Historiai. Estimated composition 450-420 BCE. Book 3.91. Earliest known written use of the term Palaistine in the Greek historical record.",
  "Journal of Palestine Studies: University of California Press (1971-present) :: University of California Press. (1971-present). Journal of Palestine Studies. Berkeley, California. Peer-reviewed academic journal covering archaeology, history, and documentation of the Palestinian record.",
].join("; ");

async function main() {
  await pool.query(
    "UPDATE posts SET verified_source = $1, locked = true WHERE slug = $2",
    [verifiedSource, slug]
  );

  // Verify count using same logic as UI
  const check = await pool.query("SELECT verified_source FROM posts WHERE slug = $1", [slug]);
  const vs = check.rows[0].verified_source as string;
  const entries = vs.split(/[;|]/).map((e: string) => e.trim()).filter(Boolean);
  console.log(`Badge count (UI logic): ${entries.length}`);
  entries.forEach((e: string, i: number) => {
    const label = e.split("::")[0].trim();
    console.log(`  ${i + 1}. ${label}`);
  });

  await pool.end();
}

main().catch(console.error);
