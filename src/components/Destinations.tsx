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
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { y: 250, opacity: 0, rotateX: 30, z: -400, scale: 0.8 },
        {
          y: 0, opacity: 1,
          
          rotateX: 0,
          z: 0,
          scale: 1,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'center center',
            scrub: 1,
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardsRef.current[idx];
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
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
      ease: 'elastic.out(1, 0.5)',
      duration: 1.5,
    });
    
    const img = card.querySelector('img');
    gsap.to(img, {
      x: 0,
      y: 0, opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: 'power3.out',
    });
  };

  return (
    <section id="destinations" ref={containerRef} className="py-32 bg-transparent text-forest dark:text-[#fdfbf7] perspective-[2000px] transition-colors duration-500">
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
          {destinations.map((dest, index) => (
            <div 
              key={dest.name}
              ref={el => cardsRef.current[index] = el}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onClick={() => navigate(`/destinations/${dest.name.toLowerCase()}`)}
              className="group relative h-[550px] overflow-hidden rounded-2xl cursor-pointer will-change-transform transform-style-3d shadow-xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-500 bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-forest/10 dark:border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              <img 
                src={dest.img} 
                alt={dest.name} 
                className="w-[110%] h-[110%] -left-[5%] -top-[5%] absolute object-cover will-change-transform pointer-events-none"
              />
              <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 transform-style-3d" style={{ transform: 'translateZ(50px)' }}>
                <h3 className="text-4xl font-serif text-[#fdfbf7] mb-3 drop-shadow-lg" style={{ transform: 'translateZ(20px)' }}>{dest.name}</h3>
                <p className="text-[#fdfbf7]/90 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" style={{ transform: 'translateZ(30px)' }}>{dest.desc}</p>
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
