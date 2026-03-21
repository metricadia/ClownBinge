import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { ReactionBar } from "@/components/ReactionBar";
import { ShareButtons } from "@/components/ShareButtons";
import { BookCTA } from "@/components/BookCTA";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { usePostDetail, useViewTracker } from "@/hooks/use-posts";
import { useEffect } from "react";
import { format } from "date-fns";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PostDetail() {
  const [, params] = useRoute("/case/:slug");
  const slug = params?.slug || "";
  
  const { data: post, isLoading, error } = usePostDetail(slug);
  const { trackView } = useViewTracker(slug);

  useEffect(() => {
    if (post) {
      trackView();
    }
  }, [post?.id, trackView]);

  if (isLoading) {
    return (
      <Layout>
        <div className="cb-container py-24 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-bold text-foreground">Pulling the file...</h2>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="cb-container py-24 max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-10">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="font-display font-extrabold text-3xl text-red-900 mb-4">Case Not Found</h1>
            <p className="text-red-700 mb-8">
              Either this URL is wrong, or the politicians finally figured out how to delete the internet. (Probably the former).
            </p>
            <Link href="/" className="inline-flex bg-red-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-800 transition-colors">
              Return to Archives
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isSelfOwned = post.category === "self_owned";
  const isVideo = post.hasVideo;
  const isHero = post.category === "anti_racist_hero";

  return (
    <Layout>
      <article className="cb-container py-8 sm:py-12 max-w-3xl mx-auto pb-32">
        
        {/* Breadcrumb / Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-border pb-6 mb-6">
            <div>
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-header mb-1">
                CASE {post.caseNumber}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground">
                <span className="uppercase tracking-widest">{post.category.replace('_', ' ')}</span>
                <span>•</span>
                <span>Source: <span className="text-foreground">{post.verifiedSource}</span></span>
                {post.dateOfIncident && (
                  <>
                    <span>•</span>
                    <span>Incident: {format(new Date(post.dateOfIncident), 'MMM d, yyyy')}</span>
                  </>
                )}
              </div>
            </div>
            <div className="shrink-0">
              <VerifiedBadge source={post.verifiedSource} date={post.dateOfIncident ? format(new Date(post.dateOfIncident), 'MMM d, yyyy') : undefined} />
            </div>
          </div>

          <h1 className={`font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight mb-6 ${isSelfOwned ? 'text-primary' : 'text-header'}`}>
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed border-l-4 border-secondary pl-6">
            {post.teaser}
          </p>
        </header>

        {/* Video Player Area */}
        {isVideo && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video relative">
            {/* Placeholder for Bunny.net embed */}
            {post.videoUrl ? (
              <iframe 
                src={post.videoUrl} 
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <span className="text-3xl">▶</span>
                </div>
                <p className="font-mono text-sm tracking-widest uppercase">Secured Video Record</p>
              </div>
            )}
          </div>
        )}

        {/* Ad Placeholder Top */}
        <div className="my-10 bg-muted border border-border h-[100px] sm:h-[250px] w-full flex items-center justify-center rounded-xl">
          <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Advertisement Space</span>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg sm:prose-xl max-w-none text-foreground prose-headings:font-display prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-primary prose-a:font-bold prose-strong:text-header prose-p:leading-relaxed mb-12">
          {/* For MVP, rendering raw text. In prod, this would be a rich text renderer or MDX */}
          <div dangerouslySetInnerHTML={{ __html: post.body.replace(/\n/g, '<br/>') }} />
          
          {/* If the body is short/mocked, let's add some styled structure to show the design */}
          {post.body.length < 200 && (
            <>
              <h2>Who They Claim To Be</h2>
              <p>For years, the public messaging has been perfectly disciplined. Press releases, campaign speeches, and Sunday morning talk show appearances all hit the exact same talking points. The brand was built entirely on this specific foundation of supposed principles.</p>
              
              <h2>What The Record Actually Shows</h2>
              <p>But when we look at the verified public record, a completely different reality emerges. The contradiction isn't subtle—it's structural. The actions taken behind closed doors or in obscure committee hearings directly violate the very principles loudly championed on camera.</p>
              
              <div className="bg-primary/5 border-l-4 border-primary p-6 my-8 rounded-r-xl">
                <h3 className="text-primary mt-0 mb-2">The Self-Own Moment</h3>
                <p className="mb-0 text-foreground">The most documented hypocrisy occurred when they were forced to vote on the exact legislation they claimed to champion, choosing instead to block it while simultaneously sending a fundraising email about their steadfast support for the cause.</p>
              </div>

              <div className="mt-12 text-center">
                <span className="font-mono font-bold text-sm uppercase tracking-widest text-muted-foreground mb-2 block">ClownBinge Verdict</span>
                <p className="font-display font-bold text-2xl text-header leading-tight">
                  You can build a career on rhetoric, but you can't hide the receipts.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Ad Placeholder Bottom */}
        <div className="my-10 bg-muted border border-border h-[100px] w-full flex items-center justify-center rounded-xl">
          <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Advertisement Space</span>
        </div>

        {/* Engagement Zone */}
        <ReactionBar postId={post.id} isHero={isHero} />
        
        <ShareButtons post={post} />

        <div className="mt-16">
          <NewsletterSignup source={`post_${post.id}`} />
        </div>

        {/* Inline Book CTA */}
        {isSelfOwned && <BookCTA variant="inline" />}

        {/* Mock Comments Section */}
        <div className="mt-16 pt-8 border-t-2 border-border">
          <h3 className="font-display font-extrabold text-2xl mb-8">The Jury (Comments)</h3>
          <div className="bg-muted/50 border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground font-medium mb-4">Join the discussion with other verified receipt readers.</p>
            <button className="bg-white border-2 border-border text-header hover:border-header font-bold px-6 py-3 rounded-lg transition-all shadow-sm">
              Log in to Comment
            </button>
          </div>
        </div>

      </article>

      {/* Sticky Bottom Book CTA */}
      <BookCTA variant="banner" />
    </Layout>
  );
}
