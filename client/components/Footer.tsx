import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <img
              src="/images/logo.png"
              alt="OpenRateLab"
              className="h-8 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              We write email copy that turns subscribers into revenue. Klaviyo flows, campaigns, and ad messaging for DTC brands that want email to pull its weight.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Services</h4>
            <ul className="space-y-3">
              {[
                ["Email Copywriting", "/services#email"],
                ["Ad Messaging", "/services#ads"],
                ["Automated Email Systems", "/services#automation"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                ["Case Studies", "/case-studies"],
                ["About", "/about"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="mailto:uros@openratelab.com"
                  className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                >
                  <Mail size={14} />
                  uros@openratelab.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {year} OpenRateLab. All rights reserved.
          </p>
          <a href="/sitemap.xml" className="text-white/30 text-xs hover:text-white/50 transition-colors">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}
