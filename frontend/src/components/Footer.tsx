import React, { useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-reveal',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={containerRef} className="bg-transparent text-forest dark:text-[#fdfbf7] pt-32 pb-12 relative overflow-hidden border-t border-[#fdfbf7]/10">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2 footer-reveal">
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-[1.1] tracking-tight text-forest dark:text-[#fdfbf7] drop-shadow-sm">
              Begin Your <br/>
              <span className="italic text-orange font-light">Story</span>
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing!"); }} className="flex gap-4 items-end mt-12 border-b border-[#fdfbf7]/20 pb-4 max-w-md group hover:border-orange transition-colors duration-500">
              <input 
                type="email" 
                required
                placeholder="Enter your email for inspiration" 
                className="bg-transparent border-none outline-none w-full text-forest dark:text-[#fdfbf7] placeholder:text-forest/40 dark:text-[#fdfbf7]/40 font-medium tracking-wide"
              />
              <button type="submit" className="text-forest dark:text-[#fdfbf7] group-hover:text-orange group-hover:translate-x-2 transition-all duration-300">
                <ArrowRight size={24} />
              </button>
            </form>
          </div>

          <div className="footer-reveal">
            <h4 className="text-forest dark:text-[#fdfbf7] uppercase tracking-[0.2em] text-sm font-bold mb-8">Explore</h4>
            <ul className="space-y-5 text-forest/70 dark:text-[#fdfbf7]/70 font-medium">
              <li><a href="/destinations" className="hover:text-orange transition-colors block transform hover:translate-x-1 duration-300">Destinations</a></li>
              <li><a href="#about" className="hover:text-orange transition-colors block transform hover:translate-x-1 duration-300">About Us</a></li>
              <li><a href="/hotels" className="hover:text-orange transition-colors block transform hover:translate-x-1 duration-300">Luxury Hotels</a></li>
              <li><a href="/packages" className="hover:text-orange transition-colors block transform hover:translate-x-1 duration-300">Curated Tours</a></li>
            </ul>
          </div>

          <div className="footer-reveal">
            <h4 className="text-forest dark:text-[#fdfbf7] uppercase tracking-[0.2em] text-sm font-bold mb-8">Contact</h4>
            <ul className="space-y-5 text-forest/70 dark:text-[#fdfbf7]/70 font-medium">
              <li><a href="mailto:info@reisenova.com" className="hover:text-orange transition-colors">info@reisenova.com</a></li>
              <li>+94 11 234 5678</li>
              <li>Colombo, Sri Lanka</li>
            </ul>
            
            <div className="flex gap-4 mt-10">
              <a href="#" className="w-12 h-12 rounded-full border border-[#fdfbf7]/20 flex items-center justify-center hover:bg-forest hover:text-sand hover:border-[#fdfbf7] transition-all duration-300 transform hover:scale-110 shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-[#fdfbf7]/20 flex items-center justify-center hover:bg-forest hover:text-sand hover:border-[#fdfbf7] transition-all duration-300 transform hover:scale-110 shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-[#fdfbf7]/20 flex items-center justify-center hover:bg-forest hover:text-sand hover:border-[#fdfbf7] transition-all duration-300 transform hover:scale-110 shadow-sm">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-[#fdfbf7]/20 flex items-center justify-center hover:bg-forest hover:text-sand hover:border-[#fdfbf7] transition-all duration-300 transform hover:scale-110 shadow-sm">
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#fdfbf7]/10 flex flex-col md:flex-row justify-between items-center text-sm text-forest/50 dark:text-[#fdfbf7]/50 font-medium footer-reveal tracking-wide">
          <p>&copy; {new Date().getFullYear()} Reisenova Travel & Tours. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-orange transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
