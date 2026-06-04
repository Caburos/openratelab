import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Email Copywriting",
    description:
      "Klaviyo campaigns and flows written to convert. Welcome series, abandon sequences, post-purchase, winbacks — every touchpoint written with intent.",
    image: "/images/service-email.png",
    id: "email",
  },
  {
    title: "Ad Messaging",
    description:
      "Meta, Google, and direct response ad copy that stops the scroll and drives qualified traffic. Built on the same conversion principles as our email work.",
    image: "/images/service-ads.png",
    id: "ads",
  },
  {
    title: "Automated Email Systems",
    description:
      "We build and write complete Klaviyo flow architecture — not just copy, but strategy, segmentation logic, and A/B testing frameworks.",
    image: "/images/service-website.png",
    id: "automation",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function ServicesOverview() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">What We Do</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Copy That Earns Its Place in the Inbox
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Three focused services. All built around one goal: more revenue from every email you send.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {services.map((svc) => (
            <motion.div
              key={svc.id}
              variants={card}
              className="group rounded-2xl border border-border bg-white hover:border-accent-light hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="h-48 bg-accent-bg flex items-center justify-center p-8">
                <img
                  src={svc.image}
                  alt={svc.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-7">
                <h3 className="text-lg font-bold text-primary mb-3">{svc.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{svc.description}</p>
                <Link
                  to={`/services#${svc.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:gap-3 transition-all"
                >
                  Learn more <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Full services CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            View all services <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
