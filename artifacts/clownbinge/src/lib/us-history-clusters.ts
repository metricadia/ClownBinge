export interface HistoryCluster {
  id: string;
  label: string;
  description: string;
  googleSignal: string;
  caseNumbers: string[];
}

export const US_HISTORY_CLUSTERS: HistoryCluster[] = [
  {
    id: "legal-architecture-dispossession",
    label: "The Legal Architecture of Dispossession",
    description:
      "How the United States deployed legal instruments — congressional acts, evidentiary standards, insurance exclusion clauses, and municipal zoning proposals — as the primary mechanism for transferring assets from Indigenous, Black, and Mexican populations to the federal government and private white owners. The Dawes Act competency commissions. The California Land Act courts. The Tulsa riot exclusion clauses. The Bracero Program wage escrow accounts. The Sundown Town property covenants. The mechanism was paperwork. The documents are in the public record.",
    googleSignal:
      "Legal history of property dispossession in the United States — primary source documents including congressional acts, court records, insurance policy language, municipal archives, and federal commission reports.",
    caseNumbers: [
      "CB-000385",
      "CB-000386",
      "CB-000387",
      "CB-000098",
      "CB-000096",
      "CB-000013",
    ],
  },
  {
    id: "indigenous-nations-record",
    label: "Indigenous Nations: Survival, Knowledge, and the Demographic Record",
    description:
      "The documented history of First Nations populations — from pre-contact agricultural, ecological, and medical knowledge systems through federal elimination policies, forced child removal programs, and the 2020 Census demographic recovery data confirming survival. Coverage includes the Indian Adoption Project (1958–1967), the knowledge systems Western science is still incorporating, and the genetic and historical record of mestizo ancestry connecting Mexico to pre-colonial North America.",
    googleSignal:
      "Native American and First Nations history documented through federal census data, Bureau of Indian Affairs records, congressional legislation, peer-reviewed genetic research, and archaeological evidence.",
    caseNumbers: [
      "CB-000055",
      "CB-000040",
      "CB-000122",
      "CB-000070",
    ],
  },
  {
    id: "black-american-history",
    label: "Black American History: From the Dismal Swamp to COINTELPRO",
    description:
      "The documented record of Black American resistance and its suppression — from the Great Dismal Swamp Maroon Nation's 150-year free community through the Freedmen's Bureau's 1.5 million pages of Reconstruction documentation, the 1921 Tulsa Race Massacre Commission findings, the FBI's documented planning of the assassination of Fred Hampton, and the linguistic genealogy of 'woke' traced to Leadbelly's 1938 recording.",
    googleSignal:
      "Black American history documented through federal commission reports, Freedmen's Bureau archives, FBI COINTELPRO files, Oklahoma archaeological evidence, and contemporaneous newspaper and recording archives.",
    caseNumbers: [
      "CB-000085",
      "CB-000026",
      "CB-000150",
      "CB-000015",
      "CB-000180",
    ],
  },
  {
    id: "asian-american-history",
    label: "Asian American History: Erasure, Exclusion, and Arrival",
    description:
      "The documented record of Asian American presence and its systematic erasure — from the 1763 arrival of Filipino seamen in the Louisiana bayou (predating the United States by thirteen years) through the Chinese Exclusion Act of 1882, the Japanese American internment under Executive Order 9066, and the military record of the 442nd Regimental Combat Team as the most decorated unit in U.S. military history.",
    googleSignal:
      "Asian American history documented through Spanish colonial records, Louisiana state archives, U.S. congressional legislation, Supreme Court decisions, and military service records.",
    caseNumbers: [
      "CB-000176",
      "CB-000163",
    ],
  },
  {
    id: "scientific-racism-empire",
    label: "Scientific Racism, Eugenics, and American State Violence",
    description:
      "The documented record of state-sponsored scientific racism and its operational legacy — from the American eugenics program that provided Nazi Germany's legal and scientific template to the declassified record of U.S. military intervention in predominantly non-white nations whose natural resources are documented as the rationale in the primary source record.",
    googleSignal:
      "American eugenics history and U.S. foreign military intervention documented through Supreme Court records, declassified CIA files, congressional oversight reports, and peer-reviewed historical scholarship.",
    caseNumbers: [
      "CB-000042",
      "CB-000072",
      "CB-000137",
    ],
  },
  {
    id: "who-built-america",
    label: "Who Built America: The Primary Source Record",
    description:
      "The documented record of American wealth creation — who built it, who paid for it, and who was systematically excluded from its returns. Federal Reserve data on slavery's economic contribution. The Bonus Army veterans the government burned out of Washington in 1932. The documented demographic arithmetic of American identity. The historical record of what 'illegal' has meant across time and to whom. The mathematics of political representation for 335 million people.",
    googleSignal:
      "American economic and political history documented through Federal Reserve data, congressional records, Census Bureau statistics, DNA research, Supreme Court decisions, and federal employment records.",
    caseNumbers: [
      "CB-000161",
      "CB-000109",
      "CB-000148",
      "CB-000124",
      "CB-000083",
      "CB-000002",
      "CB-000135",
      "CB-000111",
      "CB-000029",
    ],
  },
];
