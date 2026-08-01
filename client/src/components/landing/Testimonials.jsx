import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "Remedie has transformed the way we manage our hospital. It's intuitive, reliable, and has improved efficiency across departments.",
      name: "Dr. Priya Sharma",
      role: "Medical Director, CityCare Hospital",
      initials: "PS",
      color: "bg-primary/10 text-primary",
    },
    {
      quote:
        "The system is easy to use and the support team is amazing. Our patients are happier and our processes are smoother than ever.",
      name: "Mr. Sanjay Verma",
      role: "Administrator, Green Valley Hospital",
      initials: "SV",
      color: "bg-secondary/10 text-secondary",
    },
    {
      quote:
        "Comprehensive, secure, and feature-rich HMS. Remedie is the backbone of our daily hospital operations.",
      name: "Dr. Rahul Mehta",
      role: "Head of Operations, HealthPlus Clinic",
      initials: "RM",
      color: "bg-accent/10 text-accent",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-foreground text-center mb-12">
        Trusted by <span className="text-primary">Healthcare Professionals</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map(({ quote, name, role, initials, color }) => (
          <div key={name} className="bg-card border border-border rounded-xl p-6">
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              "{quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${color}`}>
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;