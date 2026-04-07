import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Sparkles, X, Search, Loader2 } from "lucide-react";

function extractSentences(text: string, count: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [];
  return sentences.slice(0, count).join("").trim() || text.slice(0, 260).trim();
}

interface MetricadiaIDDialogProps {
  open: boolean;
  onClose: () => void;
  selectedText: string;
  onConfirm: (data: { name: string; imageUrl: string; description?: string; imageAttribution?: string }) => void;
}

async function fetchWikimediaAttribution(imgUrl: string): Promise<string> {
  try {
    const filename = decodeURIComponent(imgUrl.split("/").pop()?.split("?")[0] || "");
    if (!filename) return "Photo via Wikimedia Commons";
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=extmetadata&format=json&origin=*`;
    const res = await fetch(apiUrl);
    if (!res.ok) return "Photo via Wikimedia Commons";
    const data = await res.json() as any;
    const pages = Object.values((data.query?.pages || {})) as any[];
    const meta = pages[0]?.imageinfo?.[0]?.extmetadata;
    const artist = meta?.Artist?.value?.replace(/<[^>]+>/g, "").trim() || "";
    const license = meta?.LicenseShortName?.value || "CC";
    return artist
      ? `Photo: ${artist} · ${license} · Wikimedia Commons`
      : `Photo via Wikimedia Commons (${license})`;
  } catch {
    return "Photo via Wikimedia Commons";
  }
}

export function MetricadiaIDDialog({ open, onClose, selectedText, onConfirm }: MetricadiaIDDialogProps) {
  const [name, setName] = useState(selectedText);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [imageAttribution, setImageAttribution] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupStatus, setLookupStatus] = useState<"idle" | "found" | "notfound">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWikipediaLookup = async () => {
    if (!name.trim()) return;
    setIsLookingUp(true);
    setLookupStatus("idle");
    try {
      const encoded = encodeURIComponent(name.trim().replace(/ /g, "_"));
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`, {
        headers: { "User-Agent": "ClownBinge/1.0" },
      });
      if (!res.ok) throw new Error("not found");
      const data = await res.json() as any;
      if (data.type === "disambiguation" || !data.extract) throw new Error("ambiguous");

      const bio = extractSentences(data.extract, 3);
      setDescription(bio);

      if (!imageUrl && data.thumbnail?.source) {
        const src = data.thumbnail.source;
        setImageUrl(src);
        if (/upload\.wikimedia\.org|wikipedia\.org/i.test(src)) {
          const credit = await fetchWikimediaAttribution(src);
          setImageAttribution(credit);
        }
      }
      setLookupStatus("found");
    } catch {
      setLookupStatus("notfound");
    } finally {
      setIsLookingUp(false);
    }
  };

  useEffect(() => {
    if (open && selectedText) {
      setName(selectedText);
      setImageUrl("");
      setDescription("");
      setImageAttribution("");
      setLookupStatus("idle");
    }
  }, [open, selectedText]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Image must be less than 5MB"); return; }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const headers: HeadersInit = {};
      const token = sessionStorage.getItem("metricadia_token");
      if (token) headers["X-Metricadia-Token"] = token;

      const response = await fetch("/api/upload-image", {
        method: "POST",
        headers,
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setImageUrl(data.url);
    } catch {
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    if (!name.trim()) return;

    const isSafeUrl = (url: string): boolean => {
      const trimmed = url.trim();
      if (trimmed !== url || /[\x00-\x1F\x7F]/.test(url)) return false;
      if (url.startsWith("//")) return false;
      if (url.startsWith("/")) return true;
      try {
        const parsed = new URL(url, window.location.origin);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch { return false; }
    };

    const trimmedUrl = imageUrl.trim();
    if (trimmedUrl && !isSafeUrl(trimmedUrl)) { alert("Invalid image URL."); return; }

    onConfirm({
      name: name.trim(),
      imageUrl: trimmedUrl || "",
      description: description.trim() || undefined,
      imageAttribution: imageAttribution.trim() || undefined,
    });
    setName(""); setImageUrl(""); setDescription(""); setImageAttribution("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-900/40 max-w-md z-[10003]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent font-bold">
              Metricadia ID™
            </span>
            <span className="text-white">Identified</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a clickable person profile to your article
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="person-name" className="text-indigo-400 font-semibold">Person's Name</Label>
            <div className="flex gap-2">
              <Input
                id="person-name"
                value={name}
                onChange={(e) => { setName(e.target.value); setLookupStatus("idle"); }}
                placeholder="e.g., Jane Smith"
                className="bg-slate-950 border-slate-700 text-white flex-1"
                data-testid="input-metricadiaid-name"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleWikipediaLookup(); } }}
              />
              <Button
                type="button"
                onClick={handleWikipediaLookup}
                disabled={!name.trim() || isLookingUp}
                variant="outline"
                className="shrink-0 border-indigo-600/40 bg-indigo-900/20 text-indigo-300 hover:bg-indigo-800/40"
                title="Look up on Wikipedia"
                data-testid="button-wikipedia-lookup"
              >
                {isLookingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            {lookupStatus === "found" && (
              <p className="text-xs text-green-400">Wikipedia bio filled in. Edit below if needed.</p>
            )}
            {lookupStatus === "notfound" && (
              <p className="text-xs text-amber-400">No Wikipedia article found — write a bio manually.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-upload" className="text-indigo-400 font-semibold">
              Photo <span className="text-slate-500 font-normal">(optional — initials shown if omitted)</span>
            </Label>
            <input ref={fileInputRef} type="file" id="image-upload" accept="image/*" onChange={handleFileSelect} className="hidden" data-testid="input-metricadiaid-image-file" />
            {!imageUrl ? (
              <div className="flex gap-2 items-center">
                {/* Initials preview — shows what the popup will look like without a photo */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center border border-amber-500/40 shrink-0" title="Popup will show these initials">
                  <span className="text-sm font-bold text-amber-100 select-none">
                    {name.trim().split(" ").map((w: string) => w[0]).filter(Boolean).slice(0, 2).join("") || "?"}
                  </span>
                </div>
                <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex-1 bg-indigo-900/40 hover:bg-indigo-800/60 border border-indigo-600/40 text-indigo-300 font-bold" data-testid="button-upload-image">
                  {isUploading ? <><div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mr-2" />Uploading...</> : <><Upload className="w-4 h-4 mr-2" />Upload Photo</>}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-700 rounded">
                <span className="text-sm text-green-400 flex-1">Photo set</span>
                <Button type="button" size="sm" variant="ghost" onClick={() => { setImageUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="h-6 w-6 p-0" data-testid="button-remove-image">
                  <X className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            )}
            <p className="text-xs text-slate-500">Max 5MB &bull; JPG, PNG, GIF, WebP &bull; Wikipedia lookup auto-fills</p>
          </div>

          {imageUrl && (
            <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
              <img src={imageUrl} alt={name} className="w-full h-32 object-cover" onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%231e293b' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236366f1' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E"; }} />
            </div>
          )}

          {imageUrl && (
            <div className="space-y-1">
              <Label htmlFor="image-credit" className="text-indigo-400 font-semibold text-xs">
                Photo Credit <span className="text-slate-500 font-normal">(auto-filled for Wikimedia)</span>
              </Label>
              <Input
                id="image-credit"
                value={imageAttribution}
                onChange={(e) => setImageAttribution(e.target.value)}
                placeholder="e.g. Photo: Jane Doe · CC BY-SA · Wikimedia Commons"
                className="bg-slate-950 border-slate-700 text-white text-xs"
              />
              {imageAttribution && (
                <p className="text-[10px] text-green-400">Credit will display in the popup.</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-indigo-400 font-semibold">Who is this person? <span className="text-slate-500 font-normal">(2–3 sentences)</span></Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write 2–3 sentences about who this person is — or use the Wikipedia lookup above to auto-fill." className="bg-slate-950 border-slate-700 text-white resize-none" rows={4} data-testid="input-metricadiaid-description" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-slate-950 border-slate-700" data-testid="button-cancel">Cancel</Button>
            <Button onClick={handleConfirm} disabled={!name.trim() || !imageUrl.trim()} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold" data-testid="button-confirm-metricadiaid">
              <Sparkles className="w-4 h-4 mr-2" />Add Metricadia ID™
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
