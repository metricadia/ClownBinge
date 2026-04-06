import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminLogin } from "@/components/AdminLogin";
import { MetricadiaEditor } from "@/components/MetricadiaEditor";
import { Button } from "@/components/ui/button";
import { PenLine, LogOut, Plus, X, Loader2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  caseNumber?: string;
  publishedAt?: string;
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

export default function AdminEditorPage() {
  const params = useParams<{ postId?: string }>();
  const [, setLocation] = useLocation();
  const { authenticated, setAuthenticated, logout } = useAdminAuth();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [search, setSearch] = useState("");
  const [showNewArticle, setShowNewArticle] = useState(false);
  const queryClient = useQueryClient();

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
            <Button
              size="sm"
              onClick={() => setShowNewArticle(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              data-testid="button-new-article"
            >
              <Plus className="w-4 h-4 mr-2" />New Article
            </Button>
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
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
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
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-indigo-600/50 transition-colors cursor-pointer group"
              onClick={() => setEditingPost(post)}
              data-testid={`card-post-${post.id}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {post.caseNumber && (
                    <span className="text-xs text-indigo-400 font-mono font-bold">{post.caseNumber} &mdash; </span>
                  )}
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
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-slate-700 text-slate-300 group-hover:border-indigo-500 group-hover:text-indigo-300"
                  data-testid={`button-edit-post-${post.id}`}
                >
                  <PenLine className="w-4 h-4 mr-2" />Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
