import React, { useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, MapPin, Star, Coffee, Wifi, Waves, Wind, Shield, CheckCircle } from 'lucide-react';

const hotelData = {
  'amanwella': {
    name: 'Amanwella',
    location: 'Tangalle',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop',
    type: 'Beach Resort',
    desc: 'A contemporary beachfront retreat resting on a golden crescent on Sri Lanka’s sun-drenched south coast.',
    fullDesc: 'Situated in a mature coconut grove fronting a crescent-shaped beach, Amanwella is a tranquil seaside resort offering incredible ocean views. Each suite features a private plunge pool and a spacious terrace, perfect for soaking in the tropical surroundings. The resort\'s minimalist design beautifully complements the natural beauty of Tangalle, providing a sanctuary of peace and privacy.',
    price: 'From $950 / night',
    amenities: ['Private plunge pool', 'Oceanfront dining', 'Ayurvedic spa treatments', 'Yoga classes', 'Library', 'Infinity pool'],
    highlights: ['Direct access to a pristine private beach', 'Floor-to-ceiling sliding glass doors in all suites', 'Award-winning architecture and design']
  },
  'ceylon-tea-trails': {
    name: 'Ceylon Tea Trails',
    location: 'Hatton',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2825&auto=format&fit=crop',
    type: 'Heritage Bungalow',
    desc: 'The world\'s first tea estate resort, comprising five restored historic tea planter residences.',
    fullDesc: 'Perched at an altitude of 1,250 meters in Sri Lanka\'s panoramic Ceylon tea region, Tea Trails offers unparalleled luxury. The five restored colonial-era planter\'s bungalows feature period furnishings, gracious butler service, and gourmet cuisine. Guests can explore the lush tea fields, learn about the tea-making process, and enjoy the quintessential luxury of high tea in the gardens.',
    price: 'From $1,100 / night',
    amenities: ['Personal butler service', 'Gourmet dining', 'Guided tea tours', 'Swimming pools', 'Spa treatments', 'Tennis court'],
    highlights: ['Relais & Châteaux property', 'Authentic colonial heritage experience', 'Breathtaking views of Castlereagh reservoir']
  },
  'cape-weligama': {
    name: 'Cape Weligama',
    location: 'Weligama',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2940&auto=format&fit=crop',
    type: 'Cliffside Resort',
    desc: 'A spectacular cliffside resort offering panoramic views of the Indian Ocean.',
    fullDesc: 'Perched on a dramatic promontory rising 40 meters above the Indian Ocean, Cape Weligama is a celebrated luxury resort. The property features sprawling villas and suites, designed by renowned architect Lek Bunnag, set within 12 tropical acres. The iconic 60-meter crescent-shaped infinity pool appears to flow seamlessly into the shimmering sea below.',
    price: 'From $800 / night',
    amenities: ['Moon Pool (Infinity Pool)', 'Ocean cliff dining', 'PADI dive center', 'Spa villa', 'Fitness center', 'Kids club'],
    highlights: ['Unobstructed 270-degree ocean views', 'Luxurious freestanding villas', 'Exceptional culinary experiences']
  },
  'tri-lanka': {
    name: 'Tri Lanka',
    location: 'Koggala Lake',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?q=80&w=2874&auto=format&fit=crop',
    type: 'Eco Retreat',
    desc: 'An innovative, sustainable luxury eco-resort nestled on the shores of Koggala Lake.',
    fullDesc: 'Tri Lanka is a masterpiece of sustainable design, seamlessly integrated into its natural surroundings on the banks of Koggala Lake. The resort\'s spiraling layout, inspired by the Fibonacci sequence, ensures every suite and villa offers absolute privacy and stunning water views. It\'s a sanctuary dedicated to holistic wellness, physical rejuvenation, and spiritual awakening.',
    price: 'From $450 / night',
    amenities: ['Lakefront infinity pool', 'Treetop Yoga pavilion', 'Ayurvedic Spa', 'Organic dining', 'Library', 'Boat excursions'],
    highlights: ['100% sustainable and eco-friendly design', 'Unique spiraling architecture', 'Tranquil lakefront setting away from crowds']
  },
  'uga-ulagalla': {
    name: 'Uga Ulagalla',
    location: 'Anuradhapura',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2940&auto=format&fit=crop',
    type: 'Nature Resort',
    desc: 'A luxurious nature retreat set within a 58-acre estate in the Cultural Triangle.',
    fullDesc: 'Centered around a 150-year-old chieftain\'s mansion, Ulagalla offers a unique blend of historical charm and modern luxury. The 25 private ecologically-built chalets are scattered across 58 acres of lush woodland and paddy fields. Guests can explore the estate on horseback or bicycles, and discover the ancient wonders of Anuradhapura located just minutes away.',
    price: 'From $550 / night',
    amenities: ['Private plunge pools', 'Equestrian center', 'Archery', 'Underground wine cellar', 'Spa', 'Organic garden'],
    highlights: ['LEED certified eco-friendly resort', 'Immersive nature experiences', 'Proximity to UNESCO World Heritage sites']
  },
  'wild-coast-tented-lodge': {
    name: 'Wild Coast Tented Lodge',
    location: 'Yala',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=2940&auto=format&fit=crop',
    type: 'Safari Lodge',
    desc: 'A spectacular luxury tented camp where the jungle meets the rugged beach.',
    fullDesc: 'Adjacent to Yala National Park, Wild Coast Tented Lodge is a truly unique safari experience. The lodge\'s stunning organic architecture features boulder-like tents (Cocoons) that blend seamlessly into the surrounding landscape. The resort offers the ultimate luxury wilderness experience, combining world-class wildlife viewing with unparalleled comfort and spectacular oceanfront dining.',
    price: 'From $1,200 / night',
    amenities: ['Luxury safari Cocoons', 'Sanctuary Spa', 'Free-form swimming pool', 'Gourmet safari dining', 'Expert naturalists', 'Library'],
    highlights: ['Unique biomimetic architecture', 'Prime leopard spotting location', 'Where the jungle meets a pristine beach']
  }
};

const HotelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const hotel = id ? hotelData[id as keyof typeof hotelData] : null;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    
    const ctx = gsap.context(() => {
      gsap.fromTo('.hotel-details-reveal',
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
  }, [id]);

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent text-forest dark:text-[#fdfbf7]">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Hotel Not Found</h2>
          <Link to="/hotels" className="text-orange hover:underline uppercase tracking-widest font-semibold">Back to Hotels</Link>
        </div>
      </div>
    );
  }

  return (
    <section ref={containerRef} className="bg-transparent text-forest dark:text-[#fdfbf7] relative min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
          <div className="hotel-details-reveal flex items-center gap-2 mb-6">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[#fdfbf7] text-xs tracking-[0.2em] uppercase font-bold">
              {hotel.type}
            </span>
            <div className="flex bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
              {[...Array(hotel.rating)].map((_, i) => (
                <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-[#fdfbf7] text-center drop-shadow-lg hotel-details-reveal">
            {hotel.name}
          </h1>
          <div className="hotel-details-reveal mt-6 flex items-center gap-2 text-[#fdfbf7]/90 text-lg tracking-widest uppercase font-semibold">
             <MapPin size={20} className="text-orange" />
             {hotel.location}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 relative z-30">
        <div className="mb-12 hotel-details-reveal">
          <Link to="/hotels" className="inline-flex items-center gap-2 bg-orange text-[#fdfbf7] hover:bg-forest dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-all uppercase tracking-widest text-xs font-bold px-5 py-2.5 rounded-full shadow-lg hover:shadow-orange/30">
            <ArrowLeft size={16} />
            Back to Hotels
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-4xl font-serif mb-6 hotel-details-reveal">The Experience</h2>
              <p className="text-lg leading-relaxed text-forest/80 dark:text-[#fdfbf7]/80 hotel-details-reveal mb-6 font-medium italic">
                "{hotel.desc}"
              </p>
              <p className="text-lg leading-relaxed text-forest/80 dark:text-[#fdfbf7]/80 hotel-details-reveal">
                {hotel.fullDesc}
              </p>
            </div>

            <div className="hotel-details-reveal">
              <h3 className="text-2xl font-serif mb-6">Signature Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotel.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-forest/10 dark:border-white/10">
                    <CheckCircle className="text-orange shrink-0 mt-0.5" size={20} />
                    <span className="text-forest/90 dark:text-[#fdfbf7]/90 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hotel-details-reveal">
              <h3 className="text-2xl font-serif mb-6">Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {hotel.amenities.map((amenity, i) => (
                  <span key={i} className="px-4 py-2 rounded-full text-sm font-medium bg-forest/5 dark:bg-white/5 border border-forest/10 dark:border-white/10 text-forest/80 dark:text-[#fdfbf7]/80 flex items-center gap-2">
                    {/* Simplified icon selection just to give it a premium feel */}
                    <div className="w-1.5 h-1.5 rounded-full bg-orange"></div>
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white/40 dark:bg-[#0a0f0d]/40 backdrop-blur-md border border-forest/10 dark:border-white/10 rounded-2xl p-8 shadow-xl hotel-details-reveal sticky top-32">
              <div className="mb-6 pb-6 border-b border-forest/10 dark:border-white/10 text-center">
                <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-2">Starting From</span>
                <span className="text-4xl font-serif text-orange">{hotel.price}</span>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between text-forest/80 dark:text-[#fdfbf7]/80 border-b border-forest/5 dark:border-white/5 pb-4">
                  <span className="flex items-center gap-2"><Coffee size={18} className="text-orange"/> Breakfast</span>
                  <span className="font-medium">Included</span>
                </div>
                <div className="flex items-center justify-between text-forest/80 dark:text-[#fdfbf7]/80 border-b border-forest/5 dark:border-white/5 pb-4">
                  <span className="flex items-center gap-2"><Wifi size={18} className="text-orange"/> High-Speed WiFi</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex items-center justify-between text-forest/80 dark:text-[#fdfbf7]/80 pb-2">
                  <span className="flex items-center gap-2"><Shield size={18} className="text-orange"/> Cancellation</span>
                  <span className="font-medium">Flexible</span>
                </div>
              </div>
              
              <Link to="/plan-trip" className="w-full flex items-center justify-center gap-2 bg-forest text-sand dark:bg-[#16201a] dark:text-[#fdfbf7] px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange dark:hover:bg-orange hover:text-[#fdfbf7] dark:hover:text-[#fdfbf7] transition-all shadow-lg hover:shadow-orange/30">
                Book This Hotel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelDetailsPage;
