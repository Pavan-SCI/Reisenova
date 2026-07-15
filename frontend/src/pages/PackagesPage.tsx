import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Calendar, MapPin, Clock, Plus, Edit, Trash, X } from 'lucide-react';

const PackagesPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [packages, setPackages] = useState<any[]>([]);
  const [bookedItemIds, setBookedItemIds] = useState<Set<string>>(new Set());
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', duration: '', description: '', fullDesc: '', image: '', images: [] as string[], price: '', destinations: '', highlights: '', inclusions: '' });

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

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          desc: d.description,
          duration: d.duration,
          destinations: d.destinations || d.included || [],
          img: d.images?.[0] || d.image || 'https://images.unsplash.com/photo-1620803457106-92c2865954ec?q=80&w=2940&auto=format&fit=crop',
          images: d.images || (d.image ? [d.image] : []),
          price: `From $${d.price}`,
          originalData: d
        }));
        setPackages(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch packages', err);
    }
  };

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdminLoggedIn') === 'true');
    fetchPackages();
    
    const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
    if (userId) {
      fetch(`/api/bookings/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.packages) {
            const ids = new Set<string>();
            data.packages.forEach((b: any) => ids.add(b.packageId));
            setBookedItemIds(ids);
          }
        })
        .catch(console.error);
    }
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pkg-reveal',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
        }
      );
    });
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (packages.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.pkg-card').forEach((card: any) => {
        gsap.fromTo(card, 
          { y: 100, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, [packages]);

  const handleEditClick = (e: React.MouseEvent, pkg: any) => {
    e.stopPropagation();
    setEditingPkg(pkg);
    setFormData({
      title: pkg.title,
      duration: pkg.originalData?.duration || pkg.duration || '',
      description: pkg.originalData?.description || pkg.desc || '',
      fullDesc: pkg.originalData?.fullDesc || pkg.fullDesc || '',
      image: pkg.img,
      images: pkg.images || [],
      price: pkg.originalData?.price || pkg.price.replace(/[^0-9]/g, ''),
      destinations: pkg.originalData?.destinations?.join(', ') || pkg.destinations?.join(', ') || '',
      highlights: pkg.originalData?.highlights?.join(', ') || pkg.highlights?.join(', ') || '',
      inclusions: pkg.originalData?.inclusions?.join(', ') || pkg.inclusions?.join(', ') || ''
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingPkg(null);
    setFormData({ title: '', duration: '', description: '', fullDesc: '', image: '', images: [], price: '', destinations: '', highlights: '', inclusions: '' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, pkgId: string) => {
    e.stopPropagation();
    try {
      await fetch(`/api/packages/${pkgId}`, { method: 'DELETE' });
      fetchPackages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      duration: formData.duration,
      description: formData.description,
      fullDesc: formData.fullDesc,
      image: formData.images?.[0] || '',
      images: formData.images || [],
      price: Number(formData.price),
      destinations: formData.destinations.split(',').map(h => h.trim()).filter(h => h !== ''),
      highlights: formData.highlights.split(',').map(h => h.trim()).filter(h => h !== ''),
      inclusions: formData.inclusions.split(',').map(h => h.trim()).filter(h => h !== '')
    };

    try {
      if (editingPkg && editingPkg.originalData?.id) {
        await fetch(`/api/packages/${editingPkg.originalData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookClick = async (e: React.MouseEvent, pkg: any) => {
    e.preventDefault();
    e.stopPropagation();
    const isUser = localStorage.getItem('isUserLoggedIn') === 'true';
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');

    if (!isUser && !isAdmin) {
      navigate('/login');
      return;
    }

    try {
      const payload = {
        userId: userId || userEmail || 'unknown_user', // fallback
        userEmail: userEmail || 'unknown_user',
        packageId: pkg.id,
        packageDetails: pkg
      };
      
      const res = await fetch('/api/bookings/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Package booked successfully!');
        setBookedItemIds(prev => new Set(prev).add(pkg.id));
      } else {
        alert('Failed to book package.');
      }
    } catch (err) {
      console.error(err);
      alert('Error booking package.');
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
 <section ref={containerRef} className="min-h-screen pt-24 pb-24 md:pt-32 md:pb-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden transition-colors duration-500">

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-16 md:mb-20 pkg-reveal text-center max-w-3xl mx-auto">
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Curated Experiences</p>
          <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-tight drop-shadow-sm text-forest dark:text-[#fdfbf7]">
            Our Tour <br />
            <span className="italic text-orange font-light">Packages</span>
          </h2>
          <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light text-lg">
            Discover the perfect journey tailored to your interests. From ancient ruins to pristine beaches, we have a package for every traveler.
          </p>
          {isAdmin && (
            <div className="mt-8 flex justify-center gap-4">
              <button 
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-orange text-white px-6 py-3 rounded-full hover:bg-orange/90 transition-colors shadow-lg font-bold tracking-widest uppercase text-sm"
              >
                <Plus size={18} /> Add New Package
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(`/packages/${pkg.id || pkg.title.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`)}
              className="pkg-card group bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer relative"
            >
              {isAdmin && (
                <div className="absolute top-4 left-4 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={(e) => handleEditClick(e, pkg)} className="bg-white/90 text-forest p-2 rounded-full hover:bg-orange hover:text-white transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={(e) => handleDeleteClick(e, pkg.id)} className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                    <Trash size={16} />
                  </button>
                </div>
              )}
              
              <div className="h-64 overflow-hidden relative">
                <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-[#0a0f0d]/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-forest dark:text-[#fdfbf7]">
                  {pkg.price}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-orange mb-4 text-sm font-semibold tracking-widest uppercase">
                  <Clock size={16} />
                  <span>{pkg.duration}</span>
                </div>
                
                <h3 className="text-2xl font-serif text-forest dark:text-[#fdfbf7] mb-4 group-hover:text-orange transition-colors duration-300">{pkg.title}</h3>
                
                <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light mb-6 flex-grow">
                  {pkg.desc}
                </p>
                
                <div className="border-t border-[#fdfbf7]/10 dark:border-white/10 pt-4 mb-6">
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-orange shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-widest text-forest dark:text-[#fdfbf7] mb-1">Route & Destinations</span>
                      <span className="text-sm text-forest/70 dark:text-[#fdfbf7]/70 italic leading-relaxed">
                        {pkg.destinations.join(' ➔ ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {bookedItemIds.has(pkg.id) ? (
                  <button disabled className="w-full bg-forest/20 dark:bg-[#fdfbf7]/20 text-forest/50 dark:text-[#fdfbf7]/50 py-4 rounded-full font-bold uppercase tracking-widest cursor-not-allowed text-center transition-colors duration-300 shadow-md text-sm mt-auto">
                    Already Booked
                  </button>
                ) : (
                  <button onClick={(e) => handleBookClick(e, pkg)} className="w-full bg-forest dark:bg-[#1a251e] text-sand dark:text-[#fdfbf7] py-4 rounded-full font-bold uppercase tracking-widest hover:bg-orange dark:hover:bg-orange hover:text-[#fdfbf7] dark:hover:text-[#fdfbf7] text-center transition-colors duration-300 shadow-md text-sm mt-auto">
                    Book This Package
                  </button>
                )}
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
          <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 opacity-50 hover:opacity-100 hover:text-orange transition-colors">
            <X size={24} />
          </button>
          
          <h2 className="text-3xl font-serif mb-6">{editingPkg ? 'Edit Package' : 'Add New Package'}</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Duration</label>
                <input required type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" placeholder="7 Days / 6 Nights" />
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
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Price ($)</label>
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Destinations (comma separated)</label>
                <input type="text" value={formData.destinations} onChange={e => setFormData({...formData, destinations: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" placeholder="Kandy, Ella..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Highlights (comma separated)</label>
                <input type="text" value={formData.highlights} onChange={e => setFormData({...formData, highlights: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" placeholder="Temple visits, Safaris..." />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Inclusions (comma separated)</label>
                <input type="text" value={formData.inclusions} onChange={e => setFormData({...formData, inclusions: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" placeholder="Hotels, Transport..." />
              </div>
            </div>
            
            <button type="submit" className="mt-4 bg-orange text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-orange/90 transition-colors">
              {editingPkg ? 'Save Changes' : 'Create Package'}
            </button>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default PackagesPage;
