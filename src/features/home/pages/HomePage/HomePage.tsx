import Navbar from '@/components/layout/Navbar/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CityGrid from '@/components/home/CityGrid';
import { useState } from 'react';
import AuthModal from '@/features/auth/components/AuthModal/AuthModal';
import RegisterModal from '@/features/auth/components/RegisterModal/RegisterModal';
import WelcomeModal from '@/features/auth/components/WelcomeModal/WelcomeModal';
import { useUser } from '@/features/user';

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const { refreshUser } = useUser();

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Navbar floats over content, no padding needed */}
      <div>
        <HeroSection onLoginClick={() => setShowAuth(true)} />
        <CityGrid />
        <Footer />
      </div>

      {/* Authentication Modals */}
      <AuthModal
        show={showAuth}
        onClose={() => setShowAuth(false)}
        onOpenRegister={() => {
          setShowAuth(false);
          setShowRegister(true);
        }}
        onSuccess={async (name: string) => {
          await refreshUser();
          setWelcomeName(name);
          setShowWelcome(true);
          setShowAuth(false);
        }}
      />

      <RegisterModal
        show={showRegister}
        onClose={() => setShowRegister(false)}
        onBackToLogin={() => {
          setShowRegister(false);
          setShowAuth(true);
        }}
        onSuccess={async (name: string) => {
          await refreshUser();
          setWelcomeName(name);
          setShowWelcome(true);
          setShowRegister(false);
        }}
      />

      <WelcomeModal
        show={showWelcome}
        onClose={() => setShowWelcome(false)}
        userName={welcomeName}
      />
    </div>
  );
}
