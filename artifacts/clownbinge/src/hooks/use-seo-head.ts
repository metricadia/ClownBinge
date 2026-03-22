import { useEffect } from "react";
import type { Post } from "@workspace/api-client-react";

const DOMAIN = "https://clownbinge.com";
const SITE_TITLE = "ClownBinge | Verified News. Primary Sources. For the People.";
const SITE_DESCRIPTION = "Verified accountability journalism. ClownBinge documents real, sourced incidents where politicians and religious leaders contradict their own words and votes. Primary sources only. No fabrications.";

function setMeta(name: string, content: string, attr = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(id: string, data: object) {
  let el = document.querySelector(`script[data-ld="${id}"]`) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-ld", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  document.querySelector(`script[data-ld="${id}"]`)?.remove();
}

export function useArticleSeoHead(post: Post | null | undefined) {
  useEffect(() => {
    if (!post) return;

    const canonical = `${DOMAIN}/case/${post.slug}`;
    const ogImage = (post as any).videoThumbnail ?? `${DOMAIN}/opengraph.jpg`;
    const description = post.teaser ?? "";

    document.title = `${post.title} | ClownBinge`;

    setLink("canonical", canonical);

    setMeta("description", description);

    setMeta("og:title",       post.title,   "property");
    setMeta("og:description", description,  "property");
    setMeta("og:type",        "article",    "property");
    setMeta("og:url",         canonical,    "property");
    setMeta("og:image",       ogImage,      "property");
    setMeta("og:site_name",   "ClownBinge", "property");

    setMeta("twitter:card",        "summary_large_image");
    setMeta("twitter:title",       post.title);
    setMeta("twitter:description", description);
    setMeta("twitter:image",       ogImage);

    setJsonLd("article", {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": post.title,
      "description": description,
      "datePublished": post.publishedAt ?? post.createdAt,
      "dateModified":  post.publishedAt ?? post.createdAt,
      "mainEntityOfPage": canonical,
      "keywords": Array.isArray(post.tags) ? post.tags.join(", ") : "",
      "author": {
        "@type": "Organization",
        "name": "ClownBinge",
        "url": DOMAIN
      },
      "publisher": {
        "@type": "Organization",
        "name": "ClownBinge",
        "logo": {
          "@type": "ImageObject",
          "url": `${DOMAIN}/logo.png`
        }
      }
    });

    if (post.subjectName) {
      const person: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": post.subjectName,
      };
      if (post.subjectTitle) person.jobTitle = post.subjectTitle;
      if (post.subjectParty && post.subjectParty !== "None") {
        person.memberOf = {
          "@type": "Organization",
          "name": `${post.subjectParty} Party`
        };
      }
      setJsonLd("subject", person);
    }

    return () => {
      document.title = SITE_TITLE;
      removeJsonLd("article");
      removeJsonLd("subject");
    };
  }, [post?.slug]);
}

export function useHomeSeoHead() {
  useEffect(() => {
    document.title = SITE_TITLE;

    setLink("canonical", `${DOMAIN}/`);
    setMeta("description", SITE_DESCRIPTION);

    setMeta("og:title",       SITE_TITLE,       "property");
    setMeta("og:description", SITE_DESCRIPTION, "property");
    setMeta("og:type",        "website",         "property");
    setMeta("og:url",         `${DOMAIN}/`,      "property");
    setMeta("og:image",       `${DOMAIN}/opengraph.jpg`, "property");
    setMeta("og:site_name",   "ClownBinge",      "property");

    setMeta("twitter:card",        "summary_large_image");
    setMeta("twitter:title",       SITE_TITLE);
    setMeta("twitter:description", SITE_DESCRIPTION);
    setMeta("twitter:image",       `${DOMAIN}/opengraph.jpg`);

    setJsonLd("website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ClownBinge",
      "url": DOMAIN,
      "description": SITE_DESCRIPTION,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${DOMAIN}/?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    });

    setJsonLd("organization", {
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      "name": "ClownBinge",
      "alternateName": "Laughphoria Informatics",
      "url": DOMAIN,
      "logo": `${DOMAIN}/logo.png`,
      "description": SITE_DESCRIPTION,
      "foundingDate": "2024",
      "publishingPrinciples": `${DOMAIN}/ethics`,
      "verificationFactCheckingPolicy": `${DOMAIN}/ethics`,
      "actionableFeedbackPolicy": `${DOMAIN}/contact`
    });

    return () => {
      removeJsonLd("website");
      removeJsonLd("organization");
    };
  }, []);
}
