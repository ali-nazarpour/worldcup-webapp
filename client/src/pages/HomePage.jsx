import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { MatchDashboard } from '@/components/home/MatchDashboard';
import { ResultsSection } from '@/components/home/ResultsSection';
import { PredictionTracking } from '@/components/predictions/PredictionTracking';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <MatchDashboard />
        <ResultsSection />
        <PredictionTracking />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
