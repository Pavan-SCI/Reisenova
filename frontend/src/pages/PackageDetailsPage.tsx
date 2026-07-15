import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, MapPin, Clock, CalendarCheck, Info, CheckCircle } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';

const allPackages = {
  '7-day-cultural-triangle': {
    title: '7-Day Cultural Triangle',
    desc: 'Explore ancient cities, majestic temples, and the legendary Sigiriya Rock Fortress. Perfect for history enthusiasts.',
    duration: '7 Days / 6 Nights',
    destinations: ['Anuradhapura', 'Polonnaruwa', 'Sigiriya', 'Dambulla', 'Kandy'],
    img: 'https://images.unsplash.com/photo-1620803457106-92c2865954ec?q=80&w=2940&auto=format&fit=crop',
    price: 'From $850',
    fullDesc: 'Embark on a mesmerizing 7-day journey through Sri Lanka\'s Cultural Triangle. Step back in time as you explore the ancient capitals of Anuradhapura and Polonnaruwa, featuring magnificent stupas and ancient reservoirs. Climb the iconic Sigiriya Rock Fortress, marvel at the Dambulla Cave Temple, and experience the cultural heartbeat of Kandy.',
    highlights: [
      'Guided tour of ancient ruins in Anuradhapura and Polonnaruwa',
      'Climb the 5th-century Sigiriya Rock Fortress',
      'Visit the Dambulla Cave Temple complex',
      'Temple of the Sacred Tooth Relic in Kandy',
      'Traditional Kandyan cultural dance performance'
    ],
    inclusions: ['4-star accommodation', 'Daily breakfast and dinner', 'English-speaking chauffeur guide', 'All entrance fees to historical sites', 'Air-conditioned transport']
  },
  '14-day-island-explorer': {
    title: '14-Day Island Explorer',
    desc: 'A comprehensive journey through misty tea plantations, pristine beaches, and thrilling wildlife safaris.',
    duration: '14 Days / 13 Nights',
    destinations: ['Colombo', 'Kandy', 'Nuwara Eliya', 'Yala', 'Mirissa', 'Galle'],
    img: 'https://images.unsplash.com/photo-1586523925763-8a3fc073a62d?q=80&w=2940&auto=format&fit=crop',
    price: 'From $1,450',
    fullDesc: 'Experience the best of Sri Lanka in this 14-day comprehensive tour. From the bustling streets of Colombo to the serene hills of Nuwara Eliya, the thrilling wildlife of Yala, and the relaxing beaches of Mirissa, this package offers a complete tropical island experience.',
    highlights: [
      'City tour of Colombo',
      'Scenic train ride from Kandy to Nuwara Eliya',
      'Tea plantation and factory visit',
      'Jeep safari in Yala National Park',
      'Whale watching in Mirissa',
      'Explore the historic Galle Fort'
    ],
    inclusions: ['Boutique and 4-star accommodation', 'Daily breakfast', 'Private air-conditioned transport', 'Selected activities and safaris', 'Airport transfers']
  },
  '5-day-wildlife-safari': {
    title: '5-Day Wildlife Safari',
    desc: 'An intense wildlife experience focusing on leopards, elephants, and endemic birds in their natural habitats.',
    duration: '5 Days / 4 Nights',
    destinations: ['Wilpattu', 'Minneriya', 'Yala'],
    img: 'https://images.unsplash.com/photo-1544079868-87422f281e05?q=80&w=2864&auto=format&fit=crop',
    price: 'From $700',
    fullDesc: 'Calling all nature lovers! This 5-day safari takes you deep into Sri Lanka\'s most famous national parks. Spot leopards in Wilpattu and Yala, and witness the incredible elephant gathering at Minneriya. A true wildlife adventure.',
    highlights: [
      'Full-day safari in Wilpattu National Park',
      'Witness the Elephant Gathering at Minneriya',
      'Morning and evening safaris in Yala National Park',
      'Bird watching opportunities'
    ],
    inclusions: ['Eco-lodge accommodation', 'All meals included', 'Private 4x4 safari jeeps', 'Park entrance fees', 'Expert wildlife tracker']
  },
  '10-day-surf-and-sand': {
    title: '10-Day Surf & Sand',
    desc: 'The ultimate coastal escape. Chase the best waves and relax on pristine golden beaches along the south and east coasts.',
    duration: '10 Days / 9 Nights',
    destinations: ['Hikkaduwa', 'Unawatuna', 'Mirissa', 'Arugam Bay'],
    img: 'https://images.unsplash.com/photo-1579685655767-f3c5b967d26b?q=80&w=2940&auto=format&fit=crop',
    price: 'From $1,100',
    fullDesc: 'Catch the perfect wave and soak up the sun on Sri Lanka\'s best beaches. From the lively shores of Hikkaduwa to the world-renowned surf breaks of Arugam Bay, this 10-day itinerary is designed for beach bums and surf enthusiasts.',
    highlights: [
      'Surfing lessons in Hikkaduwa',
      'Relax on the palm-fringed beaches of Unawatuna',
      'Vibrant nightlife in Mirissa',
      'World-class surfing in Arugam Bay'
    ],
    inclusions: ['Beachfront accommodation', 'Daily breakfast', 'Surfboard rentals', 'Private transport between beaches']
  },
  '8-day-hill-country-retreat': {
    title: '8-Day Hill Country Retreat',
    desc: 'Breathe in the crisp mountain air, hike through lush tea estates, and experience the iconic train journey.',
    duration: '8 Days / 7 Nights',
    destinations: ['Kandy', 'Hatton', 'Nuwara Eliya', 'Ella'],
    img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=2940&auto=format&fit=crop',
    price: 'From $950',
    fullDesc: 'Escape to the misty mountains of Sri Lanka. Discover the charm of Nuwara Eliya ("Little England"), hike the scenic trails of Ella, and enjoy breathtaking views of endless tea estates and cascading waterfalls.',
    highlights: [
      'Visit the Temple of the Tooth in Kandy',
      'Stay amidst tea trails in Hatton',
      'Explore Nuwara Eliya town and Gregory Lake',
      'Hike to Little Adam\'s Peak and Nine Arch Bridge in Ella'
    ],
    inclusions: ['Heritage hotel accommodation', 'Daily breakfast and high tea', 'Scenic train tickets (subject to availability)', 'Private air-conditioned transport']
  },
  '12-day-wellness-and-ayurveda': {
    title: '12-Day Wellness & Ayurveda',
    desc: 'Rejuvenate your mind and body with ancient healing practices, yoga, and meditation in serene settings.',
    duration: '12 Days / 11 Nights',
    destinations: ['Negombo', 'Kandy', 'Weligama', 'Bentota'],
    img: 'https://images.unsplash.com/photo-1588258524451-24905d53a992?q=80&w=2940&auto=format&fit=crop',
    price: 'From $1,800',
    fullDesc: 'Focus on your well-being with this 12-day Ayurvedic retreat. Experience traditional Sri Lankan healing therapies, daily yoga sessions, and mindful meditation, all set against the backdrop of tranquil beaches and peaceful nature.',
    highlights: [
      'Ayurvedic consultation and customized treatment plan',
      'Daily yoga and meditation sessions',
      'Relaxation by the beach in Weligama and Bentota',
      'Healthy, organic Ayurvedic meals'
    ],
    inclusions: ['Accommodation at an Ayurveda resort', 'All Ayurvedic meals and herbal drinks', 'Daily treatments and massages', 'Yoga sessions', 'Airport transfers']
  }
};

const PackageDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [pkg, setPkg] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isBooked, setIsBooked] = React.useState(false);
  const navigate = useNavigate();

  const handleBookClick = async (e: React.MouseEvent) => {
    e.preventDefault();
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
        userId: userId || userEmail || 'unknown_user',
        userEmail: userEmail || 'unknown_user',
        packageId: pkg?.id || id,
        packageDetails: pkg
      };
      const res = await fetch('/api/bookings/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Package booked successfully!');
        setIsBooked(true);
      } else {
        alert('Failed to book package.');
      }
    } catch (err) {
      console.error(err);
      alert('Error booking package.');
    }
  };

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        let found = null;
        if (id && allPackages[id as keyof typeof allPackages]) {
          found = { id, ...allPackages[id as keyof typeof allPackages] };
        } else if (id) {
          const res = await fetch(`/api/packages/${id}`);
          if (res.ok) {
            const data = await res.json();
            found = {
              title: data.title,
              desc: data.description,
              duration: data.duration,
              destinations: data.destinations || data.included || [],
              img: data.images?.[0] || data.image || 'https://images.unsplash.com/photo-1620803457106-92c2865954ec?q=80&w=2940&auto=format&fit=crop',
              images: data.images || (data.image ? [data.image] : []),
              price: `From $${data.price}`,
              fullDesc: data.fullDesc || data.description,
              highlights: data.highlights || [],
              inclusions: data.inclusions || []
            };
          }
        }
        setPkg(found);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchPackage();
    
    const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
    if (userId) {
      fetch(`/api/bookings/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.packages && data.packages.some((b: any) => b.packageId === id)) {
            setIsBooked(true);
          }
        })
        .catch(console.error);
    }
  }, [id]);

  useLayoutEffect(() => {
    if (loading || !pkg) return;
    window.scrollTo(0, 0);
    
    const ctx = gsap.context(() => {
      gsap.fromTo('.pkg-details-reveal',
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent text-forest dark:text-[#fdfbf7]">
        <div className="text-center text-2xl font-serif">Loading...</div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent text-forest dark:text-[#fdfbf7]">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Package Not Found</h2>
          <Link to="/packages" className="text-orange hover:underline uppercase tracking-widest font-semibold">Back to Packages</Link>
        </div>
      </div>
    );
  }

  return (
    <section ref={containerRef} className="bg-transparent text-forest dark:text-[#fdfbf7] relative min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <ImageCarousel images={pkg.images && pkg.images.length > 0 ? pkg.images : [pkg.img]} className="w-full h-full" alwaysShowArrows darkOverlay darkOverlayOpacity="bg-black/50" />
        </div>
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
          <div className="pkg-details-reveal">
            <span className="bg-orange/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[#fdfbf7] text-xs tracking-[0.2em] uppercase mb-6 inline-block font-bold">
              {pkg.duration}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#fdfbf7] text-center drop-shadow-lg pkg-details-reveal max-w-4xl">
            {pkg.title}
          </h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 relative z-30">
        <div className="mb-12 pkg-details-reveal">
          <Link to="/packages" className="inline-flex items-center gap-2 bg-orange text-[#fdfbf7] hover:bg-forest dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-all uppercase tracking-widest text-xs font-bold px-5 py-2.5 rounded-full shadow-lg hover:shadow-orange/30">
            <ArrowLeft size={16} />
            Back to Packages
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-4xl font-serif mb-6 pkg-details-reveal">Overview</h2>
              <p className="text-lg leading-relaxed text-forest/80 dark:text-[#fdfbf7]/80 pkg-details-reveal">
                {pkg.fullDesc}
              </p>
            </div>

            <div className="pkg-details-reveal">
              <h3 className="text-2xl font-serif mb-6 flex items-center gap-3">
                <MapPin className="text-orange" /> Route & Destinations
              </h3>
              <div className="flex flex-wrap gap-3">
                {pkg.destinations.map((dest, i) => (
                  <React.Fragment key={i}>
                    <span className="bg-white dark:bg-[#0a0f0d] px-4 py-2 rounded-full border border-forest/10 dark:border-white/10 font-medium">
                      {dest}
                    </span>
                    {i < pkg.destinations.length - 1 && (
                      <span className="flex items-center text-forest/40 dark:text-[#fdfbf7]/40">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="pkg-details-reveal">
              <h3 className="text-2xl font-serif mb-6 flex items-center gap-3">
                <CheckCircle className="text-orange" /> Tour Highlights
              </h3>
              <ul className="space-y-4">
                {pkg.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-3 text-forest/80 dark:text-[#fdfbf7]/80">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-orange shrink-0"></div>
                    <span className="text-lg">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-[#0a0f0d] border border-forest/10 dark:border-white/10 rounded-2xl p-8 shadow-xl pkg-details-reveal sticky top-32">
              <div className="mb-6 pb-6 border-b border-forest/10 dark:border-white/10">
                <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-2">Starting Price</span>
                <span className="text-4xl font-serif text-orange">{pkg.price}</span>
                <span className="text-sm text-forest/50 dark:text-[#fdfbf7]/50 ml-2">/ per person</span>
              </div>
              
              <ul className="space-y-6 mb-8">
                <li className="flex items-start gap-4">
                  <div className="bg-orange/10 p-3 rounded-full text-orange shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Duration</span>
                    <span className="font-medium text-forest dark:text-[#fdfbf7]">{pkg.duration}</span>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="bg-orange/10 p-3 rounded-full text-orange shrink-0">
                    <Info size={20} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">What's Included</span>
                    <ul className="mt-2 space-y-2">
                      {pkg.inclusions.map((inc, i) => (
                        <li key={i} className="text-sm text-forest/80 dark:text-[#fdfbf7]/80 flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
              
              {isBooked ? (
                <button disabled className="w-full flex items-center justify-center gap-2 bg-forest/20 text-forest/50 dark:bg-[#fdfbf7]/20 dark:text-[#fdfbf7]/50 px-8 py-4 rounded-xl font-bold uppercase tracking-widest cursor-not-allowed">
                  Already Booked
                </button>
              ) : (
                <button onClick={handleBookClick} className="w-full flex items-center justify-center gap-2 bg-forest text-sand dark:bg-[#16201a] dark:text-[#fdfbf7] px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange dark:hover:bg-orange hover:text-[#fdfbf7] dark:hover:text-[#fdfbf7] transition-all shadow-lg hover:shadow-orange/30">
                <CalendarCheck size={18} />
                Book This Package
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageDetailsPage;
