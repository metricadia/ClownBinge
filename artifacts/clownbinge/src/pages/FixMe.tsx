import { useState, useEffect, useCallback, useRef } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type ArticleRow = {
  id: string;
  caseNumber: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  locked: boolean;
  aiScore: number | null;
  aiScoreTestedAt: string | null;
  wordCount: number | null;
};

type RowState = {
  loading: boolean;
  action: "detect" | "reduce" | "lock" | null;
  error: string | null;
  elapsed: number;
};

function scoreColor(score: number | null): string {
  if (score === null) return "bg-gray-100 text-gray-500";
  if (score <= 30) return "bg-green-100 text-green-800";
  if (score <= 50) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

function scoreLabel(score: number | null): string {
  if (score === null) return "Not Tested";
  return `${score}%`;
}

function categoryLabel(cat: string): string {
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

const PASS = "HeIsTheWay26#9";

export default function FixMe() {
  const [authed, setAuthed] = useState(() => localStorage.getItem("cbfix-auth") === PASS);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [rowStates, setRowStates] = useState<Record<string, RowState>>({});
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "untested" | "high">("all");
  const [lastResult, setLastResult] = useState<{ slug: string; message: string; ok: boolean } | null>(null);

  const timerRefs = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const fetchArticles = useCallback(async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const res = await fetch(`${BASE}/api/fixme/articles`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ArticleRow[] = await res.json();
      setArticles(data);
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Failed to load articles");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchArticles();
  }, [authed, fetchArticles]);

  useEffect(() => {
    return () => {
      Object.values(timerRefs.current).forEach(clearInterval);
    };
  }, []);

  function handleLogin() {
    if (pwInput === PASS) {
      localStorage.setItem("cbfix-auth", PASS);
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  function setRowState(slug: string, state: Partial<RowState>) {
    setRowStates((prev) => ({
      ...prev,
      [slug]: { loading: false, action: null, error: null, elapsed: 0, ...prev[slug], ...state },
    }));
  }

  function startElapsedTimer(slug: string) {
    if (timerRefs.current[slug]) clearInterval(timerRefs.current[slug]);
    const start = Date.now();
    timerRefs.current[slug] = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setRowStates((prev) => ({
        ...prev,
        [slug]: { ...prev[slug], elapsed },
      }));
    }, 1000);
  }

  function stopElapsedTimer(slug: string) {
    if (timerRefs.current[slug]) {
      clearInterval(timerRefs.current[slug]);
      delete timerRefs.current[slug];
    }
  }

  async function handleDetect(slug: string) {
    setRowState(slug, { loading: true, action: "detect", error: null, elapsed: 0 });
    startElapsedTimer(slug);
    setLastResult(null);
    try {
      const res = await fetch(`${BASE}/api/fixme/detect/${slug}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setArticles((prev) =>
        prev.map((a) =>
          a.slug === slug
            ? { ...a, aiScore: data.score, aiScoreTestedAt: new Date().toISOString() }
            : a
        )
      );
      setLastResult({
        slug,
        ok: true,
        message: `${slug}: ${data.score}% — ${data.flaggedCount} flagged sentences`,
      });
    } catch (e) {
      setRowState(slug, { error: e instanceof Error ? e.message : "Detection failed" });
    } finally {
      stopElapsedTimer(slug);
      setRowState(slug, { loading: false, action: null });
    }
  }

  async function handleToggleLock(slug: string, currentLocked: boolean) {
    setRowState(slug, { loading: true, action: "lock", error: null });
    try {
      const res = await fetch(`${BASE}/api/fixme/lock/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locked: !currentLocked }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      const listRes = await fetch(`${BASE}/api/fixme/articles`);
      if (listRes.ok) {
        const updated: ArticleRow[] = await listRes.json();
        setArticles(updated);
      }
    } catch (e) {
      setRowState(slug, { error: e instanceof Error ? e.message : "Lock toggle failed" });
    } finally {
      setRowState(slug, { loading: false, action: null });
    }
  }

  async function handleReduce(slug: string) {
    setRowState(slug, { loading: true, action: "reduce", error: null, elapsed: 0 });
    startElapsedTimer(slug);
    setLastResult(null);
    try {
      const res = await fetch(`${BASE}/api/fixme/reduce/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetScore: 30 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

      const poll = setInterval(async () => {
        try {
          const statusRes = await fetch(`${BASE}/api/fixme/reduce/status/${slug}`);
          const status = await statusRes.json();
          if (status.status === "done" || status.status === "idle") {
            clearInterval(poll);
            stopElapsedTimer(slug);
            setRowState(slug, { loading: false, action: null });
            const listRes = await fetch(`${BASE}/api/fixme/articles`);
            if (listRes.ok) {
              const updated: ArticleRow[] = await listRes.json();
              setArticles(updated);
            }
            if (status.status === "done") {
              const { initialScore, finalScore, diffsCount, saved } = status;
              const delta = initialScore - finalScore;
              const saveNote = saved
                ? `Saved — article updated.`
                : `Score logged, no body changes.`;
              const ok = finalScore <= 30 || delta > 0;
              setLastResult({
                slug,
                ok,
                message: `${initialScore}% → ${finalScore}% (${delta > 0 ? `-${delta}` : "no change"}) | ${diffsCount} rewrites | ${saveNote}`,
              });
            }
          }
        } catch {
          clearInterval(poll);
          stopElapsedTimer(slug);
          setRowState(slug, { loading: false, action: null });
        }
      }, 3000);
    } catch (e) {
      stopElapsedTimer(slug);
      setRowState(slug, { error: e instanceof Error ? e.message : "Reduction failed", loading: false, action: null });
    }
  }

  const filtered = articles.filter((a) => {
    if (filter === "untested") return a.aiScore === null;
    if (filter === "high") return a.aiScore !== null && a.aiScore > 30;
    return true;
  });

  const stats = {
    total: articles.length,
    tested: articles.filter((a) => a.aiScore !== null).length,
    passing: articles.filter((a) => a.aiScore !== null && a.aiScore <= 30).length,
    failing: articles.filter((a) => a.aiScore !== null && a.aiScore > 30).length,
    untested: articles.filter((a) => a.aiScore === null).length,
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 w-full max-w-sm">
          <h1 className="text-white text-xl font-bold mb-1">CBfix</h1>
          <p className="text-gray-400 text-sm mb-6">AI Score Reduction Dashboard</p>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder="Admin password"
              className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded text-sm mb-3 focus:outline-none focus:border-blue-500"
            />
            {pwError && <p className="text-red-400 text-xs mb-3">Incorrect password.</p>}
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 rounded text-sm font-semibold transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">CBfix</h1>
          <p className="text-gray-400 text-xs">AI Score Reduction Dashboard | Target: 30% | JS-gated rewrites | 20x concurrency</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchArticles}
            disabled={loadingList}
            className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded border border-gray-600 transition-colors disabled:opacity-50"
          >
            {loadingList ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => { localStorage.removeItem("cbfix-auth"); setAuthed(false); }}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total Articles", value: stats.total, color: "text-white" },
            { label: "Tested", value: stats.tested, color: "text-blue-400" },
            { label: "Passing (≤30%)", value: stats.passing, color: "text-green-400" },
            { label: "Failing (>30%)", value: stats.failing, color: "text-red-400" },
            { label: "Not Tested", value: stats.untested, color: "text-yellow-400" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {lastResult && (
          <div className={`mb-4 border rounded px-4 py-2.5 text-sm ${lastResult.ok ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-red-950 border-red-800 text-red-300"}`}>
            <span className="text-gray-500 mr-2">Result:</span>
            {lastResult.message}
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-500 text-xs mr-1">Show:</span>
          {(["all", "untested", "high"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1 rounded border transition-colors ${
                filter === f
                  ? "bg-blue-700 border-blue-600 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              {f === "all" ? `All (${stats.total})` : f === "untested" ? `Untested (${stats.untested})` : `Failing (${stats.failing})`}
            </button>
          ))}
        </div>

        {listError && (
          <div className="mb-4 bg-red-950 border border-red-800 rounded px-4 py-3 text-red-300 text-sm">
            {listError}
          </div>
        )}

        {loadingList ? (
          <div className="text-gray-500 text-sm py-12 text-center">Loading articles...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs w-28">Case</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs">Title</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs w-32">Category</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium text-xs w-20">Words</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium text-xs w-28">AI Score</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium text-xs w-52">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((article) => {
                  const rs = rowStates[article.slug] ?? { loading: false, action: null, error: null, elapsed: 0 };
                  return (
                    <tr
                      key={article.id}
                      className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-gray-400 font-mono text-xs">{article.caseNumber}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white text-xs leading-snug max-w-md line-clamp-2">
                          {article.title}
                        </div>
                        {rs.error && (
                          <div className="text-red-400 text-xs mt-1">{rs.error}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-400 text-xs">{categoryLabel(article.category)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-gray-500 text-xs">{article.wordCount ?? "?"}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${scoreColor(article.aiScore)}`}
                        >
                          {scoreLabel(article.aiScore)}
                        </span>
                        {article.aiScoreTestedAt && (
                          <div className="text-gray-600 text-xs mt-0.5">
                            {new Date(article.aiScoreTestedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleLock(article.slug, article.locked)}
                            disabled={rs.loading}
                            title={article.locked ? "Unlock article for editing" : "Lock article"}
                            className={`text-xs px-2 py-1.5 rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
                              article.locked
                                ? "bg-yellow-900 hover:bg-yellow-800 border-yellow-700 text-yellow-300"
                                : "bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-400"
                            }`}
                          >
                            {rs.loading && rs.action === "lock" ? "..." : article.locked ? "Unlock" : "Lock"}
                          </button>
                          <button
                            onClick={() => handleDetect(article.slug)}
                            disabled={rs.loading}
                            title="Run ZeroGPT detection and save score"
                            className="text-xs px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {rs.loading && rs.action === "detect" ? (
                              <span className="flex items-center gap-1">
                                <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                {rs.elapsed > 0 ? fmtElapsed(rs.elapsed) : "Scanning..."}
                              </span>
                            ) : "Detect"}
                          </button>
                          <button
                            onClick={() => handleReduce(article.slug)}
                            disabled={rs.loading || article.locked}
                            title={article.locked ? "Unlock article first" : "Run AI reduction loop targeting 30%"}
                            className="text-xs px-3 py-1.5 rounded bg-blue-900 hover:bg-blue-800 border border-blue-700 text-blue-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {rs.loading && rs.action === "reduce" ? (
                              <span className="flex items-center gap-1">
                                <span className="inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                {rs.elapsed > 0 ? fmtElapsed(rs.elapsed) : "Starting..."}
                              </span>
                            ) : "Reduce AI"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-600 text-sm">
                      No articles match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-lg px-5 py-4">
          <h3 className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-3">How It Works</h3>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <p className="text-gray-400 font-medium mb-1">Detect</p>
              <p>Sends article body to ZeroGPT. Runs two scans and averages them (tiebreaker scan if variance exceeds 20 points). Score (0-100%) is saved to the database.</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-1">Reduce AI</p>
              <p>ZeroGPT flags sentences. Claude Sonnet rewrites each one at temperature 0.85 — 20 at a time in parallel. JavaScript validates numbers, qualifiers, fragments, and negatives instantly. Re-scans after each pass. Repeats until 30% or score plateaus. Target: 2-5 minutes per article.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
