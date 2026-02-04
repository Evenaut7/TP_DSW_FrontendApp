import hero from '@/assets/images/hero.jfif';
export default function HeroSection() {
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
          <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-extrabold tracking-tight drop-shadow-2xl">
            Discover
          </h1>
          <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-2xl font-light tracking-[0.2em] uppercase">
            ¿Adónde quisieras ir?
          </p>
        </div>
      </div>

      {/* Animated Arrow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <span className="material-symbols-outlined text-2xl md:text-3xl">keyboard_double_arrow_down</span>
      </div>
    </section>
  );
}
