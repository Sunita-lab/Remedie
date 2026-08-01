import { Users, Stethoscope, Building2, TrendingUp, ShieldCheck } from "lucide-react";

const Stats = () => {
  const stats = [
    { icon: Users, value: "1200+", label: "Patients Managed" },
    { icon: Stethoscope, value: "250+", label: "Doctors" },
    { icon: Building2, value: "50+", label: "Departments" },
    { icon: TrendingUp, value: "98%", label: "Appointment Efficiency" },
    { icon: ShieldCheck, value: "24/7", label: "System Availability" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-card border border-border rounded-2xl p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;