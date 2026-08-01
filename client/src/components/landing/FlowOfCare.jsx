import { Link } from "react-router-dom";
import { UserPlus, Stethoscope, Activity, FlaskConical, Pill, HeartPulse } from "lucide-react";

const FlowOfCare = () => {
  const steps = [
    { icon: UserPlus, label: "Registration" },
    { icon: Stethoscope, label: "Consultation" },
    { icon: Activity, label: "Diagnosis" },
    { icon: FlaskConical, label: "Laboratory" },
    { icon: Pill, label: "Treatment" },
    { icon: HeartPulse, label: "Recovery" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold text-secondary uppercase tracking-wide">
          The Flow of Care
        </span>
        <h2 className="text-3xl font-bold text-foreground mt-2">
          One Journey. <span className="text-primary">Connected Care.</span>
        </h2>
        <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
          From the first step to full recovery, Remedie connects every
          touchpoint in the patient journey.
        </p>
        <Link to="/register" className="inline-block text-primary text-sm font-medium mt-4 hover:underline">
          See How It Works →
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-2">
        {steps.map(({ icon: Icon, label }, idx) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-2 w-24">
              <div className="w-14 h-14 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <p className="text-xs text-muted-foreground text-center">{label}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden sm:block w-10 h-px bg-border mx-1 mb-6" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlowOfCare;