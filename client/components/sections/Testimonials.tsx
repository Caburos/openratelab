import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Nika",
    role: "E-commerce founder",
    image: "/images/testimonial-nika.jpg",
    quote:
      "We were leaving money on the table with our email list. OpenRateLab rewrote our welcome flow and within 30 days it was generating more revenue than our entire previous email program combined.",
  },
  {
    name: "Teia",
    role: "DTC brand owner",
    image: "/images/testimonial-teia.jpg",
    quote:
      "The copy they write actually sounds like our brand — not like a template. Our open rates went up, our click rates went up, and most importantly our revenue from email went up. Can't ask for more than that.",
  },
  {
    name: "Viktor",
    role: "Growth director",
    image: "/images/testimonial-viktor.jpg",
    quote:
      "What sets them apart is they understand the full funnel. They don't just write emails — they think about where your customer is in the journey and what will move them. That's rare.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Testimonials() {
  return (
    <section className="section-padding bg-accent-bg">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Client Results</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            What Our Clients Say
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              className="bg-white rounded-2xl p-8 shadow-sm border border-accent-light/40 flex flex-col"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} className="text-accent fill-accent" />
                ))}
              </div>

              <p className="text-foreground/80 text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-primary">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
