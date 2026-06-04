import { motion } from "framer-motion";
import { CheckCircle2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTA from "@/components/sections/CTA";

const values = [
  {
    title: "Copy over claims",
    body: "We don't promise open rates. We write copy so good it earns them. Every line we write is accountable to results.",
  },
  {
    title: "Revenue, not vanity",
    body: "Opens and clicks are nice. Revenue is what we track. We align every email to a business outcome before we write a single word.",
  },
  {
    title: "Brand voice, not templates",
    body: "We work deep into your brand voice before we write. Your audience can tell the difference, and so can your revenue.",
  },
  {
    title: "Strategy first",
    body: "Great copy in the wrong sequence is still wasted effort. We plan the full customer journey before we sit down to write.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "OpenRateLab",
  url: "https://openratelab.com",
  email: "uros@openratelab.com",
  description:
    "Email marketing and copywriting agency for e-commerce and DTC brands. Specialising in Klaviyo flows and campaigns.",
  areaServed: "Worldwide",
  availableLanguage: ["en"],
};

export default function About() {
  return (
    <SEOHead
      title="About | OpenRateLab — Email Marketing Specialists"
      description="We're an email marketing and copywriting agency focused entirely on revenue. Meet the team behind the copy that keeps performing."
      canonical="https://openratelab.com/about"
      schema={localBusinessSchema}
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
                <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">About Us</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
                  We're Obsessed With Email Revenue. And We're Good At It.
                </h1>
                <p className="text-white/70 text-lg leading-relaxed">
                  OpenRateLab is a copywriting and email marketing agency built for brands that want email to actually perform — not just tick a box.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Story section */}
          <section className="section-padding bg-white">
            <div className="container-wide">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className="rounded-3xl overflow-hidden"
                >
                  <img
                    src="/images/team.jpg"
                    alt="OpenRateLab team"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                >
                  <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">Our Story</p>
                  <h2 className="text-3xl font-bold text-primary mb-6">
                    Built by Marketers Who Were Tired of Average
                  </h2>

                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      We started OpenRateLab because we kept seeing the same problem: brands with great products and healthy lists — leaving money in the inbox every single month. The copy was bland. The flows were incomplete. Nobody was thinking about the customer journey.
                    </p>
                    <p>
                      We fix that. Our team writes email copy the way direct response writers have always written it — with every word accountable to a result. We apply those principles to Klaviyo, to ad platforms, to every touchpoint where words need to earn their keep.
                    </p>
                    <p>
                      We work with a focused roster of e-commerce and DTC brands. We get deep into your brand, your customer, and your offer — and we write copy that reflects all three. No churn. No templates. No excuses.
                    </p>
                  </div>

                  <div className="mt-8">
                    <a
                      href="mailto:uros@openratelab.com"
                      className="inline-flex items-center gap-2 text-accent font-semibold hover:opacity-80 transition-opacity"
                    >
                      <Mail size={17} />
                      uros@openratelab.com
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="section-padding bg-accent-bg">
            <div className="container-wide">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="text-center mb-14"
              >
                <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">How We Work</p>
                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                  What We Believe
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((v, i) => (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-8 border border-accent-light/40"
                  >
                    <div className="flex items-start gap-4">
                      <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-primary mb-2">{v.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{v.body}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <CTA
            heading="Want to See How We Work in Practice?"
            subheading="Reach out and tell us about your brand. We'll take it from there."
            secondaryLabel="View Services"
            secondaryHref="/services"
          />
        </main>

        <Footer />
      </div>
    </SEOHead>
  );
}
