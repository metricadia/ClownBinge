import { useState } from "react";
import { ScanSearch, Loader2, Check, X, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DeepFactoid {
  phrase: string;
  title: string;
  summary: string;
  approved: boolean;
  foundInBody: boolean;
}

interface DeepFactoidScanDialogProps {
  open: boolean;
  articleTitle: string;
  bodyText: string;
  onClose: () => void;
  onInstall: (approved: Array<{ phrase: string; title: string; summary: string }>) => void;
}

export function DeepFactoidScanDialog({
  open,
  articleTitle,
  bodyText,
  onClose,
  onInstall,
}: DeepFactoidScanDialogProps) {
  const [scanning, setScanning] = useState(false);
  const [factoids, setFactoids] = useState<DeepFactoid[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleScan = async () => {
    setScanning(true);
    setError(null);
    setFactoids([]);
    setScanned(false);
    try {
      const res = await fetch("/api/factoid/deep-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleTitle, bodyText }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json() as { factoids: Array<{ phrase: string; title: string; summary: string }> };

      const withStatus: DeepFactoid[] = data.factoids.map((f) => ({
        ...f,
        approved: true,
        foundInBody: bodyText.includes(f.phrase),
      }));
      setFactoids(withStatus);
      setScanned(true);
    } catch {
      setError("Claude couldn't complete the scan. Check the API connection and try again.");
    } finally {
      setScanning(false);
    }
  };

  const toggleApproval = (i: number) => {
    setFactoids((prev) =>
      prev.map((f, idx) => (idx === i ? { ...f, approved: !f.approved } : f))
    );
  };

  const approvedCount = factoids.filter((f) => f.approved && f.foundInBody).length;

  const handleInstall = () => {
    const toInstall = factoids.filter((f) => f.approved && f.foundInBody);
    onInstall(toInstall);
    handleClose();
  };

  const handleClose = () => {
    setFactoids([]);
    setError(null);
    setScanned(false);
    setExpanded(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-2xl bg-[#0B1930] text-white border border-[#C9A227]/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#C9A227] font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <ScanSearch className="w-4 h-4" /> Deep Factoid Scanner™
          </DialogTitle>
          <DialogDescription className="text-white/40 text-xs mt-1">
            Claude analyzes the full article and selects the most important institutional and conceptual terms for reader context. One factoid per concept — first occurrence only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Scan button */}
          {!scanned && (
            <Button
              onClick={handleScan}
              disabled={scanning || !bodyText || bodyText.length < 100}
              className="w-full bg-[#C9A227] text-[#0B1930] font-bold hover:bg-[#C9A227]/90 h-11"
            >
              {scanning ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Claude is scanning the article…</>
              ) : (
                <><Zap className="w-4 h-4 mr-2" /> Run Deep Factoid Scan</>
              )}
            </Button>
          )}

          {scanning && (
            <p className="text-white/40 text-xs text-center">
              Analyzing concepts, laws, agencies, and key terms across the full article body…
            </p>
          )}

          {error && (
            <div className="px-3 py-2 rounded bg-red-900/30 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Results list */}
          {scanned && factoids.length === 0 && (
            <div className="text-center text-white/40 py-6 text-xs">
              No suitable factoid terms found in this article.
            </div>
          )}

          {scanned && factoids.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50 uppercase tracking-widest">
                  {factoids.length} term{factoids.length !== 1 ? "s" : ""} identified
                </span>
                <div className="flex gap-2">
                  <button
                    className="text-xs text-[#C9A227]/70 hover:text-[#C9A227] underline"
                    onClick={() => setFactoids((p) => p.map((f) => ({ ...f, approved: true })))}
                  >
                    Select all
                  </button>
                  <span className="text-white/20">·</span>
                  <button
                    className="text-xs text-white/40 hover:text-white/70 underline"
                    onClick={() => setFactoids((p) => p.map((f) => ({ ...f, approved: false })))}
                  >
                    Deselect all
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {factoids.map((f, i) => (
                  <div
                    key={i}
                    className={`rounded border transition-colors ${
                      f.approved && f.foundInBody
                        ? "border-[#C9A227]/40 bg-[#C9A227]/5"
                        : !f.foundInBody
                        ? "border-red-500/30 bg-red-900/10 opacity-60"
                        : "border-white/10 bg-white/3 opacity-50"
                    }`}
                  >
                    <div className="flex items-start gap-3 px-3 py-2.5">
                      {/* Approve toggle */}
                      <button
                        onClick={() => f.foundInBody && toggleApproval(i)}
                        disabled={!f.foundInBody}
                        className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          f.approved && f.foundInBody
                            ? "bg-[#C9A227] border-[#C9A227] text-[#0B1930]"
                            : "border-white/20 bg-transparent"
                        } ${!f.foundInBody ? "cursor-not-allowed" : "cursor-pointer hover:border-[#C9A227]/60"}`}
                      >
                        {f.approved && f.foundInBody && <Check className="w-3 h-3" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* The marked phrase */}
                          <span
                            className="font-mono text-xs px-1.5 py-0.5 rounded"
                            style={{
                              background: "rgba(201,162,39,0.12)",
                              color: "#C9A227",
                              textDecoration: "underline dotted #C9A227",
                              textUnderlineOffset: "3px",
                            }}
                          >
                            {f.phrase}
                          </span>
                          {!f.foundInBody && (
                            <span className="text-xs text-red-400 flex items-center gap-1">
                              <X className="w-3 h-3" /> phrase not found in body
                            </span>
                          )}
                        </div>
                        <div className="text-[#C9A227]/80 font-semibold text-xs mt-1">{f.title}</div>

                        {/* Expandable summary */}
                        <button
                          className="flex items-center gap-1 text-white/35 hover:text-white/60 text-xs mt-1 transition-colors"
                          onClick={() => setExpanded(expanded === i ? null : i)}
                        >
                          {expanded === i ? (
                            <><ChevronUp className="w-3 h-3" /> hide summary</>
                          ) : (
                            <><ChevronDown className="w-3 h-3" /> preview summary</>
                          )}
                        </button>
                        {expanded === i && (
                          <p className="text-white/60 text-xs mt-1.5 leading-relaxed border-l border-[#C9A227]/20 pl-2">
                            {f.summary}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Re-scan option */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleScan}
                disabled={scanning}
                className="text-white/40 border-white/15 hover:border-white/30 text-xs w-full"
              >
                {scanning ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <ScanSearch className="w-3 h-3 mr-1" />}
                Re-scan
              </Button>
            </>
          )}

          {/* Install / Cancel */}
          <div className="flex gap-2 pt-1 border-t border-white/10">
            <Button
              onClick={handleInstall}
              disabled={approvedCount === 0}
              className="flex-1 bg-[#C9A227] text-[#0B1930] font-bold hover:bg-[#C9A227]/90"
            >
              <Zap className="w-4 h-4 mr-1" />
              Install {approvedCount > 0 ? `${approvedCount} Factoid${approvedCount !== 1 ? "s" : ""}` : "Factoids"}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="text-white/60 border-white/20 hover:border-white/40"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
