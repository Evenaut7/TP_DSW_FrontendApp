import Navbar from '@/components/layout/Navbar/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CityGrid from '@/components/home/CityGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Navbar floats over content, no padding needed */}
      <div>
        <HeroSection />
        <CityGrid />
        <Footer />
      </div>
    </div>
  );
}
