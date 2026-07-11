import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';

const TripPlanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.planner-reveal',
        { y: 150, opacity: 0, rotateX: -20, z: -300, scale: 0.9 },
        {
          y: 0, opacity: 1,
          
          rotateX: 0,
          z: 0,
          scale: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'center center',
            scrub: 1.5,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="planner" ref={containerRef} className="py-32 bg-transparent text-sand dark:text-[#fdfbf7] relative overflow-hidden perspective-[1200px]">
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1544079868-87422f281e05?q=80&w=2864&auto=format&fit=crop')] bg-cover bg-center pointer-events-none" />
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-t from-black dark:from-[#060a08] to-transparent pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="planner-reveal max-w-xl">
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Let's Create Your Journey</p>
          <h2 className="text-5xl md:text-7xl font-serif text-[#fdfbf7] mb-6 leading-tight drop-shadow-md">
            Start Planning <br />
            <span className="italic text-orange font-light">Your Trip</span>
          </h2>
          <p className="text-[#fdfbf7]/70 font-light text-lg mb-8">
            Tell us about your dream vacation and our local experts will craft a personalized itinerary just for you.
          </p>
          <Link to="/plan-trip" className="inline-flex items-center gap-4 bg-orange text-[#fdfbf7] px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#fdfbf7] hover:text-forest dark:text-[#fdfbf7] dark:hover:bg-[#16201a] dark:hover:text-[#fdfbf7] transition-colors duration-300 shadow-xl group">
            Plan Your Trip
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        
        <div className="planner-reveal hidden md:block">
           <div className="relative w-72 h-72 rounded-full border border-white/20 flex items-center justify-center animate-[spin_30s_linear_infinite]">
             <div className="absolute inset-4 rounded-full border border-dashed border-white/30"></div>
             <div className="absolute inset-8 rounded-full border border-orange/40"></div>
             <div className="w-4 h-4 bg-orange rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default TripPlanner;
