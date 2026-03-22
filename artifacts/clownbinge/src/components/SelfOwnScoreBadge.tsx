export function SelfOwnScoreBadge({ score }: { score: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold text-[11px] uppercase tracking-widest whitespace-nowrap select-none"
      style={{ background: "#F5C518", color: "#fff" }}
    >
      Self-Own Score&nbsp;{score}/10
    </span>
  );
}
