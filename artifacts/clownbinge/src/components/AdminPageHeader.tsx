import { AdminNav } from "@/components/AdminNav";
import { PsaLogo } from "@/components/PsaLogo";

interface AdminPageHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  logoSrc?: string;
}

export function AdminPageHeader({
  title,
  eyebrow = "ClownBinge Newsroom",
  subtitle = "Metricadia Research, LLC \u2014 ClownBinge.com",
  logoSrc,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <div className="mb-5 flex justify-center">
        {logoSrc ? (
          <img
            src={logoSrc}
            alt="Metricadia Research LLC"
            className="h-14 sm:h-20 w-auto object-contain"
            style={{ maxWidth: "480px" }}
          />
        ) : (
          <PsaLogo variant="dark" className="text-[1.32rem] sm:text-[1.5rem]" />
        )}
      </div>
      <h1 className="font-sans font-bold text-3xl sm:text-4xl text-header leading-tight mb-2">
        {title}
      </h1>
      <p className="text-xs font-semibold tracking-widest uppercase text-primary">
        {eyebrow} &mdash; Independent. Verified. The Primary Source.
      </p>
      <div className="h-1 w-full bg-[#F5C518] rounded-full mt-5 mb-6" />
      <AdminNav />
    </div>
  );
}
