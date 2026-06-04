import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTA from "@/components/sections/CTA";

const placeholderCases = [
  {
    id: 1,
    client: "DTC Apparel Brand",
    service: "Email Copywriting",
    result: "Result placeholder — e.g. +38% email revenue in 60 days",
    tags: ["Klaviyo", "Email", "Flows"],
  },
  {
    id: 2,
    client: "Health & Wellness Brand",
    service: "Automated Email Systems",
    result: "Result placeholder — e.g. Welcome flow driving 22% of total email revenue",
    tags: ["Automation", "Klaviyo", "Welcome Flow"],
  },
  {
    id: 3,
    client: "Home Goods E-commerce",
    service: "Ad Messaging + Email",
    result: "Result placeholder — e.g. 3.2× ROAS on Meta with aligned email nurture",
    tags: ["Ads", "Email", "DTC"],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function CaseStudies() {
  return (
    <SEOHead
      title="Case Studies | OpenRateLab — Email Marketing Results"
      description="Real results from OpenRateLab clients. See how we've helped e-commerce and DTC brands drive more revenue through email copywriting and Klaviyo flows."
      canonical="https://openratelab.com/case-studies"
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
                <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">Case Studies</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
                  Numbers Don't Lie. Inboxes Don't Either.
                </h1>
                <p className="text-white/70 text-lg leading-relaxed">
                  Here's what happens when you stop treating email as a checkbox and start treating it as a revenue channel.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Placeholder notice */}
          <section className="bg-accent-bg border-b border-border py-4">
            <div className="container-wide">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Lock size={15} className="text-accent" />
                <span>Case study details are being added. Real client results coming soon.</span>
              </div>
            </div>
          </section>

          {/* Cards */}
          <section className="section-padding bg-white">
            <div className="container-wide">
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {placeholderCases.map((cs) => (
                  <motion.div
                    key={cs.id}
                    variants={card}
                    className="rounded-2xl border border-border bg-white hover:border-accent-light hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    {/* Placeholder image area */}
                    <div className="h-48 bg-accent-bg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                          <Lock size={22} className="text-accent" />
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">Details coming soon</p>
                      </div>
                    </div>

                    <div className="p-7">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {cs.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full bg-accent-bg text-primary text-xs font-medium border border-accent-light/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{cs.service}</p>
                      <h3 className="text-lg font-bold text-primary mb-3">{cs.client}</h3>
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        {cs.result}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center text-muted-foreground text-sm mt-12"
              >
                More case studies being added. In the meantime,{" "}
                <Link to="/contact" className="text-accent font-medium hover:underline">
                  ask us directly about results for your industry.
                </Link>
              </motion.p>
            </div>
          </section>

          <CTA
            heading="Want Results Like These?"
            subheading="Let's talk about your brand and what we can do for your email program."
            secondaryLabel="View Services"
            secondaryHref="/services"
          />
        </main>

        <Footer />
      </div>
    </SEOHead>
  );
}
