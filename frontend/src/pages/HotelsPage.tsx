import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Star, ArrowLeft, Plus, Edit, Trash, X } from 'lucide-react';
import PhonePromptModal from '../components/PhonePromptModal';
import { checkAndGetUserPhone } from '../utils/bookingHelper';

const HotelsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<any[]>([]);
  const [bookedItemIds, setBookedItemIds] = useState<Set<string>>(new Set());
  
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [pendingHotel, setPendingHotel] = useState<any>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', location: '', rating: '5', image: '', images: [] as string[], type: '', description: '', fullDesc: '', price: '', highlights: '' });

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

  const fetchHotels = async () => {
    try {
      const res = await fetch('/api/hotels');
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          location: d.location,
          rating: Math.floor(Number(d.rating)) || 5,
          img: d.images?.[0] || d.image || 'https://images.unsplash.com/photo-1542314831-c53cd6b7608b?q=80&w=2940&auto=format&fit=crop',
          images: d.images || (d.image ? [d.image] : []),
          price: `From $${d.price}`,
          type: d.type || 'Hotel',
          originalData: d
        }));
        setHotels(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch hotels', err);
    }
  };

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdminLoggedIn') === 'true');
    fetchHotels();
    
    const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
    if (userId) {
      fetch(`/api/bookings/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.hotels) {
            const ids = new Set<string>();
            data.hotels.forEach((b: any) => ids.add(b.hotelId));
            setBookedItemIds(ids);
          }
        })
        .catch(console.error);
    }
  }, []);

  useLayoutEffect(() => {
    let ctx: gsap.Context;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          '.hotel-reveal',
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

  const handleEditClick = (e: React.MouseEvent, hotel: any) => {
    e.stopPropagation();
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      rating: String(hotel.rating),
      image: hotel.img,
      images: hotel.images || [],
      type: hotel.originalData?.type || '',
      description: hotel.originalData?.description || hotel.desc || '',
      fullDesc: hotel.originalData?.fullDesc || hotel.fullDesc || '',
      price: hotel.originalData?.price || hotel.price.replace(/[^0-9]/g, ''),
      highlights: hotel.originalData?.highlights?.join(', ') || ''
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingHotel(null);
    setFormData({ name: '', location: '', rating: '5', image: '', images: [], type: '', description: '', fullDesc: '', price: '', highlights: '' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, hotelId: string) => {
    e.stopPropagation();
    try {
      await fetch(`/api/hotels/${hotelId}`, { method: 'DELETE' });
      fetchHotels();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      location: formData.location,
      image: formData.images?.[0] || '',
      images: formData.images || [],
      rating: Number(formData.rating),
      type: formData.type,
      description: formData.description,
      fullDesc: formData.fullDesc,
      price: Number(formData.price),
      highlights: formData.highlights.split(',').map(h => h.trim()).filter(h => h !== '')
    };

    try {
      if (editingHotel && editingHotel.originalData?.id) {
        await fetch(`/api/hotels/${editingHotel.originalData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/hotels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchHotels();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookClick = async (e: React.MouseEvent, hotel: any) => {
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

    const phone = await checkAndGetUserPhone(userId || '');
    if (phone) {
      executeBooking(hotel, phone);
    } else {
      setPendingHotel(hotel);
      setIsPhoneModalOpen(true);
    }
  };

  const executeBooking = async (hotel: any, phone: string) => {
    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');
    try {
      const payload = {
        userId: userId || userEmail || 'unknown_user', // fallback
        userEmail: userEmail || 'unknown_user',
        hotelId: hotel.id || hotel.name.toLowerCase().replace(/\s+/g, '-'),
        hotelDetails: hotel,
        guests: 1,
        userPhone: phone
      };
      
      const res = await fetch('/api/bookings/hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Hotel booked successfully!');
        setBookedItemIds(prev => new Set(prev).add(hotel.id));
        setIsPhoneModalOpen(false);
      } else {
        alert('Failed to book hotel.');
      }
    } catch (err) {
      console.error(err);
      alert('Error booking hotel.');
    }
  };

  return (<>
    <section ref={containerRef} className="min-h-screen pt-24 pb-24 md:pt-32 md:pb-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden transition-colors duration-500">
      {/* Background subtle image */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1586523925763-8a3fc073a62d?q=80&w=2874&auto=format&fit=crop" alt="bg pattern" className="w-full h-full object-cover grayscale" />
      </div>
      
      {/* Fixed Back Button */}
      <div className="fixed top-6 left-4 md:left-8 z-50">
        <Link to="/" className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/60 border border-forest/10 dark:border-white/10 text-forest dark:text-[#fdfbf7] hover:bg-orange hover:text-[#fdfbf7] dark:hover:bg-orange transition-all uppercase tracking-widest text-[10px] md:text-xs font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-20 hotel-reveal text-center max-w-3xl mx-auto opacity-0">
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Premium Accommodation</p>
          <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-tight drop-shadow-sm text-forest dark:text-[#fdfbf7]">
            Luxury <span className="italic text-orange font-light">Stays</span>
          </h2>
          <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light text-lg">
            Experience world-class hospitality in some of the most breathtaking locations on the island. We partner with the finest hotels and resorts to ensure your stay is unforgettable.
          </p>
          {isAdmin && (
            <div className="mt-8 flex justify-center gap-4">
              <button 
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-orange text-white px-6 py-3 rounded-full hover:bg-orange/90 transition-colors shadow-lg font-bold tracking-widest uppercase text-sm"
              >
                <Plus size={18} /> Add New Hotel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(`/hotels/${hotel.id || hotel.name.toLowerCase().replace(/ /g, '-')}`)}
              className="hotel-card-page group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500  bg-white dark:bg-[#0a0f0d] border border-forest/10 dark:border-white/10"
            >
              {isAdmin && (
                <div className="absolute top-4 left-4 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={(e) => handleEditClick(e, hotel)} className="bg-white/90 text-forest p-2 rounded-full hover:bg-orange hover:text-white transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={(e) => handleDeleteClick(e, hotel.id)} className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                    <Trash size={16} />
                  </button>
                </div>
              )}
              
              <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out" />
              
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-[#0a0f0d]/90 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-forest dark:text-[#fdfbf7] z-20">
                {hotel.type}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 bg-white/5 border-t border-white/10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ">
                <div className="flex gap-1 mb-3 text-orange drop-shadow-sm">
                  {[...Array(hotel.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <h3 className="text-3xl font-serif text-[#fdfbf7] mb-2 drop-shadow-md">{hotel.name}</h3>
                <p className="text-[#fdfbf7]/80 font-medium text-sm uppercase tracking-widest">{hotel.location}</p>
                
                <div className="mt-6 overflow-hidden h-0 group-hover:h-12 transition-all duration-500 flex items-center">
                  {bookedItemIds.has(hotel.id) ? (
                    <button disabled className="text-sm font-semibold tracking-widest uppercase text-[#fdfbf7]/50 cursor-not-allowed flex items-center gap-2">
                      Already Booked
                      <div className="w-6 h-px bg-current"></div>
                    </button>
                  ) : (
                    <button onClick={(e) => handleBookClick(e, hotel)} className="text-sm font-semibold tracking-widest uppercase text-[#fdfbf7] hover:text-orange transition-colors flex items-center gap-2">
                      Inquire to Book
                      <div className="w-6 h-px bg-current"></div>
                    </button>
                  )}
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
          
          <h2 className="text-3xl font-serif mb-6">{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</h2>
          
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
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors min-h-[60px]" />
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Rating (1-5)</label>
                <input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Price (Text)</label>
                <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" placeholder="e.g. From $950 / night" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Type/Amenities</label>
                <input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" placeholder="Beach Resort, Spa..." />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Highlights (comma separated)</label>
              <input type="text" value={formData.highlights} onChange={e => setFormData({...formData, highlights: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange transition-colors" placeholder="Direct access to beach, Pool..." />
            </div>
            
            <button type="submit" className="mt-4 bg-orange text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-orange/90 transition-colors">
              {editingHotel ? 'Save Changes' : 'Create Hotel'}
            </button>
          </form>
        </div>
      </div>
    )}
    
    <PhonePromptModal
      isOpen={isPhoneModalOpen}
      onClose={() => setIsPhoneModalOpen(false)}
      userId={localStorage.getItem('userId') || ''}
      onSuccess={(phone) => {
        if (pendingHotel) {
          executeBooking(pendingHotel, phone);
        }
      }}
    />
    </>
  );
};

export default HotelsPage;
