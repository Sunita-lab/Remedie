import LandingNavbar from "@/components/LandingNavbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import FlowOfCare from "@/components/landing/FlowOfCare";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <Hero />
        <Stats />
        <FlowOfCare />
        <Features />
        <Testimonials />
        <CTABanner />
      <Footer />
    </div>
  );
};

export default Landing;