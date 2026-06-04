import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import ServicesOverview from "@/components/sections/ServicesOverview";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <SEOHead
      title="OpenRateLab | Email Marketing & Klaviyo Copywriting Agency"
      description="OpenRateLab writes email copy that drives revenue. We specialise in Klaviyo flows, email campaigns, and ad messaging for e-commerce and DTC brands."
      canonical="https://openratelab.com"
    >
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Hero />
          <ServicesOverview />
          <Stats />
          <Testimonials />
          <CTA />
        </main>
        <Footer />
      </div>
    </SEOHead>
  );
}
