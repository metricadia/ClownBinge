import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { usePostsFilter, usePostsFeed, usePostsFeedPaginated, usePostDetail } from "@/hooks/use-posts";
import { useHomeSeoHead } from "@/hooks/use-seo-head";
import { Loader2, AlertCircle, TrendingUp, ArrowRight } from "lucide-react";

const HIGHLY_POPULAR_SLUG = "dei-ruse-obama-trump-appointee-qualifications";

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
  nerd_out:            "NerdOut",
};
import { STAFF_PICKS_SLUGS } from "@/config/staff-picks";


export default function Home() {
  useHomeSeoHead();
  const { category, setCategory } = usePostsFilter();
  const isStaffPicks = category === ('staff_picks' as never);

  const { data: staffPicksData, isLoading: staffPicksLoading, error: staffPicksError } = usePostsFeed(isStaffPicks ? undefined : undefined, isStaffPicks ? 60 : 0);
  const { posts: paginatedPosts, isLoading, isLoadingMore, error, hasMore, loadMore } = usePostsFeedPaginated(isStaffPicks ? undefined : category, 20);
  const { data: selfOwnData } = usePostsFeed('self_owned');
  const topSelfOwn = selfOwnData?.posts?.[0] ?? null;
  const { data: highlightedPost } = usePostDetail(HIGHLY_POPULAR_SLUG);

  // Staff picks: filter curated slugs from a full fetch; regular feed uses paginated posts
  const displayPosts = isStaffPicks
    ? STAFF_PICKS_SLUGS.map(slug => (staffPicksData?.posts ?? []).find(p => p.slug === slug)).filter(Boolean) as typeof paginatedPosts
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
                <div className="mb-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary mb-2">
                    Viewing:&nbsp;
                    <span style={{ color: "#C9980A" }}>
                      {category === 'staff_picks' ? '★ Staff Picks' : (CATEGORY_LABELS[category] ?? category)}
                    </span>
                  </p>
                  <div className="h-px w-full bg-[#F5C518] rounded-full" />
                </div>
              )}
              <h1 className="font-sans font-normal text-lg sm:text-xl text-header mb-2 leading-snug max-w-xl">
                <span className="block">A Public Accountability News Platform.</span>
                <span className="block font-bold">Verified Across 65,000 Global Sources.</span>
              </h1>
              <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
                <div className="flex gap-2">
                  <a
                    href="/clowncheck"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full text-sm font-bold bg-secondary text-gray-900 hover:bg-secondary/80 transition-colors"
                  >
                    Verify ANY News
                    <span className="text-[10px] font-semibold opacity-70 ml-0.5">$4.95</span>
                  </a>
                  <a
                    href="/reports"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full text-sm font-bold bg-secondary text-gray-900 hover:bg-secondary/80 transition-colors"
                  >
                    Full PST Report
                    <span className="text-[10px] font-semibold opacity-70 ml-0.5">$24.95</span>
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground/30 text-sm hidden sm:inline px-1">|</span>
                  <a href="/submit" className="text-xs font-semibold hover:underline whitespace-nowrap" style={{ color: "#B8860B" }}>Submit a Post</a>
                  <span className="text-muted-foreground/30">|</span>
                  <a href="/ethics" className="text-xs font-semibold hover:underline whitespace-nowrap" style={{ color: "#B8860B" }}>Ethics Policy</a>
                </div>
              </div>
            </div>

            {/* Highly Popular featured block */}
            {highlightedPost && !category && (
              <div
                className="mb-8 rounded-2xl overflow-hidden border border-blue-100"
                style={{ background: "linear-gradient(135deg, #dbeafe 0%, #e8edf5 55%, #f1f5f9 100%)" }}
              >
                <div className="px-6 pt-5 pb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0 bg-white/80 border border-blue-200 rounded-full overflow-hidden">
                    <div className="flex items-center gap-1.5 px-3 py-1">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Featured</span>
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
                            src={`${import.meta.env.BASE_URL}images/ad-coming-soon.jpg`}
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
                    src={`${import.meta.env.BASE_URL}images/ad-coming-soon.jpg`}
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
