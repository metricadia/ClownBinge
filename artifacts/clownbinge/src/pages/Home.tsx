import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { usePostsFilter, usePostsFeed, usePostsFeedPaginated, usePostDetail } from "@/hooks/use-posts";
import { useHomeSeoHead } from "@/hooks/use-seo-head";
import { Loader2, AlertCircle, ArrowRight, X, HelpCircle } from "lucide-react";

const HIGHLY_POPULAR_SLUG = "strength-differences-men-women-research";

const CATEGORY_LABELS: Record<string, string> = {
  self_owned:          "Self-Owned",
  law_and_justice:     "Law & Justice",
  money_and_power:     "Money & Power",
  us_constitution:     "U.S. Constitution",
  women_and_girls:     "Women & Girls",
  anti_racist_heroes:  "Anti-Racist Heroes",
  us_history:          "U.S. History",
  religion:            "Religion",
  investigations:      "Investigations",
  war_and_inhumanity:  "War & Inhumanity",
  health_and_healing:  "Health & Healing",
  technology:          "Technology",
  censorship:          "Censorship",
  global_south:        "Global South",
  how_it_works:        "How It Works",
  nerd_out:            "NerdOut / Academic",
  disarming_hate:      "Disarming Hate",
};
import { STAFF_PICKS_SLUGS } from "@/config/staff-picks";


