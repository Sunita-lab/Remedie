import { HeartPulse, Share2, Link2, MessageCircle } from "lucide-react";

const Footer = () => {
  const columns = [
    {
      title: "Product",
      links: ["Features", "Modules", "Pricing"],
    },
    {
      title: "Solutions",
      links: ["Hospitals", "Clinics", "Laboratories"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Contact Us"],
    },
  ];

  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <p className="font-[var(--font-logo)] font-semibold text-foreground">Remedie</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Simplifying operations. Enhancing care. Empowering better health for all.
          </p>
            <div className="flex items-center gap-3 mt-4">
  <Share2 className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
  <Link2 className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
  <MessageCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
</div>
        </div>

        {columns.map(({ title, links }) => (
          <div key={title}>
            <p className="text-sm font-semibold text-foreground mb-3">{title}</p>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <p className="max-w-7xl mx-auto px-6 py-4 text-xs text-muted-foreground text-center">
          © 2026 Remedie. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;