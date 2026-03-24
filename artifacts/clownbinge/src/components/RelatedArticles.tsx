import { Link } from "wouter";
import { useListPosts } from "@workspace/api-client-react";
import { RELATED_ARTICLES } from "@/config/related-articles";

const CATEGORY_LABELS: Record<string, string> = {
  self_owned:         "Self-Owned",
  law_and_justice:    "Law & Justice",
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
};

const CATEGORY_COLOR: Record<string, string> = {
  self_owned:         "bg-primary/10 text-primary",
  law_and_justice:    "bg-red-700/10 text-red-700",
  money_and_power:    "bg-emerald-700/10 text-emerald-700",
  us_constitution:    "bg-purple-700/10 text-purple-700",
  women_and_girls:    "bg-pink-600/10 text-pink-600",
  anti_racist_heroes: "bg-orange-600/10 text-orange-600",
  us_history:         "bg-amber-700/10 text-amber-700",
  religion:           "bg-indigo-700/10 text-indigo-700",
  investigations:     "bg-cyan-700/10 text-cyan-700",
  war_and_inhumanity: "bg-red-900/10 text-red-900",
  health_and_healing: "bg-green-700/10 text-green-700",
  technology:         "bg-sky-700/10 text-sky-700",
  censorship:         "bg-gray-700/10 text-gray-700",
  global_south:       "bg-teal-700/10 text-teal-700",
  how_it_works:       "bg-violet-700/10 text-violet-700",
};

interface RelatedArticlesProps {
  currentSlug: string;
}

export function RelatedArticles({ currentSlug }: RelatedArticlesProps) {
  const relatedSlugs = RELATED_ARTICLES[currentSlug] ?? [];

  const { data } = useListPosts({ limit: 100, offset: 0 });

  if (!relatedSlugs.length || !data?.posts?.length) return null;

  const related = relatedSlugs
    .map(slug => data.posts.find(p => p.slug === slug))
    .filter(Boolean)
    .slice(0, 3) as NonNullable<typeof data.posts>;

  if (!related.length) return null;

  return (
    <section className="mt-14 pt-10 border-t-2 border-[#1A3A8F]/15">
      <h2 className="text-xs font-black uppercase tracking-widest text-[#1A3A8F] mb-6 flex items-center gap-2">
        <span className="inline-block w-5 h-0.5 bg-[#F5C518]" />
        Also in the Record
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map(post => (
          <Link
            key={post.slug}
            href={`/case/${post.slug}`}
            className="group block rounded-xl border border-border bg-card p-5 hover:border-[#1A3A8F]/40 hover:shadow-md transition-all duration-150"
          >
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="text-[10px] font-mono font-bold text-foreground/40 tracking-wider">
                {post.caseNumber}
              </span>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${CATEGORY_COLOR[post.category] ?? "bg-muted text-muted-foreground"}`}>
                {CATEGORY_LABELS[post.category] ?? post.category}
              </span>
            </div>
            <p className="text-sm font-bold leading-snug text-foreground group-hover:text-[#1A3A8F] transition-colors line-clamp-3 mb-3">
              {post.title}
            </p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A3A8F] group-hover:translate-x-1 transition-transform inline-block">
              Read the Record &gt;
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
