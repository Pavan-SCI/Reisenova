import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Edit } from 'lucide-react';
import gsap from 'gsap';

const Beauty = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState({
    beautyImage1: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=2868&auto=format&fit=crop',
    beautyImage2: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2940&auto=format&fit=crop'
  });
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);
  const fileInputMobileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdminLoggedIn') === 'true');
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data && data.beautyImage1) {
        setSettings({
          beautyImage1: data.beautyImage1 || settings.beautyImage1,
          beautyImage2: data.beautyImage2 || settings.beautyImage2
        });
      }
    }).catch(console.error);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageKey: 'beautyImage1' | 'beautyImage2') => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const newSettings = { ...settings, [imageKey]: data.imageUrl };
        setSettings(newSettings);
        // Save to backend
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings)
        });
      }
    } catch (err) {
      console.error('Upload failed', err);
    }
  };


  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Huge background text scroll parallax
      gsap.to(bgTextRef.current, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Parallax for the images
      gsap.to('.beauty-img-1', {
        y: -150,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.beauty-img-2', {
        y: 100,
        x: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Text reveal with mask effect
      gsap.fromTo(
        '.beauty-text-line',
        { y: 150, opacity: 0, rotateX: 30, z: -100 },
        {
          y: 0, opacity: 1,
          
          rotateX: 0,
          z: 0,
          stagger: 0.1,
          ease: 'power3.out',
          transformPerspective: 1200,
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
            end: 'center center',
            scrub: 1.5,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 md:px-12 w-full relative overflow-hidden bg-transparent text-forest dark:text-[#fdfbf7]">
      {/* Huge Background Text */}
      <h2 
        ref={bgTextRef} 
        className="absolute top-1/4 left-0 text-[10rem] md:text-[15rem] lg:text-[25rem] font-serif font-bold text-forest/ dark:text-[#fdfbf7]/[0.03] whitespace-nowrap pointer-events-none select-none z-0 tracking-tighter"
      >
        CUSTOM TRIPS
      </h2>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 transform-style-3d">
        {/* Images */}
        <div ref={imageRef} className="relative h-[600px] md:h-[900px] w-full hidden md:block perspective-[1200px]">
          <div className="beauty-img-1 absolute top-0 right-[5%] w-[60%] h-[70%] z-10 overflow-hidden rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] transform-style-3d group" style={{ transform: 'translateZ(40px)' }}>
            <img 
              src={settings.beautyImage1} 
              alt="Tea Plantations" 
              className="w-full h-full absolute inset-0 object-cover"
            />
            {isAdmin && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                <button onClick={() => fileInput1Ref.current?.click()} className="bg-white/90 text-forest p-3 rounded-full hover:bg-orange hover:text-white transition-colors">
                  <Edit size={24} />
                </button>
                <input type="file" ref={fileInput1Ref} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'beautyImage1')} />
              </div>
            )}
          </div>
          <div className="beauty-img-2 absolute bottom-[5%] left-[0%] w-[60%] h-[70%] z-20 overflow-hidden rounded-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border border-white/40 backdrop-blur-md transform-style-3d group" style={{ transform: 'translateZ(80px)' }}>
            <img 
              src={settings.beautyImage2} 
              alt="Surfing Sri Lanka" 
              className="w-full h-full object-cover scale-110"
            />
            {isAdmin && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                <button onClick={() => fileInput2Ref.current?.click()} className="bg-white/90 text-forest p-3 rounded-full hover:bg-orange hover:text-white transition-colors">
                  <Edit size={24} />
                </button>
                <input type="file" ref={fileInput2Ref} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'beautyImage2')} />
              </div>
            )}
          </div>
        </div>

        {/* Text */}
        <div ref={textRef} className="flex flex-col justify-center space-y-10 z-20 pt-20 lg:pt-0 transform-style-3d" style={{ transform: 'translateZ(50px)' }}>
          <div className="overflow-hidden">
            <p className="beauty-text-line text-orange uppercase tracking-[0.4em] text-sm font-semibold">Tailor-Made Journeys</p>
          </div>
          <div className="overflow-hidden">
            <h2 className="beauty-text-line text-6xl md:text-8xl font-serif text-forest dark:text-[#fdfbf7] leading-[1.1] tracking-tight drop-shadow-sm">
              Design Your <br/><span className="italic text-orange font-light">Dream Trip</span>
            </h2>
          </div>
          <div className="space-y-6 pt-6">
            <div className="overflow-hidden">
              <p className="beauty-text-line text-xl text-forest/70 dark:text-[#fdfbf7]/70 leading-relaxed font-medium max-w-lg">
                No two travelers are alike. That's why we specialize in creating fully customized itineraries tailored to your unique interests.
              </p>
            </div>
            <div className="overflow-hidden">
              <p className="beauty-text-line text-lg text-forest/60 dark:text-[#fdfbf7]/60 leading-relaxed font-light max-w-lg">
                Whether you're seeking a thrilling adventure, a serene wellness retreat, or a deep dive into rich cultural heritage, our local experts will craft the perfect Sri Lankan experience for you.
              </p>
            </div>
          </div>
          
          <div className="pt-10 overflow-hidden">
            <a href="/plan-trip" className="beauty-text-line inline-flex items-center gap-4 group">
              <span className="border-b border-white/30 pb-1 text-forest dark:text-[#fdfbf7] tracking-[0.2em] uppercase text-sm font-bold group-hover:text-orange group-hover:border-orange transition-colors duration-300">
                Start Planning
              </span>
              <div className="w-10 h-px bg-forest/30 group-hover:w-16 group-hover:bg-orange transition-all duration-500"></div>
            </a>
          </div>
        </div>
        
        {/* Mobile image fallback */}
        <div className="h-[500px] w-full md:hidden mt-12 overflow-hidden rounded-2xl relative shadow-2xl group">
           <img 
              src={settings.beautyImage1} 
              alt="Tea Plantations" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sand via-transparent to-transparent z-10 pointer-events-none" />
            {isAdmin && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                <button onClick={() => fileInputMobileRef.current?.click()} className="bg-white/90 text-forest p-3 rounded-full hover:bg-orange hover:text-white transition-colors">
                  <Edit size={24} />
                </button>
                <input type="file" ref={fileInputMobileRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'beautyImage1')} />
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default Beauty;
