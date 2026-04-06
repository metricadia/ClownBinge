import { Link, useLocation } from "wouter";
import { PsaLogo } from "@/components/PsaLogo";
import { Menu, X, ChevronDown, Heart, Home } from "lucide-react";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { usePostsCount } from "@/hooks/use-posts";
import { FloatingAdminBar } from "@/components/FloatingAdminBar";

const CATEGORIES = [
  { id: "all",               label: "All" },
  { id: "staff_picks",       label: "★ Staff Picks" },
  { id: "self_owned",        label: "Self-Owned" },
  { id: "law_and_justice",   label: "Law & Justice Files" },
  { id: "money_and_power",   label: "Money & Power" },
  { id: "us_constitution",   label: "U.S. Constitution" },
  { id: "women_and_girls",   label: "Women & Girls" },
  { id: "anti_racist_heroes",label: "Anti-Racist Heroes" },
  { id: "us_history",        label: "U.S. History" },
  { id: "religion",          label: "Religion" },
  { id: "investigations",    label: "Investigations" },
  { id: "war_and_inhumanity",label: "War & Inhumanity" },
  { id: "health_and_healing",label: "Health & Healing" },
  { id: "technology",        label: "Technology" },
  { id: "censorship",        label: "Censorship" },
  { id: "global_south",      label: "Global South" },
  { id: "how_it_works",      label: "How It Works" },
  { id: "nerd_out",          label: "NerdOut / Academic" },
  { id: "disarming_hate",           label: "Disarming Hate" },
  { id: "native_and_first_nations", label: "Native & First Nations" },
];

