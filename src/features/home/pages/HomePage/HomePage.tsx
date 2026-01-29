import Navbar from '@/components/layout/Navbar/Navbar';
import HeroSection from '@/components/home/HeroSection';
import CityGrid from '@/components/home/CityGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <HeroSection />
      <CityGrid />
    </div>
  );
}