export default function Home() {
  useHomeSeoHead();
  const [showNerdoutModal, setShowNerdoutModal] = useState(false);
  const { category, setCategory } = usePostsFilter();
  const isStaffPicks = category === ('staff_picks' as never);

  const { data: staffPicksData, isLoading: staffPicksLoading, error: staffPicksError } = usePostsFeed(isStaffPicks ? undefined : undefined, isStaffPicks ? 60 : 0);
  const { posts: paginatedPosts, isLoading, isLoadingMore, error, hasMore, loadMore } = usePostsFeedPaginated(isStaffPicks ? undefined : category, 20);
  const { data: selfOwnData } = usePostsFeed('self_owned');
  const topSelfOwn = selfOwnData?.posts?.[0] ?? null;
  const { data: highlightedPost } = usePostDetail(HIGHLY_POPULAR_SLUG);
  const { data: foundingDoc } = usePostDetail('respectability-is-unremarkable');

  // Staff picks: filter curated slugs from a full fetch; regular feed uses paginated posts
  // Religion articles are excluded from the "all" feed — they only appear when the religion category is explicitly selected
  const isAllFeed = !category || category === 'all';
  const displayPosts = isStaffPicks
    ? STAFF_PICKS_SLUGS.map(slug => (staffPicksData?.posts ?? []).find(p => p.slug === slug)).filter(Boolean) as typeof paginatedPosts
    : isAllFeed
      ? paginatedPosts.filter(p => p.category !== 'religion')
      : paginatedPosts;

  const feedIsLoading = isStaffPicks ? staffPicksLoading : isLoading;
  const feedError = isStaffPicks ? staffPicksError : error;

  return (
    <Layout onCategoryChange={setCategory} activeCategory={category}>
      <div className="cb-container pt-4 pb-8 sm:pb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Feed Column */}
          <div className="flex-1 max-w-3xl mx-auto lg:mx-0 w-full">
            <div className="pt-2 pb-4">
              {category && category !== 'all' && (
                <div className="mb-5 text-center">
                  <p className="text-sm sm:text-[11px] font-black uppercase tracking-[0.22em] text-primary mb-2">
                    Viewing:&nbsp;
                    <span style={{ color: "#C9980A" }}>
                      {category === 'staff_picks' ? '★ Staff Picks' : (CATEGORY_LABELS[category] ?? category)}
                    </span>
                  </p>
                  <div className="h-px w-full bg-[#F5C518] rounded-full" />
                </div>
              )}
              <div className="mb-6 text-center sm:text-left">
                <h1 className="font-sans font-normal text-lg sm:text-xl text-header mb-1 leading-tight">
                  A Public Accountability News Platform.
                </h1>
                <button
                  onClick={() => setShowNerdoutModal(true)}
                  className="inline-flex items-center gap-2 font-bold text-xl sm:text-2xl text-primary hover:underline cursor-pointer transition-opacity hover:opacity-75 mb-3"
                >
                  Next Generation Verified Research.
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 opacity-60 hover:opacity-100 transition-opacity text-primary" strokeWidth={1.5} />
                </button>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Verified Across 65,000 Global Sources.
                </p>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-muted-foreground/30 text-sm hidden sm:inline px-1">|</span>
                <a href="/submit" className="text-xs font-semibold hover:underline whitespace-nowrap" style={{ color: "#B8860B" }}>Submit a Post</a>
                <span className="text-muted-foreground/30">|</span>
                <a href="/ethics" className="text-xs font-semibold hover:underline whitespace-nowrap" style={{ color: "#B8860B" }}>Ethics Policy</a>
              </div>
            </div>

            {/* NerdOut Modal */}
            {showNerdoutModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-primary/20">
                  {/* Header */}
                  <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-5 flex items-center justify-between border-b border-white/10">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">NerdOut / Academic</p>
                      <h2 className="text-2xl font-bold">Next Generation Verified Research</h2>
                    </div>
                    <button
                      onClick={() => setShowNerdoutModal(false)}
                      className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="px-6 py-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
                    <div>
                      <h3 className="text-lg font-bold text-header mb-2">What It Means</h3>
                      <p>
                        "Next Generation Verified Research" is accountability journalism redesigned for the AI era. Instead of waiting for traditional news cycles to catch institutional contradictions, we systematically aggregate and verify claims against primary sources in real time, then present findings in formats that are immediately verifiable and academically defensible.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-header mb-2">The Architecture</h3>
                      <ul className="space-y-3">
                        <li>
                          <strong className="text-header">Multi-Source Verification:</strong> Every claim is cross-referenced against government records, court filings, legislative transcripts, and peer-reviewed research before publication. No single source. No speculation.
                        </li>
                        <li>
                          <strong className="text-header">Canonical Source Links:</strong> We emit schema-resolved citations as resolvable government URLs (congress.gov, supremecourt.gov, law.cornell.edu) so Google's AI can crawl and verify authority at the source level.
                        </li>
                        <li>
                          <strong className="text-header">APA 7 Formatting:</strong> Every article is structured to be immediately citable in scholarly work, academic papers, and legal proceedings. The bibliography is built in.
                        </li>
                        <li>
                          <strong className="text-header">Topical Authority Signaling:</strong> We use structured data (ScholarlyArticle, ClaimReview, Wikidata sameAs links) to signal topical expertise to semantic search engines and AI models evaluating source authority.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-header mb-2">Why It Matters</h3>
                      <p>
                        In an era where misinformation scales faster than traditional fact-checking can respond, the only effective defense is direct access to the primary source record. We don't interpret the record. We organize it, verify it, and make it searchable. The next generation of research happens at the source layer, not the commentary layer.
                      </p>
                    </div>

                    <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                      <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">The Standard</p>
                      <p className="text-sm text-header">
                        If a claim cannot be traced to a government document, court filing, legislative record, or peer-reviewed research—it is not published on ClownBinge. The record is our only authority.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-muted/40 px-6 py-4 border-t border-border flex justify-end gap-3">
                    <button
                      onClick={() => setShowNerdoutModal(false)}
                      className="px-6 py-2 rounded-full font-semibold text-header border border-border hover:bg-muted transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Highly Popular featured block */}
            {highlightedPost && !category && (
              <div
                className="mb-8 rounded-2xl overflow-hidden border border-blue-200"
                style={{ background: "#E8EDF5" }}
              >
                <div className="px-6 pt-5 pb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0 bg-white/80 border border-blue-200 rounded-full overflow-hidden">
                    <div className="flex items-center px-3 py-1">
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M1 9.5h12M1 9.5L0.5 4l3 2.5L7 1l3.5 5.5 3-2.5L13 9.5" stroke="#1d4ed8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-blue-300 text-xs font-bold select-none">|</span>
                    <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-blue-500">
                      {CATEGORY_LABELS[highlightedPost.category] ?? highlightedPost.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 tracking-wide">{highlightedPost.caseNumber}</span>
                </div>
                <div className="px-6 py-4">
                  <Link href={`/case/${highlightedPost.slug}`}>
                    <h2 className="font-sans font-extrabold text-xl sm:text-2xl text-header leading-snug mb-3 hover:text-primary transition-colors cursor-pointer">
                      {highlightedPost.title}
                    </h2>
                  </Link>
                  {highlightedPost.teaser && (
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {highlightedPost.teaser}
                    </p>
                  )}
                  <Link
                    href={`/case/${highlightedPost.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                  >
                    Read the Record
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {feedIsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                <p className="font-bold">Digging up the receipts...</p>
              </div>
            ) : feedError ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-800">
                <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-1">Failed to load feed</h3>
                <p className="text-sm opacity-80">The servers might be dodging accountability right now.</p>
              </div>
            ) : displayPosts.length === 0 ? (
              <div className="bg-muted border border-border rounded-xl p-12 text-center">
                <div className="text-4xl mb-4">🗄️</div>
                <h3 className="font-bold text-xl mb-2 text-foreground">Archive is Empty</h3>
                <p className="text-muted-foreground">No cases found for this category yet.</p>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {displayPosts.map((post, index) => (
                  <div key={post.id}>
                    <PostCard post={post} />
                    
                    {/* Insert ad slot placeholder after 3rd post */}
                    {index === 2 && (
                      <div className="my-10">
                        <a
                          href="/contact"
                          className="block w-full overflow-hidden rounded-xl cursor-pointer"
                          aria-label="Advertise on ClownBinge"
                          title="Your ad could be here. Click to learn about advertising with ClownBinge."
                        >
                          <img
                            src={`${import.meta.env.BASE_URL}images/ad-placeholder.png`}
                            alt="Your Ad Here - Advertise on ClownBinge. Full-width placement available. High visibility."
                            className="w-full h-auto object-cover"
                            loading="lazy"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Load More */}
            {!isStaffPicks && displayPosts.length > 0 && (hasMore || isLoadingMore) && (
              <div className="py-12 flex justify-center">
                {isLoadingMore ? (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="font-bold text-sm">Loading more cases...</span>
                  </div>
                ) : (
                  <button
                    onClick={loadMore}
                    className="bg-white border-2 border-border text-foreground hover:border-primary hover:text-primary font-bold px-8 py-3 rounded-xl transition-colors shadow-sm"
                  >
                    Load More Cases
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[320px] shrink-0 space-y-8">
            <div className="sticky top-[96px]">
              {/* Founding Document block */}
              {foundingDoc && (
                <div
                  className="mb-6 rounded-2xl overflow-hidden border border-blue-200"
                  style={{ background: "#E8EDF5" }}
                >
                  {/* Header — two-tier authority layout */}
                  <div className="px-5 pt-5 pb-3 border-b border-blue-200">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="font-mono text-base font-extrabold tracking-[0.06em] leading-none" style={{ color: "#1A1A2E" }}>
                          {foundingDoc.caseNumber}
                        </p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#5A5A5A" }}>
                          ClownBinge Record
                        </p>
                      </div>
                      <div className="shrink-0 rounded-md border px-2 py-0.5" style={{ borderColor: "rgba(201,162,39,0.5)", background: "rgba(201,162,39,0.12)" }}>
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#E91E8C" }}>
                          Verified
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ borderColor: "rgba(107,53,32,0.3)", background: "rgba(107,53,32,0.08)", color: "#6B3520" }}>
                      {CATEGORY_LABELS[foundingDoc.category] ?? foundingDoc.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="px-5 py-3">
                    <Link href={`/case/${foundingDoc.slug}`}>
                      <h3 className="font-sans font-extrabold text-base leading-snug mb-3 hover:opacity-70 transition-opacity cursor-pointer" style={{ color: "#1A1A2E" }}>
                        {foundingDoc.title}
                      </h3>
                    </Link>
                    <p className="text-sm leading-relaxed mb-4 line-clamp-2 text-slate-500">
                      {foundingDoc.teaser}
                    </p>
                    <div className="border-t border-blue-200 pt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-400 truncate max-w-[55%]">
                        {foundingDoc.verifiedSource ? `Source: ${foundingDoc.verifiedSource}` : "Founding Document"}
                      </span>
                      <Link
                        href={`/case/${foundingDoc.slug}`}
                        className="text-xs font-black uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-1"
                        style={{ color: "#1A3A8F" }}
                      >
                        Read More
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Self-Own card -- pulls real data */}
              {topSelfOwn && (
                <div className="bg-primary text-white rounded-xl p-6 shadow-xl shadow-primary/20 mb-8 border border-primary-foreground/10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🫵</span>
                    <h3 className="font-display font-extrabold text-xl">Top Self-Own</h3>
                  </div>
                  <h4 className="font-bold text-lg mb-2 leading-snug">
                    {topSelfOwn.title}
                  </h4>
                  {topSelfOwn.teaser && (
                    <p className="text-white/80 text-sm mb-4 line-clamp-3">
                      {topSelfOwn.teaser}
                    </p>
                  )}
                  <Link href={`/post/${topSelfOwn.slug}`} className="block w-full bg-secondary text-dark-text font-bold uppercase tracking-wider text-sm py-3 rounded-lg hover:bg-white transition-colors text-center">
                    View The Record
                  </Link>
                </div>
              )}

              {/* Newsletter Inline Widget */}
              <div className="bg-white border-2 border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2 text-foreground">Never Miss a Case</h3>
                <p className="text-sm text-muted-foreground mb-4">Get the weekly roundup of political hypocrisy.</p>
                <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-border focus:border-primary focus:outline-none transition-colors"
                  />
                  <button className="w-full bg-header text-white font-bold py-2.5 rounded-lg hover:bg-header/90 transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>
              
              {/* Sidebar Ad Slot */}
              <div className="mt-8">
                <a
                  href="/contact"
                  className="block w-full overflow-hidden rounded-xl cursor-pointer"
                  aria-label="Advertise on ClownBinge"
                  title="Your ad could be here. Click to learn about advertising with ClownBinge."
                >
                  <img
                    src={`${import.meta.env.BASE_URL}images/ad-placeholder.png`}
                    alt="Your Ad Here - Advertise on ClownBinge. Full-width placement available. High visibility."
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </a>
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </Layout>
  );
}
