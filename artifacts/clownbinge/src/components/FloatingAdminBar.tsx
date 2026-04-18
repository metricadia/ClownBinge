import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { X, PenLine, LayoutDashboard, LogOut, ShieldOff } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

function AdminRing({ size = 44 }: { size?: number }) {
  const r = 17;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const filled = circ * 0.40;
  const gap    = circ - filled;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3" />
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
  const { isAdmin, checking, logout } = useAdmin();
  const [open, setOpen] = useState(false);
  const [reEnabling] = useState(false);

  const slugMatch = location.match(/^\/case\/(.+)/);
  const articleSlug = slugMatch ? slugMatch[1] : null;

  useEffect(() => { setOpen(false); }, [location]);

  const handleLogout = async () => { await logout(); setOpen(false); };

  if (location.startsWith("/Brain-Instance-")) return null;
  if (checking) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-2 select-none">

      {/* ── Admin panel popup ── */}
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
                href={`${sessionStorage.getItem("brain_instance_path") || "/admin-access"}/${encodeURIComponent(articleSlug)}`}
                className="flex items-center gap-2 text-sm font-bold text-sky-300 hover:text-sky-100 transition-colors px-3 py-2 rounded-xl hover:bg-sky-900/40"
              >
                <PenLine size={14} />
                Edit This Article
              </a>
            )}
            <a
              href={sessionStorage.getItem("brain_instance_path") || "/admin-access"}
              className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-slate-700/50"
            >
              <LayoutDashboard size={14} />
              Admin Dashboard
            </a>
            <button
              onClick={handleLogout}
              disabled={reEnabling}
              className="flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors px-3 py-2 rounded-xl hover:bg-amber-900/20 w-full text-left"
            >
              <ShieldOff size={14} />
              Exit Admin Mode
            </button>
          </div>
        </div>
      )}

      {/* ── Badge button ── */}
      <button
        onClick={() => isAdmin ? setOpen(v => !v) : (window.location.href = "/admin-access")}
        title={isAdmin ? "Admin menu" : "Admin access"}
        className={`relative w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200
          ${isAdmin
            ? "bg-slate-900/90 border border-slate-600/40 hover:border-emerald-500/60"
            : "bg-slate-800/80 border border-slate-600/40 hover:border-slate-400/60 backdrop-blur-sm"
          }`}
      >
        {isAdmin && <AdminRing size={44} />}
        <span className={`relative z-10 text-[10px] font-black tracking-wider ${
          isAdmin ? "text-emerald-400" : "text-slate-500"
        }`}>
          M
        </span>
      </button>

      {/* ── Full logout (below badge) ── */}
      {isAdmin && open && (
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[10px] font-bold text-red-400/70 hover:text-red-400 transition-colors uppercase tracking-widest px-2 py-1"
        >
          <LogOut size={11} />
          Full Logout
        </button>
      )}
    </div>
  );
}
