import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { FeaturedSlider } from "@/components/FeaturedSlider";
import { usePostsFilter, usePostsFeed, usePostsFeedPaginated, usePostDetail } from "@/hooks/use-posts";
import { useHomeSeoHead } from "@/hooks/use-seo-head";
import { Loader2, AlertCircle, ArrowRight, X, HelpCircle } from "lucide-react";

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
  disarming_hate:           "Disarming Hate",
  native_and_first_nations: "Native & First Nations",
};
export default function Home() {
  useHomeSeoHead();
  const [showNerdoutModal, setShowNerdoutModal] = useState(false);
  const [modalLarge, setModalLarge] = useState(false);
  const { category, setCategory } = usePostsFilter();
  const isStaffPicks = category === ('staff_picks' as never);

  const { data: staffPicksData, isLoading: staffPicksLoading, error: staffPicksError } = usePostsFeed(undefined, 50, isStaffPicks ? true : undefined);
  const { posts: paginatedPosts, isLoading, isLoadingMore, error, hasMore, loadMore } = usePostsFeedPaginated(isStaffPicks ? undefined : category, 20);
  const { data: selfOwnData } = usePostsFeed('self_owned');
  const topSelfOwn = selfOwnData?.posts?.[0] ?? null;
  const { data: foundingDoc } = usePostDetail('respectability-is-unremarkable');

  // Staff picks: driven by staffPick flag from the database — no hardcoded slug list
  // Religion articles are excluded from the "all" feed — they only appear when the religion category is explicitly selected
  const isAllFeed = !category || category === 'all';
  const displayPosts = isStaffPicks
    ? (staffPicksData?.posts ?? []).filter((p: any) => p.staffPick === true)
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
              <div className="mb-6 text-center">
                <button
                  onClick={() => setShowNerdoutModal(true)}
                  className="inline-flex items-center justify-center gap-2 font-bold text-xl sm:text-2xl text-primary hover:underline cursor-pointer transition-opacity hover:opacity-75 mb-1"
                >
                  Deep Dives + Verified Research.
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 opacity-60 hover:opacity-100 transition-opacity text-primary" strokeWidth={1.5} />
                </button>
                <h1 className="font-sans font-normal text-sm sm:text-base text-muted-foreground mb-3 leading-tight">
                  by Metricadia Research LLC
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                  Government records. Court filings. Peer-reviewed science.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground/70">
                  Verified across 65,000+ global primary sources.
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-primary/20">

                  {/* Header */}
                  <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-5 flex items-center justify-between border-b border-white/10 z-10">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Our Editorial Standard</p>
                      <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">Deep Dives + Verified Research</h2>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Font resizer */}
                      <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
                        <button
                          onClick={() => setModalLarge(false)}
                          className={`text-xs font-bold px-1.5 py-0.5 rounded-full transition-colors ${!modalLarge ? 'bg-white text-primary' : 'text-white/70 hover:text-white'}`}
                          aria-label="Smaller text"
                        >a</button>
                        <button
                          onClick={() => setModalLarge(true)}
                          className={`text-base font-bold px-1.5 py-0.5 rounded-full transition-colors ${modalLarge ? 'bg-white text-primary' : 'text-white/70 hover:text-white'}`}
                          aria-label="Larger text"
                        >A</button>
                      </div>
                      <button
                        onClick={() => setShowNerdoutModal(false)}
                        className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`px-6 py-8 space-y-7 leading-relaxed text-black transition-all ${modalLarge ? 'text-base' : 'text-sm'}`}>

                    <div>
                      <h3 className="text-lg font-extrabold text-black mb-3 flex items-center gap-2">
                        <span className="text-primary">01</span> Primary Sources. Only. Every Time.
                      </h3>
                      <p>
                        Every article on ClownBinge is built <strong>exclusively from peer-reviewed research, government records, court filings, congressional transcripts, and verified institutional data.</strong> Not summaries. Not "a source familiar with the matter." Not vibes.
                      </p>
                      <p className="mt-3">
                        The actual document. The actual study. The actual roll-call vote. If a claim cannot be traced <strong>directly to its origin</strong> — the statute, the deposition, the FOIA release, the data table — it does not exist on this platform. That is not a standard we aim for. It is the only standard we recognize.
                      </p>
                    </div>

                    <div className="h-px bg-black/8 rounded-full" />

                    <div>
                      <h3 className="text-lg font-extrabold text-black mb-3 flex items-center gap-2">
                        <span className="text-primary">02</span> 1,500 Words Minimum — and That's Not an Accident.
                      </h3>
                      <p>
                        The truth rarely fits in a tweet. Our deep dives start at 1,500 words because <strong>the misleading headline is almost never the whole story.</strong> The law that sounds simple has a carve-out. The statistic that sounds damning has context someone buried. The politician who sounds principled has a voting record that says otherwise.
                      </p>
                      <p className="mt-3">
                        Short-form journalism trades precision for speed. <strong>We trade speed for precision.</strong> You will leave each ClownBinge article knowing more than you did when you arrived — not just angrier.
                      </p>
                    </div>

                    <div className="h-px bg-black/8 rounded-full" />

                    <div>
                      <h3 className="text-lg font-extrabold text-black mb-3 flex items-center gap-2">
                        <span className="text-primary">03</span> Why This Even Has to Exist
                      </h3>
                      <p>
                        Most people have been failed by the media ecosystem — not because journalists are lazy, but because <strong>the economic incentives of the attention economy reward outrage over accuracy</strong> and velocity over depth. Cable news figured out decades ago that keeping you afraid and confused is more profitable than keeping you informed.
                      </p>
                      <p className="mt-3">
                        ClownBinge was built as a direct counter to that model. No cable. No pundits. No "both sides" theater performed for symmetry's sake. <strong>Just the record — organized, verified, and searchable.</strong> We do not tell you what to think. We hand you the receipts and trust you to think for yourself.
                      </p>
                    </div>

                    <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">The Rule That Never Bends</p>
                      <p className={`font-semibold text-black ${modalLarge ? 'text-base' : 'text-sm'}`}>
                        No peer-reviewed source. No verifiable primary document. <strong>No publication.</strong> The record is our only authority — and it always will be.
                      </p>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-black/8 flex items-center justify-between gap-3">
                    <p className="text-xs text-black/40 font-medium">Metricadia Research LLC · 65,000+ verified sources</p>
                    <button
                      onClick={() => setShowNerdoutModal(false)}
                      className="px-6 py-2 rounded-full font-bold text-sm text-white bg-primary hover:bg-primary/90 transition-colors"
                    >
                      Got It
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* Featured Slider — 5 binge-read articles, auto-advances every 7s */}
            {!category && <FeaturedSlider />}

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
              {/* Founding Document — Signature "Why We Exist" tile */}
              {foundingDoc && (
                <Link href={`/case/${foundingDoc.slug}`} className="block mb-6 group">
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "linear-gradient(155deg, #0f1f5c 0%, #192e7a 55%, #1a1040 100%)",
                      boxShadow: "0 8px 32px rgba(25,46,122,0.45), 0 1px 0 rgba(245,197,24,0.3) inset",
                    }}
                  >
                    {/* Top label bar */}
                    <div
                      className="px-5 pt-4 pb-3 flex items-center justify-between"
                      style={{ borderBottom: "1px solid rgba(245,197,24,0.18)" }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[9px] font-black uppercase tracking-[0.22em]"
                          style={{ color: "#F5C518" }}
                        >
                          Why We Exist
                        </span>
                        <span style={{ color: "rgba(245,197,24,0.35)", fontSize: "8px" }}>◆</span>
                        <span className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                          Founding Document
                        </span>
                      </div>
                      <span
                        className="text-[9px] font-black uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(245,197,24,0.15)", color: "#F5C518", border: "1px solid rgba(245,197,24,0.3)" }}
                      >
                        Verified
                      </span>
                    </div>

                    {/* Body */}
                    <div className="px-5 pt-4 pb-5">
                      <h3
                        className="font-sans font-extrabold text-[15px] leading-snug mb-3 group-hover:opacity-85 transition-opacity"
                        style={{ color: "#ffffff" }}
                      >
                        {foundingDoc.title}
                      </h3>
                      <p
                        className="text-[13px] leading-relaxed line-clamp-3"
                        style={{ color: "rgba(255,255,255,0.58)" }}
                      >
                        {foundingDoc.teaser}
                      </p>

                      {/* CTA */}
                      <div
                        className="mt-4 pt-3 flex items-center justify-between"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        <span
                          className="text-[10px] font-semibold truncate max-w-[55%]"
                          style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {foundingDoc.caseNumber}
                        </span>
                        <span
                          className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest group-hover:gap-2 transition-all"
                          style={{ color: "#F5C518" }}
                        >
                          Read More
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
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
