import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, HeartPulse } from "lucide-react";
import logo from "@/assets/logo.png";

const LandingNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Modules", href: "#modules" },
    { label: "How It Works", href: "#how-it-works" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
  <img src={logo} alt="Remedie" className="w-12 h-9" />
  <div></div>
          <div>
            <p className="font-[var(--font-logo)] text-lg font-semibold text-foreground leading-none">
              Remedie
            </p>
            <p className="text-[10px] text-muted-foreground">Hospital Management System</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Login
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-border pt-4">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-sm text-muted-foreground">
              {link.label}
            </a>
          ))}
          <Link to="/login" className="text-sm font-medium text-foreground">Login</Link>
          <Link to="/register"><Button size="sm" className="w-full">Get Started</Button></Link>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;