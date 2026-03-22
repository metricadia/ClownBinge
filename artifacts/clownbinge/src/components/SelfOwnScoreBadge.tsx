export function SelfOwnScoreBadge({ score }: { score: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold text-[11px] uppercase tracking-widest whitespace-nowrap select-none"
      style={{ background: "#fff", color: "#1A3A8F" }}
    >
      {score}/10
    </span>
  );
}
