import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: "40%+", label: "Of client revenue driven by email", prefix: "" },
  { value: "60%+", label: "Of that from automated flows", prefix: "" },
  { value: "$X", label: "Average revenue per campaign send", prefix: "" },
  { value: "Xx", label: "Conversion rate lift vs. control", prefix: "" },
];

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-black text-accent mb-3">
        {stat.value}
      </div>
      <p className="text-white/70 text-sm leading-snug max-w-[160px] mx-auto">
        {stat.label}
      </p>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="section-padding bg-primary">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">By The Numbers</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Email Doesn't Just Support Revenue — It Creates It
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/30 text-xs mt-12"
        >
          * Figures are placeholders — update with real client data before publishing.
        </motion.p>
      </div>
    </section>
  );
}
