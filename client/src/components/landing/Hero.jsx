import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Headphones, Cloud } from "lucide-react";
import heroImage from "@/assets/hero-illustration.png";

const Hero = () => {
  const trustBadges = [
    { icon: ShieldCheck, label: "Secure & Compliant" },
    { icon: Headphones, label: "24/7 Support" },
    { icon: Cloud, label: "Scalable & Reliable" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Layer 2 - Blue Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 78% 45%, rgba(59,130,246,0.10) 0%, rgba(59,130,246,0.04) 35%, transparent 70%)",
        }}
      />
      {/* Layer 3 - Teal Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 72% 60%, rgba(20,184,166,0.07) 0%, transparent 65%)",
        }}
      />
      {/* Layer 4 - Medical Pattern (subtle dot grid) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(37,99,235,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.03,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-6 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-6">
            All-in-One Hospital Management System
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            Because Every Patient Matters.{" "}
            <span className="text-primary">Care Flows Seamlessly.</span>
          </h1>

          <p className="text-muted-foreground mt-5 text-base leading-relaxed">
            Remedie simplifies hospital operations, connects every department, and
            empowers healthcare professionals to deliver exceptional care.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Remedie <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 mt-10">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="w-4 h-4 text-secondary" strokeWidth={1.5} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-visible">
          <img src={heroImage} alt="Remedie hospital ecosystem" className="w-full h-auto scale-150" />
        </div>
      </div>
    </section>
  );
};

export default Hero;