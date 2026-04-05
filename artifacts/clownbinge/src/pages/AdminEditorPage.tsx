import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AdminLogin } from "@/components/AdminLogin";
import { MetricadiaEditor } from "@/components/MetricadiaEditor";
import { Button } from "@/components/ui/button";
import { PenLine, LogOut, Plus } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  caseNumber?: string;
  publishedAt?: string;
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

export default function AdminEditorPage() {
  const params = useParams<{ postId?: string }>();
  const { authenticated, setAuthenticated, logout } = useAdminAuth();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [search, setSearch] = useState("");

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
        onClose={() => setEditingPost(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-50">
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
