import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Edit, Save, Info } from 'lucide-react';
import gsap from 'gsap';

const defaultImages = [
  { url: 'https://images.unsplash.com/photo-1579685655767-f3c5b967d26b?q=80&w=1400&auto=format&fit=crop', title: 'Mirissa Shores' },
  { url: 'https://images.unsplash.com/photo-1625736173004-94944d1809a7?q=80&w=1400&auto=format&fit=crop', title: 'Nine Arch Bridge' },
  { url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1400&auto=format&fit=crop', title: 'South Coast Surf' },
  { url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1400&auto=format&fit=crop', title: 'Hill Country' },
  { url: 'https://images.unsplash.com/photo-1586523925763-8a3fc073a62d?q=80&w=1400&auto=format&fit=crop', title: 'Galle Fort' },
];

const Gallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    galleryTitle1: 'Visual',
    galleryTitle2: 'Poetry',
    galleryImages: defaultImages
  });
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdminLoggedIn') === 'true');
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) {
        setSettings(prev => ({
          ...prev,
          galleryTitle1: data.galleryTitle1 || prev.galleryTitle1,
          galleryTitle2: data.galleryTitle2 || prev.galleryTitle2,
          galleryImages: data.galleryImages || prev.galleryImages
        }));
      }
    }).catch(console.error);
  }, []);

  useLayoutEffect(() => {
    if (isEditing) return; // Disable gsap while editing to allow easy interaction
    
    const ctx = gsap.context(() => {
      const slider = sliderRef.current;
      if (!slider) return;
      const items = gsap.utils.toArray('.gallery-h-item');
      
      if (items.length > 0) {
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
          gsap.fromTo(img, 
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: () => "+=" + slider.offsetWidth,
                scrub: true,
              }
            }
          );
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [isEditing, settings.galleryImages]); // Re-run when editing changes or images change

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageTitleChange = (idx: number, value: string) => {
    setSettings(prev => {
      const newImages = [...prev.galleryImages];
      newImages[idx] = { ...newImages[idx], title: value };
      return { ...prev, galleryImages: newImages };
    });
  };

  const handleSave = async () => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
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
        setSettings(prev => {
          const newImages = [...prev.galleryImages];
          newImages[idx] = { ...newImages[idx], url: data.imageUrl };
          return { ...prev, galleryImages: newImages };
        });
      }
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <div className="gallery-wrapper relative">
      <section id="gallery" ref={containerRef} className={`${isEditing ? 'min-h-screen py-32 overflow-y-auto flex-col' : 'h-screen overflow-hidden'} w-full bg-transparent text-forest dark:text-[#fdfbf7] relative flex items-center`}>
        
        {isAdmin && (
          <div className="absolute top-4 right-4 z-[100] fixed md:absolute">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-full hover:bg-orange/90 transition-colors shadow-lg text-sm font-bold">
                <Edit size={16} /> Edit Section
              </button>
            ) : (
              <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors shadow-lg text-sm font-bold">
                <Save size={16} /> Save Changes
              </button>
            )}
          </div>
        )}

        <div className={`${isEditing ? 'w-full px-6 mb-12 max-w-[1400px] mx-auto z-20' : 'absolute top-12 left-6 md:left-12 z-20'}`}>
          {isEditing ? (
            <div className="space-y-4 max-w-lg">
              {/* Image size recommendation banner */}
              <div className="bg-[#fff9e6] dark:bg-[#1f1a10] border border-[#ffb74d] text-[#e65100] dark:text-[#ffb74d] p-4 rounded-xl flex items-start gap-3 shadow-md mb-4 text-xs md:text-sm">
                <Info className="shrink-0 mt-0.5 text-orange" size={20} />
                <div className="space-y-1 font-medium">
                  <p className="font-bold">Recommended Image Dimensions for perfect, crop-free display:</p>
                  <p className="opacity-95">• 1400 x 800 pixels (or any landscape image with a 16:9 aspect ratio)</p>
                  <div className="pt-1.5 border-t border-[#ffb74d]/30 mt-1.5">
                    <p className="font-bold">කැපී යාම වළක්වා (Crop නොවී) පින්තූරය නිවැරදිව දර්ශනය වීමට නිර්දේශිත ප්‍රමාණය:</p>
                    <p className="opacity-95">• 1400 x 800 pixels (හෝ 16:9 Landscape අනුපාතයේ පින්තූරයක්)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-white/10 p-4 rounded-xl backdrop-blur-md">
                <input 
                  type="text" 
                  name="galleryTitle1" 
                  value={settings.galleryTitle1} 
                  onChange={handleChange} 
                  className="w-full bg-white/50 border border-forest/20 p-2 rounded text-xl font-serif text-forest" 
                  placeholder="Title Line 1"
                />
                <input 
                  type="text" 
                  name="galleryTitle2" 
                  value={settings.galleryTitle2} 
                  onChange={handleChange} 
                  className="w-full bg-white/50 border border-forest/20 p-2 rounded text-xl font-serif text-orange" 
                  placeholder="Title Line 2"
                />
              </div>
            </div>
          ) : (
            <h2 className="text-4xl md:text-6xl font-serif text-forest dark:text-[#fdfbf7] tracking-tight drop-shadow-sm">
              {settings.galleryTitle1} <span className="italic text-orange">{settings.galleryTitle2}</span>
            </h2>
          )}
        </div>

        <div ref={sliderRef} className={`${isEditing ? 'flex flex-col gap-12 w-full px-6 max-w-[1400px] mx-auto pb-20' : 'flex h-full items-center relative z-10 pt-20'}`} style={!isEditing ? { width: `${settings.galleryImages.length * 100}vw` } : {}}>
          {settings.galleryImages.map((item, idx) => (
            <div key={idx} className={`${isEditing ? 'w-full relative rounded-3xl overflow-hidden h-[400px]' : 'gallery-h-item w-screen h-[70vh] flex items-center justify-center relative px-4 md:px-20 shrink-0 perspective-[1500px]'}`}>
              <div className={`w-full h-full relative overflow-hidden rounded-3xl group ${isEditing ? '' : 'cursor-pointer shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-forest/10 dark:border-white/10 transform-style-3d'}`}>
                {!isEditing && <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700 z-10" />}
                
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className={`${isEditing ? 'w-full h-full object-cover' : 'w-[120%] max-w-none h-full object-cover absolute left-[-10%] will-change-transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out pointer-events-none'}`}
                />
                
                <div className={`absolute bottom-12 left-12 z-20 ${isEditing ? 'right-12' : 'overflow-hidden transform-style-3d'}`} style={isEditing ? {} : { transform: 'translateZ(60px)' }}>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={item.title} 
                      onChange={(e) => handleImageTitleChange(idx, e.target.value)} 
                      className="w-full bg-black/50 text-white border border-white/20 p-3 rounded-lg text-2xl font-serif backdrop-blur-md" 
                      placeholder="Image Title"
                    />
                  ) : (
                    <h3 className="text-5xl md:text-7xl font-serif text-[#fdfbf7] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-out drop-shadow-2xl">
                      {item.title}
                    </h3>
                  )}
                </div>

                {isAdmin && isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none">
                    <button onClick={() => fileInputRefs.current[idx]?.click()} className="bg-white/90 text-forest p-4 rounded-full hover:bg-orange hover:text-white transition-colors pointer-events-auto">
                      <Edit size={24} />
                    </button>
                    <input type="file" ref={el => fileInputRefs.current[idx] = el} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, idx)} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress indicator hint */}
        {!isEditing && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            <div className="w-24 h-1 bg-forest/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-orange origin-left animate-pulse" />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Gallery;
