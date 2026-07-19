import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HabaralaLeaf = ({ className }: { className?: string }) => (
  <img src="/leaf.png" alt="" className={`object-cover object-top ${className}`} draggable={false} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
);

const DynamicLeaf = ({ 
  className, 
  rotation, 
  imgUrl, 
  fallbackImgUrl,
  scale, 
  x, 
  y, 
  alt 
}: { 
  className?: string; 
  rotation: number; 
  imgUrl: string; 
  fallbackImgUrl: string;
  scale: number; 
  x: number; 
  y: number; 
  alt: string; 
}) => {
  const [currentSrc, setCurrentSrc] = useState(imgUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(imgUrl);
    setHasError(false);
  }, [imgUrl]);

  return (
    <div 
      className={`${className} overflow-hidden`}
      style={{
        WebkitMaskImage: 'url("/leaf.png")',
        maskImage: 'url("/leaf.png")',
        WebkitMaskSize: 'cover',
        maskSize: 'cover',
        WebkitMaskPosition: 'top',
        maskPosition: 'top',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }}
    >
      {/* Inner container counter-rotated to align with screen coordinates */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `rotate(${-rotation}deg)`,
        }}
      >
        {/* Photo background centered and scaled perfectly */}
        {!hasError && (
          <img 
            src={currentSrc} 
            alt={alt} 
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: `scale(${scale}) translate(${x}%, ${y}%)`,
            }}
            draggable={false} 
            referrerPolicy="no-referrer"
            onError={() => { 
              if (currentSrc !== fallbackImgUrl) {
                setCurrentSrc(fallbackImgUrl);
              } else {
                setHasError(true);
              }
            }}
          />
        )}
      </div>

      {/* Semi-transparent leaf texture on top to keep veins and leaf details visible */}
      <img 
        src="/leaf.png" 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover object-top opacity-20 dark:opacity-30 pointer-events-none"
        draggable={false} 
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
  );
};

const SigiriyaLeaf = ({ className, rotation, config }: { className?: string; rotation: number; config?: { imgUrl: string; scale: number; x: number; y: number } }) => (
  <DynamicLeaf
    className={className}
    rotation={rotation}
    imgUrl={config?.imgUrl || "/sigiriya_uploaded.png"}
    fallbackImgUrl="/sigiriya_uploaded.png"
    scale={config?.scale ?? 1.8}
    x={config?.x ?? 12}
    y={config?.y ?? 10}
    alt="Sigiriya"
  />
);

const DaladaMaligawaLeaf = ({ className, rotation, config }: { className?: string; rotation: number; config?: { imgUrl: string; scale: number; x: number; y: number } }) => (
  <DynamicLeaf
    className={className}
    rotation={rotation}
    imgUrl={config?.imgUrl || "/dalada_maligawa.jpg"}
    fallbackImgUrl="/dalada_maligawa.jpg"
    scale={config?.scale ?? 1.7}
    x={config?.x ?? 12}
    y={config?.y ?? 0}
    alt="Dalada Maligawa"
  />
);

const GalleLighthouseLeaf = ({ className, rotation, config }: { className?: string; rotation: number; config?: { imgUrl: string; scale: number; x: number; y: number } }) => (
  <DynamicLeaf
    className={className}
    rotation={rotation}
    imgUrl={config?.imgUrl || "/galle_lighthouse.jpg"}
    fallbackImgUrl="/galle_lighthouse.jpg"
    scale={config?.scale ?? 1.8}
    x={config?.x ?? 5}
    y={config?.y ?? -10}
    alt="Galle Lighthouse"
  />
);

const DambullaCaveTempleLeaf = ({ className, rotation, config }: { className?: string; rotation: number; config?: { imgUrl: string; scale: number; x: number; y: number } }) => (
  <DynamicLeaf
    className={className}
    rotation={rotation}
    imgUrl={config?.imgUrl || "/dambulla_cave_temple.jpg"}
    fallbackImgUrl="/dambulla_cave_temple.jpg"
    scale={config?.scale ?? 1.8}
    x={config?.x ?? 5}
    y={config?.y ?? 0}
    alt="Dambulla Cave Temple"
  />
);

