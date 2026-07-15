import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Plus, Edit, Trash, X, Car, Settings, MapPin, Briefcase, Calendar, ChevronDown, Phone, Mail } from 'lucide-react';

const VehiclesPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<any[]>([]);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', type: 'Car', seats: '4', image: '', images: [] as string[], description: '', price: '', features: '', withGuide: true, ac: 'Yes', wifi: 'Free', insurance: 'Included' });
  const [isUploading, setIsUploading] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdminLoggedIn') === 'true');
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles');
      const data = await res.json();
      if (Array.isArray(data)) setVehicles(data);
    } catch (err) {
      console.error(err);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        image: formData.images?.[0] || '',
        images: formData.images || [],
        seats: parseInt(formData.seats) || 4,
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
      };
      
      const url = editingVehicle ? `/api/vehicles/${editingVehicle.id}` : '/api/vehicles';
      const method = editingVehicle ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchVehicles();
      } else {
        alert('Failed to save vehicle');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving vehicle');
    }
  };

  const handleEditClick = (e: React.MouseEvent, vehicle: any) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingVehicle(vehicle);
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
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchVehicles();
      } else {
        alert('Failed to delete vehicle');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.vehicle-reveal',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (vehicles.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.vehicle-card-item',
        { y: 150, opacity: 0, rotateX: 25, z: -200, scale: 0.9 },
        { y: 0, opacity: 1, rotateX: 0, z: 0, scale: 1, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: containerRef.current, start: 'top 85%', end: 'center center', scrub: 1.5 } }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [vehicles]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <main className="min-h-screen bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-x-hidden transition-colors duration-500">
        <div className="absolute inset-0 opacity-5 dark:opacity-[0.03] pointer-events-none fixed">
          <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000" alt="bg pattern" className="w-full h-full object-cover grayscale" />
        </div>
        
        {/* Fixed Back Button */}
        <div className="fixed top-6 left-4 md:left-8 z-50">
          <Link to="/" className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-forest/10 dark:border-white/10 text-forest dark:text-[#fdfbf7] hover:bg-orange hover:text-[#fdfbf7] dark:hover:bg-orange transition-all uppercase tracking-widest text-[10px] md:text-xs font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Banner Section */}
        <section className="relative pt-32 pb-16 z-10">
          <div className="text-center max-w-3xl mx-auto vehicle-reveal bg-white/40 dark:bg-[#0a0f0d]/60 backdrop-blur-md p-10 md:p-14 rounded-[3rem] shadow-xl border border-white/20 dark:border-white/5">
            <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Transportation</p>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight drop-shadow-sm text-forest dark:text-[#fdfbf7]">
              Rent A <span className="italic text-orange font-light">Car</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm uppercase tracking-widest font-bold">
               <Link to="/" className="hover:text-orange transition-colors">Home</Link>
               <span className="opacity-50">&rarr;</span>
               <span className="text-orange">Rent A Car</span>
            </div>
          </div>
        </section>

        {/* TRANSPORTATION About our Fleet */}
        <section className="py-24 relative z-10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-white/40 dark:bg-[#0a0f0d]/60 backdrop-blur-md p-10 md:p-12 rounded-[3rem] shadow-xl border border-white/20 dark:border-white/5">
              <h3 className="text-orange font-bold tracking-widest uppercase mb-4 text-sm">Transportation</h3>
              <h2 className="text-4xl md:text-5xl font-serif text-forest dark:text-[#fdfbf7] mb-12">About our Fleet</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <MapPin className="text-orange shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-forest dark:text-[#fdfbf7] mb-1 drop-shadow-sm">Location:</h4>
                    <p className="text-forest/80 dark:text-[#fdfbf7]/95 font-light dark:font-normal">Available across Sri Lanka, including Seeduwa</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Briefcase className="text-orange shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-forest dark:text-[#fdfbf7] mb-1 drop-shadow-sm">Portfolio:</h4>
                    <p className="text-forest/80 dark:text-[#fdfbf7]/95 font-light dark:font-normal">Cars, Vans, Mini Coaches, Coaches, and SUVs</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Calendar className="text-orange shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-forest dark:text-[#fdfbf7] mb-1 drop-shadow-sm">Availability:</h4>
                    <p className="text-forest/80 dark:text-[#fdfbf7]/95 font-light dark:font-normal">Accessible year-round through pre-bookings.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
               <div className="grid grid-cols-2 gap-4">
                 <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800" className="rounded-3xl object-cover h-[300px] w-full shadow-lg" alt="Fleet 1" />
                 <img src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800" className="rounded-3xl object-cover h-[300px] w-full mt-12 shadow-lg" alt="Fleet 2" />
               </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-24 relative z-10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="bg-white/5 dark:bg-black/40 backdrop-blur-md border border-forest/10 dark:border-white/10 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16 items-center shadow-lg">
              <div className="lg:w-1/2">
                <h2 className="text-4xl md:text-5xl font-serif mb-8 text-forest dark:text-[#fdfbf7] drop-shadow-sm">Services</h2>
                <p className="text-forest/80 dark:text-[#fdfbf7]/95 font-light dark:font-normal mb-6 leading-relaxed">
                  We offer a fleet that prioritizes luxury, comfort, and convenience. From the sleek opulence of private/individual tours to accommodating safe group tours, each vehicle embodies our commitment to go the extra mile for our clients. All our vehicles are equipped with air conditioning, free Wi-Fi, luggage storage, refrigerator/ cool box facilities, and GPS.
                </p>
                <p className="text-forest/80 dark:text-[#fdfbf7]/95 font-light dark:font-normal mb-6 leading-relaxed">
                  Our comprehensive vehicle yard with in-house fuel station, standby extra vehicles to face unprecedented situations and competent maintenance team guarantees the highest quality of service.
                </p>
                <p className="text-forest/80 dark:text-[#fdfbf7]/95 font-light dark:font-normal leading-relaxed">
                  We proudly operate a carbon-neutral fleet, contributing to a sustainable and eco-conscious travel experience.
                </p>
              </div>
              <div className="lg:w-1/2 w-full">
                <img src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1000" alt="Service Car" className="rounded-[2rem] w-full h-[400px] object-cover shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Fleet Portfolio (Dynamic Vehicles) */}
        <section ref={containerRef} className="py-24 relative z-10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 bg-white/40 dark:bg-[#0a0f0d]/60 backdrop-blur-md p-8 md:p-10 rounded-[2rem] shadow-xl border border-white/20 dark:border-white/5">
              <h2 className="text-4xl md:text-5xl font-serif text-forest dark:text-[#fdfbf7] drop-shadow-sm m-0">Fleet Portfolio</h2>
              {isAdmin && (
                <button onClick={() => { setEditingVehicle(null); setFormData({ name: '', type: 'Car', seats: '4', image: '', images: [], description: '', price: '', features: '', withGuide: true, ac: 'Yes', wifi: 'Free', insurance: 'Included' }); setIsModalOpen(true); }} className="flex items-center gap-2 bg-orange text-[#fdfbf7] px-6 py-3 rounded-full hover:bg-orange/90 transition-colors shadow-lg">
                  <Plus size={18} /> <span className="font-bold text-sm tracking-widest uppercase">Add Vehicle</span>
                </button>
              )}
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {vehicles.map((vehicle, idx) => (
              <Link key={vehicle.id || idx} to={`/vehicles/${vehicle.id}`} className="vehicle-card-item group relative h-[500px] rounded-2xl overflow-hidden block cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-[#0a0f0d] border border-forest/10 dark:border-white/10">
                {isAdmin && (
                  <div className="absolute top-4 left-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={(e) => handleEditClick(e, vehicle)} className="bg-white/90 text-forest p-2 rounded-full hover:bg-orange hover:text-[#fdfbf7] transition-colors">
                      <Edit size={16} />
                    </button>
                    <button onClick={(e) => handleDeleteClick(e, vehicle.id)} className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-[#fdfbf7] transition-colors">
                      <Trash size={16} />
                    </button>
                  </div>
                )}
                
                <img src={vehicle.images?.[0] || vehicle.image} alt={vehicle.name} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out" />
                
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-[#0a0f0d]/90 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-forest dark:text-[#fdfbf7] z-20">
                  {vehicle.type}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 bg-white/5 border-t border-white/10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl font-serif text-[#fdfbf7] mb-2 drop-shadow-lg">{vehicle.name}</h3>
                  <div className="flex items-center gap-4 text-[#fdfbf7]/95 text-sm mb-3 font-medium tracking-wide drop-shadow-md">
                     <span className="flex items-center gap-1"><Settings size={14} /> Auto/Manual</span>
                     <span className="flex items-center gap-1"><Car size={14} /> {vehicle.seats} Seats</span>
                  </div>
                  {vehicle.withGuide !== false && (
                    <div className="mb-4 text-[10px] font-bold uppercase tracking-widest text-orange flex items-center gap-1 drop-shadow-sm">
                       <Briefcase size={12} /> Includes Chauffeur Guide
                    </div>
                  )}
                  
                  <div className="mt-6 overflow-hidden h-0 group-hover:h-12 transition-all duration-500 flex items-center justify-between">
                     <p className="text-orange font-bold text-xl drop-shadow-md">{vehicle.price}</p>
                     <span className="text-sm font-bold tracking-widest uppercase text-[#fdfbf7] hover:text-orange transition-colors flex items-center gap-2 drop-shadow-md">
                       View Details
                       <div className="w-6 h-px bg-current"></div>
                     </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
      </div>
    </section>

        {/* Safety Measures */}
        <section className="py-24 relative z-10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="lg:pr-12 relative z-0">
                <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200" alt="Safety" className="rounded-[2rem] w-full h-[500px] object-cover shadow-2xl" />
              </div>
              <div className="bg-white/70 dark:bg-[#1a231d]/90 backdrop-blur-md text-forest dark:text-[#fdfbf7] p-10 md:p-16 rounded-[2rem] lg:-ml-24 relative z-10 shadow-2xl border border-forest/10 dark:border-white/10 mt-[-50px] lg:mt-0">
                <h2 className="text-3xl md:text-4xl font-serif mb-6 drop-shadow-sm">SAFETY MEASURES</h2>
                <p className="mb-6 opacity-90 dark:opacity-100 font-light dark:font-normal leading-relaxed">
                  Our commitment to safety is paramount. We maintain a dedicated vehicle maintenance unit. All vehicles are thoroughly sanitized after each trip, and our chauffeur guides are extensively trained. We provide first aid facilities and strictly adhere to safety regulations.
                </p>
                <p className="opacity-90 dark:opacity-100 font-light dark:font-normal leading-relaxed">
                  Further, we are partnered to facilitate our guests with live video consultation during any time of the tour.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rent A Car CTA */}
        <section className="py-24 relative z-10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="relative overflow-hidden rounded-[3rem] text-[#fdfbf7] text-center py-24 shadow-2xl">
              <div className="absolute inset-0 bg-black">
                <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=2000" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" alt="Rent a Car background" />
              </div>
              <div className="relative z-10 max-w-3xl mx-auto px-6">
                <h2 className="text-4xl md:text-6xl font-serif mb-8 drop-shadow-lg text-[#fdfbf7]">RENT-A-CAR</h2>
                <p className="text-lg opacity-100 mb-8 font-medium leading-relaxed drop-shadow-md text-[#fdfbf7]/95">
                  Experience hassle-free transportation with our rent-a-car service. Rent a vehicle with a chauffeur for a specified period, whether for a day, week, or month. Our range includes cars, vans, coaches and luxury cars or SUVs.
                </p>
                <p className="text-lg opacity-100 mb-12 font-medium drop-shadow-md text-[#fdfbf7]/95">
                  To book one of our vehicles, please contact our transportation department via <a href="mailto:hello@reisenova.com" className="text-orange hover:underline font-bold drop-shadow-sm">email</a>.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                   <Link to="/plan-trip" className="bg-orange text-[#fdfbf7] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#fdfbf7] hover:text-black transition-colors shadow-lg shadow-orange/20">
                     Book Now
                   </Link>
                   <div className="flex flex-col text-sm opacity-90 text-left gap-1">
                     <span className="flex items-center gap-2"><Phone size={16} className="text-orange"/> +94 76 001 0784 / +94 77 124 0693</span>
                     <span className="flex items-center gap-2"><Mail size={16} className="text-orange"/> hello@reisenova.com</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 relative z-10">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="font-serif italic text-3xl text-forest/40 dark:text-[#fdfbf7]/40 mb-2">FAQ</h3>
              <h2 className="text-4xl md:text-5xl font-serif text-forest dark:text-[#fdfbf7]">Frequently Asked Questions</h2>
              <p className="mt-6 opacity-70 font-light">Have questions you want answers to?</p>
            </div>
            
            <div className="space-y-4">
              {[
                { q: 'Q1. Is there a professional driver provided with transportation service?', a: 'Yes, our all vehicles come with well trained & experience chauffeurs.' },
                { q: 'Q2. Can I request a specific type of vehicle for my transportation?', a: 'Absolutely, we offer a wide range of vehicles to choose from.' },
                { q: 'Q3. How can I make a reservation for transportation?', a: 'You can book via our website, email, or contact numbers provided.' }
              ].map((faq, index) => (
                <div key={index} className="border border-forest/10 dark:border-[#fdfbf7]/20 rounded-2xl bg-white/60 dark:bg-[#1a231d]/90 backdrop-blur-md overflow-hidden transition-all duration-300 shadow-md">
                  <button 
                    onClick={() => toggleFaq(index)} 
                    className="w-full text-left p-6 font-bold text-lg flex justify-between items-center text-forest dark:text-[#fdfbf7] hover:text-orange dark:hover:text-orange transition-colors drop-shadow-sm"
                  >
                    {faq.q}
                    <ChevronDown className={`transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="opacity-90 dark:opacity-100 font-light dark:font-normal">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

    {isModalOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
        <div className="bg-[#fdfbf7] dark:bg-[#121915] text-forest dark:text-[#fdfbf7] p-8 rounded-2xl w-full max-w-2xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
          <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 opacity-50 hover:opacity-100 transition-colors">
            <X size={24} />
          </button>
          
          <h2 className="text-3xl font-serif mb-6">{editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Upload Images (Max 10)</label>
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
              {editingVehicle ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default VehiclesPage;
