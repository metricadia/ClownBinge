import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "political", label: "Political" },
  { id: "self_owned", label: "Self-Owned" },
  { id: "clown_electeds", label: "Clown Electeds" },
  { id: "religious", label: "Religious" },
  { id: "cultural", label: "Cultural" },
  { id: "anti_racist_hero", label: "Anti-Racist Hero" },
];

export function Layout({ children, onCategoryChange, activeCategory }: { 
  children: React.ReactNode,
  onCategoryChange?: (id: string | null) => void,
  activeCategory?: string 
}) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileMenuOpen(false), [location]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-pink-verified selection:text-white">
      {/* Sticky Navbar */}
      <header className={`
        sticky top-0 z-50 w-full transition-all duration-200
        ${scrolled ? 'bg-header/95 backdrop-blur-md shadow-lg' : 'bg-header'}
      `}>
        <div className="cb-container h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none hover:opacity-90 transition-opacity group">
            <div className="flex items-baseline gap-0">
              <span className="logo-text text-3xl sm:text-4xl text-white tracking-tight">Clown</span>
              <span className="logo-text text-3xl sm:text-4xl text-secondary tracking-tight">Binge</span>
              <span className="text-white/40 text-2xl sm:text-3xl font-sans font-light mx-2">|</span>
              <span className="text-white/80 text-xl sm:text-2xl font-sans font-light tracking-normal">Receipts</span>
            </div>
            <span className="text-white/50 text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase mt-0.5 group-hover:text-white/70 transition-colors">
              Verified. Documented. Clowned.
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm font-bold uppercase tracking-wider hover:text-white transition-colors ${location === '/' ? 'text-white' : 'text-white/70'}`}>
              Home
            </Link>
            <Link href="/about" className={`text-sm font-bold uppercase tracking-wider hover:text-white transition-colors ${location === '/about' ? 'text-white' : 'text-white/70'}`}>
              About
            </Link>
            <Link href="/store" className={`text-sm font-bold uppercase tracking-wider hover:text-secondary transition-colors ${location === '/store' ? 'text-secondary' : 'text-white/70'}`}>
              Books
            </Link>
            <Link href="/contact" className={`text-sm font-bold uppercase tracking-wider hover:text-white transition-colors ${location === '/contact' ? 'text-white' : 'text-white/70'}`}>
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Category Filter Bar - Only on Homepage */}
        {location === '/' && onCategoryChange && (
          <div className="bg-white border-b shadow-sm">
            <div className="cb-container">
              <div className="flex overflow-x-auto py-3 gap-2 sm:gap-4 no-scrollbar scroll-smooth">
                {CATEGORIES.map(cat => {
                  const isActive = activeCategory === cat.id || (!activeCategory && cat.id === 'all');
                  const isHero = cat.id === 'anti_racist_hero';
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onCategoryChange(cat.id)}
                      className={`
                        shrink-0 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors
                        ${isHero
                          ? isActive
                            ? 'bg-secondary text-gray-900 shadow-md ring-2 ring-secondary/50'
                            : 'bg-secondary/80 text-gray-900 hover:bg-secondary'
                          : isActive
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-muted text-muted-foreground hover:bg-border hover:text-foreground'}
                      `}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 sm:top-20 z-40 bg-header/95 backdrop-blur-xl flex flex-col md:hidden">
          <nav className="flex flex-col items-center justify-center flex-1 gap-8 p-6">
            <Link href="/" className="text-2xl font-bold text-white uppercase tracking-widest">Home</Link>
            <Link href="/about" className="text-2xl font-bold text-white uppercase tracking-widest">About</Link>
            <Link href="/store" className="text-2xl font-bold text-secondary uppercase tracking-widest">Books</Link>
            <Link href="/contact" className="text-2xl font-bold text-white uppercase tracking-widest">Contact</Link>
          </nav>
        </div>
      )}

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
                  <span className="text-white/80 text-xl font-sans font-light tracking-normal">Receipts</span>
                </div>
                <span className="text-white/50 text-[10px] font-mono tracking-[0.2em] uppercase mt-0.5">
                  Verified. Documented. Clowned.
                </span>
              </Link>
              <p className="text-white/70 font-medium max-w-sm mb-6 leading-relaxed">
                Verified accountability journalism and political satire. Documenting the hypocrisy so you don't have to. The receipts don't lie.
              </p>
              <div className="text-xs text-white/50 font-mono leading-relaxed">
                © {new Date().getFullYear()} ClownBinge
              </div>
              <div className="text-xs text-white/40 mt-1 leading-relaxed">
                A project of Laughphoria Informatics &nbsp;·&nbsp; Wyoming Corporation
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-white/70 hover:text-secondary transition-colors font-medium">Home Feed</Link></li>
                <li><Link href="/store" className="text-white/70 hover:text-secondary transition-colors font-medium">Books & Store</Link></li>
                <li><Link href="/about" className="text-white/70 hover:text-secondary transition-colors font-medium">About & Mission</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-secondary transition-colors font-medium">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-white/70 hover:text-secondary transition-colors font-medium">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white/70 hover:text-secondary transition-colors font-medium">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