const GlassPalmTreeBadge = ({ className, isDark }: { className?: string; isDark: boolean }) => {
  const strokeColor = isDark ? "white" : "black";
  const fillStyle = isDark ? "white" : "black";

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Badge Content */}
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        <svg
          viewBox="0 0 75 75"
          className={`w-full h-full ${isDark ? 'text-white' : 'text-black'} drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 1. Large orange-red sun circle behind the trees with glowing effect */}
          <circle 
            cx="34" 
            cy="52" 
            r="13" 
            fill="#f15a24" 
            fillOpacity="0.8"
            className="filter drop-shadow-[0_0_8px_#f15a24]"
          />

          <g>
            {/* 2. Left Palm Tree */}
            <path 
              d="M 28 65 Q 26 50 18 44 Q 21 50 29 65 Z" 
              fill="currentColor" 
              fillOpacity="0.5"
              stroke={strokeColor}
              strokeWidth="0.5"
            />
            <path d="M 18 44 Q 10 40 4 46 C 10 45 14 44 18 44" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />
            <path d="M 18 44 Q 8 46 3 54 C 9 51 14 48 18 44" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />
            <path d="M 18 44 Q 22 36 28 38 C 24 40 21 42 18 44" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />
            <path d="M 18 44 Q 24 44 28 50 C 23 48 20 46 18 44" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />
            <path d="M 18 44 Q 12 50 8 56 C 12 52 15 48 18 44" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />
            <path d="M 18 44 Q 16 34 14 28 C 16 34 17 39 18 44" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />

            {/* 3. Right Palm Tree */}
            <path 
              d="M 39 65 Q 36 46 47 33 Q 39 44 40 65 Z" 
              fill="currentColor" 
              fillOpacity="0.5"
              stroke={strokeColor}
              strokeWidth="0.5"
            />
            <path d="M 47 33 Q 45 21 42 14 C 45 21 46 27 47 33" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />
            <path d="M 47 33 Q 37 27 29 33 C 37 32 42 32 47 33" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />
            <path d="M 47 33 Q 35 35 28 43 C 36 39 42 36 47 33" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />
            <path d="M 47 33 Q 57 25 65 30 C 57 30 52 31 47 33" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />
            <path d="M 47 33 Q 59 34 67 42 C 58 38 52 35 47 33" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />
            <path d="M 47 33 Q 56 43 61 51 C 54 45 50 39 47 33" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />
            <path d="M 47 33 Q 41 41 36 48 C 41 41 44 37 47 33" fill="currentColor" fillOpacity="0.7" stroke={strokeColor} strokeWidth="0.3" />

            {/* 4. Grassy Island Base & Shrubbery */}
            <path 
              d="M 12 65 Q 28 62 48 65 Q 40 63 12 65" 
              fill="currentColor" 
              fillOpacity="0.8"
              stroke={strokeColor}
              strokeWidth="0.5"
            />
            <path 
              d="M 18 65 L 17 60 L 19 65 L 21 58 L 22 65 L 25 59 L 26 65 L 29 58 L 31 65 L 34 61 L 35 65 L 38 58 L 39 65" 
              stroke={strokeColor} 
              strokeWidth="0.8" 
              strokeLinecap="round" 
              fill={fillStyle} 
            />
            <path 
              d="M 40 65 L 41 61 L 43 65 L 44 59 L 45 65" 
              stroke={strokeColor} 
              strokeWidth="0.8" 
              strokeLinecap="round" 
              fill={fillStyle} 
            />

            {/* 5. Elegant Water Waves Rippling below island */}
            <path 
              d="M 10 68 C 18 67, 22 69, 30 68 C 38 67, 42 69, 50 68" 
              fill="none" 
              stroke={strokeColor} 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeOpacity="0.8"
            />
            <path 
              d="M 15 71 C 21 70, 25 72, 31 71 C 37 70, 41 72, 45 71" 
              fill="none" 
              stroke={strokeColor} 
              strokeWidth="0.8" 
              strokeLinecap="round" 
              strokeOpacity="0.6"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

const JungleBackground = () => {
  const location = useLocation();
  const isDetailsPage = /^\/(destinations|hotels|packages|vehicles)\/[^/]+$/.test(location.pathname);

  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [leavesConfig, setLeavesConfig] = useState<any>({
    topLeft: { imgUrl: "/sigiriya_uploaded.png", scale: 1.8, x: 12, y: 10 },
    topRight: { imgUrl: "/dambulla_cave_temple.jpg", scale: 1.8, x: 5, y: 0 },
    bottomLeft: { imgUrl: "/galle_lighthouse.jpg", scale: 1.8, x: 5, y: -10 },
    bottomRight: { imgUrl: "/dalada_maligawa.jpg", scale: 1.7, x: 12, y: 0 }
  });

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchSettings = () => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data && data.leaves) {
            setLeavesConfig(prev => ({
              ...prev,
              ...data.leaves
            }));
          }
        })
        .catch(console.error);
    };

    fetchSettings();

    window.addEventListener('leaf-settings-updated', fetchSettings);
    return () => {
      window.removeEventListener('leaf-settings-updated', fetchSettings);
    };
  }, []);

  useLayoutEffect(() => {
    let ctx: gsap.Context;
    // Wait a tick to make sure the body has height
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // 1. Background image zooms in continuously to give the feeling of moving forward
        gsap.to(bgRef.current, {
          scale: 2.5,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
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
            invalidateOnRefresh: true,
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

        // Glass palm tree badge appearing and swinging across smoothly, then fading out
        const badgeTl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: '2% top',
            end: '50% top',
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
        
        badgeTl.fromTo('.global-glass-badge', 
          { x: '100vw', y: '10vh', rotate: -45, scale: 0.6, opacity: 0 },
          { x: '25vw', y: '45vh', rotate: 0, opacity: 1, scale: 2.2, ease: 'sine.inOut', duration: 26 }
        ).to('.global-glass-badge', {
          y: '20vh', opacity: 0, scale: 1.5, ease: 'power2.in', duration: 22
        });

        // Reisenova Travel & Tours text flying in on scroll trigger, then fading out
        const textTl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: '5% top',
            end: '55% top',
            scrub: 2,
            invalidateOnRefresh: true,
          }
        });

        textTl.fromTo('.global-reisenova-text',
          { x: '110vw', y: '80vh', rotate: -15, scale: 0.5, opacity: 0 },
          { x: '52vw', y: '72vh', rotate: 0, scale: 1.4, opacity: 1, ease: 'sine.out', duration: 33 }
        ).to('.global-reisenova-text', {
          y: '90vh', opacity: 0, scale: 0.8, ease: 'power2.in', duration: 17
        });

        
      }, containerRef);
    }, 150); // Slight delay to let components mount and lenis to scroll to top
    
    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [location.pathname]);

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
      <div className="absolute inset-0 w-[120%] max-w-none h-[120%] -left-[10%] -top-[10%] z-0">
        <div className="absolute inset-0 bg-sand/80 dark:bg-white/70 z-10 transition-colors duration-500" />
        <img
          ref={bgRef}
          src="https://images.unsplash.com/photo-1518182170546-076616fdacaf?q=80&w=2940&auto=format&fit=crop"
          alt="Deep Jungle Sri Lanka"
          className="w-full h-full object-cover origin-center opacity-50 dark:opacity-75"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      {/* Wildlife */}
      <div className="absolute inset-0 z-10 transform-style-3d">
        <div style={{ opacity: isDetailsPage ? 0 : 1, transition: 'opacity 0.5s ease' }}>
          {/* Glass Palm Tree Badge (replacing the monkey) */}
          <div className="global-glass-badge absolute top-0 left-0 opacity-0 transform-gpu will-change-transform pointer-events-none select-none z-40">
            <GlassPalmTreeBadge className="w-64 h-64" isDark={isDark} />
          </div>
          
          {/* Reisenova Travel & Tours text (replacing the bird with a merging transition) */}
          <div className="global-reisenova-text absolute top-0 left-0 opacity-0 transform-gpu will-change-transform pointer-events-none select-none z-50">
          <div className="flex flex-col items-start p-2">
            <span 
              className="text-4xl md:text-6xl font-logo font-bold tracking-[0.04em] uppercase text-orange italic leading-none"
              style={{
                fontFamily: '"Permanent Marker", "Caveat", "Playfair Display", cursive',
                textShadow: '1px 1px 0px rgba(255,255,255,1), -1px 1px 0px rgba(255,255,255,1), 1px -1px 0px rgba(255,255,255,1), -1px -1px 0px rgba(255,255,255,1), 0 0 6px rgba(255,255,255,1)'
              }}
            >
              REISENOVA
            </span>
            <span 
              className="text-xs md:text-sm font-semibold tracking-[0.35em] uppercase mt-2 filter"
              style={{
                letterSpacing: '0.35em',
                color: isDark ? '#ffffff' : '#000000',
                textShadow: isDark 
                  ? '1px 1px 0px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.8)' 
                  : '1px 1px 0px rgba(255,255,255,0.8), 0 1px 2px rgba(255,255,255,0.3)'
              }}
            >
              TRAVEL & TOURS
            </span>
          </div>
        </div>
        </div>
      </div>

      {/* Leaves */}
      <div className="absolute inset-0 z-20 transform-style-3d">
        {/* Initial foreground leaves - Top Left */}
        <SigiriyaLeaf className="global-leaf-1 absolute -top-12 -left-24 w-[36rem] h-[36rem] z-30 transform-gpu will-change-transform rotate-[120deg]" rotation={120} config={leavesConfig.topLeft} />
        <HabaralaLeaf className="global-leaf-1a absolute top-12 -left-36 w-[30rem] h-[30rem] text-[#243d2e] dark:text-[#fdfbf7]/5 rotate-[145deg] z-20 transform-gpu will-change-transform" />
        <HabaralaLeaf className="global-leaf-1b absolute -top-28 left-12 w-[34rem] h-[34rem] text-[#32523f] dark:text-[#fdfbf7]/5 rotate-[90deg] z-10 transform-gpu will-change-transform" />

        {/* Initial foreground leaves - Top Right */}
        <DambullaCaveTempleLeaf className="global-leaf-2 absolute -top-24 -right-24 w-[33rem] h-[33rem] z-30 transform-gpu will-change-transform rotate-[-60deg]" rotation={-60} config={leavesConfig.topRight} />
        <HabaralaLeaf className="global-leaf-2a absolute top-16 -right-32 w-[32rem] h-[32rem] text-[#193222] dark:text-[#fdfbf7]/5 rotate-[-85deg] z-20 transform-gpu will-change-transform" />
        <HabaralaLeaf className="global-leaf-2b absolute -top-10 right-32 w-[22rem] h-[22rem] text-[#254231] dark:text-[#fdfbf7]/5 rotate-[-30deg] z-10 transform-gpu will-change-transform" />

        {/* Initial foreground leaves - Bottom Left */}
        <GalleLighthouseLeaf className="global-leaf-7 absolute -bottom-10 -left-16 w-[36rem] h-[36rem] z-30 transform-gpu will-change-transform rotate-[60deg]" rotation={60} config={leavesConfig.bottomLeft} />
        <HabaralaLeaf className="global-leaf-7a absolute -bottom-24 left-10 w-[42rem] h-[42rem] text-[#172d1f] dark:text-[#fdfbf7]/5 rotate-[35deg] z-20 transform-gpu will-change-transform" />

        {/* Initial foreground leaves - Bottom Right */}
        <DaladaMaligawaLeaf className="global-leaf-8 absolute -bottom-36 -right-36 w-[43rem] h-[43rem] z-30 transform-gpu will-change-transform rotate-[-45deg]" rotation={-45} config={leavesConfig.bottomRight} />
        <HabaralaLeaf className="global-leaf-8a absolute -bottom-10 right-24 w-[30rem] h-[30rem] text-[#1a3322] dark:text-[#fdfbf7]/5 rotate-[-15deg] z-20 transform-gpu will-change-transform" />
        
      </div>
    </div>
  );
};

export default JungleBackground;
