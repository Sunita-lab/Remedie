import LandingNavbar from "@/components/LandingNavbar";
import Hero from "@/components/landing/Hero";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <Hero />
    </div>
  );
};

export default Landing;