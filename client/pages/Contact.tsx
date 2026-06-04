import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const services = [
  "Email Copywriting (campaigns & flows)",
  "Automated Email Systems (Klaviyo setup)",
  "Ad Messaging (Meta / Google)",
  "All of the above",
  "Not sure yet — let's talk",
];

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact OpenRateLab",
  url: "https://openratelab.com/contact",
  description: "Get in touch with OpenRateLab to discuss your email marketing project.",
  mainEntity: {
    "@type": "Organization",
    name: "OpenRateLab",
    email: "uros@openratelab.com",
    url: "https://openratelab.com",
  },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSent(true);
        setFormData({ name: "", email: "", service: "", message: "" });
      } else {
        toast.error("Something went wrong. Please email us directly.");
      }
    } catch {
      toast.error("Network error. Please email us directly at uros@openratelab.com");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SEOHead
      title="Contact | OpenRateLab — Let's Talk Email"
      description="Ready to make email your top revenue channel? Get in touch with OpenRateLab and tell us about your brand."
      canonical="https://openratelab.com/contact"
      schema={contactSchema}
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
                <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">Get In Touch</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
                  Let's Talk About Your Email Program
                </h1>
                <p className="text-white/70 text-lg leading-relaxed">
                  Tell us where you are and what you're trying to fix. We'll respond within 24 hours.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Form + Info */}
          <section className="section-padding bg-white">
            <div className="container-wide">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                {/* Left: info */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-2xl font-bold text-primary mb-6">What Happens Next</h2>

                  <div className="space-y-6 mb-10">
                    {[
                      {
                        step: "1",
                        title: "You fill in the form",
                        body: "Tell us about your brand, your current email setup, and what you're trying to achieve.",
                      },
                      {
                        step: "2",
                        title: "We review and respond",
                        body: "We'll come back to you within 24 hours with a clear view of how we can help — or whether we're the right fit.",
                      },
                      {
                        step: "3",
                        title: "We scope the work",
                        body: "If it's a match, we'll put together a proposal with a clear scope, timeline, and investment.",
                      },
                    ].map((s) => (
                      <div key={s.step} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-accent/20 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                          {s.step}
                        </div>
                        <div>
                          <p className="font-semibold text-primary mb-1">{s.title}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-accent-bg border border-accent-light/60 p-6">
                    <p className="font-semibold text-primary mb-2">Prefer to email directly?</p>
                    <a
                      href="mailto:uros@openratelab.com"
                      className="inline-flex items-center gap-2 text-accent font-semibold hover:opacity-80 transition-opacity"
                    >
                      <Mail size={16} />
                      uros@openratelab.com
                    </a>
                    <p className="text-xs text-muted-foreground mt-2">Response within 24 hours on business days.</p>
                  </div>
                </motion.div>

                {/* Right: form */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {sent ? (
                    <div className="flex flex-col items-center justify-center text-center h-full py-16">
                      <CheckCircle className="text-accent w-16 h-16 mb-6" />
                      <h3 className="text-2xl font-bold text-primary mb-3">Message Sent</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Thanks for reaching out. We'll be back in touch within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                          Your name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Jane Smith"
                          className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                          Email address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="jane@yourbrand.com"
                          className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white"
                        />
                      </div>

                      <div>
                        <label htmlFor="service" className="block text-sm font-semibold text-foreground mb-2">
                          What are you looking for?
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white"
                        >
                          <option value="">Select a service</option>
                          {services.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                          Tell us about your brand
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          placeholder="What's your brand, what platform are you on, what's working and what isn't?"
                          className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white resize-none"
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <Send size={17} />
                        {submitting ? "Sending…" : "Send Message"}
                      </motion.button>
                    </form>
                  )}
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </SEOHead>
  );
}
