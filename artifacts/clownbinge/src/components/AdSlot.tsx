const ADS_ENABLED = import.meta.env.VITE_PROGRAMMATIC_ADS_ENABLED === "true";

interface AdSlotProps {
  id: "cb-ad-top" | "cb-ad-mid" | "cb-ad-bottom";
  className?: string;
}

export function AdSlot({ id, className = "" }: AdSlotProps) {
  if (!ADS_ENABLED) return null;

  return (
    <div
      id={id}
      className={`cb-ad-slot w-full flex items-center justify-center bg-muted border border-border rounded-lg ${className}`}
      style={{ minHeight: 90 }}
      aria-label="Advertisement"
    >
      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest select-none">
        Advertisement
      </span>
    </div>
  );
}
