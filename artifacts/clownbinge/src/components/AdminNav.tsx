import { Link } from "wouter";

export function AdminNav() {
  return (
    <nav className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-muted-foreground mt-4 mb-10">
      <Link href="/about" className="hover:text-primary transition-colors">About</Link>
      <span className="text-muted-foreground/40">|</span>
      <Link href="/ethics" className="hover:text-primary transition-colors">Our Ethics</Link>
      <span className="text-muted-foreground/40">|</span>
      <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
    </nav>
  );
}
