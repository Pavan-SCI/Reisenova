import React, { useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-reveal',
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1,
          
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={containerRef} className="py-32 bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-forest/10 dark:border-white/10 text-forest dark:text-[#fdfbf7] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="order-2 lg:order-1 space-y-10">
            <div className="about-reveal">
              <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">About Reisenova</p>
              <h2 className="text-5xl md:text-7xl font-serif leading-tight">
                Your Trusted <br/>
                <span className="italic text-orange font-light">Local Experts</span>
              </h2>
            </div>
            
            <div className="about-reveal space-y-6 text-forest/70 dark:text-[#fdfbf7]/70 font-light text-lg">
              <p>
                At Reisenova Travel & Tours, we believe that traveling is more than just visiting a place; it's about experiencing its soul. Based in the heart of Sri Lanka, our team of passionate locals is dedicated to unveiling the true magic of our island home.
              </p>
              <p>
                With over a decade of experience, we curate journeys that go beyond the ordinary. From hidden temples in the jungle to secluded pristine beaches, we provide authentic encounters, seamless logistics, and unparalleled personalized service.
              </p>
            </div>
            
            <div className="about-reveal flex gap-12 pt-6">
              <div>
                <h4 className="text-4xl font-serif text-forest dark:text-[#fdfbf7] mb-2">10+</h4>
                <p className="text-sm uppercase tracking-widest text-forest/60 dark:text-[#fdfbf7]/60 font-semibold">Years Experience</p>
              </div>
              <div>
                <h4 className="text-4xl font-serif text-forest dark:text-[#fdfbf7] mb-2">5k+</h4>
                <p className="text-sm uppercase tracking-widest text-forest/60 dark:text-[#fdfbf7]/60 font-semibold">Happy Travelers</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative about-reveal h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2874&auto=format&fit=crop" 
              alt="About Us Sri Lanka" 
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-forest/10 hover:bg-transparent transition-colors duration-500" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
