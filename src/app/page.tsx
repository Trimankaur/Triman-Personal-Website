import HeroSection from "@/components/home/HeroSection";
import QuoteSection from "@/components/home/QuoteSection";
import ActivityGraph from "@/components/home/ActivityGraph";
import RecentLearnings from "@/components/home/RecentLearnings";
import CuriositiesSection from "@/components/home/CuriositiesSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ActivityGraph />
      <QuoteSection />
      <RecentLearnings />
      <CuriositiesSection />
    </div>
  );
}
