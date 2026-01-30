import Navbar from '@/components/layout/Navbar/Navbar';
import HeroSection from '@/components/home/HeroSection';
import CityGrid from '@/components/home/CityGrid';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CityGrid />
    </>
  );
}
