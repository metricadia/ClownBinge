/**
 * MetricadiaEditor™
 * A full-featured visual content editor built on TipTap + React.
 *
 * Props:
 *   postId          – unique ID of the post being edited
 *   initialContent  – HTML string of existing content
 *   initialTitle    – article title
 *   initialExcerpt  – brief summary / meta description
 *   onClose         – called when user exits the editor
 *   apiEndpoint     – (optional) override the default PUT /api/posts/:postId endpoint
 */

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { MetricadiaIDMark, sanitizeMetricadiaIDAttributes } from "@/extensions/MetricadiaIDMark";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Quote,
  Code,
  Save,
  X,
  Lightbulb,
  Sparkles,
  Upload,
  Zap,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import { MetricadiaIDDialog } from "./MetricadiaIDDialog";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DetectedPerson {
  name: string;
  imageUrl: string | null;
  description: string | null;
  wikiUrl: string | null;
  found: boolean;
}

interface MetricadiaEditorProps {
  postId: string;
  initialContent: string;
  initialTitle: string;
  initialExcerpt: string;
  onClose: () => void;
  apiEndpoint?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MetricadiaEditor({
  postId,
  initialContent,
  initialTitle,
  initialExcerpt,
  onClose,
  apiEndpoint,
}: MetricadiaEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [seoScore, setSeoScore] = useState(0);
  const [isExcerptAutoFixed, setIsExcerptAutoFixed] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showMetricadiaIDDialog, setShowMetricadiaIDDialog] = useState(false);
  const [metricadiaIDSelectedText, setMetricadiaIDSelectedText] = useState("");
  const [metricadiaIDSelectionRange, setMetricadiaIDSelectionRange] = useState<{
    from: number;
    to: number;
  } | null>(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  // Compact mode (mobile / short viewports)
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [showEditorBody, setShowEditorBody] = useState(true);
  const [showSEO, setShowSEO] = useState(false);

  // Auto-detect state
  const [showAutoDetect, setShowAutoDetect] = useState(false);
  const [autoDetectLoading, setAutoDetectLoading] = useState(false);
  const [detectedPeople, setDetectedPeople] = useState<DetectedPerson[]>([]);
  const [approvedPeople, setApprovedPeople] = useState<Set<number>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // ── Compact mode detection ─────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsCompactMode(window.innerHeight < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Close handler ──────────────────────────────────────────────────────────
  const handleClose = async () => {
    if (saveMutation.isPending || isSaving) {
      await new Promise<void>((resolve) => {
        const iv = setInterval(() => {
          if (!saveMutation.isPending && !isSaving) {
            clearInterval(iv);
            resolve();
          }
        }, 100);
      });
    }
    onClose();
  };

  // ── TipTap editor ──────────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Underline,
      TextStyle,
      Color,
      MetricadiaIDMark.configure({ HTMLAttributes: { class: "metricadiaid-marker" } }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-indigo max-w-none focus:outline-none min-h-[400px] p-4 text-white",
      },
    },
  });

  // ── Save mutation ──────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      const content = editor?.getHTML() || "";
      const endpoint = apiEndpoint || `/api/posts/${postId}`;

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = sessionStorage.getItem("metricadia_token");
      if (token) headers["X-Metricadia-Token"] = token;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify({ title, content, excerpt }),
      });

      if (!res.ok) {
        const err: any = new Error(res.status === 401 ? "Unauthorized" : "Failed to save");
        err.status = res.status;
        throw err;
      }
      return res.json();
    },
    onSuccess: () => {
      if (apiEndpoint) {
        queryClient.invalidateQueries({ queryKey: [apiEndpoint] });
      } else {
        queryClient.invalidateQueries({
          predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "/api/posts",
        });
      }
      setIsSaving(false);
    },
    onError: (error: any) => {
      if (error.status === 401) {
        sessionStorage.removeItem("metricadia_token");
        sessionStorage.removeItem("metricadia_authenticated");
        toast({
          title: "Session Expired",
          description: "Please log in again to continue editing.",
          variant: "destructive",
        });
        setTimeout(() => (window.location.href = "/"), 2000);
      } else {
        toast({
          title: "Save Failed",
          description: "Could not save changes. Please try again.",
          variant: "destructive",
        });
      }
      setIsSaving(false);
    },
  });

  // ── Autosave (2-second debounce) ───────────────────────────────────────────
  useEffect(() => {
    if (!editor) return;
    const id = setTimeout(() => {
      if (!saveMutation.isPending) {
        setIsSaving(true);
        saveMutation.mutate();
      }
    }, 2000);
    return () => clearTimeout(id);
  }, [title, excerpt, editor?.state.doc]);

  // ── SEO Score ──────────────────────────────────────────────────────────────
  const calculateSEOScore = () => {
    if (!editor) return 0;
    let score = 0;
    const content = editor.getHTML();
    const wordCount = editor.getText().trim().split(/\s+/).length;
    if (title.length >= 50 && title.length <= 60) score += 25;
    else if (title.length >= 40 && title.length <= 70) score += 15;
    else if (title.length > 0) score += 5;
    if (excerpt.length >= 150 && excerpt.length <= 160) score += 25;
    else if (excerpt.length >= 120 && excerpt.length <= 180) score += 15;
    else if (excerpt.length > 0) score += 5;
    if (wordCount >= 1500) score += 30;
    else if (wordCount >= 1000) score += 20;
    else if (wordCount >= 500) score += 10;
    else if (wordCount >= 300) score += 5;
    const h1 = (content.match(/<h1>/g) || []).length;
    const h2 = (content.match(/<h2>/g) || []).length;
    if (h1 >= 1 && h2 >= 3) score += 20;
    else if (h2 >= 2) score += 10;
    else if (h2 >= 1) score += 5;
    return Math.min(score, 100);
  };

  useEffect(() => {
    if (!editor) return;
    setSeoScore(calculateSEOScore());
  }, [title, excerpt, editor?.state.doc]);

  // ── SEO Recommendations ────────────────────────────────────────────────────
  const generateRecommendations = () => {
    if (!editor) return [];
    const recs: { icon: string; priority: string; category: string; issue: string; solution: string }[] = [];
    const content = editor.getHTML();
    const wordCount = editor.getText().trim().split(/\s+/).length;
    const h1 = (content.match(/<h1>/g) || []).length;
    const h2 = (content.match(/<h2>/g) || []).length;
    if (!title.length) recs.push({ icon: "🚨", priority: "Critical", category: "Title", issue: "Missing title", solution: "Add a title between 50-60 characters." });
    else if (title.length < 40) recs.push({ icon: "⚠️", priority: "High", category: "Title", issue: `Title too short (${title.length})`, solution: "Expand to 50-60 characters." });
    else if (title.length > 70) recs.push({ icon: "⚠️", priority: "Medium", category: "Title", issue: `Title too long (${title.length})`, solution: "Trim to 50-60 characters." });
    if (!excerpt.length) recs.push({ icon: "🚨", priority: "Critical", category: "Meta Description", issue: "Missing excerpt", solution: "Add a 150-160 character summary for Google." });
    else if (excerpt.length < 120) recs.push({ icon: "⚠️", priority: "High", category: "Meta Description", issue: `Excerpt too short (${excerpt.length})`, solution: "Expand to 150-160 characters." });
    else if (excerpt.length > 180) recs.push({ icon: "⚠️", priority: "Medium", category: "Meta Description", issue: `Excerpt too long (${excerpt.length})`, solution: "Trim to 150-160 characters." });
    if (wordCount < 300) recs.push({ icon: "🚨", priority: "Critical", category: "Content Length", issue: `Very short (${wordCount} words)`, solution: "Aim for 1,000+ words." });
    else if (wordCount < 1000) recs.push({ icon: "⚠️", priority: "High", category: "Content Length", issue: `Short content (${wordCount} words)`, solution: "Expand to 1,500+ words." });
    if (h1 === 0 && h2 === 0) recs.push({ icon: "🚨", priority: "Critical", category: "Headings", issue: "No headings", solution: "Add an H1 and at least 3 H2s." });
    else if (h2 < 3) recs.push({ icon: "⚠️", priority: "Medium", category: "Headings", issue: `Only ${h2} H2(s)`, solution: "Add at least 3 H2 headings." });
    if (seoScore >= 95) recs.push({ icon: "🎉", priority: "Success", category: "Overall", issue: "Excellent SEO!", solution: "Your content is well-optimized." });
    return recs;
  };

  // ── Auto-fix excerpt ───────────────────────────────────────────────────────
  const autoFixExcerpt = () => {
    if (!editor) return;
    const clean = editor.getText().replace(/\s+/g, " ").trim();
    if (!clean) return;
    let ex = clean.substring(0, 155);
    if (clean.length > 155 && ex.lastIndexOf(" ") > 0) ex = ex.substring(0, ex.lastIndexOf(" "));
    if (clean.length > ex.length) ex += "...";
    setExcerpt(ex);
    setIsExcerptAutoFixed(true);
    toast({ title: "Excerpt auto-fixed!", description: `${ex.length} chars — SEO optimized.` });
  };

  // ── Manual save ────────────────────────────────────────────────────────────
  const handleManualSave = () => {
    if (!saveMutation.isPending) {
      setIsSaving(true);
      setJustSaved(true);
      saveMutation.mutate();
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
    const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragStart({ x: cx - position.x, y: cy - position.y });
  };
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const cx = "touches" in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const cy = "touches" in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    setPosition({ x: cx - dragStart.x, y: cy - dragStart.y });
  };
  const handleDragEnd = () => setIsDragging(false);
  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleDragMove);
    window.addEventListener("touchend", handleDragEnd);
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, dragStart, position]);

  // ── Image upload ───────────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) { toast({ title: "File too large", description: "Max 10 MB.", variant: "destructive" }); return; }
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const headers: HeadersInit = {};
      const token = sessionStorage.getItem("metricadia_token");
      if (token) headers["X-Metricadia-Token"] = token;
      const res = await fetch("/api/upload-image", { method: "POST", body: formData, credentials: "include", headers });
      if (!res.ok) throw Object.assign(new Error("Upload failed"), { status: res.status });
      const data = await res.json();
      editor?.chain().focus().setImage({ src: data.url }).run();
      toast({ title: "Image uploaded", description: file.name });
    } catch (err: any) {
      if (err.status === 401) { sessionStorage.removeItem("metricadia_token"); toast({ title: "Session expired", variant: "destructive" }); setTimeout(() => (window.location.href = "/"), 2000); }
      else toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Metricadia ID handlers ───────────────────────────────────────────────────────
  const handleOpenMetricadiaID = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");
    if (!text.trim()) { toast({ title: "No text selected", description: "Select a person's name first.", variant: "destructive" }); return; }
    setMetricadiaIDSelectedText(text);
    setMetricadiaIDSelectionRange({ from, to });
    setShowMetricadiaIDDialog(true);
  };

  const handleConfirmMetricadiaID = (data: { name: string; imageUrl: string; description?: string }) => {
    if (!editor || !metricadiaIDSelectionRange) return;
    const sanitized = sanitizeMetricadiaIDAttributes(data);
    editor.chain().focus().setTextSelection(metricadiaIDSelectionRange).setMetricadiaID({
      name: sanitized.name || "",
      imageUrl: sanitized.imageUrl || "/uploads/fallback-avatar.png",
      description: sanitized.description || undefined,
    }).run();
    toast({ title: "Profile linked", description: `${data.name} is now clickable.` });
    setMetricadiaIDSelectionRange(null);
  };

  // ── Auto-detect: scan article and pull Wikipedia data ──────────────────────
  const handleAutoDetect = async () => {
    if (!editor) return;
    setAutoDetectLoading(true);
    setShowAutoDetect(true);
    setDetectedPeople([]);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = sessionStorage.getItem("metricadia_token");
      if (token) headers["X-Metricadia-Token"] = token;

      const res = await fetch("/api/metricadia/detect-people", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ content: editor.getHTML() }),
      });

      if (!res.ok) throw new Error("Detection failed");
      const data = await res.json();
      setDetectedPeople(data.people || []);
      setApprovedPeople(new Set(
        (data.people || [])
          .map((_: DetectedPerson, i: number) => i)
          .filter((i: number) => (data.people as DetectedPerson[])[i]?.found)
      ));
    } catch {
      toast({ title: "Detection failed", description: "Could not scan the article. Try again.", variant: "destructive" });
      setShowAutoDetect(false);
    } finally {
      setAutoDetectLoading(false);
    }
  };

  // ── Apply approved MetricadiaID marks to the HTML ──────────────────────────
  const applyMetricadiaIDMarks = () => {
    if (!editor) return;
    let html = editor.getHTML();
    let appliedCount = 0;

    for (const idx of approvedPeople) {
      const person = detectedPeople[idx];
      if (!person) continue;

      const escapedName = person.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escapedName}\\b`);

      const parts = html.split(/(<[^>]+>)/);
      let found = false;
      html = parts.map(part => {
        if (found || part.startsWith("<")) return part;
        if (regex.test(part)) {
          found = true;
          appliedCount++;
          const safeDesc = person.description
            ? person.description.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            : "";
          const safeImg = (person.imageUrl || "").replace(/"/g, "&quot;");
          const safeName = person.name.replace(/"/g, "&quot;").replace(/</g, "&lt;");
          return part.replace(regex, (match) =>
            `<span data-metricadiaid-name="${safeName}" data-metricadiaid-image="${safeImg}"${safeDesc ? ` data-metricadiaid-desc="${safeDesc}"` : ""} class="metricadiaid-marker" role="button" tabindex="0">${match}</span>`
          );
        }
        return part;
      }).join("");
    }

    editor.commands.setContent(html, false);
    setShowAutoDetect(false);
    toast({ title: `${appliedCount} Metricadia ID${appliedCount !== 1 ? "s" : ""} applied`, description: "Names are now clickable in the article." });
  };

  if (!editor) return null;

  // ── SEO score color ────────────────────────────────────────────────────────
  const scoreColor = seoScore >= 80 ? "#22c55e" : seoScore >= 60 ? "#eab308" : seoScore >= 40 ? "#f97316" : "#ef4444";

  // ── Shared toolbar button classes ──────────────────────────────────────────
  const toolbarBtn = (active: boolean) =>
    `min-h-[44px] min-w-[44px] p-2 ${active ? "bg-indigo-600 text-white border-indigo-500 shadow-lg" : "bg-slate-950 text-indigo-400 border-slate-700 hover:border-indigo-500 hover:bg-slate-900"}`;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={editorRef}
      className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-[9999] flex flex-col"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "default",
        transition: isDragging ? "none" : "transform 0.2s ease-out",
      }}
    >
      {/* Floating close */}
      <button
        onClick={handleClose}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-[10001] w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 border-2 border-red-500/30"
        data-testid="button-close-editor-floating"
        title="Close Metricadia Editor"
        style={{ boxShadow: "0 0 30px rgba(220,38,38,0.5)" }}
      >
        <X className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
      </button>

      {/* Saving indicator */}
      {(isSaving || saveMutation.isPending) && (
        <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[10001] bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm animate-pulse flex items-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          SAVING...
        </div>
      )}

      <div className="flex-1 overflow-y-auto pt-4 md:pt-6 pb-20 px-2 md:px-0">
        <div className="max-w-6xl mx-auto flex flex-col h-full shadow-2xl">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div
            className="flex-shrink-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b-2 border-indigo-600/40 shadow-2xl rounded-t-xl select-none"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
            data-testid="editor-drag-handle"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-xl text-xl md:text-2xl font-black text-white"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
              >
                M
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 tracking-tight">
                  Metricadia Editor
                </h2>
                <p className="text-[10px] md:text-xs text-slate-500 tracking-widest uppercase font-bold">
                  Drag to Move &bull; Content Intelligence Platform
                </p>
              </div>
            </div>

            {/* SEO Score */}
            {!isCompactMode && (
              <div className="flex items-center gap-2 md:gap-3 justify-between md:justify-start">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-xl border border-slate-700">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">SEO Score</div>
                    <div className="text-lg font-black" style={{ color: scoreColor }}>{seoScore}/100</div>
                  </div>
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 text-lg md:text-xl font-black text-white"
                    style={{
                      borderColor: scoreColor,
                      background: `conic-gradient(${scoreColor} ${seoScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                    }}
                  >
                    {seoScore}
                  </div>
                </div>

                {/* Recommendations dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-slate-900 border-indigo-600/40 text-indigo-400 font-bold" data-testid="button-seo-recommendations">
                      <Lightbulb className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Tips</span>
                    </Button>
                  </DialogTrigger>
                  <DialogPortal>
                    <DialogOverlay className="fixed inset-0 z-[10000] bg-black/80" />
                    <div className="fixed left-1/2 top-1/2 z-[10001] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-slate-950 to-slate-900 border border-indigo-600/30 rounded-xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
                      <DialogClose className="absolute right-4 top-4 text-slate-400 hover:text-white p-2 rounded bg-slate-800/50">
                        <X className="h-4 w-4" />
                      </DialogClose>
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-indigo-400 flex items-center gap-2">
                          <Lightbulb className="w-6 h-6" /> SEO Recommendations
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Personalized tips to boost your score from {seoScore}/100
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-6">
                        {generateRecommendations().map((rec, i) => (
                          <div key={i} className="p-4 bg-slate-900 border rounded-xl" style={{ borderColor: rec.priority === "Critical" ? "#ef4444" : rec.priority === "High" ? "#f97316" : rec.priority === "Medium" ? "#eab308" : rec.priority === "Success" ? "#22c55e" : "#475569" }}>
                            <div className="flex gap-3">
                              <span className="text-3xl">{rec.icon}</span>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-bold text-slate-300 uppercase px-2 py-0.5 rounded bg-slate-800">{rec.priority}</span>
                                  <span className="text-indigo-400 text-sm font-semibold">{rec.category}</span>
                                </div>
                                <h4 className="text-white font-bold mb-1">{rec.issue}</h4>
                                <p className="text-slate-300 text-sm">{rec.solution}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {generateRecommendations().length === 0 && (
                          <div className="text-center py-10">
                            <p className="text-2xl font-black text-green-400">Perfect score!</p>
                            <p className="text-slate-400 mt-2">Your content is fully optimized.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogPortal>
                </Dialog>
              </div>
            )}

            <Button onClick={handleClose} variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6" data-testid="button-close-editor">
              <X className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">EXIT</span>
            </Button>
          </div>

          {/* ── Compact toggles ────────────────────────────────────────── */}
          {isCompactMode && (
            <div className="flex-shrink-0 p-3 bg-slate-900 border-b border-indigo-900/30">
              <button onClick={() => setShowMetadata(!showMetadata)} className="w-full flex items-center justify-between text-indigo-400 font-bold text-sm" data-testid="button-toggle-metadata">
                <span>{showMetadata ? "▼" : "▶"} Title & Excerpt</span>
                <span className="text-xs text-slate-500">{showMetadata ? "Hide" : "Show"}</span>
              </button>
            </div>
          )}

          {/* ── Title & Excerpt ────────────────────────────────────────── */}
          {(!isCompactMode || showMetadata) && (
            <div className="flex-shrink-0 p-4 md:p-8 space-y-4 bg-gradient-to-b from-slate-800 to-slate-900 border-b-2 border-indigo-900/40 border-x-2 border-indigo-900/20">
              <div>
                <label className="text-xs font-bold text-indigo-400 mb-2 block tracking-wide uppercase">Article Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-slate-700 hover:border-indigo-700/50 focus:border-indigo-600 rounded-lg px-4 py-3 text-white text-lg font-semibold focus:outline-none transition-all"
                  data-testid="input-post-title"
                  placeholder="Enter article title..."
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="text-xs font-bold text-indigo-400 tracking-wide uppercase">Excerpt / Meta</label>
                    {isExcerptAutoFixed && (
                      <span className="text-xs font-bold text-green-400 bg-green-950/50 border border-green-600/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Auto-Fixed
                      </span>
                    )}
                  </div>
                  <Button onClick={autoFixExcerpt} variant="outline" size="sm" className="bg-indigo-600 text-white border-indigo-500 font-bold text-xs h-auto shrink-0" data-testid="button-auto-fix-excerpt">
                    <Sparkles className="w-3 h-3 mr-1" /> Auto-Fix
                  </Button>
                </div>
                <div className="relative">
                  <textarea
                    value={excerpt}
                    onChange={(e) => { setExcerpt(e.target.value); setIsExcerptAutoFixed(false); }}
                    rows={3}
                    className="w-full bg-slate-950 border-2 border-slate-700 hover:border-indigo-700/50 focus:border-indigo-600 rounded-lg px-4 py-3 text-white text-sm resize-none focus:outline-none transition-all"
                    data-testid="input-post-excerpt"
                    placeholder="Brief summary (150-160 chars for Google)..."
                  />
                  <span className={`absolute bottom-2 right-3 text-xs font-mono ${excerpt.length >= 150 && excerpt.length <= 160 ? "text-green-400" : excerpt.length > 160 ? "text-red-400" : "text-slate-500"}`}>
                    {excerpt.length}/160
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Toolbar ────────────────────────────────────────────────── */}
          <div
            className={`flex-shrink-0 flex gap-1.5 md:gap-2 p-3 md:p-4 border-b-2 border-indigo-900/40 border-x-2 border-indigo-900/20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 ${isCompactMode ? "overflow-x-auto" : "flex-wrap"}`}
            style={isCompactMode ? { scrollbarWidth: "none" } : {}}
          >
            {/* Save */}
            <Button
              onClick={handleManualSave}
              variant="outline"
              size="sm"
              className={justSaved ? "bg-green-600 text-white border-green-500 min-h-[44px] px-3" : "bg-indigo-600 text-white border-indigo-500 font-bold min-h-[44px] px-3"}
              data-testid="button-save"
              disabled={saveMutation.isPending}
            >
              <Save className="w-4 h-4 md:mr-1" />
              <span className="hidden sm:inline ml-1">{justSaved ? "SAVED!" : "SAVE"}</span>
            </Button>

            <div className="hidden md:block w-px h-8 bg-slate-700 mx-1" />

            {/* Formatting */}
            <Button onClick={() => editor.chain().focus().toggleBold().run()} variant="outline" size="sm" className={toolbarBtn(editor.isActive("bold"))} data-testid="button-bold" title="Bold"><Bold className="w-5 h-5" /></Button>
            <Button onClick={() => editor.chain().focus().toggleItalic().run()} variant="outline" size="sm" className={toolbarBtn(editor.isActive("italic"))} data-testid="button-italic" title="Italic"><Italic className="w-5 h-5" /></Button>
            <Button onClick={() => editor.chain().focus().toggleUnderline().run()} variant="outline" size="sm" className={toolbarBtn(editor.isActive("underline"))} data-testid="button-underline" title="Underline"><UnderlineIcon className="w-5 h-5" /></Button>

            <div className="hidden md:block w-px h-8 bg-slate-700 mx-1" />

            {/* Color swatches */}
            {[
              { color: "hsl(230, 60%, 60%)", name: "Indigo", testId: "button-color-indigo" },
              { color: "hsl(45, 95%, 60%)", name: "Yellow", testId: "button-color-yellow" },
              { color: "hsl(0, 0%, 98%)", name: "White", testId: "button-color-white" },
              { color: "hsl(210, 20%, 70%)", name: "Grey", testId: "button-color-grey" },
            ].map(({ color, name, testId }) => (
              <Button
                key={testId}
                onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().setColor(color).run(); }}
                variant="outline"
                size="sm"
                className={toolbarBtn(false)}
                data-testid={testId}
                title={`${name} text`}
              >
                <div className="w-5 h-5 rounded-full border-2 border-white/40" style={{ backgroundColor: color }} />
              </Button>
            ))}
            <Button onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().unsetColor().run(); }} variant="outline" size="sm" className={toolbarBtn(false)} data-testid="button-color-clear" title="Clear color"><X className="w-4 h-4" /></Button>

            <div className="hidden md:block w-px h-8 bg-slate-700 mx-1" />

            {/* Metricadia ID™ — manual */}
            <Button onClick={handleOpenMetricadiaID} variant="outline" size="sm" className="min-h-[44px] px-3 bg-indigo-900/30 text-indigo-300 border-indigo-600/40 hover:border-indigo-400 font-bold" data-testid="button-metricadiaid" title="Select a name, then add a Metricadia ID profile">
              <Zap className="w-4 h-4 mr-1" /><span className="hidden md:inline">ID™</span>
            </Button>
            {/* Metricadia ID™ — auto-detect */}
            <Button onClick={handleAutoDetect} variant="outline" size="sm" className="min-h-[44px] px-3 bg-amber-900/30 text-amber-300 border-amber-600/40 hover:border-amber-400 font-bold" data-testid="button-auto-detect-people" title="Auto-detect all people in this article">
              <Users className="w-4 h-4 mr-1" /><span className="hidden md:inline">Auto-ID</span>
            </Button>

            <div className="hidden md:block w-px h-8 bg-slate-700 mx-1" />

            {/* Headings */}
            <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} variant="outline" size="sm" className={toolbarBtn(editor.isActive("heading", { level: 1 }))} data-testid="button-h1" title="H1"><Heading1 className="w-5 h-5" /></Button>
            <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} variant="outline" size="sm" className={toolbarBtn(editor.isActive("heading", { level: 2 }))} data-testid="button-h2" title="H2"><Heading2 className="w-5 h-5" /></Button>

            <div className="hidden md:block w-px h-8 bg-slate-700 mx-1" />

            {/* Lists & blocks */}
            <Button onClick={() => editor.chain().focus().toggleBulletList().run()} variant="outline" size="sm" className={toolbarBtn(editor.isActive("bulletList"))} data-testid="button-bullet-list" title="Bullet list"><List className="w-5 h-5" /></Button>
            <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} variant="outline" size="sm" className={toolbarBtn(editor.isActive("orderedList"))} data-testid="button-ordered-list" title="Numbered list"><ListOrdered className="w-5 h-5" /></Button>
            <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} variant="outline" size="sm" className={toolbarBtn(editor.isActive("blockquote"))} data-testid="button-blockquote" title="Quote"><Quote className="w-5 h-5" /></Button>
            <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()} variant="outline" size="sm" className={toolbarBtn(editor.isActive("codeBlock"))} data-testid="button-code" title="Code block"><Code className="w-5 h-5" /></Button>

            <div className="hidden md:block w-px h-8 bg-slate-700 mx-1" />

            {/* Link & Image */}
            <Button onClick={() => { const url = window.prompt("Enter URL:"); if (url) editor.chain().focus().setLink({ href: url }).run(); }} variant="outline" size="sm" className={toolbarBtn(editor.isActive("link"))} data-testid="button-link" title="Link"><LinkIcon className="w-5 h-5" /></Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" disabled={isUploadingImage} className={toolbarBtn(false)} data-testid="button-image" title="Upload image">
              {isUploadingImage ? <Upload className="w-5 h-5 animate-pulse" /> : <ImageIcon className="w-5 h-5" />}
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" data-testid="input-image-upload" />
          </div>

          {/* ── Compact SEO panel ──────────────────────────────────────── */}
          {isCompactMode && (
            <div className="flex-shrink-0 p-3 bg-slate-900 border-b border-indigo-900/30">
              <button onClick={() => setShowSEO(!showSEO)} className="w-full flex items-center justify-between text-indigo-400 font-bold text-sm" data-testid="button-toggle-seo">
                <span>{showSEO ? "▼" : "▶"} SEO Score</span>
                <span className="text-xs text-slate-500">{showSEO ? "Hide" : "Show"}</span>
              </button>
            </div>
          )}
          {isCompactMode && showSEO && (
            <div className="flex-shrink-0 p-4 bg-slate-800 border-b border-indigo-900/30">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-xl border border-slate-700">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase">SEO Score</div>
                  <div className="text-lg font-black" style={{ color: scoreColor }}>{seoScore}/100</div>
                </div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center border-4 text-xl font-black text-white" style={{ borderColor: scoreColor, background: `conic-gradient(${scoreColor} ${seoScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}>
                  {seoScore}
                </div>
              </div>
            </div>
          )}

          {/* ── Compact editor body toggle ─────────────────────────────── */}
          {isCompactMode && (
            <div className="flex-shrink-0 p-3 bg-slate-900 border-b border-indigo-900/30">
              <button onClick={() => setShowEditorBody(!showEditorBody)} className="w-full flex items-center justify-between text-indigo-400 font-bold text-sm" data-testid="button-toggle-editor-body">
                <span>{showEditorBody ? "▼" : "▶"} Main Editor</span>
                <span className="text-xs text-slate-500">{showEditorBody ? "Hide" : "Show"}</span>
              </button>
            </div>
          )}

          {/* ── Editor content area ────────────────────────────────────── */}
          {(!isCompactMode || showEditorBody) && (
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-950 p-3 md:p-8 border-x-2 border-b-2 border-indigo-900/20 rounded-b-xl">
              <div className="bg-slate-950 rounded-xl p-4 md:p-8 border border-slate-800 shadow-2xl min-h-full">
                <EditorContent editor={editor} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metricadia ID™ dialog */}
      <MetricadiaIDDialog
        open={showMetricadiaIDDialog}
        onClose={() => setShowMetricadiaIDDialog(false)}
        selectedText={metricadiaIDSelectedText}
        onConfirm={handleConfirmMetricadiaID}
      />

      {/* Auto-detect review modal */}
      {showAutoDetect && (
        <div className="fixed inset-0 z-[10002] bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-600/30 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Auto-detected People</h2>
                  <p className="text-xs text-slate-500">Wikipedia images &amp; bios — approve to mark names as clickable</p>
                </div>
              </div>
              <button onClick={() => setShowAutoDetect(false)} className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {autoDetectLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 font-medium">Scanning article &amp; fetching Wikipedia data…</p>
                </div>
              )}

              {!autoDetectLoading && detectedPeople.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                  <p className="text-lg font-semibold">No people found</p>
                  <p className="text-sm mt-1">No recognisable real-person names were detected in this article.</p>
                </div>
              )}

              {!autoDetectLoading && detectedPeople.map((person, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    approvedPeople.has(i)
                      ? "bg-amber-950/30 border-amber-600/50"
                      : "bg-slate-900 border-slate-700 opacity-60"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 rounded accent-amber-500 flex-shrink-0"
                    checked={approvedPeople.has(i)}
                    disabled={!person.found}
                    onChange={(e) => {
                      const next = new Set(approvedPeople);
                      if (e.target.checked) next.add(i); else next.delete(i);
                      setApprovedPeople(next);
                    }}
                  />

                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                    {person.imageUrl
                      ? <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover object-top" />
                      : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-800/60 to-amber-950/80">
                          <span className="text-amber-200 font-black text-sm select-none">
                            {person.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                          </span>
                        </div>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{person.name}</span>
                      {person.found
                        ? <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle2 className="w-3 h-3" />{person.imageUrl ? "Wikipedia" : "Wikipedia · no photo"}</span>
                        : <span className="flex items-center gap-1 text-xs text-slate-500"><AlertCircle className="w-3 h-3" />Not in Wikipedia</span>
                      }
                    </div>
                    {person.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{person.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>

            {/* Footer */}
            {!autoDetectLoading && detectedPeople.length > 0 && (
              <div className="flex items-center justify-between gap-3 p-4 border-t border-slate-800 flex-shrink-0">
                <span className="text-sm text-slate-400">
                  {approvedPeople.size} of {detectedPeople.filter(p => p.found).length} with images selected
                </span>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300" onClick={() => setShowAutoDetect(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-black font-bold"
                    disabled={approvedPeople.size === 0}
                    onClick={applyMetricadiaIDMarks}
                    data-testid="button-apply-metricadiaid"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />Apply {approvedPeople.size} ID{approvedPeople.size !== 1 ? "s" : ""}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
