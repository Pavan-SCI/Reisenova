import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';

const allPackages = [
  {
    title: '7-Day Cultural Triangle',
    desc: 'Explore ancient cities, majestic temples, and the legendary Sigiriya Rock Fortress. Perfect for history enthusiasts.',
    duration: '7 Days / 6 Nights',
    destinations: ['Anuradhapura', 'Polonnaruwa', 'Sigiriya', 'Dambulla', 'Kandy'],
    img: 'https://images.unsplash.com/photo-1620803457106-92c2865954ec?q=80&w=2940&auto=format&fit=crop',
    price: 'From $850'
  },
  {
    title: '14-Day Island Explorer',
    desc: 'A comprehensive journey through misty tea plantations, pristine beaches, and thrilling wildlife safaris.',
    duration: '14 Days / 13 Nights',
    destinations: ['Colombo', 'Kandy', 'Nuwara Eliya', 'Yala', 'Mirissa', 'Galle'],
    img: 'https://images.unsplash.com/photo-1586523925763-8a3fc073a62d?q=80&w=2940&auto=format&fit=crop',
    price: 'From $1,450'
  },
  {
    title: '5-Day Wildlife Safari',
    desc: 'An intense wildlife experience focusing on leopards, elephants, and endemic birds in their natural habitats.',
    duration: '5 Days / 4 Nights',
    destinations: ['Wilpattu', 'Minneriya', 'Yala'],
    img: 'https://images.unsplash.com/photo-1544079868-87422f281e05?q=80&w=2864&auto=format&fit=crop',
    price: 'From $700'
  },
  {
    title: '10-Day Surf & Sand',
    desc: 'The ultimate coastal escape. Chase the best waves and relax on pristine golden beaches along the south and east coasts.',
    duration: '10 Days / 9 Nights',
    destinations: ['Hikkaduwa', 'Unawatuna', 'Mirissa', 'Arugam Bay'],
    img: 'https://images.unsplash.com/photo-1579685655767-f3c5b967d26b?q=80&w=2940&auto=format&fit=crop',
    price: 'From $1,100'
  },
  {
    title: '8-Day Hill Country Retreat',
    desc: 'Breathe in the crisp mountain air, hike through lush tea estates, and experience the iconic train journey.',
    duration: '8 Days / 7 Nights',
    destinations: ['Kandy', 'Hatton', 'Nuwara Eliya', 'Ella'],
    img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=2940&auto=format&fit=crop',
    price: 'From $950'
  },
  {
    title: '12-Day Wellness & Ayurveda',
    desc: 'Rejuvenate your mind and body with ancient healing practices, yoga, and meditation in serene settings.',
    duration: '12 Days / 11 Nights',
    destinations: ['Negombo', 'Kandy', 'Weligama', 'Bentota'],
    img: 'https://images.unsplash.com/photo-1588258524451-24905d53a992?q=80&w=2940&auto=format&fit=crop',
    price: 'From $1,800'
  }
];

const PackagesPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pkg-reveal',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
        }
      );
      
      gsap.utils.toArray('.pkg-card').forEach((card: any) => {
        gsap.fromTo(card, 
          { y: 100, opacity: 0 },
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
    
      {/* Fixed Back Button */}
      <div className="fixed top-6 left-4 md:left-8 z-50">
        <Link to="/" className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-forest/10 dark:border-white/10 text-forest dark:text-[#fdfbf7] hover:bg-orange hover:text-[#fdfbf7] dark:hover:bg-orange transition-all uppercase tracking-widest text-[10px] md:text-xs font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
<section ref={containerRef} className="min-h-screen pt-24 pb-24 md:pt-32 md:pb-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden transition-colors duration-500">

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-16 md:mb-20 pkg-reveal text-center max-w-3xl mx-auto">
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Curated Experiences</p>
          <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-tight drop-shadow-sm text-forest dark:text-[#fdfbf7]">
            Our Tour <br />
            <span className="italic text-orange font-light">Packages</span>
          </h2>
          <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light text-lg">
            Discover the perfect journey tailored to your interests. From ancient ruins to pristine beaches, we have a package for every traveler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPackages.map((pkg, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(`/packages/${pkg.title.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`)}
              className="pkg-card group bg-white dark:bg-[#0a0f0d] border border-forest/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-[#0a0f0d]/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-forest dark:text-[#fdfbf7]">
                  {pkg.price}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-orange mb-4 text-sm font-semibold tracking-widest uppercase">
                  <Clock size={16} />
                  <span>{pkg.duration}</span>
                </div>
                
                <h3 className="text-2xl font-serif text-forest dark:text-[#fdfbf7] mb-4 group-hover:text-orange transition-colors duration-300">{pkg.title}</h3>
                
                <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light mb-6 flex-grow">
                  {pkg.desc}
                </p>
                
                <div className="border-t border-[#fdfbf7]/10 dark:border-white/10 pt-4 mb-6">
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-orange shrink-0 mt-1" />
                    <span className="text-sm text-forest/70 dark:text-[#fdfbf7]/70 italic">
                      {pkg.destinations.join(' • ')}
                    </span>
                  </div>
                </div>
                
                <Link to="/plan-trip" onClick={(e) => e.stopPropagation()} className="w-full bg-forest dark:bg-[#1a251e] text-sand dark:text-[#fdfbf7] py-4 rounded-full font-bold uppercase tracking-widest hover:bg-orange text-center transition-colors duration-300 shadow-md text-sm mt-auto">
                  Book This Package
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section></>
  );
};

export default PackagesPage;
