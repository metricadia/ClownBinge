import { useState } from "react";
import { Link2, Facebook, Twitter, Check } from "lucide-react";
import type { Post } from "@workspace/api-client-react";

export function ShareButtons({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);

  const url = `https://clownbinge.com/case/${post.slug}`;
  const title = `Case ${post.caseNumber}: ${post.title} - ClownBinge`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=ClownBinge,TheRecord`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <a
        href={shareLinks.x}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 border border-border px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:bg-muted transition-colors"
      >
        <Twitter className="w-3 h-3 text-[#1DA1F2]" fill="currentColor" />
        Post
      </a>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 border border-border px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:bg-muted transition-colors"
      >
        <Facebook className="w-3 h-3 text-[#1877F2]" fill="currentColor" />
        Facebook
      </a>
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 border border-border px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:bg-muted transition-colors"
      >
        <svg className="w-3 h-3 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        WhatsApp
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 border border-border px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:bg-muted transition-colors"
      >
        {copied ? <Check className="w-3 h-3 text-green-600" /> : <Link2 className="w-3 h-3" />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
