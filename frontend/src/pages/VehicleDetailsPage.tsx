import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Car, Settings, Calendar, MapPin, Shield, Fuel, Wifi, Snowflake, CheckCircle, X, Users, Briefcase, Phone, Mail, Edit } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ pickupDate: '', dropoffDate: '', pickupLocation: '' });
  const [isBooked, setIsBooked] = useState(false);

  // Admin edit states
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'Car', seats: '4', image: '', images: [] as string[], description: '', price: '', features: '', withGuide: true, ac: 'Yes', wifi: 'Free', insurance: 'Included' });
  const [isUploading, setIsUploading] = useState(false);

  const fetchVehicleDetails = () => {
    fetch(`/api/vehicles/${id}`)
      .then(res => res.json())
      .then(data => {
        setVehicle(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
    setIsAdmin(localStorage.getItem('isAdminLoggedIn') === 'true');
    
    if (userId) {
      fetch(`/api/bookings/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.vehicles && data.vehicles.some((b: any) => b.vehicleId === id)) {
            setIsBooked(true);
          }
        })
        .catch(console.error);
    }
    fetchVehicleDetails();
  }, [id]);

  useLayoutEffect(() => {
    if (loading || !vehicle) return;
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo('.vd-reveal',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
        }
      );

      if (heroRef.current) {
        gsap.to(heroRef.current, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, vehicle]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const loggedInId = userId || userEmail;
    if (!loggedInId) {
      navigate('/login');
      return;
    }
    
    try {
      const res = await fetch('/api/bookings/vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: loggedInId,
          userEmail,
          vehicleId: vehicle.id,
          vehicleDetails: { name: vehicle.name, price: vehicle.price },
          ...bookingForm
        })
      });
      if (res.ok) {
        alert('Booking successful! We will contact you soon.');
        setIsBooked(true);
        setIsBookingModalOpen(false);
      } else {
        alert('Failed to book.');
      }
    } catch (err) {
      console.error(err);
      alert('Error booking vehicle.');
    }
  };

  const handleEditClick = () => {
    setFormData({
      name: vehicle.name || '',
      type: vehicle.type || 'Car',
      seats: vehicle.seats?.toString() || '4',
      image: vehicle.image || vehicle.images?.[0] || '',
      images: vehicle.images || [],
      description: vehicle.description || '',
      price: vehicle.price || '',
      features: Array.isArray(vehicle.features) ? vehicle.features.join(', ') : '',
      withGuide: vehicle.withGuide !== undefined ? vehicle.withGuide : true,
      ac: vehicle.ac || 'Yes',
      wifi: vehicle.wifi || 'Free',
      insurance: vehicle.insurance || 'Included'
    });
    setIsEditModalOpen(true);
  };

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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        image: formData.images?.[0] || '',
        images: formData.images || [],
        seats: parseInt(formData.seats) || 4,
        features: formData.features.split(',').map((f: string) => f.trim()).filter(Boolean)
      };
      
      const res = await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchVehicleDetails();
      } else {
        alert('Failed to update vehicle');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating vehicle');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent text-forest dark:text-[#fdfbf7]">
        <div className="text-center text-2xl font-serif">Loading...</div>
      </div>
    );
  }

  if (!vehicle || vehicle.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent text-forest dark:text-[#fdfbf7]">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Vehicle Not Found</h2>
          <Link to="/vehicles" className="text-orange hover:underline uppercase tracking-widest font-semibold">Back to Vehicles</Link>
        </div>
      </div>
    );
  }

  const featuresList = vehicle.features && vehicle.features.length > 0 ? vehicle.features : [];

  return (
    <>
    <section ref={containerRef} className="bg-transparent text-forest dark:text-[#fdfbf7] relative min-h-screen pb-24">
      {/* ── Cinematic Hero ── */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <ImageCarousel
            images={vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.image]}
            className="w-full h-full"
            alwaysShowArrows
            darkOverlay
            darkOverlayOpacity="bg-black/40"
          />
        </div>

        {/* Hero overlay content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
          <div className="vd-reveal flex items-center gap-3 mb-6">
            <span className="bg-[#fdfbf7]/20 backdrop-blur-md px-5 py-2 rounded-full text-[#fdfbf7] text-xs tracking-[0.2em] uppercase font-bold border border-[#fdfbf7]/10">
              {vehicle.type}
            </span>
            {vehicle.withGuide !== false && (
              <span className="bg-orange/80 backdrop-blur-md px-5 py-2 rounded-full text-[#fdfbf7] text-xs tracking-[0.2em] uppercase font-bold border border-orange/30">
                Chauffeur Guide
              </span>
            )}
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-[#fdfbf7] text-center drop-shadow-lg vd-reveal">
            {vehicle.name}
          </h1>
          <div className="vd-reveal mt-6 flex items-center gap-6 text-[#fdfbf7]/90 text-lg">
            <span className="flex items-center gap-2 tracking-widest uppercase font-semibold">
              <Car size={20} className="text-orange" />
              {vehicle.seats} Seats
            </span>
            <span className="w-1 h-1 rounded-full bg-[#fdfbf7]/50"></span>
            <span className="flex items-center gap-2 tracking-widest uppercase font-semibold">
              <Settings size={20} className="text-orange" />
              Auto / Manual
            </span>
          </div>
        </div>
      </div>

      {/* ── Content Section ── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 relative z-30">
        {/* Buttons */}
        <div className="mb-12 vd-reveal flex items-center gap-4 flex-wrap">
          <Link to="/vehicles" className="inline-flex items-center gap-2 bg-orange text-[#fdfbf7] hover:bg-forest dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-all uppercase tracking-widest text-xs font-bold px-5 py-2.5 rounded-full shadow-lg hover:shadow-orange/30">
            <ArrowLeft size={16} />
            Back to Vehicles
          </Link>
          
          {isAdmin && (
            <button 
              onClick={handleEditClick}
              className="inline-flex items-center gap-2 bg-[#fdfbf7]/10 dark:bg-white/10 text-forest dark:text-[#fdfbf7] hover:bg-orange hover:text-white transition-all uppercase tracking-widest text-xs font-bold px-5 py-2.5 rounded-full shadow-lg border border-forest/10 dark:border-white/10"
            >
              <Edit size={16} />
              Edit Vehicle
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* ── Left: Details ── */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-4xl font-serif mb-6 vd-reveal">About This Vehicle</h2>
              {vehicle.description ? (
                <p className="text-lg leading-relaxed text-forest/80 dark:text-[#fdfbf7]/90 vd-reveal font-light dark:font-normal">
                  {vehicle.description}
                </p>
              ) : (
                <p className="text-lg leading-relaxed text-forest/80 dark:text-[#fdfbf7]/90 vd-reveal font-light dark:font-normal">
                  Experience the finest in Sri Lankan transport with the {vehicle.name}. Designed for comfort and reliability, this vehicle comes equipped with modern amenities and is perfect for exploring the island in style. All our vehicles include air conditioning, free Wi-Fi, luggage storage, and GPS navigation.
                </p>
              )}
            </div>

            {/* Quick Specs */}
            <div className="vd-reveal">
              <h3 className="text-2xl font-serif mb-6">Vehicle Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-5 rounded-2xl bg-white/60 dark:bg-[#0a0f0d]/60 backdrop-blur-md border border-forest/10 dark:border-[#fdfbf7]/10">
                  <Car className="text-orange shrink-0 mt-0.5" size={22} />
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Seats</span>
                    <span className="text-forest dark:text-[#fdfbf7] font-bold text-lg">{vehicle.seats}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-5 rounded-2xl bg-white/60 dark:bg-[#0a0f0d]/60 backdrop-blur-md border border-forest/10 dark:border-[#fdfbf7]/10">
                  <Settings className="text-orange shrink-0 mt-0.5" size={22} />
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Transmission</span>
                    <span className="text-forest dark:text-[#fdfbf7] font-bold text-lg">Auto/Manual</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-5 rounded-2xl bg-white/60 dark:bg-[#0a0f0d]/60 backdrop-blur-md border border-forest/10 dark:border-[#fdfbf7]/10">
                  <Snowflake className="text-orange shrink-0 mt-0.5" size={22} />
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Climate</span>
                    <span className="text-forest dark:text-[#fdfbf7] font-bold text-lg">Full A/C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            {featuresList.length > 0 && (
              <div className="vd-reveal">
                <h3 className="text-2xl font-serif mb-6">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuresList.map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/60 dark:bg-[#0a0f0d]/60 backdrop-blur-md border border-forest/10 dark:border-[#fdfbf7]/10">
                      <CheckCircle className="text-orange shrink-0 mt-0.5" size={20} />
                      <span className="text-forest/90 dark:text-[#fdfbf7]/90 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Amenities */}
            <div className="vd-reveal">
              <h3 className="text-2xl font-serif mb-6">Standard Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {['Air Conditioning', 'Free Wi-Fi', 'GPS Navigation', 'Luggage Storage', 'Cool Box', 'First Aid Kit'].map((amenity, i) => (
                  <span key={i} className="px-4 py-2.5 rounded-full text-sm font-medium bg-forest/5 dark:bg-[#fdfbf7]/5 border border-forest/10 dark:border-[#fdfbf7]/10 text-forest/80 dark:text-[#fdfbf7]/80 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange"></div>
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Chauffeur Guide Info */}
            {vehicle.withGuide !== false && (
              <div className="vd-reveal bg-gradient-to-br from-orange/10 via-orange/5 to-transparent border border-orange/20 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-orange/10 flex items-center justify-center shrink-0">
                    <Briefcase size={24} className="text-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif mb-2 text-forest dark:text-[#fdfbf7]">Professional Chauffeur Guide Included</h3>
                    <p className="text-forest/70 dark:text-[#fdfbf7]/80 font-light dark:font-normal leading-relaxed">
                      This vehicle comes with an experienced, English-speaking chauffeur guide who doubles as your personal tour guide. They have extensive knowledge of Sri Lanka's history, culture, and hidden gems.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Booking Sidebar ── */}
          <div className="space-y-8">
            <div className="bg-white/70 dark:bg-[#0a0f0d]/70 backdrop-blur-md border border-forest/10 dark:border-[#fdfbf7]/10 rounded-2xl p-8 shadow-xl vd-reveal sticky top-32">
              {/* Price */}
              <div className="mb-6 pb-6 border-b border-forest/10 dark:border-[#fdfbf7]/10 text-center">
                <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-2">Starting From</span>
                <span className="text-4xl font-serif text-orange">{vehicle.price}</span>
              </div>

              {/* Quick Info */}
              <div className="space-y-5 mb-8">
                <div className="flex items-center justify-between text-forest/80 dark:text-[#fdfbf7]/80 border-b border-forest/5 dark:border-[#fdfbf7]/5 pb-4">
                  <span className="flex items-center gap-2"><Users size={18} className="text-orange"/> Passengers</span>
                  <span className="font-bold">{vehicle.seats} Seats</span>
                </div>
                <div className="flex items-center justify-between text-forest/80 dark:text-[#fdfbf7]/80 border-b border-forest/5 dark:border-[#fdfbf7]/5 pb-4">
                  <span className="flex items-center gap-2"><Wifi size={18} className="text-orange"/> Wi-Fi</span>
                  <span className="font-bold">{vehicle.wifi || 'Free'}</span>
                </div>
                <div className="flex items-center justify-between text-forest/80 dark:text-[#fdfbf7]/80 border-b border-forest/5 dark:border-[#fdfbf7]/5 pb-4">
                  <span className="flex items-center gap-2"><Snowflake size={18} className="text-orange"/> Air Conditioning</span>
                  <span className="font-bold">{vehicle.ac || 'Yes'}</span>
                </div>
                <div className="flex items-center justify-between text-forest/80 dark:text-[#fdfbf7]/80 pb-2">
                  <span className="flex items-center gap-2"><Shield size={18} className="text-orange"/> Insurance</span>
                  <span className="font-bold">{vehicle.insurance || 'Included'}</span>
                </div>
              </div>

              {/* Book Button */}
              {isBooked ? (
                <button disabled className="w-full flex items-center justify-center gap-2 bg-forest/20 text-forest/50 dark:bg-[#fdfbf7]/20 dark:text-[#fdfbf7]/50 px-8 py-4 rounded-xl font-bold uppercase tracking-widest cursor-not-allowed">
                  Already Booked
                </button>
              ) : (
                <button onClick={() => setIsBookingModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-forest text-sand dark:bg-[#16201a] dark:text-[#fdfbf7] px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange dark:hover:bg-orange hover:text-[#fdfbf7] dark:hover:text-[#fdfbf7] transition-all shadow-lg hover:shadow-orange/30">
                  Book This Vehicle
                </button>
              )}

              {/* Contact */}
              <div className="mt-6 pt-6 border-t border-forest/10 dark:border-[#fdfbf7]/10 space-y-3">
                <p className="text-xs uppercase tracking-widest font-bold text-forest/50 dark:text-[#fdfbf7]/50 mb-3">Need Help?</p>
                <a href="tel:+94760010784" className="flex items-center gap-2 text-sm text-forest/70 dark:text-[#fdfbf7]/70 hover:text-orange transition-colors">
                  <Phone size={14} className="text-orange" /> +94 76 001 0784
                </a>
                <a href="mailto:hello@reisenova.com" className="flex items-center gap-2 text-sm text-forest/70 dark:text-[#fdfbf7]/70 hover:text-orange transition-colors">
                  <Mail size={14} className="text-orange" /> hello@reisenova.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {isEditModalOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsEditModalOpen(false)}>
        <div className="bg-[#fdfbf7] dark:bg-[#121915] text-forest dark:text-[#fdfbf7] p-8 rounded-2xl w-full max-w-2xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
          <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 opacity-50 hover:opacity-100 transition-colors">
            <X size={24} />
          </button>
          
          <h2 className="text-3xl font-serif mb-6">Edit Vehicle</h2>
          
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Type (Car, Van, Bus, Bike)</label>
                <input required type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Seats</label>
                <input required type="number" value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Price (e.g. $50 / day)</label>
                <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange" />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange min-h-[80px]" />
            </div>
            
            <div>
              <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Features (comma separated)</label>
              <input type="text" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange" placeholder="AC, Bluetooth, GPS..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Wi-Fi</label>
                <input type="text" value={formData.wifi} onChange={e => setFormData({...formData, wifi: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange" placeholder="e.g. Free" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Air Conditioning</label>
                <input type="text" value={formData.ac} onChange={e => setFormData({...formData, ac: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange" placeholder="e.g. Yes" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Insurance</label>
                <input type="text" value={formData.insurance} onChange={e => setFormData({...formData, insurance: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-3 outline-none focus:border-orange" placeholder="e.g. Included" />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Upload Images</label>
              <div className="flex gap-4 items-center">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-2 outline-none focus:border-orange file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange/10 file:text-orange hover:file:bg-orange/20" />
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

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="withGuide" checked={formData.withGuide} onChange={e => setFormData({...formData, withGuide: e.target.checked})} className="accent-orange w-4 h-4" />
              <label htmlFor="withGuide" className="text-sm font-bold opacity-80">Includes Chauffeur Guide</label>
            </div>

            <button type="submit" className="mt-4 bg-orange text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-orange/90 transition-colors">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    )}

    {/* ── Booking Modal ── */}
    {isBookingModalOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsBookingModalOpen(false)}>
        <div className="bg-[#fdfbf7] dark:bg-[#121915] text-forest dark:text-[#fdfbf7] p-8 rounded-2xl w-full max-w-md shadow-2xl relative" onClick={e => e.stopPropagation()}>
          <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-6 right-6 opacity-50 hover:opacity-100 transition-opacity">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-serif mb-2">Book {vehicle.name}</h2>
          <p className="text-sm opacity-60 mb-6 font-light dark:font-normal">Fill in your trip details below</p>
          <form onSubmit={handleBook} className="flex flex-col gap-5">
            <div>
              <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block font-bold">Pickup Date</label>
              <input required type="date" value={bookingForm.pickupDate} onChange={e => setBookingForm({...bookingForm, pickupDate: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-xl p-3.5 outline-none focus:border-orange transition-colors" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block font-bold">Dropoff Date</label>
              <input required type="date" value={bookingForm.dropoffDate} onChange={e => setBookingForm({...bookingForm, dropoffDate: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-xl p-3.5 outline-none focus:border-orange transition-colors" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block font-bold">Pickup Location</label>
              <input required type="text" value={bookingForm.pickupLocation} onChange={e => setBookingForm({...bookingForm, pickupLocation: e.target.value})} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-xl p-3.5 outline-none focus:border-orange transition-colors" placeholder="Airport, Hotel..." />
            </div>
            <button type="submit" className="mt-2 bg-orange text-[#fdfbf7] py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-orange/90 transition-colors shadow-lg">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default VehicleDetailsPage;
