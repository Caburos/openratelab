export const updateMetaTags = (
  title: string,
  description: string,
  keywords?: string,
  ogImage?: string
) => {
  // Update title
  document.title = title;
  
  // Update or create meta tags
  const updateOrCreateMeta = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", name);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  };

  const updateOrCreateProperty = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  };

  // Update standard meta tags
  updateOrCreateMeta("description", description);
  if (keywords) {
    updateOrCreateMeta("keywords", keywords);
  }

  // Update Open Graph tags
  updateOrCreateProperty("og:title", title);
  updateOrCreateProperty("og:description", description);
  if (ogImage) {
    updateOrCreateProperty("og:image", ogImage);
  }

  // Update Twitter tags
  updateOrCreateMeta("twitter:title", title);
  updateOrCreateMeta("twitter:description", description);
  if (ogImage) {
    updateOrCreateMeta("twitter:image", ogImage);
  }
};

export const DEFAULT_SEO = {
  title: "Uros Korene | Full-Stack Developer & Designer | E-commerce & Web Solutions",
  description:
    "Full-stack developer and designer specializing in e-commerce solutions, website development, and digital marketing. 3+ years of experience, 20+ successful projects, 99% client satisfaction.",
  keywords:
    "web developer, e-commerce development, web design, UI/UX design, React developer, full-stack developer, digital marketing, website development, brand design, SEO optimization",
  url: "https://urosbuilds.com",
  image: "https://urosbuilds.com/og-image.jpg",
};

export const generateStructuredData = (type: string, data: Record<string, any>) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
  };

  return { ...baseSchema, ...data };
};
