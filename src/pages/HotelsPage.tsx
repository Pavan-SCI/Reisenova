import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Star, ArrowLeft } from 'lucide-react';

const allHotels = [
  { name: 'Amanwella', location: 'Tangalle', rating: 5, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop', type: 'Beach Resort' },
  { name: 'Ceylon Tea Trails', location: 'Hatton', rating: 5, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2825&auto=format&fit=crop', type: 'Heritage Bungalow' },
  { name: 'Cape Weligama', location: 'Weligama', rating: 5, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2940&auto=format&fit=crop', type: 'Cliffside Resort' },
  { name: 'Tri Lanka', location: 'Koggala Lake', rating: 5, img: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=2874&auto=format&fit=crop', type: 'Eco Retreat' },
  { name: 'Uga Ulagalla', location: 'Anuradhapura', rating: 5, img: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2940&auto=format&fit=crop', type: 'Nature Resort' },
  { name: 'Wild Coast Tented Lodge', location: 'Yala', rating: 5, img: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=2940&auto=format&fit=crop', type: 'Safari Lodge' }
];

const HotelsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hotel-reveal',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
        }
      );
      
      gsap.utils.toArray('.hotel-card-page').forEach((card: any) => {
        gsap.fromTo(card, 
          { y: 100, opacity: 0, },
          {
            y: 0, opacity: 1, 
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

  return (<>
    <section ref={containerRef} className="min-h-screen pt-24 pb-24 md:pt-32 md:pb-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden transition-colors duration-500">
      {/* Background subtle image */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1586523925763-8a3fc073a62d?q=80&w=2874&auto=format&fit=crop" alt="bg pattern" className="w-full h-full object-cover grayscale" />
      </div>
      
      {/* Fixed Back Button */}
      <div className="fixed top-6 left-4 md:left-8 z-50">
        <Link to="/" className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/60 border border-forest/10 dark:border-white/10 text-forest dark:text-[#fdfbf7] hover:bg-orange hover:text-[#fdfbf7] dark:hover:bg-orange transition-all uppercase tracking-widest text-[10px] md:text-xs font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-20 hotel-reveal text-center max-w-3xl mx-auto">
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Premium Accommodation</p>
          <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-tight drop-shadow-sm text-forest dark:text-[#fdfbf7]">
            Luxury <span className="italic text-orange font-light">Stays</span>
          </h2>
          <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light text-lg">
            Experience world-class hospitality in some of the most breathtaking locations on the island. We partner with the finest hotels and resorts to ensure your stay is unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allHotels.map((hotel, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(`/hotels/${hotel.name.toLowerCase().replace(/ /g, '-')}`)}
              className="hotel-card-page group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500  bg-white dark:bg-[#0a0f0d] border border-forest/10 dark:border-white/10"
            >
              <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out" />
              
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-[#0a0f0d]/90 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-forest dark:text-[#fdfbf7] z-20">
                {hotel.type}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 bg-white/5 border-t border-white/10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ">
                <div className="flex gap-1 mb-3 text-orange drop-shadow-sm">
                  {[...Array(hotel.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <h3 className="text-3xl font-serif text-[#fdfbf7] mb-2 drop-shadow-md">{hotel.name}</h3>
                <p className="text-[#fdfbf7]/80 font-medium text-sm uppercase tracking-widest">{hotel.location}</p>
                
                <div className="mt-6 overflow-hidden h-0 group-hover:h-12 transition-all duration-500 flex items-center">
                  <Link to="/plan-trip" onClick={(e) => e.stopPropagation()} className="text-sm font-semibold tracking-widest uppercase text-[#fdfbf7] hover:text-orange transition-colors flex items-center gap-2">
                    Inquire to Book
                    <div className="w-6 h-px bg-current"></div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section></>
  );
};

export default HotelsPage;
