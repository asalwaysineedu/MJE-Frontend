import LandingLayout from "@/landing/ui/layout/LandingLayout";
import HeroSection from "@/landing/ui/components/sections/HeroSection";

export default function LandingPage() {
  return (
    <LandingLayout height={4750}>
      <HeroSection />
    </LandingLayout>
  );
}
