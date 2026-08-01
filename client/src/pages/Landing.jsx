import LandingNavbar from "@/components/LandingNavbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import FlowOfCare from "@/components/landing/FlowOfCare";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <Hero />
        <Stats />
        <FlowOfCare />
        <Features />
        <Testimonials />
    </div>
  );
};

export default Landing;