import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';

const destinations = [
  { name: 'Sigiriya', desc: 'The Ancient Rock Fortress', img: 'https://images.unsplash.com/photo-1588258524451-24905d53a992?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Ella', desc: 'Misty Mountains & Tea', img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Mirissa', desc: 'Golden Sands & Whales', img: 'https://images.unsplash.com/photo-1579685655767-f3c5b967d26b?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Galle', desc: 'Historic Dutch Fort', img: 'https://images.unsplash.com/photo-1586523925763-8a3fc073a62d?q=80&w=1000&auto=format&fit=crop' },
];

const Destinations = () => {
  const [fetchedDestinations, setFetchedDestinations] = React.useState<any[]>([]);
  useEffect(() => {
    fetch('/api/destinations').then(res => res.json()).then(data => {
      if (data && data.length > 0) {
        setFetchedDestinations(data.slice(0, 4).map((d: any) => ({ id: d.id, name: d.name, desc: d.description || d.location, img: d.image || 'https://images.unsplash.com/photo-1588258524451-24905d53a992?q=80&w=1000&auto=format&fit=crop' })));
      }
    }).catch(console.error);
  }, []);
  const displayDests = fetchedDestinations.length > 0 ? fetchedDestinations : destinations;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  useLayoutEffect(() => {
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
      
      gsap.fromTo('.view-all-dest-btn',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.view-all-dest-container',
            start: 'top 90%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // quickTo setters — created once per card, reused on every mousemove (no new tween spam)
  const quickRotX = useRef<((val: number) => void)[]>([]);
  const quickRotY = useRef<((val: number) => void)[]>([]);
  const quickImgX = useRef<((val: number) => void)[]>([]);
  const quickImgY = useRef<((val: number) => void)[]>([]);
  const rafRef    = useRef<number | null>(null);

  const initQuickTo = (idx: number) => {
    const card = cardsRef.current[idx];
    if (!card || quickRotX.current[idx]) return;

    // ✅ Set perspective + preserve-3d so rotation looks truly 3D
    gsap.set(card, { transformPerspective: 900, transformStyle: 'preserve-3d' });

    const img = card.querySelector('img');
    quickRotX.current[idx] = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3.out' });
    quickRotY.current[idx] = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3.out' });
    if (img) {
      gsap.set(img, { transformStyle: 'preserve-3d' });
      quickImgX.current[idx] = gsap.quickTo(img, 'x', { duration: 0.5, ease: 'power3.out' });
      quickImgY.current[idx] = gsap.quickTo(img, 'y', { duration: 0.5, ease: 'power3.out' });
    }

    // Also set preserve-3d on text layers
    card.querySelectorAll('[data-tilt-layer]').forEach(el => {
      gsap.set(el, { transformStyle: 'preserve-3d' });
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardsRef.current[idx];
    if (!card) return;
    initQuickTo(idx);

    // Cancel any pending RAF to avoid queuing up
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Normalised -1 → 1
      const nx = (x / rect.width)  * 2 - 1;   // left=-1, right=+1
      const ny = (y / rect.height) * 2 - 1;   // top=-1, bottom=+1

      // Dead-zone at 12% from edges — prevents jiggle when cursor grazes border
      const DZ = 0.12;
      const cx = Math.abs(nx) > (1 - DZ) ? Math.sign(nx) * (1 - DZ) : nx;
      const cy = Math.abs(ny) > (1 - DZ) ? Math.sign(ny) * (1 - DZ) : ny;

      const MAX_ROT = 13;
      const rotX = cy * -MAX_ROT;   // tilt forward when cursor is at bottom
      const rotY = cx *  MAX_ROT;   // tilt right when cursor is at right

      quickRotX.current[idx]?.(rotX);
      quickRotY.current[idx]?.(rotY);
      quickImgX.current[idx]?.(cx * -12);
      quickImgY.current[idx]?.(cy * -12);

      gsap.to(card.querySelector('img'), { scale: 1.12, duration: 0.6, ease: 'power2.out' });
    });
  };

  const handleMouseLeave = (idx: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const card = cardsRef.current[idx];
    if (!card) return;

    // Smooth snap-back — power3.out, NO elastic (elastic causes the bounce-jiggle)
    gsap.to(card, {
      rotateX: 0, rotateY: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
    const img = card.querySelector('img');
    gsap.to(img, {
      x: 0, y: 0, scale: 1,
      duration: 0.8,
      ease: 'power3.out',
    });
  };


  return (
    <section id="destinations" ref={containerRef} className="py-32 bg-transparent text-forest dark:text-[#fdfbf7] transition-colors duration-500" style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <p className="text-orange uppercase tracking-[0.3em] text-sm font-semibold mb-6">Iconic Locations</p>
            <h2 className="text-6xl md:text-[5.5rem] font-serif leading-none tracking-tight">
              Destinations
            </h2>
          </div>
          <Link to="/destinations" className="border-b border-white/30 pb-2 tracking-[0.2em] uppercase text-sm font-medium hover:text-orange hover:border-orange transition-colors duration-300">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-24">
          {displayDests.map((dest, index) => (
            <div 
              key={dest.name}
              ref={el => cardsRef.current[index] = el}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onClick={() => navigate(`/destinations/${dest.id || dest.name.toLowerCase()}`)}
              className="group relative h-[550px] rounded-2xl cursor-pointer will-change-transform shadow-xl hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.45)] transition-shadow duration-500"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Parallax clip container */}
              <div className="dest-img-container absolute inset-0 rounded-2xl overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                <img 
                  src={dest.img} 
                  alt={dest.name} 
                  className="w-[115%] max-w-none h-[115%] -left-[7.5%] -top-[7.5%] absolute object-cover will-change-transform pointer-events-none"
                />
              </div>

              {/* Text — floats above card in Z-space for real depth */}
              <div
                data-tilt-layer
                className="absolute bottom-0 left-0 p-8 z-20"
                style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }}
              >
                <h3
                  className="text-4xl font-serif text-[#fdfbf7] mb-3 drop-shadow-lg"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {dest.name}
                </h3>
                <p
                  className="text-[#fdfbf7]/90 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  {dest.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="view-all-dest-container text-center relative z-10">
          <Link to="/destinations" className="view-all-dest-btn inline-flex items-center gap-4 bg-forest dark:bg-[#1a251e] text-sand dark:text-[#fdfbf7] px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-orange transition-colors duration-300 shadow-xl group">
            Explore All Destinations
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        
      </div>
    </section>
  );
};

export default Destinations;
