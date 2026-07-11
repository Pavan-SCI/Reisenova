import React, { useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bird } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HabaralaLeaf = ({ className }: { className?: string }) => (
  <img src="/leaf.png" alt="" className={`object-cover object-top ${className}`} draggable={false} />
);

const MonkeySilhouette = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M50,30 C60,20 70,30 75,40 C80,50 70,70 60,70 C50,70 40,60 40,50 C40,40 45,35 50,30 Z" />
    <path d="M70,45 C80,40 90,30 95,20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M60,70 C65,80 75,90 85,95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M40,50 C30,60 20,70 10,65 C0,60 10,40 20,30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
    <circle cx="55" cy="40" r="10" />
  </svg>
);

const JungleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    // Wait a tick to make sure the body has height
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // 1. Background image zooms in continuously to give the feeling of moving forward
        gsap.to(bgRef.current, {
          scale: 2.5,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });

        // 2. Foreground leaves scale up and move away
        // Top Left
        gsap.to(['.global-leaf-1', '.global-leaf-1a', '.global-leaf-1b'], {
          x: -800,
          y: -400,
          scale: 2,
          
          rotate: -60,
          ease: 'power1.in',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: '25% top',
            scrub: 1,
          }
        });

        // Top Right
        gsap.to(['.global-leaf-2', '.global-leaf-2a', '.global-leaf-2b'], {
          x: 800,
          y: -400,
          scale: 2,
          
          rotate: 60,
          ease: 'power1.in',
          scrollTrigger: {
            trigger: document.body,
            start: '2% top',
            end: '28% top',
            scrub: 1,
          }
        });

        // Bottom Left
        gsap.to(['.global-leaf-7', '.global-leaf-7a'], {
          x: -800, 
          y: 800, 
          scale: 2, 
           
          rotate: 120,
          ease: 'power1.in', 
          scrollTrigger: { 
            trigger: document.body, 
            start: 'top top', 
            end: '25% top', 
            scrub: 1 
          }
        });

        // Bottom Right
        gsap.to(['.global-leaf-8', '.global-leaf-8a'], {
          x: 800, 
          y: 800, 
          scale: 2, 
           
          rotate: -120,
          ease: 'power1.in', 
          scrollTrigger: { 
            trigger: document.body, 
            start: '3% top', 
            end: '22% top', 
            scrub: 1 
          }
        });

        // Monkey appearing and swinging across smoothly
        gsap.fromTo('.global-monkey', 
          { x: '100vw', y: -50, rotate: -30,  scale: 1, opacity: 1 },
          {
            x: '-40vw', 
            y: 400, 
            rotate: 30, 
            opacity: 1,
            scale: 2.5,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: document.body,
              start: '5% top',
              end: '35% top',
              scrub: 2,
            }
          }
        );

        // Birds appearing around 40-50% scroll
        gsap.fromTo('.global-bird-1',
          { x: '-20vw', y: 300, scale: 0.2, z: -500, opacity: 1 },
          { x: '120vw', y: -200, scale: 2.5, z: 200, opacity: 1, ease: 'power1.inOut', scrollTrigger: { trigger: document.body, start: '35% top', end: '55% top', scrub: 1.5 } }
        );
        gsap.fromTo('.global-bird-2',
          { x: '120vw', y: 400, scale: 0.1, z: -800, opacity: 1 },
          { x: '-20vw', y: 0, scale: 3, z: 400, opacity: 1, ease: 'power1.inOut', scrollTrigger: { trigger: document.body, start: '45% top', end: '65% top', scrub: 2 } }
        );
        gsap.fromTo('.global-bird-3',
          { x: '-20vw', y: 100, scale: 0.5, opacity: 1 },
          { x: '120vw', y: 500, scale: 3.5, opacity: 1, ease: 'power1.inOut', scrollTrigger: { trigger: document.body, start: '70% top', end: '90% top', scrub: 1.5 } }
        );
        
      }, containerRef);
      return () => ctx.revert();
    }, 500); // Slight delay to let components mount
    
    return () => clearTimeout(timer);
  }, []);

  // Mouse Parallax for background
  useLayoutEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;

      gsap.to(bgRef.current, {
        x: x * -30,
        y: y * -30,
        duration: 2,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 perspective-[2000px] overflow-hidden bg-[#e8e4db] dark:bg-[#0a0f0d] transition-colors duration-500">
      {/* Background Image */}
      <div className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] z-0">
        <div className="absolute inset-0 bg-sand/80 dark:bg-white/70 z-10 transition-colors duration-500" />
        <img
          ref={bgRef}
          src="https://images.unsplash.com/photo-1518182170546-076616fdacaf?q=80&w=2940&auto=format&fit=crop"
          alt="Deep Jungle Sri Lanka"
          className="w-full h-full object-cover origin-center opacity-50 dark:opacity-80 filter contrast-100 dark:contrast-125 brightness-110 dark:brightness-75 transition-[filter,opacity] duration-500"
        />
      </div>

      {/* Wildlife */}
      <div className="absolute inset-0 z-10 transform-style-3d">
        <div className="global-monkey absolute top-[10%] left-[60%] text-forest/50 dark:text-[#fdfbf7]/5 opacity-0 transform-gpu will-change-transform">
          <MonkeySilhouette className="w-64 h-64" />
        </div>
        
        <div className="global-bird-1 absolute top-[40%] left-[30%] text-forest/50 dark:text-[#fdfbf7]/5 opacity-0 transform-gpu will-change-transform">
          <Bird className="w-20 h-20 scale-x-[-1]" strokeWidth={1.5} />
        </div>
        <div className="global-bird-2 absolute top-[50%] left-[60%] text-forest/60 dark:text-[#fdfbf7]/5 opacity-0 transform-gpu will-change-transform">
          <div className="relative">
            <Bird className="w-16 h-16" strokeWidth={2} />
            <span className="absolute top-[28%] left-[96%] text-[9px] font-bold tracking-[0.2em] uppercase">Reisenova</span>
          </div>
        </div>
        <div className="global-bird-3 absolute top-[20%] left-[20%] text-forest/40 dark:text-[#fdfbf7]/5 opacity-0 transform-gpu will-change-transform">
          <Bird className="w-24 h-24 scale-x-[-1]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Leaves */}
      <div className="absolute inset-0 z-20 transform-style-3d">
        {/* Initial foreground leaves - Top Left */}
        <HabaralaLeaf className="global-leaf-1 absolute -top-10 -left-20 w-[30rem] h-[30rem] text-[#2c4a38] dark:text-[#fdfbf7]/5 rotate-[120deg] z-30 transform-gpu will-change-transform" />
        <HabaralaLeaf className="global-leaf-1a absolute top-10 -left-32 w-[25rem] h-[25rem] text-[#243d2e] dark:text-[#fdfbf7]/5 rotate-[145deg] z-20 blur-[1px] transform-gpu will-change-transform" />
        <HabaralaLeaf className="global-leaf-1b absolute -top-24 left-10 w-[28rem] h-[28rem] text-[#32523f] dark:text-[#fdfbf7]/5 rotate-[90deg] z-10 transform-gpu will-change-transform" />

        {/* Initial foreground leaves - Top Right */}
        <HabaralaLeaf className="global-leaf-2 absolute -top-20 -right-20 w-[35rem] h-[35rem] text-[#1e3b2a] dark:text-[#fdfbf7]/5 rotate-[-60deg] z-30 transform-gpu will-change-transform" />
        <HabaralaLeaf className="global-leaf-2a absolute top-16 -right-32 w-[32rem] h-[32rem] text-[#193222] dark:text-[#fdfbf7]/5 rotate-[-85deg] z-20 blur-[1px] transform-gpu will-change-transform" />
        <HabaralaLeaf className="global-leaf-2b absolute -top-10 right-32 w-[22rem] h-[22rem] text-[#254231] dark:text-[#fdfbf7]/5 rotate-[-30deg] z-10 transform-gpu will-change-transform" />

        {/* Initial foreground leaves - Bottom Left */}
        <HabaralaLeaf className="global-leaf-7 absolute -bottom-10 -left-16 w-[36rem] h-[36rem] text-[#203a2a] dark:text-[#fdfbf7]/5 rotate-[60deg] z-30 transform-gpu will-change-transform" />
        <HabaralaLeaf className="global-leaf-7a absolute -bottom-24 left-10 w-[42rem] h-[42rem] text-[#172d1f] dark:text-[#fdfbf7]/5 rotate-[35deg] z-20 blur-[2px] transform-gpu will-change-transform" />

        {/* Initial foreground leaves - Bottom Right */}
        <HabaralaLeaf className="global-leaf-8 absolute -bottom-16 -right-16 w-[38rem] h-[38rem] text-[#23422d] dark:text-[#fdfbf7]/5 rotate-[-45deg] z-30 transform-gpu will-change-transform" />
        <HabaralaLeaf className="global-leaf-8a absolute -bottom-10 right-24 w-[30rem] h-[30rem] text-[#1a3322] dark:text-[#fdfbf7]/5 rotate-[-15deg] z-20 blur-[1px] transform-gpu will-change-transform" />
        
      </div>
    </div>
  );
};

export default JungleBackground;
