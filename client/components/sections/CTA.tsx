import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  heading?: string;
  subheading?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryHref?: string;
  secondaryHref?: string;
}

export default function CTA({
  heading = "Ready to Make Email Your Top Revenue Channel?",
  subheading = "Tell us about your brand and we'll show you what's possible.",
  primaryLabel = "Start the Conversation",
  secondaryLabel = "See Case Studies",
  primaryHref = "/contact",
  secondaryHref = "/case-studies",
}: CTAProps) {
  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent/10 rounded-full blur-2xl -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative container-wide text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto">
            {heading}
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">
            {subheading}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={primaryHref}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-primary font-bold rounded-full hover:opacity-90 transition-opacity"
            >
              {primaryLabel}
              <ArrowRight size={17} />
            </Link>
            <Link
              to={secondaryHref}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              {secondaryLabel}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
