import { UserCog, Calendar, Stethoscope, FlaskConical, Pill, Receipt, Package, BarChart3 } from "lucide-react";

const Features = () => {
  const features = [
    { icon: UserCog, label: "Patient Management" },
    { icon: Calendar, label: "Appointment Scheduling" },
    { icon: Stethoscope, label: "Doctor Management" },
    { icon: FlaskConical, label: "Medical Records" },
    { icon: Pill, label: "Prescriptions" },
    { icon: Receipt, label: "Billing & Invoicing" },
    { icon: Package, label: "Role-Based Access" },
    { icon: BarChart3, label: "Reports & Analytics" },
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-foreground">
          Everything You Need. <span className="text-primary">All in One Place.</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {features.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-xl p-5 flex flex-col items-center text-center gap-3 hover:shadow-md hover:border-primary/30 transition-all"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-foreground">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;