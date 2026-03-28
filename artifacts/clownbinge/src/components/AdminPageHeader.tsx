import { AdminNav } from "@/components/AdminNav";

interface AdminPageHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
}

export function AdminPageHeader({
  title,
  eyebrow = "ClownBinge Newsroom",
  subtitle = "Primary Source Analytics, LLC \u2014 ClownBinge.com",
}: AdminPageHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">{eyebrow}</p>
      <h1 className="font-sans font-bold text-3xl sm:text-4xl text-header leading-tight mb-2">{title}</h1>
      <p className="text-muted-foreground text-sm">{subtitle}</p>
      <div className="h-1 w-full bg-[#F5C518] rounded-full mt-5 mb-6" />
      <AdminNav />
    </div>
  );
}
