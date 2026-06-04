import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTA from "@/components/sections/CTA";

const services = [
  {
    id: "email",
    title: "Email Copywriting",
    image: "/images/service-email.png",
    tagline: "Klaviyo campaigns and flows that move product.",
    description:
      "We write email copy for brands that take their list seriously. Whether it's a promotional campaign, a seasonal send, or an evergreen automation — every email we write is built around one question: what will make this reader take action today?",
    features: [
      "Promotional and seasonal campaigns",
      "Welcome series and onboarding flows",
      "Abandoned cart and browse abandonment",
      "Post-purchase and retention flows",
      "Winback sequences",
      "Subject line and preview text optimisation",
      "A/B test variants",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Email Copywriting",
      provider: { "@type": "Organization", name: "OpenRateLab" },
      description:
        "Klaviyo campaigns and flows written to convert. Welcome series, abandon sequences, post-purchase, winbacks.",
    },
  },
  {
    id: "ads",
    title: "Ad Messaging",
    image: "/images/service-ads.png",
    tagline: "Copy that earns the click — then earns the sale.",
    description:
      "Ad copy is email copy's faster sibling. Less time, less space, same pressure to perform. We write Meta, Google, and direct response ad copy using the same conversion principles that make our email work — clear value, specific claims, and a reason to act now.",
    features: [
      "Meta (Facebook/Instagram) ad copy",
      "Google search and display copy",
      "Direct response copy frameworks",
      "Hook variations for creative testing",
      "Landing page headline alignment",
      "Offer and angle development",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Ad Messaging",
      provider: { "@type": "Organization", name: "OpenRateLab" },
      description:
        "Meta, Google, and direct response ad copy built for performance.",
    },
  },
  {
    id: "automation",
    title: "Automated Email Systems",
    image: "/images/service-website.png",
    tagline: "Revenue while you sleep — built properly from day one.",
    description:
      "Most brands have flows. Most of those flows are underperforming. We build and write complete Klaviyo flow architecture — not just the copy, but the strategy, segmentation logic, timing, and testing framework to make the whole system earn its keep.",
    features: [
      "Full flow architecture and strategy",
      "Klaviyo setup and segmentation",
      "Flow copy for every touchpoint",
      "Timing and send logic",
      "Conditional splits and branching",
      "Performance benchmarks and A/B framework",
      "Monthly flow review and optimisation",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Automated Email Systems",
      provider: { "@type": "Organization", name: "OpenRateLab" },
      description:
        "Full Klaviyo flow architecture: welcome, abandon, post-purchase, winback.",
    },
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Services() {
  return (
    <SEOHead
      title="Services | OpenRateLab — Email Copywriting & Klaviyo Flows"
      description="Email copywriting, ad messaging, and automated Klaviyo flow systems for e-commerce and DTC brands. Built to convert, not to fill inboxes."
      canonical="https://openratelab.com/services"
      schema={services.map((s) => s.schema)}
    >
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          {/* Page header */}
          <section className="bg-primary section-padding">
            <div className="container-wide">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">Services</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
                  Three Services. One Goal: More Revenue from Email.
                </h1>
                <p className="text-white/70 text-lg leading-relaxed">
                  We focus on what we're genuinely great at. If it touches your inbox — or drives traffic to it — we can write it.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Service sections */}
          <div className="divide-y divide-border">
            {services.map((svc, idx) => (
              <section
                key={svc.id}
                id={svc.id}
                className={`section-padding ${idx % 2 === 1 ? "bg-accent-bg" : "bg-white"}`}
              >
                <div className="container-wide">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${idx % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                    {/* Image */}
                    <motion.div
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.6 }}
                      className={`flex items-center justify-center bg-accent-bg rounded-3xl p-12 h-72 ${idx % 2 === 1 ? "lg:col-start-2" : ""}`}
                    >
                      <img
                        src={svc.image}
                        alt={svc.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-80px" }}
                    >
                      <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">{svc.tagline}</p>
                      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-5">{svc.title}</h2>
                      <p className="text-muted-foreground leading-relaxed mb-8">{svc.description}</p>

                      <ul className="space-y-3 mb-8">
                        {svc.features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                            <CheckCircle2 size={17} className="text-accent flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                      >
                        Get started <ArrowRight size={16} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <CTA
            heading="Not Sure Which Service You Need?"
            subheading="Tell us where you are and what you're trying to fix. We'll recommend the right starting point."
          />
        </main>

        <Footer />
      </div>
    </SEOHead>
  );
}
