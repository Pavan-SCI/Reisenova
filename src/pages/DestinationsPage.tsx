import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, MapPin } from 'lucide-react';

const allDestinations = [
  { name: 'Sigiriya', desc: 'The Ancient Rock Fortress', img: 'https://images.unsplash.com/photo-1588258524451-24905d53a992?q=80&w=2940&auto=format&fit=crop', category: 'Heritage' },
  { name: 'Ella', desc: 'Misty Mountains & Tea', img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=2940&auto=format&fit=crop', category: 'Nature' },
  { name: 'Mirissa', desc: 'Golden Sands & Whales', img: 'https://images.unsplash.com/photo-1579685655767-f3c5b967d26b?q=80&w=2940&auto=format&fit=crop', category: 'Beach' },
  { name: 'Galle', desc: 'Historic Dutch Fort', img: 'https://images.unsplash.com/photo-1586523925763-8a3fc073a62d?q=80&w=2940&auto=format&fit=crop', category: 'Culture' },
  { name: 'Kandy', desc: 'The Sacred City', img: 'https://images.unsplash.com/photo-1620803457106-92c2865954ec?q=80&w=2940&auto=format&fit=crop', category: 'Heritage' },
  { name: 'Yala', desc: 'Wildlife Safari', img: 'https://images.unsplash.com/photo-1544079868-87422f281e05?q=80&w=2864&auto=format&fit=crop', category: 'Wildlife' },
  { name: 'Nuwara Eliya', desc: 'Little England', img: 'https://images.unsplash.com/photo-1616423528143-6901968840a1?q=80&w=2940&auto=format&fit=crop', category: 'Nature' },
  { name: 'Anuradhapura', desc: 'Ancient Capital', img: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2940&auto=format&fit=crop', category: 'Heritage' }
];

const DestinationsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dest-reveal',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
        }
      );
      
      cardsRef.current.forEach((card: any) => {
        if (!card) return;
        gsap.fromTo(card, 
          { y: 100, opacity: 0, rotateX: 10 },
          {
            y: 0, opacity: 1, rotateX: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            }
          }
        );
      });
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
    <section ref={containerRef} className="min-h-screen pt-24 pb-24 md:pt-32 md:pb-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden transition-colors duration-500 perspective-[2000px]">
      
      {/* Fixed Back Button */}
      <div className="fixed top-6 left-4 md:left-8 z-50 dest-reveal">
        <Link to="/" className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-forest/10 dark:border-white/10 text-forest dark:text-[#fdfbf7] hover:bg-orange hover:text-[#fdfbf7] dark:hover:bg-orange transition-all uppercase tracking-widest text-[10px] md:text-xs font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-16 md:mb-20 dest-reveal text-center max-w-3xl mx-auto">
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Iconic Locations</p>
          <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-tight drop-shadow-sm text-forest dark:text-[#fdfbf7]">
            Explore <span className="italic text-orange font-light">Destinations</span>
          </h2>
          <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light text-lg">
            Discover the rich diversity of Sri Lanka, from mist-shrouded mountains and ancient ruins to golden shores and vibrant wildlife parks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {allDestinations.map((dest, index) => (
            <div 
              key={dest.name}
              ref={el => cardsRef.current[index] = el}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onClick={() => navigate(`/destinations/${dest.name.toLowerCase()}`)}
              className="group relative h-[550px] overflow-hidden rounded-2xl cursor-pointer will-change-transform transform-style-3d shadow-xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-500 bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-forest/10 dark:border-white/10"
            >
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-[#0a0f0d]/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-forest dark:text-[#fdfbf7] z-30 shadow-sm">
                {dest.category}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              
              <img 
                src={dest.img} 
                alt={dest.name} 
                className="w-[110%] h-[110%] -left-[5%] -top-[5%] absolute object-cover will-change-transform pointer-events-none"
              />
              
              <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 transform-style-3d" style={{ transform: 'translateZ(50px)' }}>
                <h3 className="text-4xl font-serif text-[#fdfbf7] mb-3 drop-shadow-lg" style={{ transform: 'translateZ(20px)' }}>{dest.name}</h3>
                <p className="text-[#fdfbf7]/90 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" style={{ transform: 'translateZ(30px)' }}>{dest.desc}</p>
                
                <div className="mt-6 overflow-hidden h-0 group-hover:h-10 transition-all duration-500 flex items-center" style={{ transform: 'translateZ(40px)' }}>
                  <Link to="/plan-trip" onClick={(e) => e.stopPropagation()} className="text-sm font-semibold tracking-widest uppercase text-[#fdfbf7] hover:text-orange transition-colors flex items-center gap-2">
                    Include in Trip
                    <div className="w-6 h-px bg-current"></div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DestinationsPage;
