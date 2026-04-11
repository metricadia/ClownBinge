import { Info } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function parseVerifiedSource(source: string): { label: string; citation: string }[] {
  if (source.includes("::")) {
    // Delimiter is | between entries, each entry is "Label :: Citation text"
    return source
      .split("|")
      .map(s => s.trim())
      .filter(Boolean)
      .map(entry => {
        const [labelPart, ...rest] = entry.split("::");
        return {
          label: labelPart.trim(),
          citation: rest.join("::").replace(/(https?:\/\/[^\s,;)]+)/g, "").trim(),
        };
      });
  }
  return source.split(/[;|]/).map(s => s.trim()).filter(Boolean).map(s => ({ label: s, citation: "" }));
}

export function VerifiedBadge({ source, date }: { source?: string | null; date?: string | null }) {
  const [open, setOpen] = useState(false);
  const citations = source ? parseVerifiedSource(source) : [];
  const isMulti = citations.length > 1;

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="verified-badge"
        aria-label="View verification details"
      >
        VERIFIED
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg bg-white border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-verified mb-2">
              <Info className="h-5 w-5" />
              <DialogTitle className="font-display font-bold text-xl uppercase tracking-wider text-verified">
                Verification Protocol
              </DialogTitle>
            </div>
            <DialogDescription className="text-base text-foreground font-sans pt-2">
              Every factual claim on ClownBinge traces to a verified public source. We do not use unverified sources, we do not fabricate claims, and we do not target private individuals.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted rounded-lg mt-4 border border-border overflow-hidden">
            {isMulti ? (
              <div className="p-4">
                <p className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {citations.length} Primary Sources
                </p>
                <ol className="space-y-3">
                  {citations.map((c, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono font-bold text-sm text-[#F5C518] shrink-0 w-5 text-right mt-0.5">{i + 1}.</span>
                      <div>
                        <p className="font-mono font-semibold text-sm text-foreground leading-snug mb-0.5">{c.label}</p>
                        {c.citation && <p className="text-xs text-muted-foreground leading-snug italic">{c.citation}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 text-sm p-4">
                <div className="col-span-1 text-muted-foreground font-semibold">Primary Source:</div>
                <div className="col-span-2 font-mono font-medium text-foreground">
                  {citations[0]?.label || "Public Record"}
                  {citations[0]?.citation && <p className="text-xs text-muted-foreground italic mt-1">{citations[0].citation}</p>}
                </div>
              </div>
            )}

            {date && (
              <div className="grid grid-cols-3 gap-4 text-sm px-4 pb-4">
                <div className="col-span-1 text-muted-foreground font-semibold">Incident Date:</div>
                <div className="col-span-2 font-mono font-medium text-foreground">{date}</div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 text-sm px-4 pb-4">
              <div className="col-span-1 text-muted-foreground font-semibold">Legal Shield:</div>
              <div className="col-span-2 font-mono font-medium text-foreground">First Amendment / NYT v. Sullivan (1964)</div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setOpen(false)}
              className="w-full bg-header text-white font-bold py-3 rounded-lg hover:bg-header/90 transition-colors"
            >
              Back to The Record
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
