import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Star, ArrowRight } from 'lucide-react';

const hotels = [
  { name: 'Amanwella', location: 'Tangalle', rating: 5, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop' },
  { name: 'Ceylon Tea Trails', location: 'Hatton', rating: 5, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2825&auto=format&fit=crop' },
  { name: 'Cape Weligama', location: 'Weligama', rating: 5, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2940&auto=format&fit=crop' },
];

const Hotels = () => {
  const [fetchedHotels, setFetchedHotels] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    fetch('/api/hotels').then(res => res.json()).then(data => {
      if (data && data.length > 0) {
        setFetchedHotels(data.slice(0, 3).map((d: any) => ({ id: d.id, name: d.name, location: d.location, rating: Number(d.rating) || 5, img: d.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop' })));
      } else {
        setFetchedHotels([]);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);
  const displayHotels = fetchedHotels;
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleBookClick = async (e: React.MouseEvent, hotel: any) => {
    e.preventDefault();
    e.stopPropagation();
    const isUser = localStorage.getItem('isUserLoggedIn') === 'true';
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');

    if (!isUser && !isAdmin) {
      navigate('/login');
      return;
    }

    try {
      const payload = {
        userId: userId || userEmail || 'unknown_user',
        userEmail: userEmail || 'unknown_user',
        hotelId: hotel.name.toLowerCase().replace(/\s+/g, '-'),
        hotelDetails: hotel,
        guests: 1
      };
      
      const res = await fetch('/api/bookings/hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Hotel booked successfully!');
      } else {
        alert('Failed to book hotel.');
      }
    } catch (err) {
      console.error(err);
      alert('Error booking hotel.');
    }
  };


  useLayoutEffect(() => {
    if (loading || displayHotels.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.hotel-card',
        { y: 150, opacity: 0, rotateX: 25, z: -200, scale: 0.9 },
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
            scrub: 1.5,
          }
        }
      );
      
      gsap.fromTo('.view-all-hotels',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.view-all-hotels-container',
            start: 'top 90%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading, displayHotels.length]);

  if (!loading && displayHotels.length === 0) {
    return null;
  }

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden bg-transparent text-forest dark:text-[#fdfbf7] perspective-[1200px]">
      {/* Background subtle image */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1586523925763-8a3fc073a62d?q=80&w=2874&auto=format&fit=crop" alt="bg pattern" className="w-full h-full object-cover grayscale" />
      </div>
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-24">
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Premium Accommodation</p>
          <h2 className="text-6xl md:text-[5.5rem] font-serif mb-6 leading-none tracking-tight text-forest dark:text-[#fdfbf7] drop-shadow-sm">
            Luxury <span className="italic text-orange font-light">Stays</span>
          </h2>
          <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light text-xl max-w-xl mx-auto">
            Experience world-class hospitality in some of the most breathtaking locations on the island.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {displayHotels.map((hotel, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(`/hotels/${hotel.name.toLowerCase().replace(/ /g, '-')}`)}
              className="hotel-card group relative h-[600px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-shadow duration-500 transform-style-3d bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-forest/10 dark:border-white/10"
            >
              <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 backdrop-blur-md bg-white/5 border-t border-white/10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 transform-style-3d" style={{ transform: 'translateZ(30px)' }}>
                <div className="flex gap-1 mb-4 text-orange drop-shadow-sm">
                  {[...Array(hotel.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <h3 className="text-4xl font-serif text-[#fdfbf7] mb-2 drop-shadow-md">{hotel.name}</h3>
                <p className="text-[#fdfbf7]/80 font-medium text-sm uppercase tracking-widest">{hotel.location}</p>
                
                <div className="mt-6 overflow-hidden h-0 group-hover:h-12 transition-all duration-500 flex items-center">
                  <button onClick={(e) => handleBookClick(e, hotel)} className="text-sm font-semibold tracking-widest uppercase text-[#fdfbf7] hover:text-orange transition-colors flex items-center gap-2">
                    Reserve
                    <div className="w-6 h-px bg-current"></div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="view-all-hotels-container text-center relative z-10">
          <Link to="/hotels" className="view-all-hotels inline-flex items-center gap-4 bg-forest dark:bg-[#1a251e] text-sand dark:text-[#fdfbf7] px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-orange transition-colors duration-300 shadow-xl group">
            Explore All Hotels
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hotels;
