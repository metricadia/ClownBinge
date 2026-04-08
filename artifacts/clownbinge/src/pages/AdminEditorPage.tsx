import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AdminLogin } from "@/components/AdminLogin";
import { MetricadiaEditor } from "@/components/MetricadiaEditor";
import { Button } from "@/components/ui/button";
import { PenLine, LogOut, Plus, X, Loader2, Star, Trash2, Copy, Check } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  caseNumber?: string;
  publishedAt?: string;
  premiumOnly?: boolean;
}

interface SubscriberToken {
  token: string;
  label: string;
  email: string | null;
  active: boolean;
  createdAt: string;
  expiresAt: string | null;
}

const CATEGORIES: { value: string; label: string }[] = [
  { value: "self_owned",            label: "Self-Owned" },
  { value: "law_and_justice",       label: "Law & Justice" },
  { value: "money_and_power",       label: "Money & Power" },
  { value: "us_constitution",       label: "US Constitution" },
  { value: "women_and_girls",       label: "Women & Girls" },
  { value: "anti_racist_heroes",    label: "Anti-Racist Heroes" },
  { value: "us_history",            label: "US History" },
  { value: "religion",              label: "Religion" },
  { value: "investigations",        label: "Investigations" },
  { value: "war_and_inhumanity",    label: "War & Inhumanity" },
  { value: "health_and_healing",    label: "Health & Healing" },
  { value: "technology",            label: "Technology" },
  { value: "censorship",            label: "Censorship" },
  { value: "global_south",          label: "Global South" },
  { value: "how_it_works",          label: "How It Works" },
  { value: "nerd_out",              label: "Nerd Out" },
  { value: "disarming_hate",        label: "Disarming Hate" },
  { value: "native_and_first_nations", label: "Native & First Nations" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = sessionStorage.getItem("metricadia_token");
  if (token) headers["X-Metricadia-Token"] = token;
  return headers;
}

function useAdminAuth() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("metricadia_authenticated") === "true") {
      setAuthenticated(true);
      return;
    }
    fetch("/api/metricadia/auth-status", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setAuthenticated(!!d.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  const logout = async () => {
    await fetch("/api/metricadia/logout", { method: "POST", credentials: "include" });
    sessionStorage.removeItem("metricadia_token");
    sessionStorage.removeItem("metricadia_authenticated");
    setAuthenticated(false);
  };

  return { authenticated, setAuthenticated, logout };
}

interface NewArticleModalProps {
  onClose: () => void;
  onCreated: (post: Post) => void;
}

function NewArticleModal({ onClose, onCreated }: NewArticleModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [caseManual, setCaseManual] = useState(false);
  const [caseLoading, setCaseLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCaseLoading(true);
    fetch("/api/metricadia/next-case-number", {
      credentials: "include",
      headers: authHeaders(),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.caseNumber) setCaseNumber(d.caseNumber);
      })
      .catch(() => setCaseNumber("CB-000001"))
      .finally(() => setCaseLoading(false));
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManual) setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category || !caseNumber.trim() || !slug.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!/^CB-\d{6}$/.test(caseNumber.trim())) {
      setError("Case number must be in CB-XXXXXX format.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/metricadia/posts", {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
        body: JSON.stringify({
          caseNumber: caseNumber.trim(),
          title: title.trim(),
          slug: slug.trim(),
          category,
          status: "draft",
          body: "",
          teaser: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create article.");
        return;
      }
      onCreated({
        id: data.id,
        title: title.trim(),
        slug: slug.trim(),
        excerpt: "",
        content: "",
        caseNumber: caseNumber.trim(),
      });
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-white">New Article</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article headline..."
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
              autoFocus
              data-testid="input-new-article-title"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
              data-testid="select-new-article-category"
            >
              <option value="" disabled>Select a category...</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Case Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={caseLoading ? "" : caseNumber}
                  onChange={(e) => { setCaseManual(true); setCaseNumber(e.target.value); }}
                  placeholder={caseLoading ? "Loading..." : "CB-000000"}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-sm font-mono"
                  data-testid="input-new-article-case-number"
                />
                {caseLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 animate-spin" />
                )}
              </div>
              {!caseManual && !caseLoading && (
                <p className="text-[10px] text-slate-600 mt-1">Auto-generated · editable</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Slug <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }}
                placeholder="url-slug"
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-sm font-mono"
                data-testid="input-new-article-slug"
              />
              {!slugManual && slug && (
                <p className="text-[10px] text-slate-600 mt-1">Auto-derived from title</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 text-slate-400 hover:text-white"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              disabled={submitting || caseLoading || !title.trim() || !category || !slug.trim()}
              data-testid="button-create-article"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>
              ) : (
                <><Plus className="w-4 h-4 mr-2" />Create &amp; Open Editor</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SubscribersPanel({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const queryClient = useQueryClient();
  const [newLabel, setNewLabel] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const { data: tokens = [], isLoading } = useQuery<SubscriberToken[]>({
    queryKey: ["/api/metricadia/subscriber-tokens"],
    queryFn: async () => {
      const res = await fetch("/api/metricadia/subscriber-tokens", { credentials: "include", headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch tokens");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/metricadia/subscriber-tokens", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ label: newLabel.trim(), email: newEmail.trim() || undefined }),
      });
      if (!res.ok) throw new Error("Failed to create token");
      return res.json();
    },
    onSuccess: () => {
      setNewLabel("");
      setNewEmail("");
      setCreating(false);
      queryClient.invalidateQueries({ queryKey: ["/api/metricadia/subscriber-tokens"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ token, active }: { token: string; active: boolean }) => {
      const res = await fetch(`/api/metricadia/subscriber-tokens/${token}/active`, {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error("Failed to update");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/metricadia/subscriber-tokens"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (token: string) => {
      await fetch(`/api/metricadia/subscriber-tokens/${token}`, {
        method: "DELETE",
        headers: authHeaders(),
        credentials: "include",
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/metricadia/subscriber-tokens"] }),
  });

  function copyToken(token: string) {
    const activationUrl = `${window.location.origin}/subscribe?token=${token}`;
    navigator.clipboard.writeText(activationUrl).then(() => {
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Subscribers</h1>
          <p className="text-slate-500 text-sm mt-1">{tokens.filter(t => t.active).length} active tokens</p>
        </div>
        <Button
          size="sm"
          onClick={() => setCreating(true)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />Issue Token
        </Button>
      </div>

      {creating && (
        <div className="bg-slate-900 border border-amber-700/40 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-white mb-4">Issue New Access Token</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Label <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Jane Smith — Apr 2026"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="subscriber@example.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button
                size="sm"
                onClick={() => createMutation.mutate()}
                disabled={!newLabel.trim() || createMutation.isPending}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
              >
                {createMutation.isPending ? "Creating..." : "Create Token"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCreating(false)} className="text-slate-400">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && tokens.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <Star className="w-10 h-10 mx-auto mb-3 text-slate-700" />
          <p>No subscriber tokens yet. Issue one to get started.</p>
        </div>
      )}

      <div className="grid gap-3">
        {tokens.map((t) => (
          <div
            key={t.token}
            className={`bg-slate-900 border rounded-xl p-4 ${t.active ? "border-slate-800" : "border-slate-800/40 opacity-60"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-bold text-white text-sm">{t.label}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${t.active ? "bg-green-950 text-green-400" : "bg-slate-800 text-slate-500"}`}>
                    {t.active ? "ACTIVE" : "REVOKED"}
                  </span>
                </div>
                {t.email && <p className="text-xs text-slate-500">{t.email}</p>}
                <p className="text-[10px] text-slate-700 font-mono mt-1 truncate max-w-[240px]" title={t.token}>{t.token}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Issued: {new Date(t.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  {t.expiresAt && ` · Expires: ${new Date(t.expiresAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => copyToken(t.token)}
                  title="Copy activation link"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {copiedToken === t.token ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => toggleMutation.mutate({ token: t.token, active: !t.active })}
                  title={t.active ? "Revoke access" : "Restore access"}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                    t.active
                      ? "bg-red-950/50 text-red-400 hover:bg-red-950"
                      : "bg-green-950/50 text-green-400 hover:bg-green-950"
                  }`}
                >
                  {t.active ? "Revoke" : "Restore"}
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete token for "${t.label}"?`)) deleteMutation.mutate(t.token);
                  }}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Delete token permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Member {
  clerkId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  lastLoginAt: string;
}

function MembersPanel({ authHeaders }: { authHeaders: () => Record<string, string> }) {
  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ["/api/members"],
    queryFn: async () => {
      const res = await fetch("/api/members", { credentials: "include", headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch members");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Clerk Members</h2>
          <p className="text-xs text-slate-400 mt-0.5">{members.length} registered member{members.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          No members yet. Members appear here when they sign in via Clerk.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/60">
                <th className="text-left px-4 py-3 text-[11px] font-black uppercase tracking-wider text-slate-400">Member</th>
                <th className="text-left px-4 py-3 text-[11px] font-black uppercase tracking-wider text-slate-400">Email</th>
                <th className="text-left px-4 py-3 text-[11px] font-black uppercase tracking-wider text-slate-400">Joined</th>
                <th className="text-left px-4 py-3 text-[11px] font-black uppercase tracking-wider text-slate-400">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, i) => (
                <tr key={member.clerkId} className={`border-b border-slate-800 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-900/20"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-indigo-900/60 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-indigo-300">{(member.name || member.email)[0].toUpperCase()}</span>
                        </div>
                      )}
                      <span className="text-white font-medium">{member.name || <span className="text-slate-500 italic">—</span>}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-mono text-xs">{member.email}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{new Date(member.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{new Date(member.lastLoginAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminEditorPage() {
  const params = useParams<{ postId?: string }>();
  const [, setLocation] = useLocation();
  const { authenticated, setAuthenticated, logout } = useAdminAuth();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [search, setSearch] = useState("");
  const [showNewArticle, setShowNewArticle] = useState(false);
  const [activeTab, setActiveTab] = useState<"articles" | "subscribers" | "members">("articles");
  const queryClient = useQueryClient();

  // ── Premium toggle mutation ─────────────────────────────────────────────────
  const premiumMutation = useMutation({
    mutationFn: async ({ id, premiumOnly }: { id: string; premiumOnly: boolean }) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = sessionStorage.getItem("metricadia_token");
      if (token) headers["X-Metricadia-Token"] = token;
      const res = await fetch(`/api/metricadia/posts/${id}/premium`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ premiumOnly }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/metricadia/posts"] }),
  });

  const { data: postsData, isLoading } = useQuery<{ posts: Post[] }>({
    queryKey: ["/api/metricadia/posts"],
    enabled: authenticated === true,
    queryFn: async () => {
      const headers: Record<string, string> = {};
      const token = sessionStorage.getItem("metricadia_token");
      if (token) headers["X-Metricadia-Token"] = token;
      const res = await fetch("/api/metricadia/posts", { credentials: "include", headers });
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  const allPosts = postsData?.posts || [];
  const posts = search.trim()
    ? allPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          (p.caseNumber || "").toLowerCase().includes(search.toLowerCase())
      )
    : allPosts;

  useEffect(() => {
    if (params.postId && allPosts.length > 0) {
      const found = allPosts.find((p) => p.id === params.postId || p.slug === params.postId);
      if (found) setEditingPost(found);
    }
  }, [params.postId, allPosts]);

  const handleCreated = useCallback((post: Post) => {
    setShowNewArticle(false);
    queryClient.invalidateQueries({ queryKey: ["/api/metricadia/posts"] });
    setEditingPost(post);
  }, [queryClient]);

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <AdminLogin
        onSuccess={() => {
          sessionStorage.setItem("metricadia_authenticated", "true");
          setAuthenticated(true);
        }}
      />
    );
  }

  if (editingPost) {
    return (
      <MetricadiaEditor
        postId={editingPost.id}
        initialTitle={editingPost.title}
        initialContent={editingPost.content}
        initialExcerpt={editingPost.excerpt}
        onClose={() => setLocation(`/case/${editingPost.slug}`)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {showNewArticle && (
        <NewArticleModal
          onClose={() => setShowNewArticle(false)}
          onCreated={handleCreated}
        />
      )}

      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-black text-white"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              M
            </div>
            <div>
              <p className="font-black text-white text-lg leading-none">Metricadia Editor</p>
              <p className="text-xs text-slate-500 tracking-wide">Content Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "articles" && (
              <Button
                size="sm"
                onClick={() => setShowNewArticle(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                data-testid="button-new-article"
              >
                <Plus className="w-4 h-4 mr-2" />New Article
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-slate-400 hover:text-white"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />Logout
            </Button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-0 flex gap-1">
          {(["articles", "subscribers", "members"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-indigo-500 text-indigo-300"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "subscribers" ? <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" />Subscribers</span> : tab === "members" ? "Members" : "Articles"}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* ── Articles tab ── */}
        {activeTab === "articles" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-black text-white">All Articles</h1>
              <span className="text-slate-500 text-sm">{allPosts.length} total</span>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or case number..."
              className="w-full mb-6 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              data-testid="input-search-posts"
            />

            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!isLoading && posts.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                <p className="text-lg">No articles found.</p>
              </div>
            )}

            <div className="grid gap-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-indigo-600/50 transition-colors group"
                  data-testid={`card-post-${post.id}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setEditingPost(post)}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.caseNumber && (
                          <span className="text-xs text-indigo-400 font-mono font-bold">{post.caseNumber}</span>
                        )}
                        {post.premiumOnly && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#F5C518", color: "#1A1A2E" }}>
                            MEMBERS
                          </span>
                        )}
                      </div>
                      <span className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {post.title || "(Untitled)"}
                      </span>
                      {post.publishedAt && (
                        <p className="text-xs text-slate-600 mt-1">
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          premiumMutation.mutate({ id: post.id, premiumOnly: !post.premiumOnly });
                        }}
                        title={post.premiumOnly ? "Remove members-only" : "Mark as members-only"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          post.premiumOnly
                            ? "text-amber-400 bg-amber-950/40 hover:bg-amber-950/60"
                            : "text-slate-600 hover:text-amber-400 hover:bg-slate-800"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${post.premiumOnly ? "fill-amber-400" : ""}`} />
                      </button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPost(post)}
                        className="shrink-0 border-slate-700 text-slate-300 group-hover:border-indigo-500 group-hover:text-indigo-300"
                        data-testid={`button-edit-post-${post.id}`}
                      >
                        <PenLine className="w-4 h-4 mr-2" />Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Subscribers tab ── */}
        {activeTab === "subscribers" && <SubscribersPanel authHeaders={authHeaders} />}

        {/* ── Members tab ── */}
        {activeTab === "members" && <MembersPanel authHeaders={authHeaders} />}

      </main>
    </div>
  );
}
