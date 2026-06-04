export interface HeroSection {
  headline: string;
  subheadline: string;
  stats: Array<{ label: string; value: string }>;
  primaryCta: string;
  secondaryCta: string;
  profileImage?: string;
  trustLabels?: {
    rating: string;
    clients: string;
    response: string;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  icon: string;
}

export interface ServicesSection {
  heading: string;
  subheading: string;
  services: Service[];
  customSolutionsText?: string;
  customSolutionsButtonText?: string;
}

export interface WorkProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  result?: string;
  clientOrder?: string;
}

export interface WorkSection {
  heading: string;
  subheading: string;
  projects: WorkProject[];
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
}

export interface TestimonialsSection {
  heading: string;
  subheading: string;
  testimonials: Testimonial[];
  trustLabel?: string;
  ctaText?: string;
  ctaHeading?: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface AboutSection {
  heading: string;
  content: string[];
  image?: string;
  stats: Array<{ label: string; value: string; icon?: string }>;
  skills: Skill[];
}

export interface CTASection {
  heading: string;
  subheading: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface ContactSection {
  heading: string;
  subheading: string;
  email: string;
  phone?: string;
  description?: string;
  projectTypes?: string[];
  budgetRanges?: string[];
}

export interface PageContent {
  hero: HeroSection;
  services: ServicesSection;
  work: WorkSection;
  testimonials: TestimonialsSection;
  about: AboutSection;
  cta: CTASection;
  contact: ContactSection;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  projectType?: string;
  budget?: string;
}

export interface ContactSubmission extends ContactFormData {
  id: string;
  createdAt: string;
  read: boolean;
}
