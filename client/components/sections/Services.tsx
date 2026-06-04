import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import { getIcon, ICON_LIST } from "@/lib/icons";

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  icon: string;
}

interface ServicesProps {
  heading: string;
  subheading: string;
  services: Service[];
  customSolutionsText?: string;
  customSolutionsButtonText?: string;
}

export default function Services({ heading, subheading, services, customSolutionsText, customSolutionsButtonText }: ServicesProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            {heading}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subheading}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="p-8 bg-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100"
            >
              {/* Icon */}
              <div className="mb-4 p-3 bg-blue-600 rounded-lg w-fit">
                {(() => {
                  const IconComponent = getIcon(service.icon);
                  return IconComponent ? (
                    <IconComponent className="w-8 h-8 text-white" />
                  ) : (
                    <div className="w-8 h-8" />
                  );
                })()}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4 text-sm">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 font-bold mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Price and Learn More - Same Line */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{service.price}</p>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Custom Solutions CTA */}
        {customSolutionsText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16 pt-12"
          >
            <p className="text-lg text-gray-600 mb-6">
              {customSolutionsText}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              {customSolutionsButtonText || "Discuss Your Project"}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
