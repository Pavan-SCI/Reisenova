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
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    fetch('/api/destinations').then(res => res.json()).then(data => {
      if (data && data.length > 0) {
        setFetchedDestinations(data.slice(0, 4).map((d: any) => ({ id: d.id, name: d.name, desc: d.description || d.location, img: d.image || 'https://images.unsplash.com/photo-1588258524451-24905d53a992?q=80&w=1000&auto=format&fit=crop' })));
      } else {
        setFetchedDestinations([]);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);
  const displayDests = fetchedDestinations;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (loading || displayDests.length === 0) return;
    const ctx = gsap.context(() => {
      // ── Card entrance stagger ──
      gsap.fromTo(
        cardsRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
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
  }, [loading, displayDests.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardsRef.current[idx];
    if (!card) return;
    
    // Calculate relative to the outer container (currentTarget) which doesn't rotate
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1200,
      ease: 'power2.out',
      duration: 0.5,
    });
    
    const img = card.querySelector('img');
    gsap.to(img, {
      x: ((x - centerX) / centerX) * -15,
      y: ((y - centerY) / centerY) * -15,
      scale: 1.15,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (idx: number) => {
    const card = cardsRef.current[idx];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: 'power3.out',
      duration: 0.8,
    });
    
    const img = card.querySelector('img');
    gsap.to(img, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.5,
      ease: 'power3.out',
    });
  };


  if (!loading && displayDests.length === 0) return null;

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
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onClick={() => navigate(`/destinations/${dest.id || dest.name.toLowerCase()}`)}
              className="relative h-[550px] cursor-none"
              style={{ perspective: '1400px' }}
            >
              <div
                ref={el => cardsRef.current[index] = el}
                className="group relative w-full h-full overflow-hidden rounded-2xl shadow-xl hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.45)] transition-shadow duration-500 bg-[#fdfbf7] dark:bg-[#0a0f0d] border border-forest/10 dark:border-white/10 pointer-events-none opacity-0"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
                <img 
                  src={dest.img} 
                  alt={dest.name} 
                  className="w-[115%] max-w-none h-[115%] -left-[7.5%] -top-[7.5%] absolute object-cover pointer-events-none"
                />

                <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
                  <h3 className="text-4xl font-serif text-[#fdfbf7] mb-3 drop-shadow-lg pointer-events-none">
                    {dest.name}
                  </h3>
                  <p className="text-[#fdfbf7]/90 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pointer-events-none">
                    {dest.desc}
                  </p>
                </div>
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
