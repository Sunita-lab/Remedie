import LandingNavbar from "@/components/LandingNavbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import FlowOfCare from "@/components/landing/FlowOfCare";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <Hero />
        <Stats />
        <FlowOfCare />
    </div>
  );
};

export default Landing;