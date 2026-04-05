import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Sparkles, X } from "lucide-react";

interface PettyIDDialogProps {
  open: boolean;
  onClose: () => void;
  selectedText: string;
  onConfirm: (data: { name: string; imageUrl: string; description?: string }) => void;
}

export function PettyIDDialog({ open, onClose, selectedText, onConfirm }: PettyIDDialogProps) {
  const [name, setName] = useState(selectedText);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && selectedText) {
      setName(selectedText);
      setImageUrl("");
      setDescription("");
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
    if (!name.trim() || !imageUrl.trim()) return;

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
    if (!isSafeUrl(trimmedUrl)) { alert("Invalid image URL."); return; }

    onConfirm({ name: name.trim(), imageUrl: trimmedUrl, description: description.trim() || undefined });
    setName(""); setImageUrl(""); setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-900/40 max-w-md z-[10003]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent font-bold">
              PettyID™
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
            <Input
              id="person-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Jane Smith"
              className="bg-slate-950 border-slate-700 text-white"
              data-testid="input-pettyid-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-upload" className="text-indigo-400 font-semibold">Upload Photo</Label>
            <input ref={fileInputRef} type="file" id="image-upload" accept="image/*" onChange={handleFileSelect} className="hidden" data-testid="input-pettyid-image-file" />
            {!imageUrl ? (
              <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full bg-indigo-900/40 hover:bg-indigo-800/60 border border-indigo-600/40 text-indigo-300 font-bold" data-testid="button-upload-image">
                {isUploading ? <><div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mr-2" />Uploading...</> : <><Upload className="w-4 h-4 mr-2" />Click to Upload Photo</>}
              </Button>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-700 rounded">
                <span className="text-sm text-green-400 flex-1">Photo uploaded</span>
                <Button type="button" size="sm" variant="ghost" onClick={() => { setImageUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="h-6 w-6 p-0" data-testid="button-remove-image">
                  <X className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            )}
            <p className="text-xs text-slate-500">Max 5MB &bull; JPG, PNG, GIF, WebP</p>
          </div>

          {imageUrl && (
            <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
              <img src={imageUrl} alt={name} className="w-full h-32 object-cover" onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%231e293b' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236366f1' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E"; }} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-indigo-400 font-semibold">Description (optional)</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief bio or context..." className="bg-slate-950 border-slate-700 text-white resize-none" rows={3} data-testid="input-pettyid-description" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-slate-950 border-slate-700" data-testid="button-cancel">Cancel</Button>
            <Button onClick={handleConfirm} disabled={!name.trim() || !imageUrl.trim()} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold" data-testid="button-confirm-pettyid">
              <Sparkles className="w-4 h-4 mr-2" />Add PettyID™
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
