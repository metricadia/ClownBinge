import { BookOpen } from "lucide-react";

export function CitedBadge({ count }: { count: number }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.getElementById("verified-references");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`${count} verified reference${count !== 1 ? "s" : ""} — click to view`}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded font-display font-medium text-xs tracking-wider uppercase text-white transition-opacity hover:opacity-80"
      style={{ background: "#1A3A8F" }}
    >
      <BookOpen className="w-3 h-3 shrink-0" strokeWidth={2} />
      <span style={{ color: "#F5C518" }}>{count}</span> Cited
    </button>
  );
}
