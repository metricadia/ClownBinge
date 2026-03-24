import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { usePostsFilter, usePostsFeed } from "@/hooks/use-posts";
import { useHomeSeoHead } from "@/hooks/use-seo-head";
import { Loader2, AlertCircle } from "lucide-react";
import type { Post } from "@workspace/api-client-react";

const STAFF_PICKS_SLUGS = [
  "arithmetic-of-presence-census-2020-2025-white-america",
  "give-me-your-tired-us-foreign-policy-immigration-global-south",
  "we-hold-these-truths-2026-constitutional-record",
  "second-amendment-racial-disparity-philando-castile",
  "national-debt-military-spending-interest-payments-generational-cost",
  "diversity-denial-primary-source-record-what-was-lost",
  "ted-haggard-male-escort-meth-nae-resignation-2006",
  "cable-news-binary-media-bias-cnn-msnbc-fox-documented-record-2026",
];

// Mock data to ensure beautiful UI even if API fails or is empty initially
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    caseNumber: "CB-00124",
    title: "Senator Claims To Support 'Family Values' While Voting Against Child Tax Credit Expansion",
    slug: "senator-family-values-hypocrisy",
    teaser: "The voting record tells a different story than the campaign mailers. A deep dive into the consistent pattern of opposing family-centric legislation while running on a pro-family platform.",
    body: "Full content here...",
    category: "self_owned",
    verifiedSource: "Congressional Record",
    hasVideo: false,
    tags: ["hypocrisy", "voting record"],
    status: "published",
    createdAt: new Date().toISOString(),
    dateOfIncident: "2023-11-15T00:00:00Z",
    viewCount: 14500,
    shareCount: 2300,
    userSubmitted: false,
  },
  {
    id: "2",
    caseNumber: "CB-00125",
    title: "Governor's Bizarre Town Hall Tirade Goes Viral After Reporter Asks Basic Economics Question",
    slug: "governor-town-hall-meltdown",
    teaser: "When asked to explain the math behind the new budget proposal, the response devolved into a 4-minute rant about unrelated cultural grievances.",
    body: "Full content here...",
    category: "clown_electeds",
    verifiedSource: "C-SPAN",
    hasVideo: true,
    videoThumbnail: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=450&fit=crop",
    tags: ["meltdown", "economy"],
    status: "published",
    createdAt: new Date().toISOString(),
    dateOfIncident: "2024-01-22T00:00:00Z",
    viewCount: 45200,
    shareCount: 8900,
    userSubmitted: false,
  },
  {
    id: "3",
    caseNumber: "CB-00126",
    title: "Local Official Backtracks Entire Career Position After Checking Poll Numbers",
    slug: "local-official-poll-reversal",
    teaser: "We have the tape from 2018, 2020, and 2022. The 2024 pivot is a masterclass in political whiplash.",
    body: "Full content here...",
    category: "political",
    verifiedSource: "Reuters",
    hasVideo: false,
    tags: ["flip-flop"],
    status: "published",
    createdAt: new Date().toISOString(),
    dateOfIncident: "2024-02-10T00:00:00Z",
    viewCount: 8200,
    shareCount: 450,
    userSubmitted: true,
  }
];

export default function Home() {
  useHomeSeoHead();
  const { category, setCategory } = usePostsFilter();
  const isStaffPicks = category === ('staff_picks' as never);
  const { data, isLoading, error } = usePostsFeed(isStaffPicks ? undefined : category, isStaffPicks ? 60 : 20);
  const { data: selfOwnData } = usePostsFeed('self_owned');
  const topSelfOwn = selfOwnData?.posts?.[0] ?? null;

  // Use real data if available and not empty, otherwise fallback to mock for demonstration
  const posts = (data?.posts && data.posts.length > 0) ? data.posts : MOCK_POSTS;

  // Staff picks: filter to curated slugs in editorial order
  const displayPosts = isStaffPicks
    ? STAFF_PICKS_SLUGS.map(slug => posts.find(p => p.slug === slug)).filter(Boolean) as typeof posts
    : (data?.posts && data.posts.length > 0)
      ? posts
      : (category ? posts.filter(p => p.category === category) : posts);

  return (
    <Layout onCategoryChange={setCategory} activeCategory={category}>
      <div className="cb-container pt-4 pb-8 sm:pb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Feed Column */}
          <div className="flex-1 max-w-3xl mx-auto lg:mx-0 w-full">
            <div className="pt-2 pb-4">
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

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                <p className="font-bold">Digging up the receipts...</p>
              </div>
            ) : error ? (
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
                      <div className="my-10 bg-muted/50 border border-border/50 h-[250px] rounded-xl flex items-center justify-center">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Advertisement Space</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Infinite Scroll loading indicator placeholder */}
            {!isLoading && displayPosts.length > 0 && (
              <div className="py-12 flex justify-center">
                <button className="bg-white border-2 border-border text-foreground hover:border-primary hover:text-primary font-bold px-8 py-3 rounded-xl transition-colors shadow-sm">
                  Load More Cases
                </button>
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
              <div className="mt-8 bg-muted/50 border border-border/50 h-[600px] rounded-xl flex items-center justify-center">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Sticky Ad Space</span>
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </Layout>
  );
}
