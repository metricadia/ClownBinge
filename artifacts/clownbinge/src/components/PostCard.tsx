import { Link } from "wouter";
import { format } from "date-fns";
import { Video, Star } from "lucide-react";
import type { Post } from "@workspace/api-client-react";
import { VerifiedBadge } from "./VerifiedBadge";
import { UserSubmittedBadge } from "./UserSubmittedBadge";
import { SelfOwnScoreBadge } from "./SelfOwnScoreBadge";
import { abbreviateSource } from "@/lib/source-abbrev";
import { STAFF_PICKS_SLUGS } from "@/config/staff-picks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CATEGORY_LABELS: Record<string, string> = {
  self_owned:         "Self-Owned",
  law_and_justice:    "Law & Justice Files",
  money_and_power:    "Money & Power",
  us_constitution:    "U.S. Constitution",
  women_and_girls:    "Women & Girls",
  anti_racist_heroes: "Anti-Racist Heroes",
  us_history:         "U.S. History",
  religion:           "Religion",
  investigations:     "Investigations",
  war_and_inhumanity: "War & Inhumanity",
  health_and_healing: "Health & Healing",
  technology:         "Technology",
  censorship:         "Censorship",
  global_south:       "Global South",
  how_it_works:       "How It Works",
  nerd_out:           "NerdOut",
  disarming_hate:           "Disarming Hate",
  native_and_first_nations: "Native & First Nations",
};

const CATEGORY_BORDER: Record<string, string> = {
  self_owned:         "border-primary shadow-lg shadow-primary/20",
  law_and_justice:    "border-red-700 shadow-lg shadow-red-700/20",
  money_and_power:    "border-emerald-700 shadow-lg shadow-emerald-700/20",
  us_constitution:    "border-indigo-700 shadow-lg shadow-indigo-700/20",
  women_and_girls:    "border-rose-600 shadow-lg shadow-rose-600/20",
  anti_racist_heroes: "border-secondary shadow-lg shadow-secondary/20",
  us_history:         "border-teal-700 shadow-lg shadow-teal-700/20",
  religion:           "border-violet-700 shadow-lg shadow-violet-700/20",
  investigations:     "border-amber-600 shadow-lg shadow-amber-600/20",
  war_and_inhumanity: "border-orange-700 shadow-lg shadow-orange-700/20",
  health_and_healing: "border-green-700 shadow-lg shadow-green-700/20",
  technology:         "border-sky-600 shadow-lg shadow-sky-600/20",
  censorship:         "border-zinc-700 shadow-lg shadow-zinc-700/20",
  global_south:       "border-cyan-700 shadow-lg shadow-cyan-700/20",
  how_it_works:       "border-slate-600 shadow-lg shadow-slate-600/20",
  nerd_out:           "border-fuchsia-900 shadow-lg shadow-fuchsia-900/20",
  disarming_hate:           "border-pink-600 shadow-lg shadow-pink-600/20",
  native_and_first_nations: "border-amber-700 shadow-lg shadow-amber-700/20",
};

function formatWordCount(body: string | null | undefined): string | null {
  if (!body) return null;
  const wc = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  if (wc < 100) return null;
  if (wc >= 1000) return `~${(wc / 1000).toFixed(1).replace(/\.0$/, "")}K words`;
  return `~${wc} words`;
}

export function PostCard({ post }: { post: Post }) {
  const isVideo = post.hasVideo;
  const wordCountLabel = formatWordCount((post as any).body);
  const cardClasses = `bg-white text-foreground ${CATEGORY_BORDER[post.category] ?? "border-border shadow-sm hover:shadow-md"}`;

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
          {/* Header — Authority Line */}
          <div className="mb-3 pb-3 border-b border-[#1A1A2E]/10">
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="min-w-0">
                <p className="font-mono text-lg sm:text-xl font-extrabold tracking-[0.06em] text-[#1A1A2E] leading-none">
                  {post.caseNumber}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] font-semibold text-[#5A5A5A]">
                  Metricadia Research
                </p>
              </div>
              <div className="shrink-0">
                <VerifiedBadge source={post.verifiedSource} date={post.dateOfIncident ? format(new Date(post.dateOfIncident), 'MMM d, yyyy') : undefined} />
              </div>
            </div>

            {/* Metadata Line — category + optional badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded border border-[#6B3520]/30 bg-[#6B3520]/8 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B3520]">
                {CATEGORY_LABELS[post.category] || post.category}
              </span>
              {post.userSubmitted && <UserSubmittedBadge />}
              {post.selfOwnScore != null && <SelfOwnScoreBadge score={post.selfOwnScore} />}
              {STAFF_PICKS_SLUGS.includes(post.slug) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-600 text-white">
                  ★ Staff Pick
                </span>
              )}
              {(post as any).premiumOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ background: "#FEF3C7", color: "#92400E", borderColor: "#D97706" }}>
                  <Star className="w-2.5 h-2.5 fill-current" /> Member
                </span>
              )}
              {post.category === "nerd_out" && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-500 text-white cursor-help">
                        Academic
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="max-w-[220px] text-center bg-slate-800 text-white border-0 leading-snug py-2.5 px-3"
                    >
                      Academic-level analysis for researchers, educators, and the deeply curious. Longer read. Heavier sourcing. Worth it.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
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
            <div className={`flex items-center gap-2 text-xs font-medium truncate min-w-0 ${mutedTextClasses}`}>
              <span className="truncate">{abbreviateSource(post.verifiedSource, true)}</span>
              {wordCountLabel && (
                <span className="shrink-0 text-xs font-medium text-muted-foreground/80 tabular-nums">
                  · {wordCountLabel}
                </span>
              )}
              {post.category === "nerd_out" && (
                <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-300">
                  Scholarly Read
                </span>
              )}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary group-hover:translate-x-1 transition-transform">
              Read More &gt;
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
