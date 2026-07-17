import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, MapPin, Plus, Edit, Trash, X } from 'lucide-react';

const DestinationsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<any[]>([]);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', location: '', description: '', fullDesc: '', bestTimeToVisit: '', activities: '', image: '', images: [] as string[], price: '', highlights: '' });

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadData = new FormData();
    Array.from(files).forEach(file => {
      uploadData.append('images', file);
    });

    setIsUploading(true);
    try {
      const res = await fetch('/api/upload/multiple', {
        method: 'POST',
        body: uploadData,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({
          ...prev, 
          images: [...prev.images, ...(data.imageUrls || [])]
        }));
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading images');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const fetchDestinations = async () => {
    try {
      const res = await fetch('/api/destinations');
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          desc: d.description || d.location,
          img: d.images?.[0] || d.image || 'https://images.unsplash.com/photo-1588258524451-24905d53a992?q=80&w=2940&auto=format&fit=crop',
          images: d.images || (d.image ? [d.image] : []),
          category: d.highlights && d.highlights.length > 0 ? d.highlights[0] : 'General',
          originalData: d
        }));
        setDestinations(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch destinations', err);
    }
  };

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdminLoggedIn') === 'true');
    fetchDestinations();
  }, []);

  useLayoutEffect(() => {
    let ctx: gsap.Context;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          '.dest-reveal',
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
          }
        );
      });
    }, 150);
    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardsRef.current[idx];
    if (!card) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1200,
      ease: 'power2.out',
      duration: 0.5,
    });
    
    const img = card.querySelector('img');
    if (img) {
      gsap.to(img, {
        x: ((x - centerX) / centerX) * -15,
        y: ((y - centerY) / centerY) * -15,
        scale: 1.15,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = (idx: number) => {
    const card = cardsRef.current[idx];
    if (!card) return;
    
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: 'power3.out',
      duration: 0.8,
    });
    
    const img = card.querySelector('img');
    if (img) {
      gsap.to(img, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out',
      });
    }
  };

  const handleEditClick = (e: React.MouseEvent, dest: any) => {
    e.stopPropagation();
    setEditingDest(dest);
    setFormData({
      name: dest.name,
      location: dest.originalData?.location || '',
      description: dest.originalData?.description || dest.desc || '',
      fullDesc: dest.originalData?.fullDesc || '',
      bestTimeToVisit: dest.originalData?.bestTimeToVisit || '',
      activities: dest.originalData?.activities?.join(', ') || '',
      image: dest.img,
      images: dest.images || [],
      price: dest.originalData?.price || '',
      highlights: dest.originalData?.highlights?.join(', ') || dest.category || ''
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingDest(null);
    setFormData({ name: '', location: '', description: '', fullDesc: '', bestTimeToVisit: '', activities: '', image: '', images: [], price: '', highlights: '' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, destId: string) => {
    e.stopPropagation();
    try {
      await fetch(`/api/destinations/${destId}`, { method: 'DELETE' });
      fetchDestinations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      image: formData.images?.[0] || '',
      images: formData.images || [],
      price: Number(formData.price),
      highlights: formData.highlights.split(',').map(h => h.trim()).filter(h => h !== ''),
      activities: formData.activities.split(',').map(a => a.trim()).filter(a => a !== '')
    };

    try {
      if (editingDest && editingDest.originalData?.id) {
        await fetch(`/api/destinations/${editingDest.originalData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchDestinations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isUser = localStorage.getItem('isUserLoggedIn') === 'true';
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isUser && !isAdmin) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (<>
    
      {/* Fixed Back Button */}
      <div className="fixed top-6 left-4 md:left-8 z-50">
        <Link to="/" className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-forest/10 dark:border-white/10 text-forest dark:text-[#fdfbf7] hover:bg-orange hover:text-[#fdfbf7] dark:hover:bg-orange transition-all uppercase tracking-widest text-[10px] md:text-xs font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
<section ref={containerRef} className="min-h-screen pt-24 pb-24 md:pt-32 md:pb-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden transition-colors duration-500 ">

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-16 md:mb-20 dest-reveal text-center max-w-3xl mx-auto opacity-0">
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Iconic Locations</p>
          <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-tight drop-shadow-sm text-forest dark:text-[#fdfbf7]">
            Explore <span className="italic text-orange font-light">Destinations</span>
          </h2>
          <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light text-lg">
            Discover the rich diversity of Sri Lanka, from mist-shrouded mountains and ancient ruins to golden shores and vibrant wildlife parks.
          </p>
          {isAdmin && (
            <div className="mt-8 flex justify-center gap-4">
              <button 
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-orange text-white px-6 py-3 rounded-full hover:bg-orange/90 transition-colors shadow-lg font-bold tracking-widest uppercase text-sm"
              >
                <Plus size={18} /> Add New Destination
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {destinations.map((dest, index) => (
            <div 
              key={dest.name + index}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onClick={() => navigate(`/destinations/${dest.id || dest.name.toLowerCase()}`)}
              className="group relative h-[550px] cursor-pointer"
              style={{ perspective: '1200px' }}
            >
              <div
                ref={el => { cardsRef.current[index] = el; }}
                className="dest-card-inner relative w-full h-full overflow-hidden rounded-2xl shadow-xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-500 bg-[#fdfbf7] dark:bg-[#0a0f0d] border border-forest/10 dark:border-white/10"
              >
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-[#0a0f0d]/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-forest dark:text-[#fdfbf7] z-30 shadow-sm pointer-events-none">
                  {dest.category}
                </div>

                {isAdmin && (
                  <div className="absolute top-4 left-4 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                    <button onClick={(e) => handleEditClick(e, dest)} className="bg-white/90 text-forest p-2 rounded-full hover:bg-orange hover:text-white transition-colors cursor-pointer">
                      <Edit size={16} />
                    </button>
                    <button onClick={(e) => handleDeleteClick(e, dest.id)} className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors cursor-pointer">
                      <Trash size={16} />
                    </button>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
                
                <img 
                  src={dest.img} 
                  alt={dest.name} 
                  className="w-[115%] max-w-none h-[115%] -left-[7.5%] -top-[7.5%] absolute object-cover pointer-events-none"
                />
                
                <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
                  <h3 className="text-4xl font-serif text-[#fdfbf7] mb-3 drop-shadow-lg pointer-events-none">{dest.name}</h3>
                  <p className="text-[#fdfbf7]/90 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pointer-events-none">{dest.desc}</p>
                  
                  <div className="mt-6 overflow-hidden h-0 group-hover:h-10 transition-all duration-500 flex items-center pointer-events-auto">
                    <Link to="/plan-trip" onClick={handleBookClick} className="text-sm font-semibold tracking-widest uppercase text-[#fdfbf7] hover:text-orange transition-colors flex items-center gap-2 cursor-pointer">
                      Include in Trip
                      <div className="w-6 h-px bg-current"></div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
    
    {/* Admin Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
        <div className="bg-[#fdfbf7] dark:bg-[#121915] text-forest dark:text-[#fdfbf7] p-8 rounded-2xl w-full max-w-2xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
          <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 opacity-50 hover:opacity-100 hover:text-orange transition-colors z-10">
            <X size={24} />
          </button>
          
          <h2 className="text-3xl font-serif mb-6">{editingDest ? 'Edit Destination' : 'Add New Destination'}</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar" data-lenis-prevent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Location</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" />
              </div>
            </div>
            
            <div>
              <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Short Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors min-h-[60px]" />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Full Detail Description</label>
              <textarea value={formData.fullDesc} onChange={e => setFormData({...formData, fullDesc: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors min-h-[100px]" />
            </div>
            
            <div>
              <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Upload Images (Max 10)</label>
              <div className="flex gap-4 items-center">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-2 outline-none focus:border-orange transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange/10 file:text-orange hover:file:bg-orange/20" />
                {isUploading && <span className="text-xs text-orange animate-pulse">Uploading...</span>}
              </div>
              
              {formData.images && formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-forest/20 dark:border-[#fdfbf7]/20">
                      <img src={imgUrl} alt={`Preview ${idx}`} className="w-full h-24 object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Best Time To Visit</label>
                <input type="text" value={formData.bestTimeToVisit} onChange={e => setFormData({...formData, bestTimeToVisit: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" placeholder="e.g. December to April" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Price ($)</label>
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Activities (comma separated)</label>
                <input type="text" value={formData.activities} onChange={e => setFormData({...formData, activities: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" placeholder="Hiking, Surfing..." />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Highlights (comma separated)</label>
                <input type="text" value={formData.highlights} onChange={e => setFormData({...formData, highlights: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" placeholder="Heritage, Nature, Wildlife..." />
              </div>
            </div>
            
            <button type="submit" className="mt-4 bg-orange text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-orange/90 transition-colors">
              {editingDest ? 'Save Changes' : 'Create Destination'}
            </button>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default DestinationsPage;
