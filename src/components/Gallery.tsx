import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const images = [
  { url: 'https://images.unsplash.com/photo-1579685655767-f3c5b967d26b?q=80&w=1400&auto=format&fit=crop', title: 'Mirissa Shores' },
  { url: 'https://images.unsplash.com/photo-1625736173004-94944d1809a7?q=80&w=1400&auto=format&fit=crop', title: 'Nine Arch Bridge' },
  { url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1400&auto=format&fit=crop', title: 'South Coast Surf' },
  { url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1400&auto=format&fit=crop', title: 'Hill Country' },
  { url: 'https://images.unsplash.com/photo-1586523925763-8a3fc073a62d?q=80&w=1400&auto=format&fit=crop', title: 'Galle Fort' },
];

const Gallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const items = gsap.utils.toArray('.gallery-h-item');
      
      // Horizontal scroll animation
      gsap.to(items, {
        xPercent: -100 * (items.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: {
            snapTo: 1 / (items.length - 1),
            duration: { min: 0.2, max: 1 },
            delay: 0.1,
            ease: 'power3.inOut'
          },
          end: () => "+=" + slider.offsetWidth
        }
      });
      
      // Image parallax inside horizontal scroll
      items.forEach((item: any) => {
        const img = item.querySelector('img');
        gsap.to(img, {
          xPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: () => "+=" + slider.offsetWidth,
            scrub: true,
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="gallery-wrapper relative">
      <section id="gallery" ref={containerRef} className="h-screen w-full bg-transparent text-forest dark:text-[#fdfbf7] overflow-hidden relative flex items-center">
        <div className="absolute top-12 left-6 md:left-12 z-20">
          <h2 className="text-4xl md:text-6xl font-serif text-forest dark:text-[#fdfbf7] tracking-tight drop-shadow-sm">
            Visual <span className="italic text-orange">Poetry</span>
          </h2>
        </div>
        <div ref={sliderRef} className="flex h-full w-[500vw] items-center relative z-10 pt-20">
          {images.map((item, idx) => (
            <div key={idx} className="gallery-h-item w-screen h-[70vh] flex items-center justify-center relative px-4 md:px-20 shrink-0 perspective-[1500px]">
              <div className="w-full h-full relative overflow-hidden rounded-3xl group cursor-pointer shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-forest/10 dark:border-white/10 transform-style-3d">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700 z-10" />
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-[120%] h-full object-cover absolute left-[-10%] will-change-transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out pointer-events-none"
                />
                <div className="absolute bottom-12 left-12 z-20 overflow-hidden transform-style-3d" style={{ transform: 'translateZ(60px)' }}>
                  <h3 className="text-5xl md:text-7xl font-serif text-[#fdfbf7] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-out drop-shadow-2xl">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress indicator hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          <div className="w-24 h-1 bg-forest/10 rounded-full overflow-hidden">
            <div className="w-full h-full bg-orange origin-left animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
