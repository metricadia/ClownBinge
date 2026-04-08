import { useState } from "react";
import { Sparkles, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CBFactoidDialogProps {
  open: boolean;
  selectedText: string;
  articleContext?: string;
  onClose: () => void;
  onInsert: (data: { title: string; summary: string; url: string }) => void;
}

export function CBFactoidDialog({
  open,
  selectedText,
  articleContext,
  onClose,
  onInsert,
}: CBFactoidDialogProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [url, setUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/factoid/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: selectedText, articleContext }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json() as { title: string; summary: string };
      setTitle(data.title);
      setSummary(data.summary);
      setGenerated(true);
    } catch {
      setError("Claude couldn't generate a factoid. Enter manually below.");
    } finally {
      setGenerating(false);
    }
  };

  const handleInsert = () => {
    if (!title || !summary) return;
    onInsert({ title, summary, url });
    setTitle("");
    setSummary("");
    setUrl("");
    setGenerated(false);
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setSummary("");
    setUrl("");
    setGenerated(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-lg bg-[#0B1930] text-white border border-[#C9A227]/30">
        <DialogHeader>
          <DialogTitle className="text-[#C9A227] font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> CB Factoid™ Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <div className="text-xs text-white/50 uppercase tracking-widest mb-1">Selected Term</div>
            <div className="px-3 py-2 rounded bg-white/10 font-semibold text-white/90 truncate">
              {selectedText || <span className="italic text-white/40">No text selected</span>}
            </div>
          </div>

          {!generated && (
            <Button
              onClick={handleGenerate}
              disabled={generating || !selectedText}
              className="w-full bg-[#C9A227] text-[#0B1930] font-bold hover:bg-[#C9A227]/90"
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Asking Claude…</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Generate with Claude</>
              )}
            </Button>
          )}

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <div>
            <label className="text-xs text-white/50 uppercase tracking-widest mb-1 block">
              Factoid Title
            </label>
            <input
              className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-white/30 text-sm border border-white/10 focus:outline-none focus:border-[#C9A227]/60"
              placeholder="Short factual label…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />
          </div>

          <div>
            <label className="text-xs text-white/50 uppercase tracking-widest mb-1 block">
              Summary
            </label>
            <textarea
              className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-white/30 text-sm border border-white/10 focus:outline-none focus:border-[#C9A227]/60 resize-none"
              placeholder="Educational context for readers…"
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-white/50 uppercase tracking-widest mb-1 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> URL <span className="text-white/30">(optional)</span>
            </label>
            <input
              className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-white/30 text-sm border border-white/10 focus:outline-none focus:border-[#C9A227]/60"
              placeholder="https://…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-1">
            {generated && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={generating}
                className="text-white/60 border-white/20 hover:border-white/40 text-xs"
              >
                {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Regenerate"}
              </Button>
            )}
            <Button
              onClick={handleInsert}
              disabled={!title || !summary}
              className="flex-1 bg-[#C9A227] text-[#0B1930] font-bold hover:bg-[#C9A227]/90"
            >
              Insert Factoid
            </Button>
            <Button variant="outline" onClick={handleClose} className="text-white/60 border-white/20 hover:border-white/40">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
