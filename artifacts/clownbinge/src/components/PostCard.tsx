import { Link } from "wouter";
import { format } from "date-fns";
import { Video } from "lucide-react";
import type { Post } from "@workspace/api-client-react";
import { VerifiedBadge } from "./VerifiedBadge";
import { UserSubmittedBadge } from "./UserSubmittedBadge";
import { SelfOwnScoreBadge } from "./SelfOwnScoreBadge";

const ABBREV: [RegExp, string][] = [
  [/Congressional Budget Office\b[^;]*/gi,   "CBO"],
  [/Congressional Record\b[^;]*/gi,          "Cong. Record"],
  [/Senate Vote #\d+[^;]*/gi,               "GovTrack"],
  [/House Vote #\d+[^;]*/gi,                "GovTrack"],
  [/GovTrack\b[^;]*/gi,                     "GovTrack"],
  [/senate\.gov[^;]*/gi,                    "senate.gov"],
  [/Federal Election Commission\b[^;]*/gi,   "FEC"],
  [/U\.S\. Citizenship and Immigration Services\b[^;]*/gi, "USCIS"],
  [/American Library Association\b[^;]*/gi,  "ALA"],
  [/Ellis Island Foundation\b[^;]*/gi,       "Ellis Island"],
  [/House (Committee on the )?Judiciary\b[^;]*/gi, "House Judiciary"],
  [/OpenSecrets\b[^;]*/gi,                   "OpenSecrets"],
  [/C-SPAN\b[^;]*/gi,                        "C-SPAN"],
  [/American Israel Public Affairs Committee\b[^;]*/gi, "AIPAC"],
  [/Recording Academy\b[^;]*/gi,             "Grammy/RIAA"],
  [/State Bar of Texas\b[^;]*/gi,            "TX State Bar"],
  [/Bexar County[^;]*/gi,                    "Bexar Co. Courts"],
  [/Maricopa County[^;]*/gi,                 "Maricopa Co."],
  [/Palmetto County[^;]*/gi,                 "County Records"],
  [/Court Records?\b[^;]*/gi,                "Court Records"],
  [/official\s+(?:Senate|House|Congressional)\s+social media[^;]*/gi, "Official Posts"],
  [/\w+\s+official\s+Senate\s+social media[^;]*/gi, "Official Posts"],
  [/(?:Biden|Trump|Obama|Bush|Clinton)\s+\w+\s+speech transcript[^;]*/gi, "Presidential Speech"],
  [/(?:Biden|Trump|Obama|Bush|Clinton)\s+speech transcript[^;]*/gi, "Presidential Speech"],
  [/NBC News[^;]*/gi,                        "NBC News"],
  [/The Hill[^;]*/gi,                        "The Hill"],
  [/HuffPost[^;]*/gi,                        "HuffPost"],
  [/Rolling Stone[^;]*/gi,                   "Rolling Stone"],
  [/Politico[^;]*/gi,                        "Politico"],
  [/Washington Post[^;]*/gi,                 "Wash. Post"],
  [/New York Times[^;]*/gi,                  "NY Times"],
  [/Los Angeles Times[^;]*/gi,               "LA Times"],
  [/Associated Press[^;]*/gi,                "AP"],
  [/Reuters[^;]*/gi,                         "Reuters"],
  [/ProPublica[^;]*/gi,                      "ProPublica"],
  [/The Guardian[^;]*/gi,                    "The Guardian"],
  [/Axios[^;]*/gi,                           "Axios"],
];

function abbreviateSource(raw: string | null | undefined): string {
  if (!raw) return "Verified Public Record";
  const segments = raw.split(/[;|]/).map(s => s.trim()).filter(Boolean);
  const shortened = segments.slice(0, 2).map(seg => {
    let s = seg;
    for (const [pattern, abbr] of ABBREV) s = s.replace(pattern, abbr);
    return s.replace(/\s+/g, " ").trim();
  });
  return `Source: ${shortened.join(" / ")}`;
}

export function PostCard({ post }: { post: Post }) {
  const isSelfOwned = post.category === "self_owned";
  const isAntiRacist = post.category === "anti_racist_hero";
  const isVideo = post.hasVideo || post.category === "clown_electeds";
  
  const categoryLabels: Record<string, string> = {
    political: "Political",
    self_owned: "Self-Owned",
    clown_electeds: "Clown Electeds",
    religious: "Religious",
    cultural: "Cultural",
    anti_racist_hero: "Anti-Racist Hero"
  };

  // Base card styles depend on category
  const cardClasses = isSelfOwned
    ? "bg-white text-foreground border-primary shadow-lg shadow-primary/20"
    : "bg-white text-foreground border-border shadow-sm hover:shadow-md";

  const textClasses = "text-dark-text";
  const mutedTextClasses = "text-muted-foreground";

  return (
    <Link href={`/case/${post.slug}`} className="block group">
      <div className={`
        relative rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1
        ${cardClasses}
      `}>
        {/* Accent line at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary" />

        <div className="p-5 sm:p-6">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-4 gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-semibold tracking-tight text-primary">
                {post.caseNumber}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border border-primary/20 text-primary bg-primary/5">
                {categoryLabels[post.category] || post.category}
              </span>
            </div>
            <div className="shrink-0 flex items-center gap-2 flex-wrap justify-end">
              {post.userSubmitted && <UserSubmittedBadge />}
              {isSelfOwned && post.selfOwnScore != null && <SelfOwnScoreBadge score={post.selfOwnScore} />}
              <VerifiedBadge source={post.verifiedSource} date={post.dateOfIncident ? format(new Date(post.dateOfIncident), 'MMM d, yyyy') : undefined} />
            </div>
          </div>

          {/* Title & Teaser */}
          <div className="mb-6">
            <h2 className={`font-sans font-bold text-xl sm:text-2xl leading-tight mb-3 group-hover:underline decoration-2 underline-offset-4 ${textClasses}`}>
              {post.title}
            </h2>
            <p className={`line-clamp-2 text-sm sm:text-base leading-relaxed ${mutedTextClasses}`}>
              {post.teaser}
            </p>
          </div>

          {/* Video Thumbnail (if applicable) */}
          {isVideo && post.videoThumbnail && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-slate-900 group-hover:ring-2 ring-primary ring-offset-2 transition-all">
              <img 
                src={post.videoThumbnail} 
                alt="Video thumbnail" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary/90 text-white p-3 rounded-full shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <Video className="w-6 h-6 ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                Watch the receipts
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-current/10 gap-4">
            <div className={`text-xs font-medium truncate min-w-0 ${mutedTextClasses}`}>
              {abbreviateSource(post.verifiedSource)}
            </div>
            <div className={`text-xs font-bold uppercase tracking-wider ${isSelfOwned ? 'text-secondary' : 'text-primary'} group-hover:translate-x-1 transition-transform`}>
              Read More &gt;
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
