import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import FeaturedWork from "@/components/sections/FeaturedWork";
import Testimonials from "@/components/sections/Testimonials";
import About from "@/components/sections/About";
import CTA from "@/components/sections/CTA";
import Contact from "@/components/sections/Contact";
import SEOHead from "@/components/SEOHead";

interface PageContent {
  hero: {
    headline: string;
    subheadline: string;
    stats: Array<{ label: string; value: string }>;
    primaryCta: string;
    secondaryCta: string;
    profileImage?: string;
  };
  services: {
    heading: string;
    subheading: string;
    services: Array<{
      id: string;
      title: string;
      description: string;
      features: string[];
      price: string;
      icon: string;
    }>;
  };
  work: {
    heading: string;
    subheading: string;
    projects: Array<{
      id: string;
      title: string;
      description: string;
      tags: string[];
      image: string;
      link: string;
    }>;
  };
  testimonials: {
    heading: string;
    subheading: string;
    testimonials: Array<{
      id: string;
      name: string;
      title: string;
      company: string;
      content: string;
      rating: number;
      image?: string;
    }>;
  };
  about: {
    heading: string;
    content: string[];
    image?: string;
    stats: Array<{ label: string; value: string }>;
    skills: Array<{ name: string; level: number }>;
  };
  cta: {
    heading: string;
    subheading: string;
    primaryCta: string;
    secondaryCta: string;
  };
  contact: {
    heading: string;
    subheading: string;
    email: string;
    phone?: string;
  };
}

export default function Index() {
  const { data, isLoading } = useQuery<PageContent>({
    queryKey: ["content"],
    queryFn: async () => {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed to fetch content");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const defaultContent: PageContent = {
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
      profileImage: "/placeholder.svg",
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
          features: [
            "Logo design",
            "Brand guidelines",
            "Packaging design",
          ],
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
          features: [
            "iOS & Android apps",
            "User-friendly design",
            "Fast & scalable",
          ],
          price: "Starting at $8,000",
          icon: "smartphone",
        },
      ],
    },
    work: {
      heading: "Featured Work",
      subheading:
        "Here are some of my recent projects that showcase my expertise.",
      projects: [
        {
          id: "1",
          title: "TVMerch.com",
          description: "A modern e-commerce platform for merchandise sales with streaming integration.",
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
      subheading:
        "Don't just take my word for it. Here's what my clients have to say.",
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
        { label: "Projects Completed", value: "20+" },
        { label: "Client Satisfaction", value: "99%" },
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

  const content = data || defaultContent;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SEOHead
      title="Uros Korene | Full-Stack Developer & Designer | E-commerce & Web Solutions"
      description="Full-stack developer and designer specializing in e-commerce solutions, website development, and digital marketing. 3+ years of experience, 20+ successful projects, 99% client satisfaction."
      keywords="web developer, e-commerce development, web design, UI/UX design, React developer, full-stack developer, digital marketing, website development, brand design, SEO optimization"
      canonical="https://urosbuilds.com"
      ogImage="https://urosbuilds.com/og-image.jpg"
    >
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          <Hero data={content.hero} />
          <Services {...content.services} />
          <FeaturedWork {...content.work} />
          <Testimonials {...content.testimonials} />
          <About data={content.about} />
          <CTA {...content.cta} />
          <Contact {...content.contact} />
        </main>

        <Footer />
      </div>
    </SEOHead>
  );
}
