import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { X, Eye, EyeOff, PenLine, LayoutDashboard, LogOut } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

// SVG ring — 40% fill signals "you are admin"
function AdminRing({ size = 44 }: { size?: number }) {
  const r = 17;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const filled = circ * 0.40;
  const gap    = circ - filled;
  // Start at top (rotate -90deg)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3" />
      {/* 40% arc */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#22c55e"
        strokeWidth="3"
        strokeDasharray={`${filled} ${gap}`}
        strokeLinecap="round"
        style={{ transform: `rotate(-90deg)`, transformOrigin: `${cx}px ${cy}px` }}
      />
    </svg>
  );
}

export function FloatingAdminBar() {
  const [location] = useLocation();
  const { isAdmin, checking, login, logout } = useAdmin();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const slugMatch = location.match(/^\/case\/(.+)/);
  const articleSlug = slugMatch ? slugMatch[1] : null;

  useEffect(() => {
    if (open && !isAdmin) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open, isAdmin]);

  // Close panel when navigating
  useEffect(() => { setOpen(false); }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    const result = await login(password);
    setLoading(false);
    if (result === "ok") { setPassword(""); setOpen(false); }
    else if (result === "wrong") setError("Wrong password");
    else setError("Connection error");
  };

  const handleLogout = async () => { await logout(); setOpen(false); };

  // Don't render inside the admin editor itself
  if (location.startsWith("/Kemet8")) return null;
  if (checking) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-2 select-none">

      {/* ── Admin panel popup (when logged in) ── */}
      {isAdmin && open && (
        <div className="bg-slate-900/98 border border-slate-600/50 backdrop-blur-sm rounded-2xl p-4 shadow-2xl w-56 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Admin Active
            </span>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <X size={13} />
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {articleSlug && (
              <a
                href={`/Kemet8/${encodeURIComponent(articleSlug)}`}
                className="flex items-center gap-2 text-sm font-bold text-sky-300 hover:text-sky-100 transition-colors px-3 py-2 rounded-xl hover:bg-sky-900/40"
              >
                <PenLine size={14} />
                Edit This Article
              </a>
            )}
            <a
              href="/Kemet8"
              className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-slate-700/50"
            >
              <LayoutDashboard size={14} />
              Editor Panel
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors px-3 py-2 rounded-xl hover:bg-red-900/20 w-full text-left"
            >
              <LogOut size={14} />
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* ── Login popup (when not logged in) ── */}
      {!isAdmin && open && (
        <div className="bg-slate-900/98 border border-slate-600/50 backdrop-blur-sm rounded-2xl p-4 shadow-2xl w-60 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Admin Login</span>
            <button onClick={() => { setOpen(false); setError(""); setPassword(""); }} className="text-slate-500 hover:text-white transition-colors">
              <X size={13} />
            </button>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-2">
            <div className="relative">
              <input
                ref={inputRef}
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Password"
                className="w-full bg-slate-800 border border-slate-600/60 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 pr-9"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black rounded-lg py-2 transition-colors"
            >
              {loading ? "Checking..." : "Enter Editor"}
            </button>
          </form>
        </div>
      )}

      {/* ── The badge button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        title={isAdmin ? "Admin menu" : "Admin login"}
        className={`relative w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200
          ${isAdmin
            ? "bg-slate-900/90 border border-slate-600/40 hover:border-emerald-500/60"
            : "bg-slate-800/80 border border-slate-600/40 hover:border-slate-400/60 backdrop-blur-sm"
          }`}
      >
        {isAdmin && <AdminRing size={44} />}
        <span className={`relative z-10 text-[10px] font-black tracking-wider ${isAdmin ? "text-emerald-400" : "text-slate-500"}`}>
          {isAdmin ? "M" : "M"}
        </span>
      </button>
    </div>
  );
}
