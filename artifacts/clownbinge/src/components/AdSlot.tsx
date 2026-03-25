const ADS_ENABLED = import.meta.env.VITE_PROGRAMMATIC_ADS_ENABLED === "true";

interface AdSlotProps {
  id: "cb-ad-top" | "cb-ad-mid" | "cb-ad-bottom";
  className?: string;
}

export function AdSlot({ id, className = "" }: AdSlotProps) {
  if (ADS_ENABLED) {
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

  return (
    <a
      id={id}
      href="/contact"
      className={`block w-full overflow-hidden rounded-xl cursor-pointer ${className}`}
      aria-label="Advertise on ClownBinge"
      title="Your ad could be here. Click to learn about advertising with ClownBinge."
    >
      <img
        src={`${import.meta.env.BASE_URL}images/ad-coming-soon.jpg`}
        alt="Your Ad Here - Advertise on ClownBinge. Showcase your brand with ClownBinge. Full-width placement available. High visibility."
        className="w-full h-auto object-cover"
        loading="lazy"
      />
    </a>
  );
}
