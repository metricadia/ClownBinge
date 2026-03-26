import { useEffect } from "react";
import type { Post } from "@workspace/api-client-react";

const DOMAIN = "https://clownbinge.com";
const SITE_TITLE = "ClownBinge.com | Verified News. Primary Sources. For the People.";
const SITE_DESCRIPTION = "Verified accountability journalism. ClownBinge documents real, sourced incidents where politicians and religious leaders contradict their own words and votes. Primary sources only. No fabrications.";
const ORG_ID = `${DOMAIN}/#organization`;
const WEBSITE_ID = `${DOMAIN}/#website`;

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

function removeMeta(name: string, attr = "name") {
  document.querySelector(`meta[${attr}="${name}"]`)?.remove();
}

const CATEGORY_LABELS: Record<string, string> = {
  self_owned:         "Self-Owned",
  law_and_justice:    "Law & Justice Files",
  money_and_power:    "Money & Power",
  us_constitution:    "U.S. Constitution",
  women_and_girls:    "Women & Girls",
  anti_racist_heroes: "Anti-Racist Heroes",
  us_history:         "U.S. History",
  religion:           "Religion",
  investigations:     "Investigations",
  war_and_inhumanity: "War & Inhumanity",
  health_and_healing: "Health & Healing",
  technology:         "Technology",
  censorship:         "Censorship",
  global_south:       "Global South",
  how_it_works:       "How It Works",
  nerd_out:           "NerdOut",
};

const PUBLISHER_BLOCK = {
  "@type": ["NewsMediaOrganization", "ResearchOrganization"],
  "@id": ORG_ID,
  "name": "ClownBinge",
  "alternateName": "Primary Source Analytics, LLC",
  "url": DOMAIN,
  "logo": {
    "@type": "ImageObject",
    "url": `${DOMAIN}/logo.png`,
    "width": 400,
    "height": 60
  },
  "description": "Primary Source Analytics, LLC publishes accountability journalism grounded exclusively in primary sources — court opinions, legislative records, peer-reviewed research, and official government documents. No editorializing. No fabrications. The record speaks for itself.",
  "foundingDate": "2024",
  "knowsAbout": [
    "U.S. Constitutional Law",
    "Accountability Journalism",
    "Primary Source Research",
    "Voting Rights",
    "Ancient History",
    "Global South",
    "Health Policy",
    "Fact-Checking"
  ],
  "publishingPrinciples": `${DOMAIN}/ethics`,
  "verificationFactCheckingPolicy": `${DOMAIN}/ethics`,
  "actionableFeedbackPolicy": `${DOMAIN}/contact`,
  "inLanguage": "en-US"
};

function estimateWordCount(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return Math.max(50, Math.round(text.split(" ").length));
}

