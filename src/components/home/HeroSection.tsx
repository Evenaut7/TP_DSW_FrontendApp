import hero from '@/assets/images/hero.jfif';
import { useUser } from '@/features/user';
import '@/styles/homepage.css';

interface HeroSectionProps {
  onLoginClick?: () => void;
}

export default function HeroSection({ onLoginClick }: HeroSectionProps) {
  const { user } = useUser();

  return (
    <section className="relative w-full h-[calc(100vh-4rem)] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Atmospheric travel landscape"
          className="w-full h-full object-cover"
          src={hero}
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 md:space-y-8 px-6">
        <div className="space-y-2">
          <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-9xl">
            Discover
          </h1>
          <p className="hero-subtitle text-sm sm:text-base md:text-lg lg:text-2xl">
            ¿Adónde quisieras ir?
          </p>
        </div>

        {/* CTA Button for Non-Authenticated Users */}
        {!user && onLoginClick && (
          <div className="pt-4">
            <button
              onClick={onLoginClick}
              className="loginButton px-8 py-4 text-lg rounded-xl shadow-2xl"
            >
              ¡Comienza tu aventura!
            </button>
          </div>
        )}
      </div>

      {/* Animated Arrow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <span className="material-symbols-outlined text-2xl md:text-3xl">keyboard_double_arrow_down</span>
      </div>
    </section>
  );
}
