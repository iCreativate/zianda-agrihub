import { HomeHero } from "@/components/marketing/home-hero";
import { HomeNav } from "@/components/marketing/home-nav";
import {
  CropsSection,
  FarmMovingSection,
  FarmOneViewSection,
  FinalCtaSection,
  HomeFooter,
  FarmerSection,
  IntelligenceSection,
  LivestockSection,
  MarketplaceSection,
  QrSection,
  TrustStrip
} from "@/components/marketing/home-sections";

export function HomeExperience() {
  return (
    <main className="home-page bg-ivory text-ink">
      <HomeNav />
      <HomeHero />
      <TrustStrip />
      <FarmOneViewSection />
      <LivestockSection />
      <CropsSection />
      <FarmMovingSection />
      <QrSection />
      <IntelligenceSection />
      <FarmerSection />
      <MarketplaceSection />
      <FinalCtaSection />
      <HomeFooter />
    </main>
  );
}