const PILL: Record<string, { on: string; off: string }> = {
  all:               { on: 'bg-primary text-white shadow-md ring-2 ring-primary/40',         off: 'bg-muted text-muted-foreground hover:bg-border hover:text-foreground' },
  staff_picks:       { on: 'bg-[#F5C518] text-[#1A3A8F] shadow-md ring-2 ring-[#F5C518]/50 font-black', off: 'bg-[#F5C518] text-[#1A3A8F] hover:bg-[#e0b400] font-black' },
  self_owned:        { on: 'bg-primary text-white shadow-md ring-2 ring-primary/40',         off: 'bg-primary text-white hover:bg-primary/80' },
  law_and_justice:   { on: 'bg-red-700 text-white shadow-md ring-2 ring-red-700/40',         off: 'bg-red-700 text-white hover:bg-red-800' },
  money_and_power:   { on: 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-700/40', off: 'bg-emerald-700 text-white hover:bg-emerald-800' },
  us_constitution:   { on: 'bg-indigo-700 text-white shadow-md ring-2 ring-indigo-700/40',   off: 'bg-indigo-700 text-white hover:bg-indigo-800' },
  women_and_girls:   { on: 'bg-rose-600 text-white shadow-md ring-2 ring-rose-600/40',       off: 'bg-rose-600 text-white hover:bg-rose-700' },
  anti_racist_heroes:{ on: 'bg-secondary text-gray-900 shadow-md ring-2 ring-secondary/50', off: 'bg-secondary/80 text-gray-900 hover:bg-secondary' },
  us_history:        { on: 'bg-teal-700 text-white shadow-md ring-2 ring-teal-700/40',       off: 'bg-teal-700 text-white hover:bg-teal-800' },
  religion:          { on: 'bg-violet-700 text-white shadow-md ring-2 ring-violet-700/40',   off: 'bg-violet-700 text-white hover:bg-violet-800' },
  investigations:    { on: 'bg-amber-600 text-white shadow-md ring-2 ring-amber-600/40',     off: 'bg-amber-600 text-white hover:bg-amber-700' },
  war_and_inhumanity:{ on: 'bg-orange-700 text-white shadow-md ring-2 ring-orange-700/40',   off: 'bg-orange-700 text-white hover:bg-orange-800' },
  health_and_healing:{ on: 'bg-green-700 text-white shadow-md ring-2 ring-green-700/40',     off: 'bg-green-700 text-white hover:bg-green-800' },
  technology:        { on: 'bg-sky-600 text-white shadow-md ring-2 ring-sky-600/40',         off: 'bg-sky-600 text-white hover:bg-sky-700' },
  censorship:        { on: 'bg-zinc-700 text-white shadow-md ring-2 ring-zinc-700/40',       off: 'bg-zinc-700 text-white hover:bg-zinc-800' },
  global_south:      { on: 'bg-cyan-700 text-white shadow-md ring-2 ring-cyan-700/40',       off: 'bg-cyan-700 text-white hover:bg-cyan-800' },
  how_it_works:      { on: 'bg-slate-600 text-white shadow-md ring-2 ring-slate-600/40',     off: 'bg-slate-600 text-white hover:bg-slate-700' },
  nerd_out:          { on: 'bg-fuchsia-900 text-white shadow-md ring-2 ring-fuchsia-900/40', off: 'bg-fuchsia-900 text-white hover:bg-fuchsia-950' },
  disarming_hate:           { on: 'bg-rose-900 text-white shadow-md ring-2 ring-rose-900/40',      off: 'bg-rose-900 text-white hover:bg-rose-950' },
  native_and_first_nations: { on: 'bg-amber-700 text-white shadow-md ring-2 ring-amber-700/40',    off: 'bg-amber-700 text-white hover:bg-amber-800' },
};

// Font sizer levels — declared outside component so they're stable references
const FONT_SIZES  = [16, 19, 23];
const FONT_LABELS = ["a", "A", "A+"];

export function Layout({ children, onCategoryChange, activeCategory }: { 
  children: React.ReactNode,
  onCategoryChange?: (id: string | null) => void,
  activeCategory?: string 
}) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [catBarOpen, setCatBarOpen] = useState(true);
  const [reducedBarOpen, setReducedBarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [footerOpen, setFooterOpen] = useState<Record<string, boolean>>({});
  const [ctaOpen, setCtaOpen] = useState(false);
  const catDropdownRef = useRef<HTMLDivElement>(null);
  const { data: postCount } = usePostsCount();

  const REAL_CATS = CATEGORIES.filter(c => c.id !== 'all');
  const fmtCount = (n?: number) => {
    if (!n) return '';
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    return String(n);
  };

  const [fontLevel, setFontLevel] = useState<number>(() => {
    const saved = localStorage.getItem("cb-font-level");
    return saved !== null ? parseInt(saved) : 1;
  });
  // useLayoutEffect fires synchronously before paint — required for Safari
  useLayoutEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SIZES[fontLevel]}px`;
    localStorage.setItem("cb-font-level", String(fontLevel));
  }, [fontLevel]);

  const getRoot = () => document.getElementById("root");

  const handleCategoryChange = (id: string) => {
    onCategoryChange?.(id);
    getRoot()?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  useEffect(() => {
    const root = getRoot();
    if (!root) return;
    const handleScroll = () => setScrolled(root.scrollTop > 20);
    root.addEventListener("scroll", handleScroll);
    return () => root.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => { setMobileMenuOpen(false); setCatDropdownOpen(false); setReducedBarOpen(false); }, [location]);

  // Close category dropdown on outside click
  useEffect(() => {
    if (!catDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) {
        setCatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [catDropdownOpen]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-pink-verified selection:text-white">
      {/* Sticky Navbar */}
      <header className={`
        sticky top-0 z-50 w-full transition-all duration-200
        ${scrolled ? 'bg-header/95 backdrop-blur-md shadow-lg' : 'bg-header'}
      `}>
        <div className="cb-container h-[80px] sm:h-[96px] flex items-center justify-between">
          {/* Home icon + Logo */}
          <div className="flex items-center gap-4">
          <Link
            href="/"
            onClick={() => { handleCategoryChange('all'); setCatDropdownOpen(false); }}
            className={`transition-colors ${location === '/' ? 'text-white' : 'text-white/50 hover:text-white'}`}
            title="Home"
          >
            <Home className="w-6 h-6" />
          </Link>
          <Link
            href="/"
            onClick={() => { handleCategoryChange('all'); setCatDropdownOpen(false); }}
            className="flex flex-col leading-none hover:opacity-90 transition-opacity group"
          >
            <div className="flex items-baseline gap-0">
              <span className="logo-text text-[26px] sm:text-[36px] text-white tracking-tight">Clown</span>
              <span className="logo-text text-[26px] sm:text-[36px] text-secondary tracking-tight">Binge</span>
              <span className="text-white/40 text-[18px] sm:text-[30px] font-sans font-light mx-1 sm:mx-2">|</span>
              <span className="text-white/80 text-[13px] sm:text-[24px] font-sans font-semibold tracking-wider sm:tracking-widest uppercase">
                Newsroom
              </span>
            </div>
            <span className="text-white text-[11px] sm:text-[12px] font-mono tracking-tight sm:tracking-[0.2em] uppercase mt-0.5 transition-colors">
              Independent<span className="text-[#F5C518]">.</span> Verified<span className="text-[#F5C518]">.</span> The Primary Source<span className="text-[#F5C518]">.</span>
            </span>
          </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 ml-10">
            <Link href="/about" className={`text-[14px] font-bold uppercase tracking-wider hover:text-white transition-colors ${location === '/about' ? 'text-white' : 'text-white/70'}`}>
              About
            </Link>
            <Link href="/contact" className={`text-[14px] font-bold uppercase tracking-wider hover:text-white transition-colors ${location === '/contact' || location === '/advertise' ? 'text-white' : 'text-white/70'}`}>
              Support
            </Link>
            <Link href="/bookstore" className={`text-[14px] font-bold uppercase tracking-wider hover:text-[#e0b400] transition-colors ${location === '/bookstore' ? 'text-[#F5C518]' : 'text-[#F5C518]'}`}>
              Our Books
            </Link>
            <Link href="/reports" className={`text-[14px] font-bold uppercase tracking-wider hover:text-[#e0b400] transition-colors ${location === '/reports' ? 'text-[#F5C518]' : 'text-[#F5C518]'}`}>
              Buy Reports
            </Link>
            <Link href="/invest-in-us" className={`text-[14px] font-bold uppercase tracking-wider hover:text-[#e0b400] transition-colors ${location === '/invest-in-us' ? 'text-[#F5C518]' : 'text-[#F5C518]'}`}>
              Donate Now
            </Link>

          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-2 self-start pt-3"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[80px] sm:top-[96px] z-40 bg-header/95 backdrop-blur-xl flex flex-col md:hidden">
          <nav className="flex flex-col items-center justify-center flex-1 gap-8 p-6">
            <Link href="/about" className="text-[24px] font-bold text-white uppercase tracking-widest">About</Link>
            <Link href="/contact" className="text-[24px] font-bold text-white uppercase tracking-widest">Support</Link>
            <Link href="/bookstore" className="text-[24px] font-bold uppercase tracking-widest text-[#F5C518] hover:text-[#e0b400] transition-colors">Our Books</Link>
            <Link href="/reports" className="text-[24px] font-bold uppercase tracking-widest text-[#F5C518] hover:text-[#e0b400] transition-colors">Buy Reports</Link>
            <Link href="/invest-in-us" className="text-[24px] font-bold uppercase tracking-widest text-[#F5C518] hover:text-[#e0b400] transition-colors">Donate Now</Link>

          </nav>
        </div>
      )}

      {/* Category sub-bar -- sticky below nav */}
      <div className={`sticky top-[80px] sm:top-[96px] z-40 bg-white border-b shadow-sm relative`} ref={catDropdownRef}>
        <div className="cb-container">

          {/* Desktop: collapsible two-row wrap (md+) */}
          <div className="hidden md:block">
            {location !== '/' ? (
              /* Reduced mode on article/other pages — full-width clickable banner */
              <div>
                <button
                  onClick={() => setReducedBarOpen(o => !o)}
                  className="flex items-center gap-3 py-3 px-1 group"
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#B8860B] shrink-0">A–Z Categories</span>
                  <span className="text-[#B8860B]/50 font-light text-[18px] leading-none select-none">|</span>
                  <span className="text-[15px] font-bold text-foreground/80 group-hover:text-foreground transition-colors">
                    Browse{postCount ? ` ${fmtCount(postCount)} Verified Articles` : ''} across{' '}
                    <span className="text-[#1B3E99] font-black">{REAL_CATS.length} Topics</span>
                  </span>
                  <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-wider transition-all duration-200 shrink-0 ${reducedBarOpen ? 'bg-[#1B3E99] text-white' : 'bg-[#F5C518] text-[#1A1A2E]'}`}>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${reducedBarOpen ? 'rotate-180' : ''}`} />
                    {reducedBarOpen ? 'Hide' : 'Browse Topics'}
                  </span>
                </button>

                {reducedBarOpen && (
                  /* Click anywhere on this white area (not a pill) to retract */
                  <div
                    className="pb-3 pt-1 cursor-pointer"
                    onClick={() => setReducedBarOpen(false)}
                  >
                    <div className="flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                      {REAL_CATS.map(cat => {
                        const pill = PILL[cat.id] ?? PILL.all;
                        return (
                          <Link
                            key={cat.id}
                            href={`/?category=${cat.id}`}
                            onClick={() => setReducedBarOpen(false)}
                            className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${pill.off}`}
                          >
                            {cat.label}
                          </Link>
                        );
                      })}
                    </div>
                    <p className="mt-2.5 text-[11px] text-muted-foreground/60 text-center select-none">Click anywhere here to close</p>
                  </div>
                )}
              </div>
            ) : catBarOpen ? (
              <div className="flex flex-wrap items-center py-2.5 gap-2 pr-2">
                {CATEGORIES.map(cat => {
                  const isActive = location === '/' && (activeCategory === cat.id || (!activeCategory && cat.id === 'all'));
                  const pill = PILL[cat.id] ?? PILL.all;
                  const cls = `px-4 py-1.5 rounded-full text-[14px] font-bold whitespace-nowrap transition-colors ${isActive ? pill.on : pill.off}`;
                  return onCategoryChange ? (
                    <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={cls}>{cat.label}</button>
                  ) : (
                    <Link key={cat.id} href={cat.id === 'all' ? '/' : `/?category=${cat.id}`} className={cls}>{cat.label}</Link>
                  );
                })}
                {/* Hide button — styled as a pill, sits inline with categories */}
                <button
                  onClick={() => setCatBarOpen(false)}
                  className="ml-1 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-black uppercase tracking-wider bg-[#1B3E99] text-white hover:bg-[#162f7a] transition-colors whitespace-nowrap shrink-0"
                >
                  <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                  Hide
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2">
                <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">A–Z Categories</span>
                <button
                  onClick={() => setCatBarOpen(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-black uppercase tracking-wider bg-[#F5C518] text-[#1A1A2E] hover:bg-[#e0b400] transition-colors shadow-sm"
                >
                  <ChevronDown className="w-4 h-4" />
                  Browse Topics
                </button>
              </div>
            )}
          </div>

          {/* Mobile: tap-to-open dropdown (below md) */}
          <div className="md:hidden">
            {location !== '/' ? (
              /* Reduced mode on article/other pages */
              <div>
                <button
                  onClick={() => setReducedBarOpen(o => !o)}
                  className="w-full flex items-center justify-between py-2.5 group"
                >
                  <span className="text-[12px] font-bold text-foreground/70 group-hover:text-foreground transition-colors">
                    {postCount ? `${fmtCount(postCount)} Articles · ` : ''}<span className="text-[#1B3E99] font-black">{REAL_CATS.length} Topics</span>
                  </span>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-200 ${reducedBarOpen ? 'bg-[#1B3E99] text-white' : 'bg-[#F5C518] text-[#1A1A2E]'}`}>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${reducedBarOpen ? 'rotate-180' : ''}`} />
                    {reducedBarOpen ? 'Hide' : 'Browse'}
                  </span>
                </button>
                {reducedBarOpen && (
                  <div
                    className="pb-3 pt-1 cursor-pointer"
                    onClick={() => setReducedBarOpen(false)}
                  >
                    <div className="flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                      {REAL_CATS.map(cat => {
                        const pill = PILL[cat.id] ?? PILL.all;
                        return (
                          <Link
                            key={cat.id}
                            href={`/?category=${cat.id}`}
                            onClick={() => setReducedBarOpen(false)}
                            className={`px-3 py-1 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors ${pill.off}`}
                          >
                            {cat.label}
                          </Link>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-[10px] text-muted-foreground/50 text-center select-none">Tap anywhere to close</p>
                  </div>
                )}
              </div>
            ) : (() => {
              const activeCat = CATEGORIES.find(c => c.id === (activeCategory || 'all')) ?? CATEGORIES[0];
              const pill = PILL[activeCat.id] ?? PILL.all;
              return (
                <button
                  onClick={() => setCatDropdownOpen(o => !o)}
                  className="flex items-center justify-between w-full py-3 gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Category</span>
                    <span className={`px-3 py-1 rounded-full text-[14px] font-bold ${pill.on}`}>
                      {activeCat.label}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${catDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              );
            })()}

            {catDropdownOpen && location === '/' && (
              <div className="absolute left-0 right-0 top-full z-50 bg-white border-b border-t border-border shadow-xl">
                <div className="cb-container py-4 flex flex-wrap gap-2 max-h-[70vh] overflow-y-auto">
                  {CATEGORIES.map(cat => {
                    const isActive = location === '/' && (activeCategory === cat.id || (!activeCategory && cat.id === 'all'));
                    const pill = PILL[cat.id] ?? PILL.all;
                    const cls = `px-4 py-2 rounded-full text-[14px] font-bold whitespace-nowrap transition-colors ${isActive ? pill.on : pill.off}`;
                    const handleSelect = () => {
                      setCatDropdownOpen(false);
                      if (location === '/') handleCategoryChange(cat.id);
                    };
                    return onCategoryChange && location === '/' ? (
                      <button key={cat.id} onClick={handleSelect} className={cls}>{cat.label}</button>
                    ) : (
                      <Link key={cat.id} href={cat.id === 'all' ? '/' : `/?category=${cat.id}`} onClick={() => setCatDropdownOpen(false)} className={cls}>{cat.label}</Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-header mt-20 py-12 sm:py-16">
        <div className="cb-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex flex-col leading-none mb-4 inline-flex hover:opacity-90 transition-opacity">
                <div className="flex items-baseline gap-0">
                  <span className="logo-text text-3xl text-white tracking-tight">Clown</span>
                  <span className="logo-text text-3xl text-secondary tracking-tight">Binge</span>
                  <span className="text-white/40 text-2xl font-sans font-light mx-2">|</span>
                  <span className="text-white/80 text-xl font-sans font-semibold tracking-widest uppercase">
                    Newsroom
                  </span>
                </div>
                <span className="text-white/50 text-[10px] font-mono tracking-[0.2em] uppercase mt-0.5">
                  Independent<span className="text-[#F5C518]">.</span> Verified<span className="text-[#F5C518]">.</span> The Primary Source<span className="text-[#F5C518]">.</span>
                </span>
              </Link>
              <p className="text-white/70 font-medium max-w-sm mb-6 leading-relaxed">
                Verified accountability journalism. Primary sources only. The receipts don't lie.
              </p>
            </div>
            
            <div>
              <button
                className="w-full flex items-center justify-between text-white font-bold uppercase tracking-widest text-sm py-3 md:py-0 md:mb-4 border-b border-white/10 md:border-none md:cursor-default"
                onClick={() => setFooterOpen(s => ({ ...s, platform: !s.platform }))}
                aria-expanded={!!footerOpen.platform}
              >
                Platform
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform duration-200 ${footerOpen.platform ? "rotate-180" : ""}`}
                />
              </button>
              <ul className={`space-y-4 mt-3 md:mt-0 overflow-hidden transition-all duration-200 ${footerOpen.platform ? "max-h-96" : "max-h-0 md:max-h-96"}`}>
                <li><Link href="/" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Home Feed</Link></li>
                <li><Link href="/submit" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Submit a Post</Link></li>
                <li><Link href="/store" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Books & Store</Link></li>
                <li><Link href="/about" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">About & Mission</Link></li>
                <li><Link href="/contact" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Contact Us</Link></li>
                <li><Link href="/invest-in-us" className="block py-1 font-bold hover:text-secondary transition-colors" style={{ color: "#F5C518" }}>Support Our Work</Link></li>
              </ul>
            </div>
            
            <div>
              <button
                className="w-full flex items-center justify-between text-white font-bold uppercase tracking-widest text-sm py-3 md:py-0 md:mb-4 border-b border-white/10 md:border-none md:cursor-default"
                onClick={() => setFooterOpen(s => ({ ...s, legal: !s.legal }))}
                aria-expanded={!!footerOpen.legal}
              >
                Legal
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform duration-200 ${footerOpen.legal ? "rotate-180" : ""}`}
                />
              </button>
              <ul className={`space-y-4 mt-3 md:mt-0 overflow-hidden transition-all duration-200 ${footerOpen.legal ? "max-h-96" : "max-h-0 md:max-h-96"}`}>
                <li><Link href="/privacy" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Privacy Policy</Link></li>
                <li><Link href="/terms" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Terms of Service</Link></li>
                <li><Link href="/methodology" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Editorial Methodology</Link></li>
                <li><Link href="/corrections" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Corrections Policy</Link></li>
                <li><a href="/ethics#self-own-methodology" className="block py-1 text-white/70 hover:text-secondary transition-colors font-medium">Scoring Methodology</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <PsaLogo variant="white" style={{ fontSize: "1.15rem" }} />
              <p className="text-xs font-mono text-white/40 leading-relaxed">
                &copy; {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            <p className="text-[10px] font-mono tracking-[0.18em] uppercase" style={{ color: "#F5C518" }}>
              Independent<span className="opacity-60">.</span> Verified<span className="opacity-60">.</span> The Primary Source<span className="opacity-60">.</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Donate CTA -- click to expand, works on all sizes */}
      <div className="fixed bottom-6 left-6 z-30 flex flex-col items-start gap-2">
        {/* Font sizer pill */}
        <div className="flex items-center rounded-full overflow-hidden shadow-lg border border-white/15" style={{ background: "rgba(26,58,143,0.92)", backdropFilter: "blur(8px)" }}>
          {FONT_SIZES.map((_, i) => (
            <button
              key={i}
              onClick={() => setFontLevel(i)}
              aria-label={`Text size ${FONT_LABELS[i]}`}
              title={`Text size: ${FONT_LABELS[i]}`}
              className={`px-3 py-1.5 font-bold transition-colors leading-none ${
                fontLevel === i
                  ? "bg-white/20 text-white"
                  : "text-white/45 hover:text-white hover:bg-white/10"
              }`}
              style={{ fontSize: i === 0 ? "10px" : i === 1 ? "13px" : "15px" }}
            >
              {FONT_LABELS[i]}
            </button>
          ))}
        </div>
        {ctaOpen && (
          <div
            className="mb-2 w-64 flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-white/15 animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={{ background: "#1A3A8F" }}
          >
            <div className="px-4 pt-3 pb-2 flex items-center justify-between">
              <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Donate</p>
              <Heart className="w-3.5 h-3.5 text-[#F5C518]" />
            </div>
            <div className="px-4 pb-1">
              <p className="text-base font-black text-white leading-tight">Any Amount</p>
            </div>
            <div className="px-4 pb-3">
              <p className="text-[11px] text-white/70 leading-relaxed">
                No product. No deliverable. Just you deciding that verified, independent journalism is worth keeping alive.
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {["Funds original research", "Supports editorial independence", "Keeps the site free"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <span className="text-[#F5C518] text-[10px]">&#10003;</span>
                    <span className="text-[10px] text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-3 pb-3">
              <Link
                href="/invest-in-us"
                onClick={() => setCtaOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-black text-sm text-[#1A3A8F] hover:opacity-90 transition-opacity"
                style={{ background: "#F5C518" }}
              >
                <span>I Want to Help</span>
                <Heart className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCtaOpen((o) => !o)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs text-[#1A3A8F] shadow-lg transition-transform active:scale-95"
            style={{ background: "#F5C518" }}
          >
            {ctaOpen ? (
              "Close"
            ) : (
              <>
                <Heart className="w-3 h-3" />
                <span>Donate Today</span>
              </>
            )}
          </button>
          <span
            className="font-mono text-xs font-black tabular-nums leading-none px-2 py-1 rounded-full"
            style={{ color: "rgba(0,0,0,0.8)", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(4px)" }}
          >
            {postCount ?? 0}/400
          </span>
        </div>
      </div>
      <FloatingAdminBar />
    </div>
  );
}
