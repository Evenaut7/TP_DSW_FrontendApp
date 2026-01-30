import Navbar from '@/components/layout/Navbar/Navbar';
import HeroSection from '@/components/home/HeroSection';
import CityGrid from '@/components/home/CityGrid';

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <HeroSection />
      <div className="relative" style={{ marginTop: '100vh' }}>
        <CityGrid />
      </div>
    </div>
  );
}
