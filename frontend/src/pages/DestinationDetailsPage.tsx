import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, MapPin, Navigation, Calendar, Users } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';

const destinationsData = {
  sigiriya: { name: 'Sigiriya', desc: 'The Ancient Rock Fortress', img: 'https://images.unsplash.com/photo-1588258524451-24905d53a992?q=80&w=2940&auto=format&fit=crop', category: 'Heritage', fullDesc: 'Rising dramatically from the central plains, the enigmatic rocky outcrop of Sigiriya is perhaps Sri Lanka\'s single most dramatic sight. Near-vertical walls soar to a flat-topped summit that contains the ruins of an ancient civilization.', location: 'Central Province', bestTimeToVisit: 'January to April', activities: ['Rock Climbing', 'Photography', 'History Tours'] },
  ella: { name: 'Ella', desc: 'Misty Mountains & Tea', img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=2940&auto=format&fit=crop', category: 'Nature', fullDesc: 'Ella is a small town in the Badulla District of Uva Province, Sri Lanka. It is situated at an elevation of 1,041 metres above sea level. The area has a rich bio-diversity, dense with numerous varieties of flora and fauna.', location: 'Uva Province', bestTimeToVisit: 'January to May', activities: ['Hiking', 'Tea Plantation Visits', 'Train Rides'] },
  mirissa: { name: 'Mirissa', desc: 'Golden Sands & Whales', img: 'https://images.unsplash.com/photo-1579685655767-f3c5b967d26b?q=80&w=2940&auto=format&fit=crop', category: 'Beach', fullDesc: 'Mirissa is a small town on the south coast of Sri Lanka. It\'s a stunning crescent beach and one of the best places in the world for whale watching.', location: 'Southern Province', bestTimeToVisit: 'November to April', activities: ['Whale Watching', 'Surfing', 'Beach Relaxation'] },
  galle: { name: 'Galle', desc: 'Historic Dutch Fort', img: 'https://images.unsplash.com/photo-1586523925763-8a3fc073a62d?q=80&w=2940&auto=format&fit=crop', category: 'Culture', fullDesc: 'Galle is a jewel. A Unesco World Heritage Site, this historic city is a delight to explore on foot, an endlessly exotic old trading port blessed with imposing Dutch-colonial buildings.', location: 'Southern Province', bestTimeToVisit: 'December to March', activities: ['Walking Tours', 'Shopping', 'Photography'] },
  kandy: { name: 'Kandy', desc: 'The Sacred City', img: 'https://images.unsplash.com/photo-1620803457106-92c2865954ec?q=80&w=2940&auto=format&fit=crop', category: 'Heritage', fullDesc: 'Kandy is a large city in central Sri Lanka. It\'s set on a plateau surrounded by mountains, which are home to tea plantations and biodiverse rainforest.', location: 'Central Province', bestTimeToVisit: 'December to April', activities: ['Temple Visits', 'Botanical Gardens', 'Cultural Shows'] },
  yala: { name: 'Yala', desc: 'Wildlife Safari', img: 'https://images.unsplash.com/photo-1544079868-87422f281e05?q=80&w=2864&auto=format&fit=crop', category: 'Wildlife', fullDesc: 'Yala National Park is the most visited and second largest national park in Sri Lanka, bordering the Indian Ocean. The park consists of five blocks.', location: 'Southern Province', bestTimeToVisit: 'February to July', activities: ['Wildlife Safari', 'Bird Watching', 'Camping'] },
  'nuwara eliya': { name: 'Nuwara Eliya', desc: 'Little England', img: 'https://images.unsplash.com/photo-1616423528143-6901968840a1?q=80&w=2940&auto=format&fit=crop', category: 'Nature', fullDesc: 'Nuwara Eliya is a city in the tea country hills of central Sri Lanka. The naturally landscaped Hakgala Botanical Gardens displays roses and tree ferns.', location: 'Central Province', bestTimeToVisit: 'February to April', activities: ['Tea Tours', 'Golfing', 'Lake Walks'] },
  anuradhapura: { name: 'Anuradhapura', desc: 'Ancient Capital', img: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2940&auto=format&fit=crop', category: 'Heritage', fullDesc: 'Anuradhapura is a major city in Sri Lanka. It is the capital city of North Central Province, Sri Lanka and the capital of Anuradhapura District.', location: 'North Central Province', bestTimeToVisit: 'May to September', activities: ['Ruins Exploration', 'Cycling', 'Temple Visits'] }
};

const DestinationDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [destination, setDestination] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Normalize id to match keys (e.g., 'nuwara eliya' -> 'nuwara eliya')
  const destKey = id ? decodeURIComponent(id).toLowerCase() : '';

  const navigate = useNavigate();

  const handleBookClick = (e: React.MouseEvent) => {
    const isUser = localStorage.getItem('isUserLoggedIn') === 'true';
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isUser && !isAdmin) {
      e.preventDefault();
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchDest = async () => {
      try {
        let found = null;
        if (destinationsData[destKey as keyof typeof destinationsData]) {
          found = { ...destinationsData[destKey as keyof typeof destinationsData] };
          found.images = found.images || [found.img];
        } else {
          const res = await fetch(`/api/destinations/${id}`);
          if (res.ok) {
            const data = await res.json();
            found = {
              name: data.name,
              desc: data.description,
              img: data.images?.[0] || data.image || 'https://images.unsplash.com/photo-1588258524451-24905d53a992?q=80&w=2940&auto=format&fit=crop',
              images: data.images || (data.image ? [data.image] : []),
              category: data.highlights && data.highlights.length > 0 ? data.highlights[0] : 'Destination',
              fullDesc: data.fullDesc || data.description,
              location: data.location,
              bestTimeToVisit: data.bestTimeToVisit || 'Year-round',
              activities: data.activities || []
            };
          }
        }
        setDestination(found);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchDest();
  }, [id, destKey]);

  useLayoutEffect(() => {
    if (loading || !destination) return;
    window.scrollTo(0, 0);
    
    const ctx = gsap.context(() => {
      gsap.fromTo('.dest-details-reveal',
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

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent text-forest dark:text-[#fdfbf7]">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Destination Not Found</h2>
          <Link to="/destinations" className="text-orange hover:underline uppercase tracking-widest font-semibold">Back to Destinations</Link>
        </div>
      </div>
    );
  }

  return (
    <section ref={containerRef} className="bg-transparent text-forest dark:text-[#fdfbf7] relative min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <ImageCarousel images={destination.images && destination.images.length > 0 ? destination.images : [destination.img]} className="w-full h-full" alwaysShowArrows darkOverlay darkOverlayOpacity="bg-black/40" />
        </div>
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
          <div className="dest-details-reveal">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[#fdfbf7] text-xs tracking-[0.2em] uppercase mb-6 inline-block font-bold">
              {destination.category}
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-[#fdfbf7] text-center drop-shadow-lg dest-details-reveal">
            {destination.name}
          </h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 relative z-30">
        <div className="mb-12 dest-details-reveal">
          <Link to="/destinations" className="inline-flex items-center gap-2 bg-orange text-[#fdfbf7] hover:bg-forest dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-all uppercase tracking-widest text-xs font-bold px-5 py-2.5 rounded-full shadow-lg hover:shadow-orange/30">
            <ArrowLeft size={16} />
            Back to Destinations
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-serif mb-8 dest-details-reveal">About {destination.name}</h2>
            <p className="text-lg leading-relaxed text-forest/80 dark:text-[#fdfbf7]/80 dest-details-reveal mb-8">
              {destination.fullDesc}
            </p>
            <p className="text-lg leading-relaxed text-forest/80 dark:text-[#fdfbf7]/80 dest-details-reveal">
              {destination.desc}. Immerse yourself in the breathtaking landscapes and rich cultural heritage that this unique destination has to offer. Whether you're seeking adventure or relaxation, {destination.name} provides an unforgettable experience.
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-[#0a0f0d] border border-forest/10 dark:border-white/10 rounded-2xl p-8 shadow-xl dest-details-reveal">
              <h3 className="text-xl font-serif mb-6 border-b border-forest/10 dark:border-white/10 pb-4">Key Information</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-orange/10 p-3 rounded-full text-orange shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Location</span>
                    <span className="font-medium text-forest dark:text-[#fdfbf7]">{destination.location}</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-orange/10 p-3 rounded-full text-orange shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Best Time to Visit</span>
                    <span className="font-medium text-forest dark:text-[#fdfbf7]">{destination.bestTimeToVisit}</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-orange/10 p-3 rounded-full text-orange shrink-0">
                    <Navigation size={20} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-forest/50 dark:text-[#fdfbf7]/50 font-bold mb-1">Top Activities</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {destination.activities.map((act, i) => (
                        <span key={i} className="text-xs bg-forest/5 dark:bg-white/5 border border-forest/10 dark:border-white/10 px-2 py-1 rounded-md text-forest/80 dark:text-[#fdfbf7]/80">
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="dest-details-reveal">
               <Link to="/plan-trip" onClick={handleBookClick} className="w-full flex items-center justify-center gap-2 bg-orange text-[#fdfbf7] px-8 py-5 rounded-xl hover:bg-forest hover:text-[#fdfbf7] dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-all shadow-lg hover:shadow-orange/30 group">
                <span className="uppercase tracking-wider font-semibold">Plan Trip Here</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationDetailsPage;
