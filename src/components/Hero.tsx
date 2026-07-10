import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Compass, Palmtree, Sun, Menu, X, User } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

const Hero = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Text flies over your head
      gsap.to(textRef.current, {
        y: -500,
        
        rotateX: 60,
        scale: 2,
        z: 800,
        ease: 'none',
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
        { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.8, stagger: 0.2, ease: 'power4.out', delay: 0.5, transformPerspective: 1500 }
      );
      
      gsap.fromTo(
        '.reveal-ui',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 1.5 }
      );
    }, containerRef);

    // Mouse Parallax for 3D effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;

      gsap.to(textRef.current, {
        rotateX: y * -10,
        rotateY: x * 10,
        x: x * 40,
        y: y * 40,
        duration: 1.2,
        ease: 'power2.out',
        transformPerspective: 1200,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-transparent perspective-[2000px]">
      
      <div className="h-screen w-full flex items-center justify-center transform-style-3d">
        {/* Header / Nav */}
        <header className="absolute top-0 left-0 w-full z-50 p-8 flex justify-between items-center reveal-ui">
          {/* Styled Reisenova Logo */}
          <div className="flex items-center gap-2 group cursor-pointer bg-white/90 dark:bg-transparent backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-lg dark:shadow-none border border-forest/20 dark:border-transparent transition-all duration-500 hover:bg-white dark:hover:bg-transparent">
            <div className="relative flex items-center justify-center h-10 w-12">
              <Palmtree size={32} className="text-forest dark:text-[#fdfbf7] absolute left-0 bottom-0 z-10 -rotate-12 group-hover:rotate-0 transition-all duration-500" />
              <Palmtree size={24} className="text-forest dark:text-[#fdfbf7] absolute right-2 bottom-1 z-10 rotate-12 group-hover:rotate-0 transition-all duration-500" />
              <Sun size={20} className="text-orange absolute bottom-2 left-4 z-0 fill-current group-hover:scale-125 transition-transform duration-700" />
            </div>
            <div className="flex flex-col">
              <span className="text-orange font-serif text-2xl tracking-[0.2em] uppercase font-bold italic leading-none group-hover:text-forest dark:group-hover:text-[#fdfbf7] transition-colors duration-500">
                Reisenova
              </span>
              <span className="text-forest dark:text-[#fdfbf7] text-[10px] tracking-[0.3em] font-medium uppercase mt-1 pl-1 transition-colors duration-500">
                Travel & Tours
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex gap-8 text-forest/90 dark:text-[#fdfbf7]/90 text-sm tracking-widest uppercase font-semibold transition-colors duration-500">
            <a href="#about" className="hover:text-orange transition-colors">About</a>
            <Link to="/destinations" className="hover:text-orange transition-colors">Destinations</Link>
            <Link to="/packages" className="hover:text-orange transition-colors">Packages</Link>
            <Link to="/hotels" className="hover:text-orange transition-colors">Hotels</Link>
            <Link to="/plan-trip" className="hover:text-orange transition-colors">Plan Trip</Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <DarkModeToggle />
            <Link to="/login" className="hidden md:flex items-center gap-2 text-[#fdfbf7] hover:text-orange transition-colors">
              <span className="text-sm uppercase tracking-wider font-semibold">Log In</span>
            </Link>
            <Link to="/profile" className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-[#fdfbf7]/20 text-[#fdfbf7] hover:border-orange hover:text-orange transition-colors">
              <User size={18} />
            </Link>
            <Link to="/plan-trip" className="hidden md:flex items-center gap-2 bg-orange text-[#fdfbf7] px-6 py-3 rounded-full hover:bg-forest hover:text-[#fdfbf7] dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-all shadow-lg hover:shadow-orange/30 group">
              <span className="text-sm uppercase tracking-wider font-semibold group-hover:translate-x-1 transition-transform">Book Now</span>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-forest dark:text-[#fdfbf7]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
              <Link to="/plan-trip" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors">Plan Trip</Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors">Log In</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors flex items-center gap-2"><User size={16} /> Profile</Link>
              <Link to="/plan-trip" onClick={() => setMobileMenuOpen(false)} className="mt-4 bg-orange text-[#fdfbf7] px-6 py-3 rounded-full hover:bg-forest dark:hover:bg-[#16201a] dark:hover:text-[#fdfbf7] transition-all text-center">
                Book Now
              </Link>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div ref={textRef} className="relative z-20 text-center px-4 flex flex-col items-center will-change-transform transform-style-3d pt-12 pointer-events-none">
          <div className="overflow-hidden mb-6" style={{ transform: 'translateZ(80px)' }}>
            <p className="reveal-text text-forest/90 dark:text-[#fdfbf7]/90 text-sm md:text-base uppercase tracking-[0.4em] font-bold block bg-white/40 dark:bg-[#0a0f0d]/40 border border-forest/10 dark:border-white/10 px-6 py-2 rounded-full backdrop-blur-md inline-block shadow-sm transition-colors duration-500">
              Your Ultimate Travel Partner
            </p>
          </div>
          <div className="overflow-hidden perspective-[1200px]" style={{ transform: 'translateZ(120px)' }}>
            <h1 className="reveal-text text-forest dark:text-[#fdfbf7] text-6xl md:text-[8rem] lg:text-[10rem] font-serif leading-[0.9] tracking-tighter drop-shadow-lg dark:drop-shadow-2xl inline-block mt-4 transition-colors duration-500">
              Explore <br />
              <span className="italic font-medium text-orange tracking-normal pr-8 drop-shadow-md">Wild</span>
              <br />
              <span className="text-5xl md:text-7xl lg:text-8xl mt-4 block text-forest/90 dark:text-[#fdfbf7]/90 transition-colors duration-500">Sri Lanka</span>
            </h1>
          </div>
          
          <div className="mt-20 reveal-ui pointer-events-auto" style={{ transform: 'translateZ(50px)' }}>
            <a href="#about" className="group flex items-center justify-center w-20 h-20 rounded-full border border-orange/40 backdrop-blur-md hover:bg-orange hover:text-[#fdfbf7] transition-all duration-700 text-orange transform hover:scale-110 shadow-xl bg-white/50 dark:bg-[#0a0f0d]/50">
              <Compass size={32} className="group-hover:rotate-90 transition-transform duration-700" />
            </a>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;
