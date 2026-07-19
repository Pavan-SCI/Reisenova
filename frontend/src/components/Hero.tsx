import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Compass, Menu, X, User } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import ReisenovaLogo from './ReisenovaLogo';

const Hero = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isAdminLoggedIn') === 'true' || localStorage.getItem('isUserLoggedIn') === 'true');
  }, []);

  useLayoutEffect(() => {
    let ctx: gsap.Context;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Text flies over your head
        gsap.to(textRef.current, {
          y: -500,
          rotateX: 60,
          scale: 2,
          z: 800,
          ease: 'none',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        // Initial reveal animation
        gsap.fromTo(
          '.reveal-text',
          { y: 150, opacity: 0, rotateX: 30, scale: 0.9 },
          { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.8, stagger: 0.2, ease: 'power4.out', delay: 0.2, transformPerspective: 1500, clearProps: 'all' }
        );
        
        gsap.fromTo(
          '.reveal-ui',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.8, clearProps: 'all' }
        );
      }, containerRef);
    }, 150);

    // Mouse Parallax for 3D effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !parallaxRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;

      gsap.to(parallaxRef.current, {
        rotateX: y * -10,
        rotateY: x * 10,
        x: x * 40,
        y: y * 40,
        duration: 1.2,
        ease: 'power2.out',
        transformPerspective: 1200,
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-transparent perspective-[2000px]">
      <div className="h-screen w-full flex items-center justify-center transform-style-3d">
        {/* Header / Nav */}
        <header className="absolute top-0 left-0 w-full z-50 pt-6 pb-12 px-4 md:px-8 flex justify-between items-center reveal-ui">
          {/* Completely transparent background to ensure the natural leaves behind remain sharp and clear */}
          <div className="absolute inset-0 transition-all duration-500 pointer-events-none -z-10 bg-transparent" />
          {/* Styled Reisenova Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center group cursor-pointer bg-transparent px-5 py-2.5 rounded-2xl transition-all duration-500 hover:bg-white/10 dark:hover:bg-white/5 -mt-6"
          >
            <ReisenovaLogo 
              iconSize="md" 
              textColorClass="text-black" 
              palmTreeColorClass="text-black" 
              hasShadow={false}
            />
          </div>

          <nav className="hidden lg:flex gap-8 text-forest dark:text-[#fdfbf7] text-sm tracking-widest uppercase font-semibold transition-colors duration-500 -mt-6">
            <a href="#about" className="hero-nav-link hover:text-orange transition-colors">About</a>
            <Link to="/destinations" className="hero-nav-link hover:text-orange transition-colors">Destinations</Link>
            <Link to="/packages" className="hero-nav-link hover:text-orange transition-colors">Packages</Link>
            <Link to="/hotels" className="hero-nav-link hover:text-orange transition-colors">Hotels</Link>
            <Link to="/vehicles" className="hero-nav-link hover:text-orange transition-colors">Vehicles</Link>
            <Link to="/plan-trip" className="hero-nav-link hover:text-orange transition-colors">Plan Trip</Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-4 -mt-6">
            <DarkModeToggle />
            {isLoggedIn ? (
              <button 
                onClick={() => { 
                  const isDarkMode = localStorage.getItem('darkMode');
                  localStorage.clear();
                  if (isDarkMode) localStorage.setItem('darkMode', isDarkMode);
                  setIsLoggedIn(false); 
                  window.location.reload(); 
                }} 
                className="hidden md:flex items-center gap-2 text-white dark:text-[#fdfbf7] hover:text-orange dark:hover:text-orange hero-nav-link transition-colors duration-500"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
              >
                <span className="text-sm uppercase tracking-wider font-semibold">Log Out</span>
              </button>
            ) : (
              <Link 
                to="/login" 
                className="hidden md:flex items-center gap-2 text-white dark:text-[#fdfbf7] hover:text-orange dark:hover:text-orange hero-nav-link transition-colors duration-500"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
              >
                <span className="text-sm uppercase tracking-wider font-semibold">Log In</span>
              </Link>
            )}
            {isLoggedIn && (
              <Link to="/profile" className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-white/40 dark:border-[#fdfbf7]/40 bg-black/20 dark:bg-black/30 text-white dark:text-[#fdfbf7] hover:border-orange dark:hover:border-orange hover:text-orange dark:hover:text-orange transition-all duration-500 shadow-lg drop-shadow-md">
                <User size={18} />
              </Link>
            )}
            <Link to="/plan-trip" className="hidden md:flex items-center gap-2 bg-orange text-[#fdfbf7] px-6 py-3 rounded-full hover:bg-white hover:text-forest dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-all duration-500 shadow-lg hover:shadow-orange/30 group">
              <span className="text-sm uppercase tracking-wider font-semibold group-hover:translate-x-1 transition-transform">Book Now</span>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2.5 text-forest dark:text-[#fdfbf7] bg-forest/5 dark:bg-black/35 backdrop-blur-sm rounded-full border border-forest/15 dark:border-white/20 transition-all duration-500 shadow-lg drop-shadow-md hover:scale-105"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white/95 dark:bg-[#0a0f0d]/95 backdrop-blur-xl border-b border-forest/10 dark:border-white/10 z-40 lg:hidden shadow-xl">
            <nav className="flex flex-col p-6 gap-6 text-forest dark:text-[#fdfbf7] text-sm tracking-widest uppercase font-semibold">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors">About</a>
              <Link to="/destinations" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors">Destinations</Link>
              <Link to="/packages" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors">Packages</Link>
              <Link to="/hotels" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors">Hotels</Link>
              <Link to="/vehicles" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors">Vehicles</Link>
              <Link to="/plan-trip" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors">Plan Trip</Link>
              {isLoggedIn ? (
                <button 
                  onClick={() => { 
                    const isDarkMode = localStorage.getItem('darkMode');
                    localStorage.clear();
                    if (isDarkMode) localStorage.setItem('darkMode', isDarkMode);
                    setIsLoggedIn(false); 
                    setMobileMenuOpen(false);
                    window.location.reload(); 
                  }} 
                  className="hover:text-orange transition-colors text-left"
                >
                  Log Out
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors">Log In</Link>
              )}
              {isLoggedIn && (
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors flex items-center gap-2"><User size={16} /> Profile</Link>
              )}
              <Link to="/plan-trip" onClick={() => setMobileMenuOpen(false)} className="mt-4 bg-orange text-[#fdfbf7] px-6 py-3 rounded-full hover:bg-forest dark:hover:bg-[#16201a] dark:hover:text-[#fdfbf7] transition-all text-center">
                Book Now
              </Link>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div ref={parallaxRef} className="relative z-20 text-center px-4 flex flex-col items-center will-change-transform transform-style-3d pt-40 mt-12 md:mt-16 lg:mt-8 md:pt-32 pointer-events-none">
          <div ref={textRef} className="flex flex-col items-center transform-style-3d w-full">
            <div className="overflow-hidden mb-6" style={{ transform: 'translateZ(80px)' }}>
              <p className="reveal-text text-forest/90 dark:text-[#fdfbf7]/90 text-sm md:text-base uppercase tracking-[0.4em] font-bold block bg-white/40 dark:bg-[#0a0f0d]/40 border border-forest/10 dark:border-white/10 px-6 py-2 rounded-full backdrop-blur-md inline-block shadow-sm transition-colors duration-500">
                Your Ultimate Travel Partner
              </p>
            </div>
            <div className="overflow-hidden perspective-[1200px]" style={{ transform: 'translateZ(120px)' }}>
              <h1 className="reveal-text text-forest dark:text-[#fdfbf7] text-5xl md:text-7xl lg:text-[10rem] font-serif leading-[0.9] tracking-tighter drop-shadow-lg dark:drop-shadow-2xl inline-block mt-4 transition-colors duration-500">
                Explore <br />
                <span className="italic font-medium text-orange tracking-normal pr-8 drop-shadow-md">Wild</span>
                <br />
                <span className="text-4xl md:text-6xl lg:text-8xl mt-4 block text-forest/90 dark:text-[#fdfbf7]/90 transition-colors duration-500">Sri Lanka</span>
              </h1>
            </div>
            
            <div className="mt-20 reveal-ui pointer-events-auto" style={{ transform: 'translateZ(50px)' }}>
              <a href="#about" className="group flex items-center justify-center w-20 h-20 rounded-full border border-orange/40 backdrop-blur-md hover:bg-orange hover:text-[#fdfbf7] transition-all duration-700 text-orange transform hover:scale-110 shadow-xl bg-white/50 dark:bg-[#0a0f0d]/50">
                <Compass size={32} className="group-hover:rotate-90 transition-transform duration-700" />
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;