export function useArticleSeoHead(post: Post | null | undefined) {
  useEffect(() => {
    if (!post) return;

    const canonical = `${DOMAIN}/case/${post.slug}`;
    const articleId = `${canonical}#article`;
    const ogImage = (post as any).videoThumbnail ?? `${DOMAIN}/opengraph.jpg`;
    const description = post.teaser ?? "";
    const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category;
    const categoryUrl = `${DOMAIN}/?category=${post.category}`;
    const isSelfOwned = post.category === "self_owned";
    const isHero = post.category === "anti_racist_heroes";
    const isNerdOut = post.category === "nerd_out";
    const isConstitution = post.category === "us_constitution";
    const isGlobalSouth = post.category === "global_south";
    const isScholarlyDeepDive = isNerdOut || isConstitution || isGlobalSouth;
    const hasApaCitations = !!(post.verifiedSource && post.verifiedSource.includes("::"));
    const pageTitle = isNerdOut
      ? `${post.title} | NerdOut Academic Analysis | ClownBinge`
      : `${post.title} | ClownBinge`;

    document.title = pageTitle;

    setLink("canonical", canonical);

    setMeta("description", description);
    setMeta("robots", "index, follow");
    setMeta("language", "en-US");
    setMeta("author", "Primary Source Analytics, LLC");

    setMeta("og:title",       post.title,   "property");
    setMeta("og:description", description,  "property");
    setMeta("og:type",        "article",    "property");
    setMeta("og:url",         canonical,    "property");
    setMeta("og:image",       ogImage,      "property");
    setMeta("og:image:alt",   isNerdOut ? `${post.title} — NerdOut Academic Analysis | ClownBinge` : `${post.title} | ClownBinge`, "property");
    setMeta("og:site_name",   "ClownBinge", "property");
    setMeta("og:locale",      "en_US",      "property");

    setMeta("article:published_time", post.publishedAt ?? post.createdAt ?? "", "property");
    setMeta("article:section", categoryLabel, "property");
    if (Array.isArray(post.tags)) {
      post.tags.slice(0, 5).forEach((tag, i) => setMeta(`article:tag${i}`, tag, "property"));
    }

    setMeta("twitter:card",        "summary_large_image");
    setMeta("twitter:title",       post.title);
    setMeta("twitter:description", description);
    setMeta("twitter:image",       ogImage);
    setMeta("twitter:site",        "@ClownBinge");

    // Build subject Person block (reused across schemas)
    let subjectPerson: Record<string, unknown> | null = null;
    if (post.subjectName) {
      subjectPerson = {
        "@type": "Person",
        "name": post.subjectName,
      };
      if (post.subjectTitle) subjectPerson.jobTitle = post.subjectTitle;
      if (post.subjectParty && post.subjectParty !== "None") {
        subjectPerson.memberOf = {
          "@type": "Organization",
          "name": `${post.subjectParty} Party`
        };
      }
    }

    // additionalProperty for verification and self-own score
    const additionalProps: Record<string, unknown>[] = [
      {
        "@type": "PropertyValue",
        "name": "VerificationStatus",
        "value": "Verified — Primary Sources"
      }
    ];
    if (post.selfOwnScore != null) {
      additionalProps.push({
        "@type": "PropertyValue",
        "name": "SelfOwnScore",
        "description": "ClownBinge Self-Own severity rating (1-10)",
        "value": post.selfOwnScore,
        "minValue": 1,
        "maxValue": 10
      });
    }

    // Backstory for deep-dive articles — signals primary-source mission to Google AI
    const backstoryProp: Record<string, unknown> = {
      "@type": "PropertyValue",
      "name": "backstory",
      "value": "ClownBinge is published by Primary Source Analytics, LLC, an independent accountability journalism operation. Every article is built exclusively on primary sources: court opinions, legislative hearing transcripts, peer-reviewed research, and official government documents. The mission is to make the documented record accessible without editorializing — the evidence speaks for itself."
    };

    // Article @type — ScholarlyArticle for deep legal/historical/academic dives
    let articleType: string | string[];
    if (isScholarlyDeepDive) {
      articleType = ["NewsArticle", "ScholarlyArticle", "AnalysisNewsArticle"];
    } else {
      articleType = "NewsArticle";
    }

    if (isScholarlyDeepDive) {
      additionalProps.push(backstoryProp);
    }

    // About entities — subject person or derived constitutional/legal entities
    const CONSTITUTION_ENTITIES = [
      { "@type": "GovernmentOrganization", "name": "Supreme Court of the United States", "sameAs": "https://www.wikidata.org/wiki/Q11201" },
      { "@type": "Legislation", "name": "Voting Rights Act of 1965", "sameAs": "https://www.wikidata.org/wiki/Q902948" },
      { "@type": "Legislation", "name": "Fourteenth Amendment to the United States Constitution", "sameAs": "https://www.wikidata.org/wiki/Q192155" },
      { "@type": "Legislation", "name": "Fifteenth Amendment to the United States Constitution", "sameAs": "https://www.wikidata.org/wiki/Q192165" }
    ];

    const GLOBAL_SOUTH_ENTITIES = [
      { "@type": "Thing", "name": "Archaeological Record" },
      { "@type": "Thing", "name": "Primary Source History" },
      { "@type": "Place", "name": "Global South" }
    ];

    // NewsArticle schema
    const wordCount = estimateWordCount(post.body ?? "");
    const articleSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": articleType,
      "@id": articleId,
      "headline": post.title,
      "name": post.title,
      "description": description,
      "inLanguage": "en-US",
      "datePublished": post.publishedAt ?? post.createdAt,
      "dateModified":  post.publishedAt ?? post.createdAt,
      "wordCount": wordCount,
      "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
      "url": canonical,
      "articleSection": isScholarlyDeepDive ? (isNerdOut ? "NerdOut Academic Analysis" : categoryLabel) : categoryLabel,
      "genre": isScholarlyDeepDive ? "Academic Analysis" : "Accountability Journalism",
      "educationalLevel": isScholarlyDeepDive ? "advanced" : undefined,
      "keywords": Array.isArray(post.tags) ? post.tags.join(", ") : "",
      "author": PUBLISHER_BLOCK,
      "publisher": PUBLISHER_BLOCK,
      "isPartOf": {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        "name": "ClownBinge",
        "url": DOMAIN
      },
      "image": {
        "@type": "ImageObject",
        "url": ogImage,
        "caption": `${post.title} | ClownBinge`
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": ogImage
      },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["[data-speakable-headline]", "[data-speakable-lede]"]
      },
      "additionalProperty": additionalProps
    };

    if (subjectPerson) {
      articleSchema.about = subjectPerson;
      articleSchema.mentions = subjectPerson;
    } else if (isConstitution) {
      articleSchema.about = CONSTITUTION_ENTITIES;
    } else if (isGlobalSouth) {
      articleSchema.about = GLOBAL_SOUTH_ENTITIES;
    }

    if (post.dateOfIncident) articleSchema.temporalCoverage = post.dateOfIncident;

    // Sovereign Override: isBasedOn + citation from APA 7 citation data
    if (post.verifiedSource && post.verifiedSource.includes("::")) {
      const parsedSources = post.verifiedSource
        .split(/[;|]/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(entry => {
          const parts = entry.split("::");
          if (parts.length < 2) return null;
          const label = parts[0].trim();
          const citation = parts.slice(1).join("::").trim();
          if (!citation) return null;
          const instMatch = citation.match(/^([^.(]+(?:Committee|Publishing Office|Court|Archives?|Library|Academy|Institute|Journal|Department|Bureau|Agency|Commission|Council|Board|Service|Foundation|University|Center|Authority)[^.(,]*)/i);
          const name = instMatch ? instMatch[1].trim() : citation.split(".")[0].trim();
          const isGov = /\b(U\.S\.|Department|Bureau|Congress|Senate|House|Federal|National|State|Court|Archives)\b/i.test(citation);
          return {
            type: isGov ? ["CreativeWork", "GovernmentPermit"] : "CreativeWork",
            name: name || label,
            description: label,
            citation: citation
          };
        })
        .filter(Boolean) as { type: string | string[]; name: string; description: string; citation: string }[];

      if (parsedSources.length > 0) {
        articleSchema.isBasedOn = parsedSources.map(s => ({
          "@type": s.type,
          "name": s.name,
          "description": s.description
        }));
        // citation field: formal bibliographic reference strings for Google
        articleSchema.citation = parsedSources.map(s => ({
          "@type": "CreativeWork",
          "name": s.name,
          "description": s.citation
        }));
      }
    } else if (post.verifiedSource) {
      // Non-APA sources: emit citation as plain string array
      const sources = post.verifiedSource.split(/[;|]/).map(s => s.trim()).filter(Boolean);
      if (sources.length > 0) {
        articleSchema.citation = sources.map(s => ({
          "@type": "CreativeWork",
          "name": s
        }));
      }
    }

    setJsonLd("article", articleSchema);

    // BreadcrumbList — site hierarchy for Topical Authority
    setJsonLd("breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "ClownBinge",
          "item": `${DOMAIN}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": categoryLabel,
          "item": categoryUrl
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.title,
          "item": canonical
        }
      ]
    });

    // Subject standalone Person block
    if (subjectPerson) {
      setJsonLd("subject", { "@context": "https://schema.org", ...subjectPerson });
    } else {
      removeJsonLd("subject");
    }

    // ClaimReview — Google rich result for fact-check / accountability journalism
    // Fires for: articles with a named subject, AND deep-dive scholarly articles with primary sources
    const claimReviewEligible = !!(post.subjectName || (isScholarlyDeepDive && hasApaCitations));
    if (claimReviewEligible) {
      let ratingValue: number;
      let alternateName: string;
      if (isHero) {
        ratingValue = 5;
        alternateName = "Anti-Racist Hero — Verified";
      } else if (isSelfOwned && post.selfOwnScore != null) {
        ratingValue = Math.min(5, Math.round(post.selfOwnScore / 2));
        alternateName = `Self-Owned — Severity ${post.selfOwnScore}/10`;
      } else if (!post.subjectName && isScholarlyDeepDive) {
        ratingValue = 4;
        alternateName = "Documented — Primary Sources Only";
      } else {
        ratingValue = 4;
        alternateName = "Verified — Documented";
      }

      const claimAuthor = subjectPerson ?? {
        "@type": "GovernmentOrganization",
        "name": "U.S. Federal Government",
        "sameAs": "https://www.wikidata.org/wiki/Q30"
      };

      setJsonLd("claimreview", {
        "@context": "https://schema.org",
        "@type": "ClaimReview",
        "url": canonical,
        "claimReviewed": post.title,
        "datePublished": post.publishedAt ?? post.createdAt,
        "author": {
          "@type": ["NewsMediaOrganization", "ResearchOrganization"],
          "@id": ORG_ID,
          "name": "ClownBinge",
          "url": DOMAIN,
          "publishingPrinciples": `${DOMAIN}/ethics`
        },
        "itemReviewed": {
          "@type": "Claim",
          "author": claimAuthor,
          "datePublished": post.dateOfIncident ?? (post.publishedAt ?? post.createdAt),
          "name": post.title
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": ratingValue,
          "bestRating": 5,
          "worstRating": 1,
          "alternateName": alternateName
        }
      });
    } else {
      removeJsonLd("claimreview");
    }

    return () => {
      document.title = SITE_TITLE;
      removeJsonLd("article");
      removeJsonLd("breadcrumb");
      removeJsonLd("subject");
      removeJsonLd("claimreview");
      removeMeta("robots");
      removeMeta("language");
      removeMeta("author");
      removeMeta("og:locale", "property");
      removeMeta("article:published_time", "property");
      removeMeta("article:section", "property");
    };
  }, [post?.slug]);
}

export function useHomeSeoHead() {
  useEffect(() => {
    document.title = SITE_TITLE;

    setLink("canonical", `${DOMAIN}/`);
    setMeta("description", SITE_DESCRIPTION);
    setMeta("robots", "index, follow");
    setMeta("language", "en-US");
    setMeta("author", "Primary Source Analytics, LLC");

    setMeta("og:title",       SITE_TITLE,       "property");
    setMeta("og:description", SITE_DESCRIPTION, "property");
    setMeta("og:type",        "website",         "property");
    setMeta("og:url",         `${DOMAIN}/`,      "property");
    setMeta("og:image",       `${DOMAIN}/opengraph.jpg`, "property");
    setMeta("og:site_name",   "ClownBinge",      "property");
    setMeta("og:locale",      "en_US",           "property");

    setMeta("twitter:card",        "summary_large_image");
    setMeta("twitter:title",       SITE_TITLE);
    setMeta("twitter:description", SITE_DESCRIPTION);
    setMeta("twitter:image",       `${DOMAIN}/opengraph.jpg`);
    setMeta("twitter:site",        "@ClownBinge");

    setJsonLd("website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      "name": "ClownBinge",
      "url": DOMAIN,
      "description": SITE_DESCRIPTION,
      "inLanguage": "en-US",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${DOMAIN}/?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    });

    setJsonLd("organization", {
      "@context": "https://schema.org",
      "@type": ["NewsMediaOrganization", "ResearchOrganization"],
      "@id": ORG_ID,
      "name": "ClownBinge",
      "alternateName": "Primary Source Analytics, LLC",
      "url": DOMAIN,
      "logo": {
        "@type": "ImageObject",
        "url": `${DOMAIN}/logo.png`,
        "width": 400,
        "height": 60
      },
      "description": SITE_DESCRIPTION,
      "foundingDate": "2024",
      "inLanguage": "en-US",
      "areaServed": "US",
      "knowsAbout": [
        "U.S. Constitutional Law",
        "Accountability Journalism",
        "Primary Source Research",
        "Voting Rights",
        "Ancient History",
        "Global South",
        "Health Policy",
        "Fact-Checking"
      ],
      "publishingPrinciples": `${DOMAIN}/ethics`,
      "verificationFactCheckingPolicy": `${DOMAIN}/ethics`,
      "actionableFeedbackPolicy": `${DOMAIN}/contact`,
      "sameAs": [
        "https://www.youtube.com/@ClownBinge"
      ]
    });

    setJsonLd("sitelinks", {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "name": [
        "About ClownBinge",
        "Editorial Standards",
        "Verify a News Story",
        "PST Comprehensive Report",
        "Support Independent Journalism",
        "Contact"
      ],
      "url": [
        `${DOMAIN}/about`,
        `${DOMAIN}/ethics`,
        `${DOMAIN}/clowncheck`,
        `${DOMAIN}/reports`,
        `${DOMAIN}/contact`,
        `${DOMAIN}/contact`
      ]
    });

    return () => {
      removeJsonLd("website");
      removeJsonLd("organization");
      removeJsonLd("sitelinks");
      removeMeta("robots");
      removeMeta("language");
      removeMeta("author");
      removeMeta("og:locale", "property");
    };
  }, []);
}

// Generic hook for all static pages (About, Ethics, Contact, Store, etc.)
interface PageSeoOptions {
  title: string;
  description: string;
  path: string;
  schemaType?: "AboutPage" | "ContactPage" | "WebPage" | "ItemPage";
  noIndex?: boolean;
}

export function usePageSeoHead({ title, description, path, schemaType = "WebPage", noIndex = false }: PageSeoOptions) {
  useEffect(() => {
    const canonical = `${DOMAIN}${path}`;
    const fullTitle = `${title} | ClownBinge`;

    document.title = fullTitle;

    setLink("canonical", canonical);
    setMeta("description", description);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");
    setMeta("language", "en-US");
    setMeta("author", "Primary Source Analytics, LLC");

    setMeta("og:title",       fullTitle,    "property");
    setMeta("og:description", description, "property");
    setMeta("og:type",        "website",   "property");
    setMeta("og:url",         canonical,   "property");
    setMeta("og:image",       `${DOMAIN}/opengraph.jpg`, "property");
    setMeta("og:site_name",   "ClownBinge", "property");
    setMeta("og:locale",      "en_US",      "property");

    setMeta("twitter:card",        "summary_large_image");
    setMeta("twitter:title",       fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image",       `${DOMAIN}/opengraph.jpg`);
    setMeta("twitter:site",        "@ClownBinge");

    setJsonLd("page", {
      "@context": "https://schema.org",
      "@type": schemaType,
      "@id": `${canonical}#page`,
      "url": canonical,
      "name": title,
      "description": description,
      "inLanguage": "en-US",
      "isPartOf": { "@type": "WebSite", "@id": WEBSITE_ID },
      "publisher": { "@type": "NewsMediaOrganization", "@id": ORG_ID }
    });

    return () => {
      document.title = SITE_TITLE;
      removeJsonLd("page");
      removeMeta("robots");
      removeMeta("language");
      removeMeta("author");
      removeMeta("og:locale", "property");
    };
  }, [path]);
}

