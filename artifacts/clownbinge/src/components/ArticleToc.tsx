import type { TocItem } from "@/hooks/use-article-toc";

interface ArticleTocProps {
  items: TocItem[];
  isFoundersPen?: boolean;
}

export function ArticleToc({ items, isFoundersPen }: ArticleTocProps) {
  if (items.length < 2) return null;

  if (isFoundersPen) {
    return (
      <nav
        aria-label="Table of Contents"
        className="mb-8 not-prose"
        style={{
          background: "#F2E8D4",
          borderLeft: "4px solid #C9A84C",
          padding: "1.25rem 1.5rem",
        }}
      >
        <p
          className="text-[10px] font-black uppercase tracking-[0.25em] mb-3"
          style={{ color: "#8C6520" }}
        >
          In This Treatise
        </p>
        <ol className="space-y-1.5 list-none m-0 p-0">
          {items.map((item, i) => (
            <li key={item.id} className="flex items-baseline gap-2.5">
              <span
                className="text-[10px] font-black tabular-nums shrink-0"
                style={{ color: "#C9A84C", minWidth: "1.2rem" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <a
                href={`#${item.id}`}
                className="text-sm leading-snug hover:underline"
                style={{
                  color: "#2C1600",
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  textDecoration: "none",
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Table of Contents"
      className="mb-6 not-prose rounded border border-border"
      style={{ background: "#F8F8F6", padding: "1rem 1.25rem" }}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2.5">
        In This Article
      </p>
      <ol className="space-y-1 list-none m-0 p-0">
        {items.map((item, i) => (
          <li key={item.id} className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-muted-foreground/60 tabular-nums shrink-0">
              {i + 1}.
            </span>
            <a
              href={`#${item.id}`}
              className="text-sm font-medium text-primary hover:underline leading-snug"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
