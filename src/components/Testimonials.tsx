import React, { useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "An experience that transcends mere travel. Sri Lanka touched my soul in ways I never expected.",
    author: "Elena Rostova",
    location: "Milan, Italy"
  },
  {
    quote: "The perfect balance of wild nature and exquisite luxury. Every detail was curated to perfection.",
    author: "James Harrington",
    location: "London, UK"
  },
  {
    quote: "From the golden sunsets in Galle to the misty mornings in Ella, an absolute masterpiece of a journey.",
    author: "Sarah Chen",
    location: "Singapore"
  }
];

const Testimonials = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.testimonial-card',
        { y: 150, opacity: 0, rotateY: 30, z: -200, scale: 0.9 },
        {
          y: 0, opacity: 1,
          
          rotateY: 0,
          z: 0,
          scale: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'center center',
            scrub: 1.5,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden perspective-[1200px]">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-24">
          <Quote size={56} className="mx-auto text-orange mb-8 opacity-40" />
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Travelers' Tales</p>
          <h2 className="text-6xl md:text-[5.5rem] font-serif leading-none tracking-tight">
            A Journey to <br/> <span className="italic text-orange font-light">Remember</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-forest/10 dark:border-white/10/60 backdrop-blur-xl p-10 lg:p-12 border border-white rounded-2xl hover:bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-forest/10 dark:border-white/10/80 transition-colors duration-500 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transform-style-3d group">
              <p className="text-xl lg:text-2xl font-serif leading-relaxed text-forest/90 dark:text-[#fdfbf7]/90 mb-10 relative z-10 group-hover:-translate-y-2 transition-transform duration-500">
                "{t.quote}"
              </p>
              <div className="group-hover:translate-x-2 transition-transform duration-500">
                <p className="text-forest dark:text-[#fdfbf7] font-semibold tracking-wide text-lg">{t.author}</p>
                <p className="text-forest/60 dark:text-[#fdfbf7]/60 text-sm font-medium tracking-wider uppercase mt-1">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
