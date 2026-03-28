import { Link } from "wouter";
import { BookOpen, ArrowRight, FlaskConical, GraduationCap, Briefcase } from "lucide-react";

interface FactBookMeta {
  vol: string;
  shortTitle: string;
  pitch: string;
  accent: string;
}

const FACTBOOK_MAP: Record<string, FactBookMeta> = {
  "no-black-americans-violent-crime-racist-narrative-2024": {
    vol: "Vol. 01",
    shortTitle: "Black Americans & Violent Crime",
    pitch: "The full empirical record — federal crime data, peer-reviewed criminology, and the documented political history of a racist narrative.",
    accent: "#FF0099",
  },
  "social-media-disinformation-platforms-facebook-x-youtube-tiktok-receipts": {
    vol: "Vol. 02",
    shortTitle: "Platform Receipts",
    pitch: "Congressional testimony, whistleblower filings, and SEC disclosures assembled into a single sourced indictment of the disinformation industrial complex.",
    accent: "#F5C518",
  },
  "second-amendment-racial-disparity-philando-castile": {
    vol: "Vol. 03",
    shortTitle: "The 2nd Amendment's Race Problem",
    pitch: "The Founders' writings, state militia statutes, and Supreme Court decisions — the full constitutional record on race and gun rights.",
    accent: "#1A3A8F",
  },
  "dei-ruse-obama-trump-appointee-qualifications": {
    vol: "Vol. 04",
    shortTitle: "DEI Was a Ruse",
    pitch: "Side-by-side credential comparisons of 40 agency appointments across both administrations. The data is unambiguous.",
    accent: "#00D084",
  },
  "cable-news-binary-media-bias-cnn-msnbc-fox-documented-record-2026": {
    vol: "Vol. 05",
    shortTitle: "CNN. MSNBC. Fox. Confirmed.",
    pitch: "Court disclosures, internal documents, and regulatory findings applied equally to all three networks. The receipts are primary-sourced.",
    accent: "#F5C518",
  },
  "hijacking-voice-gerrymandering-minority-political-autonomy-supreme-court": {
    vol: "Vol. 06",
    shortTitle: "Hijacking Voice",
    pitch: "Supreme Court rulings, Census overlays, and state redistricting records that show exactly how legal map-rigging works.",
    accent: "#C084FC",
  },
  "cb-000041-united-states-built-by-immigrants-record-confirms-it": {
    vol: "Vol. 07",
    shortTitle: "Who Built America",
    pitch: "Federal land grants, census records, congressional documents, and economic scholarship — the full account of who built this country and what they received.",
    accent: "#1A3A8F",
  },
  "judaism-zionism-distinction-documented-record-2026": {
    vol: "Vol. 08",
    shortTitle: "Judaism ≠ Zionism",
    pitch: "Founding documents of Zionism, British Mandate records, UN resolutions, and anti-Zionist Jewish primary sources — the complete historical separation.",
    accent: "#38BDF8",
  },
  "herodotus-witness-kemet-black-african-civilization-seat-human-knowledge": {
    vol: "Vol. 09",
    shortTitle: "Kemet: The African Record",
    pitch: "Herodotus, pre-dynastic DNA studies, ancient Egyptian art, and 3,000 years of archaeological evidence assembled in one place.",
    accent: "#F5C518",
  },
  "national-debt-military-spending-interest-payments-generational-cost": {
    vol: "Vol. 10",
    shortTitle: "$2.8 Billion Per Day",
    pitch: "Treasury data, CBO projections, and Federal Reserve reports that trace the national debt to its specific political decisions — by name and vote.",
    accent: "#00D084",
  },
};

export function FactBookUpsell({ slug }: { slug: string }) {
  const meta = FACTBOOK_MAP[slug];
  if (!meta) return null;

  return (
    <div
      className="rounded-xl overflow-hidden mb-8"
      style={{ border: `2px solid ${meta.accent}`, background: "linear-gradient(135deg, #0a1528 0%, #1A3A8F 100%)" }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "#0d1f54", borderBottom: `1px solid ${meta.accent}33` }}>
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: meta.accent }} />
          <span className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: meta.accent }}>
            FactBook™
          </span>
          <span className="text-xs" style={{ color: `${meta.accent}55` }}>|</span>
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            {meta.vol} · Deeper Dive
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Primary Sources Only</span>
      </div>

      {/* Body */}
      <div className="px-4 py-4 sm:flex sm:items-start sm:gap-5">
        <div className="flex-1 min-w-0 mb-4 sm:mb-0">
          <h3 className="font-sans font-extrabold text-base text-white leading-snug mb-1">
            {meta.shortTitle}
          </h3>
          <p className="text-white/65 text-sm leading-relaxed mb-3">
            {meta.pitch}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {[
              { icon: <FlaskConical className="w-3 h-3" />, label: "Empirical" },
              { icon: <GraduationCap className="w-3 h-3" />, label: "Scholarly" },
              { icon: <Briefcase className="w-3 h-3" />, label: "For Business & Academics" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: meta.accent }}>
                {icon}
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
          <div className="text-2xl font-extrabold text-white">$24.95</div>
          <Link
            href="/bookstore"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full font-extrabold text-xs whitespace-nowrap transition-opacity hover:opacity-85"
            style={{ background: meta.accent, color: meta.accent === "#F5C518" ? "#0a1528" : "#ffffff" }}
          >
            Get the FactBook™
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-[10px] text-white/35 font-mono tracking-wider">INSTANT PDF DELIVERY</span>
        </div>
      </div>
    </div>
  );
}
