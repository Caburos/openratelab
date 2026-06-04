import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  schema?: object | object[];
  children?: React.ReactNode;
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = "https://openratelab.com/images/hero-banner.jpg",
  schema,
  children,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const set = (selector: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", value);
    };

    set('meta[name="description"]', description);
    set('meta[property="og:title"]', title);
    set('meta[property="og:description"]', description);
    set('meta[property="og:image"]', ogImage);
    set('meta[name="twitter:title"]', title);
    set('meta[name="twitter:description"]', description);
    set('meta[name="twitter:image"]', ogImage);

    const url = canonical ?? window.location.origin + window.location.pathname;
    set('meta[property="og:url"]', url);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.rel = "canonical";
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = url;

    // Always index — never set noindex
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "index, follow";

    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      document.querySelectorAll("script[data-schema]").forEach((el) => el.remove());
      schemas.forEach((s) => {
        const el = document.createElement("script");
        el.type = "application/ld+json";
        el.setAttribute("data-schema", "true");
        el.textContent = JSON.stringify(s);
        document.head.appendChild(el);
      });
    }
  }, [title, description, canonical, ogImage]);

  return <>{children}</>;
}
