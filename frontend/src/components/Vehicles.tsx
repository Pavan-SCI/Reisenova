import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Car, Settings, Briefcase } from 'lucide-react';

const formatPrice = (price: any) => {
  if (!price) return 'Contact Us';
  const str = String(price).trim();
  if (str.includes('$')) return str;
  if (/^\d/.test(str)) {
    return `$${str}`;
  }
  if (/^from\s+\d/i.test(str)) {
    return str.replace(/^from\s+/i, 'From $');
  }
  if (/[0-9]/.test(str)) {
    return `$${str}`;
  }
  return str;
};

const Vehicles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVehicles(data.slice(0, 3));
      })
      .catch(console.error);
  }, []);

  useLayoutEffect(() => {
    if (vehicles.length === 0) return;
    const ctx = gsap.context(() => {
      // ── Card entrance stagger (matching Luxury Stays style) ──
      gsap.fromTo(
        cardsRef.current,
        { y: 150, opacity: 0, rotateX: 25, z: -200, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          z: 0,
          scale: 1,
          stagger: 0.1,
          ease: 'power2.out',
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
  }, [vehicles]);

  return (
    <section id="vehicles" ref={containerRef} className="py-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden transition-colors duration-500">
      {/* Background subtle image */}
      <div className="absolute inset-0 opacity-5 dark:opacity-[0.03] pointer-events-none">
        <img src="https://images.unsplash.com/photo-1586523925763-8a3fc073a62d?q=80&w=2874&auto=format&fit=crop" alt="bg pattern" className="w-full h-full object-cover grayscale" />
      </div>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Centered Title — matching Hotels / Packages pattern */}
        <div className="text-center mb-24">
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Premium Fleet</p>
          <h2 className="text-6xl md:text-[5.5rem] font-serif mb-6 leading-none tracking-tight text-forest dark:text-[#fdfbf7] drop-shadow-sm">
            Rent A <span className="italic text-orange font-light">Car</span>
          </h2>
          <p className="text-forest/70 dark:text-[#fdfbf7]/80 font-light dark:font-normal text-xl max-w-xl mx-auto">
            Explore Sri Lanka at your own pace with our diverse fleet of luxury vehicles.
          </p>
        </div>

        {/* Cards Grid */}
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {vehicles.map((vehicle, idx) => (
              <div 
                key={vehicle.id || idx} 
                ref={el => cardsRef.current[idx] = el}
                onClick={() => navigate(`/vehicles/${vehicle.id || vehicle.name.toLowerCase().replace(/\s+/g, '-')}`)}
                className="group relative h-[600px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-shadow duration-500 bg-forest/5 dark:bg-[#fdfbf7]/5 border border-forest/10 dark:border-[#fdfbf7]/10 transform-gpu"
              >
                {/* Parallax clip container */}
                <div className="absolute inset-0 z-0">
                  {/* Full image */}
                  <img 
                    src={vehicle.images?.[0] || vehicle.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1400'} 
                    alt={vehicle.name} 
                    className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out" 
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Type badge */}
                <div className="absolute top-5 right-5 bg-[#fdfbf7]/90 dark:bg-[#0a0f0d]/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-forest dark:text-[#fdfbf7] shadow-lg z-20 border border-forest/5 dark:border-[#fdfbf7]/10">
                  {vehicle.type || 'Car'}
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 w-full p-8 backdrop-blur-md bg-black/30 border-t border-white/10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-20">
                  {/* Specs pills */}
                  <div className="flex gap-3 mb-4">
                    <span className="flex items-center gap-1.5 text-[#fdfbf7]/90 text-xs font-bold tracking-wider drop-shadow-md">
                      <Settings size={13} className="text-orange" /> Auto/Manual
                    </span>
                    <span className="flex items-center gap-1.5 text-[#fdfbf7]/90 text-xs font-bold tracking-wider drop-shadow-md">
                      <Car size={13} className="text-orange" /> {vehicle.seats || 4} Seats
                    </span>
                  </div>

                  <h3 className="text-4xl font-serif text-[#fdfbf7] mb-2 drop-shadow-md">{vehicle.name}</h3>
                  
                  {vehicle.withGuide !== false && (
                    <p className="text-[#fdfbf7]/80 font-medium text-sm uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase size={13} className="text-orange" /> Chauffeur Guide
                    </p>
                  )}

                  {/* Hover-reveal row */}
                  <div className="mt-6 overflow-hidden h-0 group-hover:h-12 transition-all duration-500 flex items-center justify-between">
                    <span className="text-orange font-bold text-xl drop-shadow-md">{formatPrice(vehicle.price)}</span>
                    <span className="text-sm font-semibold tracking-widest uppercase text-[#fdfbf7] hover:text-orange transition-colors flex items-center gap-2">
                      View Details
                      <div className="w-6 h-px bg-current"></div>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-forest/50 dark:text-[#fdfbf7]/50 border border-forest/10 dark:border-[#fdfbf7]/10 rounded-2xl bg-[#fdfbf7]/50 dark:bg-[#0a0f0d]/50 backdrop-blur-md mb-20">
            <p className="text-lg font-light dark:font-normal">No vehicles available at the moment. Please check back later.</p>
          </div>
        )}

        {/* View All Button — matching Hotels / Packages pattern */}
        <div className="text-center relative z-10">
          <Link to="/vehicles" className="inline-flex items-center gap-4 bg-forest dark:bg-[#1a251e] text-sand dark:text-[#fdfbf7] px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-orange transition-colors duration-300 shadow-xl group">
            Explore All Vehicles
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Vehicles;
