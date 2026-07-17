import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Car, Settings, Calendar, MapPin, Shield, Fuel, Wifi, Snowflake, CheckCircle, X, Users, Briefcase, Phone, Mail, Edit, Info, Disc } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import PhonePromptModal from '../components/PhonePromptModal';
import { checkAndGetUserPhone } from '../utils/bookingHelper';

const formatPrice = (price: any) => {
  if (!price) return 'Contact Us';
  const str = String(price).trim();
  if (str.includes('$')) return str;
  if (/^\d/.test(str)) {
    return `$${str}`;
  }
  if (/^from\s+\d/i.test(str)) {
    return str.replace(/^from\s+/i, 'From $');
  }
  if (/[0-9]/.test(str)) {
    return `$${str}`;
  }
  return str;
};

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
  const [isDark, setIsDark] = useState(false);

  // Admin edit states
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    type: 'Car', 
    seats: '4', 
    image: '', 
    images: [] as string[], 
    description: '', 
    price: '', 
    features: '', 
    withGuide: true, 
    ac: 'Yes', 
    wifi: 'Free', 
    insurance: 'Included',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    luggage: '2 Large Bags',
    engine: '1500 cc',
    amenities: 'Air Conditioning, Free Wi-Fi, GPS Navigation, Luggage Storage, Cool Box, First Aid Kit'
  });
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

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (loading || !vehicle) return;

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
    }, containerRef);

    return () => ctx.revert();
  }, [loading, vehicle]);

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const loggedInId = userId || userEmail;
    if (!loggedInId) {
      navigate('/login');
      return;
    }

    const phone = await checkAndGetUserPhone(userId || '');
    if (phone) {
      executeBooking(phone);
    } else {
      setIsPhoneModalOpen(true);
    }
  };

  const executeBooking = async (phone: string) => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const loggedInId = userId || userEmail;
    try {
      const res = await fetch('/api/bookings/vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: loggedInId,
          userEmail,
          userPhone: phone,
          vehicleId: vehicle.id,
          vehicleDetails: { name: vehicle.name, price: formatPrice(vehicle.price) },
          ...bookingForm
        })
      });
      if (res.ok) {
        alert('Booking successful! We will contact you soon.');
        setIsBooked(true);
        setIsBookingModalOpen(false);
        setIsPhoneModalOpen(false);
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
      images: vehicle.images && vehicle.images.length > 0 ? vehicle.images : (vehicle.image ? [vehicle.image] : []),
      description: vehicle.description || '',
      price: vehicle.price || '',
      features: Array.isArray(vehicle.features) ? vehicle.features.join(', ') : '',
      withGuide: vehicle.withGuide !== undefined ? vehicle.withGuide : true,
      ac: vehicle.ac || 'Yes',
      wifi: vehicle.wifi || 'Free',
      insurance: vehicle.insurance || 'Included',
      transmission: vehicle.transmission || 'Automatic',
      fuelType: vehicle.fuelType || 'Petrol',
      luggage: vehicle.luggage || '2 Large Bags',
      engine: vehicle.engine || '1500 cc',
      amenities: Array.isArray(vehicle.amenities) ? vehicle.amenities.join(', ') : (typeof vehicle.amenities === 'string' ? vehicle.amenities : 'Air Conditioning, Free Wi-Fi, GPS Navigation, Luggage Storage, Cool Box, First Aid Kit')
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
        features: formData.features.split(',').map((f: string) => f.trim()).filter(Boolean),
        amenities: formData.amenities.split(',').map((a: string) => a.trim()).filter(Boolean)
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
  const amenitiesList = Array.isArray(vehicle.amenities) && vehicle.amenities.length > 0 
    ? vehicle.amenities 
    : ['Air Conditioning', 'Free Wi-Fi', 'GPS Navigation', 'Luggage Storage', 'Cool Box', 'First Aid Kit'];

  return (
    <>
    <section ref={containerRef} className="bg-transparent text-forest dark:text-[#fdfbf7] relative min-h-screen pb-24">
      {/* ── Cinematic Hero ── */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 w-full h-full">
          <ImageCarousel
            images={vehicle.images && vehicle.images.length > 0 ? vehicle.images : (vehicle.image ? [vehicle.image] : ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2940&auto=format&fit=crop'])}
            className="w-full h-full"
            alwaysShowArrows
            darkOverlay
            darkOverlayOpacity="bg-black/45"
          />
        </div>

        {/* Hero overlay content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none">
          <div className="vd-reveal flex items-center gap-3 mb-6">
            <span className="bg-black/35 px-5 py-2 rounded-full text-[#fdfbf7] text-xs tracking-[0.2em] uppercase font-bold border border-[#fdfbf7]/15">
              {vehicle.type}
            </span>
            {vehicle.withGuide !== false && (
              <span className="bg-orange px-5 py-2 rounded-full text-[#fdfbf7] text-xs tracking-[0.2em] uppercase font-bold border border-orange/30">
                Chauffeur Guide
              </span>
            )}
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#fdfbf7] text-center drop-shadow-lg vd-reveal max-w-4xl leading-tight">
            {vehicle.name}
          </h1>
          <div className="vd-reveal mt-6 flex items-center gap-6 text-[#fdfbf7]/90 text-sm md:text-base">
            <span className="flex items-center gap-2 tracking-widest uppercase font-semibold">
              <Car size={18} className="text-orange" />
              {vehicle.seats} Seats
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#fdfbf7]/50"></span>
            <span className="flex items-center gap-2 tracking-widest uppercase font-semibold">
              <Settings size={18} className="text-orange" />
              {vehicle.transmission || 'Automatic'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#fdfbf7]/50"></span>
            <span className="flex items-center gap-2 tracking-widest uppercase font-semibold">
              <Fuel size={18} className="text-orange" />
              {vehicle.fuelType || 'Petrol'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content Section ── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 relative z-30">
        {/* Buttons */}
        <div className="mb-12 vd-reveal flex items-center justify-between gap-4 flex-wrap">
          <Link to="/vehicles" className="inline-flex items-center gap-2 bg-orange text-[#fdfbf7] hover:bg-forest dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-all uppercase tracking-widest text-xs font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-orange/30">
            <ArrowLeft size={16} />
            Back to Vehicles
          </Link>
          
          {isAdmin && (
            <button 
              onClick={handleEditClick}
              className="inline-flex items-center gap-2 bg-[#fdfbf7]/10 dark:bg-white/10 text-forest dark:text-[#fdfbf7] hover:bg-orange hover:text-white transition-all uppercase tracking-widest text-xs font-bold px-6 py-3 rounded-full shadow-lg border border-forest/15 dark:border-white/15"
            >
              <Edit size={16} />
              Edit Vehicle Details
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* ── Left: Details ── */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif text-forest dark:text-[#fdfbf7] vd-reveal">About This Vehicle</h2>
              <div className="w-20 h-[3px] bg-orange rounded-full mb-6"></div>
              {vehicle.description ? (
                <p className="text-base md:text-lg leading-relaxed text-forest/85 dark:text-[#fdfbf7]/90 vd-reveal font-light dark:font-normal">
                  {vehicle.description}
                </p>
              ) : (
                <p className="text-base md:text-lg leading-relaxed text-forest/85 dark:text-[#fdfbf7]/90 vd-reveal font-light dark:font-normal">
                  Experience the finest in Sri Lankan transport with the {vehicle.name}. Designed for comfort and reliability, this vehicle comes equipped with modern amenities and is perfect for exploring the island in style. All our vehicles include air conditioning, free Wi-Fi, luggage storage, and GPS navigation.
                </p>
              )}
            </div>

            {/* Symmetrical Specifications Grid */}
            <div className="vd-reveal space-y-6">
              <h3 className="text-2xl font-serif text-forest dark:text-[#fdfbf7]">Vehicle Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white/90 dark:bg-[#0a0f0d]/90 border border-forest/10 dark:border-[#fdfbf7]/10 shadow-sm transition-all hover:scale-[1.01]">
                  <Car className="text-orange shrink-0 mt-0.5" size={22} />
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Seats</span>
                    <span className="text-forest dark:text-[#fdfbf7] font-bold text-lg">{vehicle.seats} Passengers</span>
                  </div>
                </div>
                <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white/90 dark:bg-[#0a0f0d]/90 border border-forest/10 dark:border-[#fdfbf7]/10 shadow-sm transition-all hover:scale-[1.01]">
                  <Settings className="text-orange shrink-0 mt-0.5" size={22} />
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Transmission</span>
                    <span className="text-forest dark:text-[#fdfbf7] font-bold text-lg">{vehicle.transmission || 'Automatic'}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white/90 dark:bg-[#0a0f0d]/90 border border-forest/10 dark:border-[#fdfbf7]/10 shadow-sm transition-all hover:scale-[1.01]">
                  <Snowflake className="text-orange shrink-0 mt-0.5" size={22} />
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Climate Control</span>
                    <span className="text-forest dark:text-[#fdfbf7] font-bold text-lg">{vehicle.ac === 'No' ? 'Standard Heater' : (vehicle.ac || 'A/C Included')}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white/90 dark:bg-[#0a0f0d]/90 border border-forest/10 dark:border-[#fdfbf7]/10 shadow-sm transition-all hover:scale-[1.01]">
                  <Fuel className="text-orange shrink-0 mt-0.5" size={22} />
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Fuel Type</span>
                    <span className="text-forest dark:text-[#fdfbf7] font-bold text-lg">{vehicle.fuelType || 'Petrol'}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white/90 dark:bg-[#0a0f0d]/90 border border-forest/10 dark:border-[#fdfbf7]/10 shadow-sm transition-all hover:scale-[1.01]">
                  <Briefcase className="text-orange shrink-0 mt-0.5" size={22} />
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Luggage</span>
                    <span className="text-forest dark:text-[#fdfbf7] font-bold text-lg">{vehicle.luggage || '2 Large Bags'}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-white/90 dark:bg-[#0a0f0d]/90 border border-forest/10 dark:border-[#fdfbf7]/10 shadow-sm transition-all hover:scale-[1.01]">
                  <Disc className="text-orange shrink-0 mt-0.5" size={22} />
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Engine Capacity</span>
                    <span className="text-forest dark:text-[#fdfbf7] font-bold text-lg">{vehicle.engine || '1500 cc'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            {featuresList.length > 0 && (
              <div className="vd-reveal space-y-6">
                <h3 className="text-2xl font-serif text-forest dark:text-[#fdfbf7]">Key Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuresList.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 dark:bg-[#0a0f0d]/80 border border-forest/5 dark:border-[#fdfbf7]/5 shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="text-orange" size={18} />
                      </div>
                      <span className="text-forest/90 dark:text-[#fdfbf7]/95 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Amenities */}
            <div className="vd-reveal space-y-6">
              <h3 className="text-2xl font-serif text-forest dark:text-[#fdfbf7]">Amenities Included</h3>
              <div className="flex flex-wrap gap-3">
                {amenitiesList.map((amenity, i) => (
                  <span key={i} className="px-5 py-3 rounded-full text-sm font-medium bg-white/75 dark:bg-[#0d1411]/75 border border-forest/10 dark:border-[#fdfbf7]/15 text-forest/85 dark:text-[#fdfbf7]/90 flex items-center gap-2.5 shadow-sm hover:scale-[1.02] transition-transform">
                    <div className="w-2 h-2 rounded-full bg-orange"></div>
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Chauffeur Guide Info */}
            {vehicle.withGuide !== false && (
              <div className="vd-reveal bg-gradient-to-br from-orange/10 via-orange/5 to-transparent border border-orange/20 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-orange/10 flex items-center justify-center shrink-0">
                    <Briefcase size={26} className="text-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif mb-2 text-forest dark:text-[#fdfbf7]">Professional Chauffeur Guide Included</h3>
                    <p className="text-forest/75 dark:text-[#fdfbf7]/80 font-light dark:font-normal leading-relaxed text-sm md:text-base">
                      This vehicle comes with an experienced, English-speaking chauffeur guide who doubles as your personal tour guide. They have extensive knowledge of Sri Lanka's history, culture, and hidden gems.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Booking Sidebar ── */}
          <div className="space-y-8">
            <div className="bg-[#f7f5ef] dark:bg-[#0d1411] border border-forest/10 dark:border-[#fdfbf7]/10 rounded-2xl p-6 md:p-8 shadow-xl vd-reveal sticky top-32">
              {/* Price */}
              <div className="mb-6 pb-6 border-b border-forest/10 dark:border-[#fdfbf7]/10 text-center">
                <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-2">Starting From</span>
                <span className="text-4xl font-serif text-orange">{formatPrice(vehicle.price)}</span>
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
                <p className="text-xs uppercase tracking-widest font-bold text-forest/50 dark:text-[#fdfbf7]/50 mb-3 text-left">Need Help?</p>
                <a href="tel:+94713850594" className="flex items-center gap-2 text-sm text-forest/70 dark:text-[#fdfbf7]/70 hover:text-orange transition-colors">
                  <Phone size={14} className="text-orange" /> +94 713850594
                </a>
                <a href="mailto:reisenovatravels@gmail.com" className="flex items-center gap-2 text-sm text-forest/70 dark:text-[#fdfbf7]/70 hover:text-orange transition-colors">
                  <Mail size={14} className="text-orange" /> reisenovatravels@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {isEditModalOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsEditModalOpen(false)}>
        <div className="bg-[#fdfbf7] dark:bg-[#121915] text-forest dark:text-[#fdfbf7] p-6 md:p-8 rounded-2xl w-full max-w-3xl shadow-2xl relative border border-forest/10 dark:border-[#fdfbf7]/10" onClick={e => e.stopPropagation()}>
          <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 opacity-60 hover:opacity-100 hover:text-orange transition-colors z-10 p-1">
            <X size={24} />
          </button>
          
          <h2 className="text-3xl font-serif mb-2 text-forest dark:text-[#fdfbf7]">Edit Vehicle</h2>
          <p className="text-sm opacity-60 mb-6 font-light">Modify specifications, details, and features of this vehicle.</p>
          
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-3 custom-scrollbar" data-lenis-prevent>
            
            {/* Recommendation info banner */}
            <div className="bg-[#fff9e6] dark:bg-[#1f1a10] border border-[#ffb74d] text-[#e65100] dark:text-[#ffb74d] p-3.5 rounded-xl flex items-start gap-3 text-xs">
              <Info className="shrink-0 mt-0.5 text-orange" size={18} />
              <div className="font-medium space-y-1">
                <p className="font-bold">Recommended Image Dimensions:</p>
                <p className="opacity-90">• 1200 x 600 pixels (or any 2:1 landscape image ratio) is recommended for perfect crop-free banner representation.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Type (Car, Van, Bus, SUV, Bike)</label>
                <input required type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Seats</label>
                <input required type="number" value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Price (e.g. $50 / day)</label>
                <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Transmission</label>
                <input required type="text" value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" placeholder="Automatic / Manual" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Fuel Type</label>
                <input type="text" value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" placeholder="Petrol / Diesel" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Luggage Capacity</label>
                <input type="text" value={formData.luggage} onChange={e => setFormData({...formData, luggage: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" placeholder="e.g. 2 Large Bags" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Engine Capacity</label>
                <input type="text" value={formData.engine} onChange={e => setFormData({...formData, engine: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" placeholder="e.g. 1500 cc" />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7] min-h-[100px]" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Key Highlights (comma separated)</label>
                <input type="text" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" placeholder="AC, Bluetooth, GPS..." />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Amenities Included (comma separated)</label>
                <input type="text" value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" placeholder="Air Conditioning, Free Wi-Fi..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Wi-Fi Status</label>
                <input type="text" value={formData.wifi} onChange={e => setFormData({...formData, wifi: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" placeholder="e.g. Free" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Air Conditioning Status</label>
                <input type="text" value={formData.ac} onChange={e => setFormData({...formData, ac: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" placeholder="e.g. Yes" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block">Insurance Coverage</label>
                <input type="text" value={formData.insurance} onChange={e => setFormData({...formData, insurance: e.target.value})} className="w-full bg-white/25 dark:bg-black/25 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3 outline-none focus:border-orange text-forest dark:text-[#fdfbf7]" placeholder="e.g. Included" />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2 block font-bold">Upload Images</label>
              <div className="flex gap-4 items-center">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full bg-white/10 border border-forest/15 dark:border-[#fdfbf7]/10 rounded-xl p-2.5 outline-none focus:border-orange file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange/15 file:text-orange hover:file:bg-orange/25 file:cursor-pointer" />
                {isUploading && <span className="text-xs text-orange animate-pulse">Uploading...</span>}
              </div>
              
              {formData.images && formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-4">
                  {formData.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-forest/20 dark:border-[#fdfbf7]/20 aspect-video shadow-md">
                      <img src={imgUrl} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500/95 text-white p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-xl border border-forest/5">
              <input type="checkbox" id="withGuide" checked={formData.withGuide} onChange={e => setFormData({...formData, withGuide: e.target.checked})} className="accent-orange w-4 h-4 cursor-pointer" />
              <label htmlFor="withGuide" className="text-sm font-bold opacity-90 cursor-pointer">Includes Chauffeur Guide service as standard</label>
            </div>

            <button type="submit" className="mt-4 bg-orange text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-orange/90 transition-all shadow-md">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    )}

    {/* ── Booking Modal ── */}
    {isBookingModalOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsBookingModalOpen(false)}>
        <div className="bg-[#fdfbf7] dark:bg-[#121915] text-forest dark:text-[#fdfbf7] p-8 rounded-2xl w-full max-w-md shadow-2xl relative border border-forest/10 dark:border-[#fdfbf7]/10" onClick={e => e.stopPropagation()}>
          <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-6 right-6 opacity-60 hover:opacity-100 hover:text-orange transition-opacity z-10 p-1">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-serif mb-1 text-forest dark:text-[#fdfbf7]">Book {vehicle.name}</h2>
          <p className="text-sm opacity-60 mb-6 font-light">Fill in your travel dates and pickup details below.</p>
          
          <form onSubmit={handleBook} className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar" data-lenis-prevent>
            <div>
              <label className="text-xs uppercase tracking-widest opacity-80 mb-2 block font-bold">Pickup Date</label>
              <input required type="date" value={bookingForm.pickupDate} onChange={e => setBookingForm({...bookingForm, pickupDate: e.target.value})} className="w-full bg-white/20 dark:bg-black/20 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3.5 outline-none focus:border-orange transition-colors text-forest dark:text-[#fdfbf7]" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest opacity-80 mb-2 block font-bold">Dropoff Date</label>
              <input required type="date" value={bookingForm.dropoffDate} onChange={e => setBookingForm({...bookingForm, dropoffDate: e.target.value})} className="w-full bg-white/20 dark:bg-black/20 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3.5 outline-none focus:border-orange transition-colors text-forest dark:text-[#fdfbf7]" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest opacity-80 mb-2 block font-bold">Pickup Location</label>
              <input required type="text" value={bookingForm.pickupLocation} onChange={e => setBookingForm({...bookingForm, pickupLocation: e.target.value})} className="w-full bg-white/20 dark:bg-black/20 border border-forest/20 dark:border-[#fdfbf7]/10 rounded-xl p-3.5 outline-none focus:border-orange transition-colors text-forest dark:text-[#fdfbf7]" placeholder="e.g. Bandaranaike Airport, Colombo..." />
            </div>
            <button type="submit" className="mt-2 bg-orange text-[#fdfbf7] py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-orange/90 transition-all shadow-lg shadow-orange/20">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    )}
    
    <PhonePromptModal
      isOpen={isPhoneModalOpen}
      onClose={() => setIsPhoneModalOpen(false)}
      userId={localStorage.getItem('userId') || ''}
      onSuccess={(phone) => executeBooking(phone)}
    />
    </>
  );
};

export default VehicleDetailsPage;
