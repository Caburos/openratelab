import { RequestHandler } from "express";
import { PageContent } from "@shared/content";
import * as fs from "fs";
import * as path from "path";

const CONTENT_FILE = path.join(process.cwd(), "data", "content.json");

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(CONTENT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Get default content
function getDefaultContent(): PageContent {
  return {
    hero: {
      headline: "Uros builds your internet presence",
      subheadline:
        "A modern developer & designer creating beautiful, functional websites and web experiences that help businesses grow.",
      stats: [
        { label: "Years", value: "3+" },
        { label: "Projects", value: "20+" },
        { label: "Happy Clients", value: "99%" },
      ],
      primaryCta: "Get Started",
      secondaryCta: "View My Work",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    services: {
      heading: "Services I Offer",
      subheading:
        "From design to development, I create end-to-end digital solutions that drive results.",
      customSolutionsText: "Don't see what you're looking for? I also offer custom solutions.",
      customSolutionsButtonText: "Discuss Your Project",
      services: [
        {
          id: "1",
          title: "E-commerce Website Development",
          description: "Build powerful online stores that convert visitors into customers.",
          features: [
            "Custom storefront design",
            "Payment integration",
            "Inventory management",
          ],
          price: "Starting at $5,000",
          icon: "code",
        },
        {
          id: "2",
          title: "Brand & Package Design",
          description: "Create compelling visual identities that stand out.",
          features: ["Logo design", "Brand guidelines", "Packaging design"],
          price: "Starting at $2,000",
          icon: "palette",
        },
        {
          id: "3",
          title: "Website Maintenance & Security",
          description: "Keep your website running smoothly and securely.",
          features: [
            "Regular updates",
            "Security monitoring",
            "Performance optimization",
          ],
          price: "Starting at $500/month",
          icon: "shield",
        },
        {
          id: "4",
          title: "SEO & Content Optimization",
          description: "Improve your online visibility and search rankings.",
          features: [
            "Keyword research",
            "Content optimization",
            "Technical SEO",
          ],
          price: "Starting at $1,500",
          icon: "zap",
        },
        {
          id: "5",
          title: "Mobile App Development",
          description: "Native and cross-platform mobile applications.",
          features: ["iOS & Android apps", "User-friendly design", "Fast & scalable"],
          price: "Starting at $8,000",
          icon: "smartphone",
        },
      ],
    },
    work: {
      heading: "Featured Work",
      subheading: "Here are some of my recent projects that showcase my expertise.",
      projects: [
        {
          id: "1",
          title: "TVMerch.com",
          description:
            "A modern e-commerce platform for merchandise sales with streaming integration.",
          tags: ["E-commerce", "Streaming", "Design"],
          image: "/placeholder.svg",
          link: "https://tvmerch.com",
          clientOrder: "E-commerce Platform",
          result: "40% increase in conversion rate",
        },
        {
          id: "2",
          title: "Opti",
          description: "Optimization platform for digital agencies.",
          tags: ["SaaS", "Analytics", "Dashboard"],
          image: "/placeholder.svg",
          link: "#",
          clientOrder: "SaaS Dashboard",
          result: "Reduced operational costs by 35%",
        },
        {
          id: "3",
          title: "CreativeAgency.com",
          description: "Portfolio website for a creative design agency.",
          tags: ["Portfolio", "Design", "Branding"],
          image: "/placeholder.svg",
          link: "#",
          clientOrder: "Portfolio Website",
          result: "Increased client inquiries by 50%",
        },
      ],
    },
    testimonials: {
      heading: "What My Clients Say",
      subheading: "Don't just take my word for it. Here's what my clients have to say.",
      trustLabel: "⭐ 4.9 rating from 20+ reviews",
      ctaHeading: "Ready to join these satisfied clients?",
      ctaText: "Start Your Success Story",
      testimonials: [
        {
          id: "1",
          name: "Sarah Johnson",
          title: "CEO",
          company: "Tech Startup Inc",
          content:
            "Working with Uros was transformative. He delivered exactly what we needed on time and exceeded our expectations.",
          rating: 5,
          image: "/placeholder.svg",
        },
        {
          id: "2",
          name: "Mike Chen",
          title: "Marketing Director",
          company: "E-Commerce Store",
          content:
            "The website he built increased our conversions by 40%. Highly recommended for anyone serious about results.",
          rating: 5,
          image: "/placeholder.svg",
        },
        {
          id: "3",
          name: "Emily Rodriguez",
          title: "Founder",
          company: "Creative Designs Co",
          content:
            "Professional, responsive, and incredibly talented. Uros is the best investment we've made for our brand.",
          rating: 5,
          image: "/placeholder.svg",
        },
      ],
    },
    about: {
      heading: "About Me",
      content: [
        "Hi, I'm Uros, a full-stack developer and designer from the digital age. I've been building websites and digital experiences for over 3 years, helping dozens of businesses establish and grow their online presence.",
        "I specialize in creating beautiful, functional, and conversion-focused websites. Whether you need a sleek portfolio, a powerful e-commerce store, or a custom web application, I've got you covered.",
        "My approach combines strategic thinking, modern design principles, and cutting-edge technology to deliver solutions that don't just look good—they work harder and smarter than your competition.",
      ],
      image: "/placeholder.svg",
      stats: [
        { label: "Projects Completed", value: "20+", icon: "award" },
        { label: "Client Satisfaction", value: "99%", icon: "users" },
      ],
      skills: [
        { name: "React & Next.js", level: 95 },
        { name: "UI/UX Design", level: 88 },
        { name: "JavaScript/TypeScript", level: 92 },
        { name: "Database Design", level: 85 },
        { name: "Web Performance", level: 90 },
      ],
    },
    cta: {
      heading: "Ready to Grow Your Business?",
      subheading:
        "Let's work together to create something amazing. Get in touch to discuss your project.",
      primaryCta: "Start Your Project",
      secondaryCta: "View Case Studies",
    },
    contact: {
      heading: "Let's Work Together",
      subheading:
        "Have a project in mind? I'd love to hear about it. Get in touch with me today.",
      email: "uros@urosbuilds.com",
      phone: "+1 (555) 123-4567",
      projectTypes: [
        "E-commerce Development",
        "Brand & Package Design",
        "Website Maintenance",
        "SEO & Content Optimization",
        "Mobile App Development",
        "Custom Solution",
      ],
      budgetRanges: [
        "$1,000 - $5,000",
        "$5,000 - $10,000",
        "$10,000 - $25,000",
        "$25,000 - $50,000",
        "$50,000+",
      ],
    },
  };
}

// Read content from file or return default
function readContent(): PageContent {
  ensureDataDir();
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading content file:", error);
  }
  return getDefaultContent();
}

// Write content to file
function writeContent(content: PageContent): void {
  ensureDataDir();
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
}

// Get all content
export const handleGetContent: RequestHandler = (_req, res) => {
  const content = readContent();
  res.json(content);
};

// Update a section
export const handleUpdateSection: RequestHandler = (req, res) => {
  const { section, data } = req.body;

  if (!section || !data) {
    res.status(400).json({ error: "Missing section or data" });
    return;
  }

  const validSections = [
    "hero",
    "services",
    "work",
    "testimonials",
    "about",
    "cta",
    "contact",
  ];
  if (!validSections.includes(section)) {
    res.status(400).json({ error: "Invalid section" });
    return;
  }

  const content = readContent();
  (content as any)[section] = data;
  writeContent(content);

  res.json({ success: true, message: `${section} updated successfully` });
};

// Get specific section
export const handleGetSection: RequestHandler = (req, res) => {
  const { section } = req.params;

  const validSections = [
    "hero",
    "services",
    "work",
    "testimonials",
    "about",
    "cta",
    "contact",
  ];
  if (!validSections.includes(section)) {
    res.status(400).json({ error: "Invalid section" });
    return;
  }

  const content = readContent();
  res.json((content as any)[section] || {});
};
