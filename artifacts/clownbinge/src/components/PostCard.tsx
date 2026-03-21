import { Link } from "wouter";
import { format } from "date-fns";
import { Video } from "lucide-react";
import type { Post } from "@workspace/api-client-react";
import { VerifiedBadge } from "./VerifiedBadge";

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
    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
    : isAntiRacist
    ? "bg-secondary text-gray-900 border-secondary shadow-lg shadow-secondary/30"
    : "bg-white text-foreground border-border shadow-sm hover:shadow-md";

  const textClasses = isSelfOwned ? "text-white" : isAntiRacist ? "text-gray-900" : "text-dark-text";
  const mutedTextClasses = isSelfOwned ? "text-white/80" : isAntiRacist ? "text-gray-700" : "text-muted-foreground";

  return (
    <Link href={`/case/${post.slug}`} className="block group">
      <div className={`
        relative rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1
        ${cardClasses}
      `}>
        {/* Accent line at bottom */}
        <div className={`absolute bottom-0 left-0 w-full h-1 ${isAntiRacist ? 'bg-header' : 'bg-secondary'}`} />

        <div className="p-5 sm:p-6">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-4 gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`font-mono text-sm font-semibold tracking-tight ${isSelfOwned ? 'text-secondary' : isAntiRacist ? 'text-header' : 'text-primary'}`}>
                {post.caseNumber}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border ${
                isSelfOwned ? 'border-white/30 text-white' : isAntiRacist ? 'border-header/30 text-header bg-header/10' : 'border-primary/20 text-primary bg-primary/5'
              }`}>
                {categoryLabels[post.category] || post.category}
              </span>
            </div>
            <div className="shrink-0">
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
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-current/10">
            <div className={`text-xs font-medium ${mutedTextClasses}`}>
              {post.verifiedSource ? `Source: ${post.verifiedSource}` : 'Verified Public Record'}
            </div>
            <div className={`text-xs font-bold uppercase tracking-wider ${isSelfOwned ? 'text-secondary' : isAntiRacist ? 'text-header' : 'text-primary'} group-hover:translate-x-1 transition-transform`}>
              Read More &gt;
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
