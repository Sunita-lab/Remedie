import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, HeartHandshake } from "lucide-react";

const CTABanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-7 h-7 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Ready to Elevate Your Hospital Experience?
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Join hospitals that trust Remedie to deliver better care.
            </p>
          </div>
        </div>

        <Link to="/register">
          <Button size="lg" className="whitespace-nowrap">
            Get Started Today <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTABanner;