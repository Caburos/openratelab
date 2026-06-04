import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ContactProps {
  heading: string;
  subheading: string;
  email: string;
  phone?: string;
  description?: string;
  projectTypes?: string[];
  budgetRanges?: string[];
}

export default function Contact({
  heading,
  subheading,
  email,
  phone,
  description,
  projectTypes = [
    "E-commerce Development",
    "Brand & Package Design",
    "Website Maintenance",
    "SEO & Content Optimization",
    "Mobile App Development",
    "Custom Solution",
  ],
  budgetRanges = [
    "$1,000 - $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000+",
  ],
}: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    projectType: "",
    budget: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your message has been sent. I'll get back to you soon!",
        });
        setFormData({ name: "", email: "", message: "", projectType: "", budget: "" });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Center - Main Heading and Subheading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            {heading}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Get In Touch
            </h3>

            <p className="text-gray-600 mb-12 leading-relaxed">
              I'm always excited to work on new projects and help businesses grow. Feel free to reach out through any of the channels below.
            </p>

            <div className="space-y-6">
              {/* Email */}
              <motion.a
                href={`mailto:${email}`}
                whileHover={{ x: 8 }}
                className="flex gap-4 items-start p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Mail className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">{email}</p>
                  <p className="text-sm text-gray-400 mt-1">Response time: Within 24 hours</p>
                </div>
              </motion.a>

              {/* Phone */}
              {phone && (
                <motion.a
                  href={`tel:${phone}`}
                  whileHover={{ x: 8 }}
                  className="flex gap-4 items-start p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Phone className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">{phone}</p>
                    <p className="text-sm text-gray-400 mt-1">Timezone: CET (UTC+1)</p>
                  </div>
                </motion.a>
              )}

              {/* Location */}
              <motion.div
                whileHover={{ x: 8 }}
                className="flex gap-4 items-start p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors"
              >
                <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-gray-600">Europe</p>
                  <p className="text-sm text-gray-400 mt-1">Available for remote work worldwide</p>
                </div>
              </motion.div>

              {/* Availability Section */}
              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 border-2 border-green-300 bg-green-50 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <p className="font-semibold text-green-600">Available for new projects</p>
                </div>
                <p className="text-sm text-gray-600">
                  I have availability for new projects starting next month. Book your spot today!
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Contact Form with Dropdowns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-100 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Send Me a Message
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="your@email.com"
              />
            </div>

            {/* Project Type Dropdown */}
            <div>
              <label htmlFor="projectType" className="block text-sm font-semibold text-gray-900 mb-2">
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              >
                <option value="">Select a service</option>
                {projectTypes.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Range Dropdown */}
            <div>
              <label htmlFor="budget" className="block text-sm font-semibold text-gray-900 mb-2">
                Budget Range
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              >
                <option value="">Select budget range</option>
                {budgetRanges.map((range, idx) => (
                  <option key={idx} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
