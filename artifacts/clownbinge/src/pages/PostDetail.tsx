import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { ReactionBar } from "@/components/ReactionBar";
import { ShareButtons } from "@/components/ShareButtons";
import { BookCTA } from "@/components/BookCTA";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { usePostDetail, useViewTracker } from "@/hooks/use-posts";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface FactoidState {
  title: string;
  summary: string;
  url: string;
  x: number;
  y: number;
}

export default function PostDetail() {
  const [, params] = useRoute("/case/:slug");
  const slug = params?.slug || "";
  
  const { data: post, isLoading, error } = usePostDetail(slug);
  const { trackView } = useViewTracker(slug);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [factoid, setFactoid] = useState<FactoidState | null>(null);

  useEffect(() => {
    if (post) {
      trackView();
    }
  }, [post?.id, trackView]);

  useEffect(() => {
    const container = bodyRef.current;
    if (!container) return;

    let hideTimeout: ReturnType<typeof setTimeout>;

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest('a.cb-factoid') as HTMLAnchorElement | null;
      if (!target) return;
      clearTimeout(hideTimeout);
      const rect = target.getBoundingClientRect();
      setFactoid({
        title: target.dataset.title || '',
        summary: target.dataset.summary || '',
        url: target.href,
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY,
      });
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as Element).closest('a.cb-factoid');
      if (!target) return;
      hideTimeout = setTimeout(() => setFactoid(null), 120);
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
      clearTimeout(hideTimeout);
    };
  }, [post]);

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
              Either this URL is wrong, or the politicians finally figured out how to delete the internet. (Probably the former.)
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-border pb-5 mb-6">
            <div>
              <div className="font-mono text-lg sm:text-xl font-bold tracking-tight text-header mb-1">
                CASE {post.caseNumber}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground">
                <span className="uppercase tracking-widest">{post.category.replace(/_/g, ' ')}</span>
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

          <h1 className={`font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight mb-5 ${isSelfOwned ? 'text-primary' : 'text-header'}`}>
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed border-l-4 border-secondary pl-5">
            {post.teaser}
          </p>
        </header>

        {/* Video Player Area */}
        {isVideo && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video relative">
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

        {/* Ad Banner — industry standard leaderboard height */}
        <div className="my-8 bg-muted border border-border h-[90px] w-full flex items-center justify-center rounded-lg">
          <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Advertisement</span>
        </div>

        {/* Article Body — HTML rendered with factoid popup support */}
        <div
          ref={bodyRef}
          className="prose prose-lg sm:prose-xl max-w-none text-foreground prose-headings:font-display prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-primary prose-a:font-bold prose-strong:text-header prose-p:leading-relaxed prose-p:mb-5 mb-12"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {/* Ad Placeholder Bottom */}
        <div className="my-8 bg-muted border border-border h-[90px] w-full flex items-center justify-center rounded-lg">
          <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Advertisement</span>
        </div>

        {/* Engagement Zone */}
        <ReactionBar postId={post.id} isHero={isHero} />
        
        <ShareButtons post={post} />

        <div className="mt-16">
          <NewsletterSignup source={`post_${post.id}`} />
        </div>

        {isSelfOwned && <BookCTA variant="inline" />}

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

      {/* Factoid Popup Portal */}
      {factoid && createPortal(
        <div
          className="cb-factoid-popup"
          style={{ left: factoid.x, top: factoid.y }}
        >
          <div className="cb-factoid-popup-label">ClownBinge Factoid</div>
          <div className="cb-factoid-popup-title">{factoid.title}</div>
          <div className="cb-factoid-popup-summary">{factoid.summary}</div>
          <a
            href={factoid.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cb-factoid-popup-link"
          >
            View Source Document →
          </a>
        </div>,
        document.body
      )}
    </Layout>
  );
}
