import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Edit, Save } from 'lucide-react';
import gsap from 'gsap';

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    aboutTitle1: 'Your Trusted',
    aboutTitle2: 'Local Experts',
    aboutDesc1: "At Reisenova Travel & Tours, we believe that traveling is more than just visiting a place; it's about experiencing its soul. Based in the heart of Sri Lanka, our team of passionate locals is dedicated to unveiling the true magic of our island home.",
    aboutDesc2: "With over a decade of experience, we curate journeys that go beyond the ordinary. From hidden temples in the jungle to secluded pristine beaches, we provide authentic encounters, seamless logistics, and unparalleled personalized service.",
    aboutStat1Num: '10+',
    aboutStat1Label: 'Years Experience',
    aboutStat2Num: '5k+',
    aboutStat2Label: 'Happy Travelers',
    aboutImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2874&auto=format&fit=crop'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdminLoggedIn') === 'true');
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    }).catch(console.error);
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const newSettings = { ...settings, aboutImage: data.imageUrl };
        setSettings(newSettings);
        if (!isEditing) {
          await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSettings)
          });
        }
      }
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <section id="about" ref={containerRef} className="py-32 bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-forest/10 dark:border-white/10 text-forest dark:text-[#fdfbf7] relative overflow-hidden">
      
      {isAdmin && (
        <div className="absolute top-4 right-4 z-50">
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

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="order-2 lg:order-1 space-y-10 relative">
            <div className="about-reveal">
              <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">About Reisenova</p>
              
              {isEditing ? (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    name="aboutTitle1" 
                    value={settings.aboutTitle1} 
                    onChange={handleChange} 
                    className="w-full bg-white/50 border border-forest/20 p-2 rounded text-2xl font-serif text-forest" 
                    placeholder="Title Line 1"
                  />
                  <input 
                    type="text" 
                    name="aboutTitle2" 
                    value={settings.aboutTitle2} 
                    onChange={handleChange} 
                    className="w-full bg-white/50 border border-forest/20 p-2 rounded text-2xl font-serif text-orange" 
                    placeholder="Title Line 2"
                  />
                </div>
              ) : (
                <h2 className="text-5xl md:text-7xl font-serif leading-tight">
                  {settings.aboutTitle1} <br/>
                  <span className="italic text-orange font-light">{settings.aboutTitle2}</span>
                </h2>
              )}
            </div>
            
            <div className="about-reveal space-y-6 text-forest/70 dark:text-[#fdfbf7]/70 font-light text-lg">
              {isEditing ? (
                <div className="space-y-4">
                  <textarea 
                    name="aboutDesc1" 
                    value={settings.aboutDesc1} 
                    onChange={handleChange} 
                    className="w-full bg-white/50 border border-forest/20 p-3 rounded text-forest min-h-[100px]" 
                    placeholder="Paragraph 1"
                  />
                  <textarea 
                    name="aboutDesc2" 
                    value={settings.aboutDesc2} 
                    onChange={handleChange} 
                    className="w-full bg-white/50 border border-forest/20 p-3 rounded text-forest min-h-[100px]" 
                    placeholder="Paragraph 2"
                  />
                </div>
              ) : (
                <>
                  <p>{settings.aboutDesc1}</p>
                  <p>{settings.aboutDesc2}</p>
                </>
              )}
            </div>
            
            <div className="about-reveal flex gap-12 pt-6">
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input type="text" name="aboutStat1Num" value={settings.aboutStat1Num} onChange={handleChange} className="w-full bg-white/50 border border-forest/20 p-1 rounded text-lg font-serif text-forest" />
                    <input type="text" name="aboutStat1Label" value={settings.aboutStat1Label} onChange={handleChange} className="w-full bg-white/50 border border-forest/20 p-1 rounded text-sm text-forest" />
                  </div>
                ) : (
                  <>
                    <h4 className="text-4xl font-serif text-forest dark:text-[#fdfbf7] mb-2">{settings.aboutStat1Num}</h4>
                    <p className="text-sm uppercase tracking-widest text-forest/60 dark:text-[#fdfbf7]/60 font-semibold">{settings.aboutStat1Label}</p>
                  </>
                )}
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input type="text" name="aboutStat2Num" value={settings.aboutStat2Num} onChange={handleChange} className="w-full bg-white/50 border border-forest/20 p-1 rounded text-lg font-serif text-forest" />
                    <input type="text" name="aboutStat2Label" value={settings.aboutStat2Label} onChange={handleChange} className="w-full bg-white/50 border border-forest/20 p-1 rounded text-sm text-forest" />
                  </div>
                ) : (
                  <>
                    <h4 className="text-4xl font-serif text-forest dark:text-[#fdfbf7] mb-2">{settings.aboutStat2Num}</h4>
                    <p className="text-sm uppercase tracking-widest text-forest/60 dark:text-[#fdfbf7]/60 font-semibold">{settings.aboutStat2Label}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative about-reveal h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
            <img 
              src={settings.aboutImage} 
              alt="About Us Sri Lanka" 
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-forest/10 hover:bg-transparent transition-colors duration-500 pointer-events-none" />
            
            {isAdmin && isEditing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 transition-opacity">
                <button onClick={() => fileInputRef.current?.click()} className="bg-white/90 text-forest p-3 rounded-full hover:bg-orange hover:text-white transition-colors">
                  <Edit size={24} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            )}
            {isAdmin && !isEditing && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center z-20 transition-opacity">
                <button onClick={() => fileInputRef.current?.click()} className="bg-white/90 text-forest p-3 rounded-full hover:bg-orange hover:text-white transition-colors">
                  <Edit size={24} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
