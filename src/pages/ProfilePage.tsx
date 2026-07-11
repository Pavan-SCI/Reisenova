import React, { useRef, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, User, Map, Settings, Heart, LogOut, Camera, Edit2, Calendar, MapPin, ChevronRight, Palmtree, Sun } from 'lucide-react';

const ProfilePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('profile');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.profile-reveal',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab]);

  return (
    <section ref={containerRef} className="min-h-screen pt-24 pb-24 md:pt-32 md:pb-32 bg-transparent text-[#fdfbf7] relative overflow-hidden">
      
      <div className="fixed top-6 left-4 md:left-8 z-50">
        <Link to="/" className="inline-flex items-center gap-2 bg-black/60 dark:bg-black/60 backdrop-blur-md border border-[#fdfbf7]/10 text-[#fdfbf7] hover:bg-orange hover:text-[#fdfbf7] transition-all uppercase tracking-widest text-[10px] md:text-xs font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-12 profile-reveal text-center flex flex-col items-center">
          <Link to="/" className="inline-flex flex-col items-center mb-8 group cursor-pointer">
            <div className="relative flex items-center justify-center h-12 w-16 mb-2">
              <Palmtree size={40} className="text-black dark:text-[#fdfbf7] absolute left-0 bottom-0 z-10 -rotate-12 group-hover:rotate-0 transition-all duration-500" />
              <Palmtree size={28} className="text-black dark:text-[#fdfbf7] absolute right-2 bottom-1 z-10 rotate-12 group-hover:rotate-0 transition-all duration-500" />
              <Sun size={24} className="text-orange absolute bottom-2 left-5 z-0 fill-current group-hover:scale-125 transition-transform duration-700" />
            </div>
          </Link>
          <h2 className="text-4xl md:text-5xl font-serif text-black dark:text-[#fdfbf7] mb-2 leading-tight drop-shadow-md">
            My <span className="italic text-orange font-light">Account</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 flex flex-col gap-4">
            <div className="bg-black/60 dark:bg-[#0a0f0d]/30 backdrop-blur-xl border border-[#fdfbf7]/10 dark:border-[#fdfbf7]/10 p-6 rounded-3xl shadow-xl flex flex-col items-center text-center text-[#fdfbf7]">
              <div className="w-full profile-reveal flex flex-col items-center">
                <div className="relative mb-4 group cursor-pointer">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange p-1">
                    <div className="w-full h-full rounded-full bg-[#fdfbf7]/10 flex items-center justify-center overflow-hidden">
                      <User size={40} className="text-[#fdfbf7]/40" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-orange text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Camera size={14} />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#fdfbf7]">John Doe</h3>
                <p className="text-[#fdfbf7]/70 text-xs tracking-widest uppercase mt-1 mb-4">Explorer</p>
                <div className="w-full h-[1px] bg-[#fdfbf7]/10 mb-4"></div>
              
                <nav className="w-full flex flex-col gap-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm tracking-wide font-medium ${activeTab === 'profile' ? 'bg-orange text-white shadow-lg' : 'text-[#fdfbf7] hover:bg-forest/5 dark:hover:bg-[#fdfbf7]/5 hover:text-orange dark:hover:text-orange'}`}
                >
                  <User size={18} />
                  Personal Info
                </button>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm tracking-wide font-medium ${activeTab === 'bookings' ? 'bg-orange text-white shadow-lg' : 'text-[#fdfbf7] hover:bg-forest/5 dark:hover:bg-[#fdfbf7]/5 hover:text-orange dark:hover:text-orange'}`}
                >
                  <Map size={18} />
                  My Bookings
                </button>
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm tracking-wide font-medium ${activeTab === 'wishlist' ? 'bg-orange text-white shadow-lg' : 'text-[#fdfbf7] hover:bg-forest/5 dark:hover:bg-[#fdfbf7]/5 hover:text-orange dark:hover:text-orange'}`}
                >
                  <Heart size={18} />
                  Wishlist
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm tracking-wide font-medium ${activeTab === 'settings' ? 'bg-orange text-white shadow-lg' : 'text-[#fdfbf7] hover:bg-forest/5 dark:hover:bg-[#fdfbf7]/5 hover:text-orange dark:hover:text-orange'}`}
                >
                  <Settings size={18} />
                  Settings
                </button>
              </nav>

              <button className="w-full flex items-center justify-center gap-2 mt-8 px-4 py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm tracking-widest uppercase font-bold">
                <LogOut size={16} />
                Sign Out
              </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-black/60 dark:bg-[#0a0f0d]/30 backdrop-blur-xl border border-[#fdfbf7]/10 dark:border-[#fdfbf7]/10 p-8 md:p-10 rounded-3xl shadow-xl min-h-[500px] text-[#fdfbf7]">
              
              {activeTab === 'profile' && (
                <div className="profile-reveal">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-serif text-[#fdfbf7]">Personal Information</h3>
                    <button className="flex items-center gap-2 text-orange text-sm font-semibold tracking-widest uppercase hover:text-[#fdfbf7]/80 transition-colors">
                      <Edit2 size={14} /> Edit
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">First Name</label>
                      <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">John</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Last Name</label>
                      <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">Doe</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Email Address</label>
                      <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">john.doe@example.com</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Phone Number</label>
                      <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">+1 234 567 8900</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Date of Birth</label>
                      <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">15 March 1985</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Nationality</label>
                      <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">United Kingdom</div>
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Address</label>
                      <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">123 Explorer Street, Adventure City, AC 12345</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="profile-reveal">
                  <h3 className="text-2xl font-serif text-[#fdfbf7] mb-8">My Bookings</h3>
                  
                  <div className="flex flex-col gap-6">
                    {/* Active Booking */}
                    <div className="border border-orange/30 bg-orange/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=600&auto=format&fit=crop" alt="Sigiriya" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-orange bg-orange/10 px-2 py-1 rounded">Upcoming</span>
                            <h4 className="text-xl font-serif font-bold text-[#fdfbf7] mt-2">Cultural Triangle Heritage</h4>
                          </div>
                          <span className="text-lg font-medium text-[#fdfbf7]">$1,299</span>
                        </div>
                        <div className="flex items-center gap-4 text-[#fdfbf7] text-sm">
                          <div className="flex items-center gap-1"><Calendar size={14} /> Oct 15 - Oct 22, 2026</div>
                          <div className="flex items-center gap-1"><User size={14} /> 2 Adults</div>
                        </div>
                        <button className="text-orange text-sm font-semibold tracking-widest uppercase hover:text-[#fdfbf7]/80 transition-colors self-start mt-2 flex items-center gap-1">
                          View Itinerary <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Past Booking */}
                    <div className="border border-[#fdfbf7]/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center opacity-70 hover:opacity-100 transition-opacity">
                      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1544473244-f6895e69ce8d?q=80&w=600&auto=format&fit=crop" alt="Beaches" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div className="flex-1 flex flex-col gap-3 w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#fdfbf7]/70 bg-[#fdfbf7]/5 px-2 py-1 rounded">Completed</span>
                            <h4 className="text-xl font-serif font-bold text-[#fdfbf7] mt-2">Southern Coastal Retreat</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[#fdfbf7] text-sm">
                          <div className="flex items-center gap-1"><Calendar size={14} /> Jan 05 - Jan 12, 2025</div>
                        </div>
                        <div className="flex gap-4 mt-2">
                          <button className="text-[#fdfbf7] text-sm font-semibold tracking-widest uppercase hover:text-orange dark:hover:text-orange transition-colors flex items-center gap-1">
                            Write Review
                          </button>
                          <button className="text-orange text-sm font-semibold tracking-widest uppercase hover:text-[#fdfbf7]/80 transition-colors flex items-center gap-1">
                            Book Again
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="profile-reveal">
                  <h3 className="text-2xl font-serif text-[#fdfbf7] mb-8">Saved Destinations</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { name: 'Ella Highlands', img: 'https://images.unsplash.com/photo-1563200055-6b582b13ed8c?q=80&w=600&auto=format&fit=crop' },
                      { name: 'Yala Safari', img: 'https://images.unsplash.com/photo-1544079868-87422f281e05?q=80&w=600&auto=format&fit=crop' }
                    ].map((item, i) => (
                      <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                          <Heart size={18} className="fill-current" />
                        </div>
                        <div className="absolute bottom-6 left-6">
                          <h4 className="text-white font-serif text-xl mb-1">{item.name}</h4>
                          <span className="text-white/80 text-xs font-semibold tracking-widest uppercase flex items-center gap-1">
                            <MapPin size={12} /> Sri Lanka
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="profile-reveal">
                  <h3 className="text-2xl font-serif text-[#fdfbf7] mb-8">Account Settings</h3>
                  
                  <div className="flex flex-col gap-8">
                    {/* Password Section */}
                    <div>
                      <h4 className="text-lg font-bold text-[#fdfbf7] mb-4">Change Password</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]">Current Password</label>
                          <input type="password" placeholder="••••••••" className="bg-transparent border-b border-[#fdfbf7]/20 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                        </div>
                        <div className="hidden md:block"></div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]">New Password</label>
                          <input type="password" placeholder="••••••••" className="bg-transparent border-b border-[#fdfbf7]/20 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]">Confirm New Password</label>
                          <input type="password" placeholder="••••••••" className="bg-transparent border-b border-[#fdfbf7]/20 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                        </div>
                      </div>
                      <button className="mt-6 bg-orange text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-forest dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-colors">
                        Update Password
                      </button>
                    </div>

                    <div className="w-full h-[1px] bg-[#fdfbf7]/10"></div>

                    {/* Notifications Section */}
                    <div>
                      <h4 className="text-lg font-bold text-[#fdfbf7] mb-4">Notifications</h4>
                      <div className="flex flex-col gap-6">
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-[#fdfbf7]/80 text-sm font-medium">Email updates on bookings</span>
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-forest/20 dark:bg-[#fdfbf7]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange"></div>
                          </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-[#fdfbf7]/80 text-sm font-medium">Promotional offers & travel news</span>
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-forest/20 dark:bg-[#fdfbf7]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange"></div>
                          </div>
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