// Hook for tag/category archive pages
export function useTagSeoHead(tag: string, postCount: number) {
  useEffect(() => {
    if (!tag) return;

    const canonical = `${DOMAIN}/tags/${encodeURIComponent(tag)}`;
    const fullTitle = `#${tag} — ${postCount} Verified Record${postCount !== 1 ? "s" : ""} | ClownBinge`;
    const description = `All verified ClownBinge records tagged #${tag}. ${postCount} documented case${postCount !== 1 ? "s" : ""} sourced from primary government and institutional records. No fabrications.`;

    document.title = fullTitle;

    setLink("canonical", canonical);
    setMeta("description", description);
    setMeta("robots", "index, follow");
    setMeta("language", "en-US");

    setMeta("og:title",       fullTitle,    "property");
    setMeta("og:description", description, "property");
    setMeta("og:type",        "website",   "property");
    setMeta("og:url",         canonical,   "property");
    setMeta("og:image",       `${DOMAIN}/opengraph.jpg`, "property");
    setMeta("og:site_name",   "ClownBinge", "property");
    setMeta("og:locale",      "en_US",      "property");

    setMeta("twitter:card",        "summary");
    setMeta("twitter:title",       fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:site",        "@ClownBinge");

    setJsonLd("breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ClownBinge", "item": `${DOMAIN}/` },
        { "@type": "ListItem", "position": 2, "name": `#${tag}`, "item": canonical }
      ]
    });

    setJsonLd("page", {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${canonical}#page`,
      "url": canonical,
      "name": `#${tag} — Verified Records`,
      "description": description,
      "inLanguage": "en-US",
      "about": { "@type": "Thing", "name": tag },
      "isPartOf": { "@type": "WebSite", "@id": WEBSITE_ID },
      "publisher": { "@type": "NewsMediaOrganization", "@id": ORG_ID }
    });

    return () => {
      document.title = SITE_TITLE;
      removeJsonLd("breadcrumb");
      removeJsonLd("page");
      removeMeta("robots");
      removeMeta("language");
      removeMeta("og:locale", "property");
    };
  }, [tag, postCount]);
}
