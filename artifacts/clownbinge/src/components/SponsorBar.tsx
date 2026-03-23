interface Sponsor {
  sponsorName: string;
  sponsorUrl: string;
  logoUrl?: string | null;
  tagline?: string | null;
}

interface SponsorBarProps {
  sponsor: Sponsor;
}

export function SponsorBar({ sponsor }: SponsorBarProps) {
  return (
    <div className="my-6 border border-border rounded-lg bg-muted/40 px-5 py-3 flex items-center gap-4">
      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">
        Sponsored
      </span>
      <div className="h-4 w-px bg-border shrink-0" />
      <a
        href={sponsor.sponsorUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity"
      >
        {sponsor.logoUrl && (
          <img
            src={sponsor.logoUrl}
            alt={sponsor.sponsorName}
            className="h-6 w-auto object-contain shrink-0"
          />
        )}
        <span className="font-bold text-sm text-foreground">{sponsor.sponsorName}</span>
        {sponsor.tagline && (
          <span className="text-sm text-muted-foreground truncate">&mdash; {sponsor.tagline}</span>
        )}
      </a>
    </div>
  );
}
