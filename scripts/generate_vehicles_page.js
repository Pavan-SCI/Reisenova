import fs from 'fs';

const content = `import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
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
  const [formData, setFormData] = useState({ name: '', type: 'Car', seats: '4', image: '', description: '', price: '', features: '' });
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
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('image', file);
    setIsUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({...prev, image: data.imageUrl}));
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        seats: parseInt(formData.seats) || 4,
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
      };
      
      const url = editingVehicle ? \`/api/vehicles/\${editingVehicle.id}\` : '/api/vehicles';
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
      image: vehicle.image || '',
      description: vehicle.description || '',
      price: vehicle.price || '',
      features: Array.isArray(vehicle.features) ? vehicle.features.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const res = await fetch(\`/api/vehicles/\${id}\`, { method: 'DELETE' });
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
    if (vehicles.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.vehicle-card-item',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [vehicles]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
    {/* Hero Banner Section */}
    <section className="relative pt-32 pb-24 bg-forest dark:bg-[#0a0f0d] text-[#fdfbf7] min-h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000" alt="Cars" className="w-full h-full object-cover opacity-30" />
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-serif mb-6">Rent A <span className="italic text-orange">Car</span></h1>
        <div className="flex items-center justify-center gap-2 text-sm uppercase tracking-widest font-bold">
           <Link to="/" className="hover:text-orange transition-colors">Home</Link>
           <span className="opacity-50">&rarr;</span>
           <span className="text-orange">Rent A Car</span>
        </div>
      </div>
    </section>

    {/* TRANSPORTATION About our Fleet */}
    <section className="py-24 bg-[#fdfbf7] dark:bg-[#121915]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h3 className="text-orange font-bold tracking-widest uppercase mb-4 text-sm">Transportation</h3>
          <h2 className="text-4xl md:text-5xl font-serif text-forest dark:text-[#fdfbf7] mb-12">About our Fleet</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <MapPin className="text-orange shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-forest dark:text-[#fdfbf7] mb-1">Location:</h4>
                <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light">Available across Sri Lanka, including Seeduwa</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Briefcase className="text-orange shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-forest dark:text-[#fdfbf7] mb-1">Portfolio:</h4>
                <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light">Cars, Vans, Mini Coaches, Coaches, and SUVs</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Calendar className="text-orange shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-forest dark:text-[#fdfbf7] mb-1">Availability:</h4>
                <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light">Accessible year-round through pre-bookings.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
           <div className="grid grid-cols-2 gap-4">
             <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800" className="rounded-3xl object-cover h-[300px] w-full" alt="Fleet 1" />
             <img src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800" className="rounded-3xl object-cover h-[300px] w-full mt-12" alt="Fleet 2" />
           </div>
        </div>
      </div>
    </section>

    {/* Services */}
    <section className="py-24 bg-forest dark:bg-[#0a0f0d] text-[#fdfbf7]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="bg-[#fdfbf7]/5 border border-white/10 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-serif mb-8">Services</h2>
            <p className="text-[#fdfbf7]/70 font-light mb-6 leading-relaxed">
              We offer a fleet that prioritizes luxury, comfort, and convenience. From the sleek opulence of private/individual tours to accommodating safe group tours, each vehicle embodies our commitment to go the extra mile for our clients. All our vehicles are equipped with air conditioning, free Wi-Fi, luggage storage, refrigerator/ cool box facilities, and GPS.
            </p>
            <p className="text-[#fdfbf7]/70 font-light mb-6 leading-relaxed">
              Our comprehensive vehicle yard with in-house fuel station, standby extra vehicles to face unprecedented situations and competent maintenance team guarantees the highest quality of service.
            </p>
            <p className="text-[#fdfbf7]/70 font-light leading-relaxed">
              We proudly operate a carbon-neutral fleet, contributing to a sustainable and eco-conscious travel experience.
            </p>
          </div>
          <div className="lg:w-1/2 w-full">
            <img src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1000" alt="Service Car" className="rounded-[2rem] w-full h-[400px] object-cover" />
          </div>
        </div>
      </div>
    </section>

    {/* Fleet Portfolio (Dynamic Vehicles) */}
    <section ref={containerRef} className="py-24 bg-[#fdfbf7] dark:bg-[#121915]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <h2 className="text-4xl md:text-5xl font-serif text-forest dark:text-[#fdfbf7]">Fleet Portfolio</h2>
          {isAdmin && (
            <button onClick={() => { setEditingVehicle(null); setFormData({ name: '', type: 'Car', seats: '4', image: '', description: '', price: '', features: '' }); setIsModalOpen(true); }} className="flex items-center gap-2 bg-orange text-white px-6 py-3 rounded-full hover:bg-orange/90 transition-colors shadow-lg">
              <Plus size={18} /> <span className="font-bold text-sm tracking-widest uppercase">Add Vehicle</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {vehicles.map((vehicle, idx) => (
            <Link key={vehicle.id || idx} to={\`/vehicles/\${vehicle.id}\`} className="vehicle-card-item group relative h-[450px] rounded-[2rem] overflow-hidden block border border-forest/10 dark:border-[#fdfbf7]/10 bg-white dark:bg-[#1a231d]">
              {isAdmin && (
                <div className="absolute top-4 left-4 z-30 flex gap-2">
                  <button onClick={(e) => handleEditClick(e, vehicle)} className="bg-white/90 text-forest p-2 rounded-full hover:bg-orange hover:text-white transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={(e) => handleDeleteClick(e, vehicle.id)} className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                    <Trash size={16} />
                  </button>
                </div>
              )}
              
              <div className="h-[60%] overflow-hidden relative">
                <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-forest shadow-lg">
                  {vehicle.type}
                </div>
              </div>
              <div className="p-8 h-[40%] flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif text-forest dark:text-[#fdfbf7] mb-2">{vehicle.name}</h3>
                  <div className="flex items-center gap-4 text-forest/60 dark:text-[#fdfbf7]/60 text-sm">
                     <span className="flex items-center gap-1"><Settings size={14} /> Auto/Manual</span>
                     <span className="flex items-center gap-1"><Car size={14} /> {vehicle.seats} Seats</span>
                  </div>
                </div>
                <p className="text-orange font-bold text-xl">{vehicle.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Safety Measures */}
    <section className="py-24 bg-[#fdfbf7] dark:bg-[#121915]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="lg:pr-12 relative z-0">
            <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200" alt="Safety" className="rounded-[2rem] w-full h-[500px] object-cover" />
          </div>
          <div className="bg-white dark:bg-[#1a231d] text-forest dark:text-[#fdfbf7] p-10 md:p-16 rounded-[2rem] lg:-ml-24 relative z-10 shadow-2xl border border-forest/5 dark:border-white/5 mt-[-50px] lg:mt-0">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">SAFETY MEASURES</h2>
            <p className="mb-6 opacity-80 font-light leading-relaxed">
              Our commitment to safety is paramount. We maintain a dedicated vehicle maintenance unit. All vehicles are thoroughly sanitized after each trip, and our chauffeur guides are extensively trained. We provide first aid facilities and strictly adhere to safety regulations.
            </p>
            <p className="opacity-80 font-light leading-relaxed">
              Further, we are partnered to facilitate our guests with live video consultation during any time of the tour.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Rent A Car CTA */}
    <section className="py-32 relative overflow-hidden text-white text-center">
      <div className="absolute inset-0 bg-black">
        <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=2000" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" alt="Rent a Car background" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-serif mb-8">RENT-A-CAR</h2>
        <p className="text-lg opacity-90 mb-8 font-light leading-relaxed">
          Experience hassle-free transportation with our rent-a-car service. Rent a vehicle with a chauffeur for a specified period, whether for a day, week, or month. Our range includes cars, vans, coaches and luxury cars or SUVs.
        </p>
        <p className="text-lg opacity-90 mb-12 font-light">
          To book one of our vehicles, please contact our transportation department via <a href="mailto:hello@reisenova.com" className="text-orange hover:underline font-bold">email</a>.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
           <Link to="/plan-trip" className="bg-orange text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors shadow-lg shadow-orange/20">
             Book Now
           </Link>
           <div className="flex flex-col text-sm opacity-90 text-left gap-1">
             <span className="flex items-center gap-2"><Phone size={16} className="text-orange"/> +94 76 001 0784 / +94 77 124 0693</span>
             <span className="flex items-center gap-2"><Mail size={16} className="text-orange"/> hello@reisenova.com</span>
           </div>
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-24 bg-[#fdfbf7] dark:bg-[#121915]">
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
            <div key={index} className="border border-forest/10 dark:border-[#fdfbf7]/10 rounded-2xl bg-white dark:bg-[#1a231d] overflow-hidden transition-all duration-300">
              <button 
                onClick={() => toggleFaq(index)} 
                className="w-full text-left p-6 font-bold text-lg flex justify-between items-center text-forest dark:text-[#fdfbf7] hover:text-orange dark:hover:text-orange transition-colors"
              >
                {faq.q}
                <ChevronDown className={\`transition-transform duration-300 \${openFaq === index ? 'rotate-180' : ''}\`} />
              </button>
              <div className={\`px-6 overflow-hidden transition-all duration-300 \${openFaq === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}\`}>
                <p className="opacity-70 font-light">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

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

            <div>
              <label className="text-xs uppercase tracking-widest opacity-70 mb-2 block">Upload Image</label>
              <div className="flex gap-4 items-center">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-transparent border border-forest/20 dark:border-[#fdfbf7]/20 rounded-lg p-2 outline-none focus:border-orange file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange/10 file:text-orange hover:file:bg-orange/20" />
                {isUploading && <span className="text-xs text-orange animate-pulse">Uploading...</span>}
              </div>
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
`;

fs.writeFileSync('src/pages/VehiclesPage.tsx', content);
