import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Calendar, ArrowRight } from 'lucide-react';

const packages = [
  {
    title: '7-Day Cultural Triangle',
    desc: 'Explore ancient cities, majestic temples, and the legendary Sigiriya Rock Fortress. Perfect for history enthusiasts.',
    duration: '7 Days / 6 Nights',
    img: 'https://images.unsplash.com/photo-1620803457106-92c2865954ec?q=80&w=2940&auto=format&fit=crop'
  },
  {
    title: '14-Day Island Explorer',
    desc: 'A comprehensive journey through misty tea plantations, pristine beaches, and thrilling wildlife safaris.',
    duration: '14 Days / 13 Nights',
    img: 'https://images.unsplash.com/photo-1586523925763-8a3fc073a62d?q=80&w=2940&auto=format&fit=crop'
  }
];

const TourPackages = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.experience-card');
      
      cards.forEach((card: any, i) => {
        // Image reveal animation
        const imgContainer = card.querySelector('.img-container');
        const img = card.querySelector('img');
        
        gsap.fromTo(imgContainer,
          { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', scale: 0.8, rotateX: 10, z: -200 },
          {
            clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
            scale: 1,
            rotateX: 0,
            z: 0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'center center',
              scrub: 1.5,
            }
          }
        );

        // Image parallax
        gsap.to(img, {
          yPercent: 30,
          scale: 1.2,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });

        // Text reveal
        const texts = card.querySelectorAll('.exp-text');
        gsap.fromTo(texts,
          { y: 100, opacity: 0, rotateX: 30, z: -100 },
          {
            y: 0, opacity: 1,
            
            rotateX: 0,
            z: 0,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              end: 'center center',
              scrub: 1.5,
            }
          }
        );
      });
      
      gsap.fromTo('.view-all-btn',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.view-all-container',
            start: 'top 90%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="packages" ref={containerRef} className="py-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden transition-colors duration-500">
      {/* Decorative vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-forest/5 hidden lg:block" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center mb-32 relative z-10 transform-style-3d">
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Expertly Crafted</p>
          <h2 className="text-6xl md:text-[5.5rem] font-serif leading-none tracking-tight text-forest dark:text-[#fdfbf7] drop-shadow-sm">
            Tour <span className="italic text-orange font-light">Packages</span>
          </h2>
        </div>

        <div className="space-y-32 md:space-y-48 mb-32">
          {packages.map((pkg, index) => (
            <div 
              key={index} 
              onClick={() => navigate(`/packages/${pkg.title.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`)}
              className={`experience-card flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24 relative transform-style-3d cursor-pointer group/card`}
            >
              
              <div className="w-full lg:w-3/5 perspective-[1200px]">
                <div className="img-container w-full h-[500px] lg:h-[750px] overflow-hidden rounded-2xl relative shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] transform-style-3d hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] transition-shadow duration-700 group">
                  <img 
                    src={pkg.img} 
                    alt={pkg.title} 
                    className="w-[120%] h-[120%] -top-[10%] -left-[10%] absolute object-cover will-change-transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500 cursor-pointer" />
                </div>
              </div>

              <div className="w-full lg:w-2/5 flex flex-col justify-center perspective-[1200px] transform-style-3d" style={{ transform: 'translateZ(60px)' }}>
                <div className="overflow-hidden mb-6 flex items-center gap-3">
                  <Calendar size={18} className="exp-text text-orange" />
                  <span className="exp-text block text-orange font-sans tracking-[0.2em] uppercase text-sm font-bold">{pkg.duration}</span>
                </div>
                <div className="overflow-hidden mb-8">
                  <h3 className="exp-text block text-5xl lg:text-6xl font-serif text-forest dark:text-[#fdfbf7] tracking-tight">{pkg.title}</h3>
                </div>
                <div className="overflow-hidden mb-10">
                  <p className="exp-text block text-xl text-forest/70 dark:text-[#fdfbf7]/70 font-light max-w-md leading-relaxed">
                    {pkg.desc}
                  </p>
                </div>
                <div className="overflow-hidden">
                  <Link to={`/packages/${pkg.title.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`} onClick={(e) => e.stopPropagation()} className="exp-text inline-flex items-center gap-4 group">
                    <span className="border-b border-white/30 pb-1 text-forest dark:text-[#fdfbf7] tracking-[0.2em] uppercase text-sm font-bold group-hover:text-orange group-hover:border-orange transition-colors duration-300">
                      View Itinerary
                    </span>
                    <div className="w-8 h-px bg-forest/30 group-hover:w-16 group-hover:bg-orange transition-all duration-500"></div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="view-all-container text-center mt-20 relative z-10">
          <Link to="/packages" className="view-all-btn inline-flex items-center gap-4 bg-forest dark:bg-[#1a251e] text-sand dark:text-[#fdfbf7] px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-orange transition-colors duration-300 shadow-xl group">
            View All Packages
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        
      </div>
    </section>
  );
};

export default TourPackages;
