import React, { useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Plane, Map, ShieldCheck, HeartHandshake } from 'lucide-react';

const services = [
  {
    icon: <Plane size={32} />,
    title: 'Custom Itineraries',
    desc: 'Tailor-made travel plans designed exclusively around your interests, budget, and pace.'
  },
  {
    icon: <Map size={32} />,
    title: 'Local Guides',
    desc: 'Explore with our certified, multilingual guides who bring the island\'s history to life.'
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Safe Travel',
    desc: 'Enjoy peace of mind with 24/7 on-ground support and secure, comfortable transport.'
  },
  {
    icon: <HeartHandshake size={32} />,
    title: 'Authentic Experiences',
    desc: 'Engage in immersive cultural activities, from village tours to authentic cooking classes.'
  }
];

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.service-card',
        { y: 100, opacity: 0, rotateY: 15 },
        {
          y: 0, opacity: 1,
          
          rotateY: 0,
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
    <section id="services" ref={containerRef} className="py-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center mb-24">
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">What We Offer</p>
          <h2 className="text-5xl md:text-7xl font-serif leading-tight">
            Our <span className="italic text-orange font-light">Services</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="service-card bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-forest/10 dark:border-white/10 p-10 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-500 border border-[#fdfbf7]/5 flex flex-col items-center text-center group">
              <div className="text-orange mb-8 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-serif text-forest dark:text-[#fdfbf7] mb-4">{service.title}</h3>
              <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
