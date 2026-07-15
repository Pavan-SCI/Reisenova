import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { ArrowLeft, User, Map, Settings, Heart, LogOut, Camera, Edit2, Calendar, MapPin, ChevronRight, Palmtree, Sun } from 'lucide-react';

const ProfilePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [userName, setUserName] = useState<string>('Explorer');
  const [profileImage, setProfileImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('userProfileImage', base64String);
        
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            await setDoc(doc(db, 'users', userId), { profileImage: base64String }, { merge: true });
          }
        } catch (err) {
          console.error("Error saving profile image", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [userEmailAddress, setUserEmailAddress] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', email: '', phone: '', dob: '', nationality: '', address: '' });
  const [userDob, setUserDob] = useState<string>('');
  const [userNationality, setUserNationality] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    promotionalOffers: false
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    try {
      const user = auth.currentUser;
      if (!user) {
        setPasswordMsg({ type: 'error', text: 'You must be logged in to change password' });
        return;
      }
      
      if (user.providerData.some(provider => provider.providerId === 'google.com')) {
         setPasswordMsg({ type: 'error', text: 'You are signed in with Google, you cannot change password here.' });
         return;
      }
      
      const credential = EmailAuthProvider.credential(user.email!, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);
      
      setPasswordMsg({ type: 'success', text: 'Password updated successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error(error);
      setPasswordMsg({ type: 'error', text: error.message || 'Failed to update password' });
    }
  };
  
  const handleNotificationToggle = async (key: 'emailUpdates' | 'promotionalOffers') => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
         await setDoc(doc(db, 'users', userId), { notifications: newNotifications }, { merge: true });
      }
    } catch (err) {
       console.error("Failed to update notifications", err);
    }
  };


  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem('userEmail');
      if (email) setUserEmailAddress(email);
      const name = localStorage.getItem('userName');
      if (name) setUserName(name);
      const savedImage = localStorage.getItem('userProfileImage');
      if (savedImage) setProfileImage(savedImage);
      
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.name) setUserName(data.name);
            if (data.phone) setUserPhone(data.phone);
            if (data.dob) setUserDob(data.dob);
            if (data.nationality) setUserNationality(data.nationality);
            if (data.address) setUserAddress(data.address);
            if (data.notifications) setNotifications(data.notifications);
            if (data.profileImage) {
              setProfileImage(data.profileImage);
              localStorage.setItem('userProfileImage', data.profileImage);
            }
          }
        } catch (err) {
          console.error("Error fetching user data", err);
        }
      }
    };
    fetchUserData();
  }, []);

  
  const handleEditClick = () => {
    const parts = userName.split(' ');
    setEditData({
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      email: userEmailAddress || '',
      phone: userPhone || '',
      dob: userDob || '',
      nationality: userNationality || '',
      address: userAddress || ''
    });
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const newName = `${editData.firstName} ${editData.lastName}`.trim();
    setUserName(newName);
    setUserEmailAddress(editData.email);
    setUserPhone(editData.phone);
    setUserDob(editData.dob);
    setUserNationality(editData.nationality);
    setUserAddress(editData.address);
    
    localStorage.setItem('userName', newName);
    localStorage.setItem('userEmail', editData.email);
    localStorage.setItem('userPhone', editData.phone);
    
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        await setDoc(doc(db, 'users', userId), {
          name: newName,
          phone: editData.phone,
          dob: editData.dob,
          nationality: editData.nationality,
          address: editData.address
        }, { merge: true });
      }
    } catch (err) {
      console.error("Error updating user data", err);
    }
    
    setIsEditing(false);
  };

const [packageBookings, setPackageBookings] = useState<any[]>([]);
  const [hotelBookings, setHotelBookings] = useState<any[]>([]);
  const [vehicleBookings, setVehicleBookings] = useState<any[]>([]);
  
  useEffect(() => {
    const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
    if (userId) {
      fetch(`/api/bookings/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          setPackageBookings(data.packages || []);
          setHotelBookings(data.hotels || []);
          setVehicleBookings(data.vehicles || []);
        })
        .catch(err => console.error('Failed to fetch bookings:', err));
    }
  }, []);



  const handleCancelBooking = async (type: string, bookingId: string) => {
    
    
    try {
      const res = await fetch(`/api/bookings/${type}/${bookingId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        
        if (type === 'package') {
          setPackageBookings(prev => prev.filter(b => b.id !== bookingId));
        } else if (type === 'hotel') {
          setHotelBookings(prev => prev.filter(b => b.id !== bookingId));
        } else if (type === 'vehicle') {
          setVehicleBookings(prev => prev.filter(b => b.id !== bookingId));
        }
      } else {
        
      }
    } catch (err) {
      console.error(err);
      
    }
  };

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
                <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange p-1">
                    <div className="w-full h-full rounded-full bg-[#fdfbf7]/10 flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} className="text-[#fdfbf7]/40" />
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-orange text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Camera size={14} />
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#fdfbf7]">{userName}</h3>
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
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm tracking-wide font-medium ${activeTab === 'settings' ? 'bg-orange text-white shadow-lg' : 'text-[#fdfbf7] hover:bg-forest/5 dark:hover:bg-[#fdfbf7]/5 hover:text-orange dark:hover:text-orange'}`}
                >
                  <Settings size={18} />
                  Settings
                </button>
              </nav>

              <button 
                onClick={() => {
                  localStorage.removeItem('isAdminLoggedIn');
                  localStorage.removeItem('isUserLoggedIn');
                  window.location.href = '/';
                }}
                className="w-full flex items-center justify-center gap-2 mt-8 px-4 py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm tracking-widest uppercase font-bold"
              >
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
                    {!isEditing ? (
                      <button onClick={handleEditClick} className="flex items-center gap-2 text-orange text-sm font-semibold tracking-widest uppercase hover:text-[#fdfbf7]/80 transition-colors">
                        <Edit2 size={14} /> Edit
                      </button>
                    ) : (
                      <button onClick={handleSaveClick} className="flex items-center gap-2 text-green-400 text-sm font-semibold tracking-widest uppercase hover:text-green-300 transition-colors">
                        Save
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">First Name</label>
                      {isEditing ? (
                        <input type="text" value={editData.firstName} onChange={e => setEditData({...editData, firstName: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userName.split(' ')[0] || 'N/A'}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Last Name</label>
                      {isEditing ? (
                        <input type="text" value={editData.lastName} onChange={e => setEditData({...editData, lastName: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userName.split(' ').slice(1).join(' ') || 'N/A'}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Email Address</label>
                      {isEditing ? (
                        <input type="email" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userEmailAddress || 'N/A'}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Phone Number</label>
                      {isEditing ? (
                        <input type="tel" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" placeholder="+1 234 567 890" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userPhone || 'Not provided'}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Date of Birth</label>
                      {isEditing ? (
                        <input type="date" value={editData.dob} onChange={e => setEditData({...editData, dob: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userDob || 'Not provided'}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Nationality</label>
                      {isEditing ? (
                        <input type="text" value={editData.nationality} onChange={e => setEditData({...editData, nationality: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" placeholder="e.g. Sri Lankan" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userNationality || 'Not provided'}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Address</label>
                      {isEditing ? (
                        <input type="text" value={editData.address} onChange={e => setEditData({...editData, address: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" placeholder="123 Explorer St" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userAddress || 'Not provided'}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'bookings' && (
                <div className="profile-reveal">
                  <h3 className="text-2xl font-serif text-[#fdfbf7] mb-8">My Bookings</h3>
                  
                  <div className="flex flex-col gap-6">
                    <h4 className="text-xl font-serif text-[#fdfbf7] mb-2 border-b border-[#fdfbf7]/20 pb-2">Tour Packages</h4>
                    {packageBookings.length === 0 ? <p className="text-sm text-[#fdfbf7]/50 italic">No package bookings found.</p> : packageBookings.map((b, i) => (
                      <div key={i} className="bg-[#fdfbf7]/5 border border-[#fdfbf7]/10 p-5 rounded-2xl flex flex-col md:flex-row gap-5 items-start md:items-center">
                        <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                          <img src={b.packageDetails.image || b.packageDetails.img} alt={b.packageDetails.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="bg-orange/20 text-orange text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm mb-2 inline-block">Confirmed</span>
                              <h4 className="font-bold text-lg">{b.packageDetails.title}</h4>
                            </div>
                            <span className="text-xl font-serif">${b.packageDetails.price || b.packageDetails.originalData?.price}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-[#fdfbf7]/70">
                              <div className="flex items-center gap-1.5"><Calendar size={14} /> {b.packageDetails.duration}</div>
                              <div className="flex items-center gap-1.5"><MapPin size={14} /> {b.packageDetails.destinations?.length} Destinations</div>
                            </div>
                            <button onClick={() => handleCancelBooking('package', b.id)} className="mt-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">Cancel Booking</button>
                        </div>
                      </div>
                    ))}

                    <h4 className="text-xl font-serif text-[#fdfbf7] mb-2 mt-6 border-b border-[#fdfbf7]/20 pb-2">Hotels</h4>
                    {hotelBookings.length === 0 ? <p className="text-sm text-[#fdfbf7]/50 italic">No hotel bookings found.</p> : hotelBookings.map((b, i) => (
                      <div key={i} className="bg-[#fdfbf7]/5 border border-[#fdfbf7]/10 p-5 rounded-2xl flex flex-col md:flex-row gap-5 items-start md:items-center">
                        <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                          <img src={b.hotelDetails.image || b.hotelDetails.img} alt={b.hotelDetails.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="bg-orange/20 text-orange text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm mb-2 inline-block">Confirmed</span>
                              <h4 className="font-bold text-lg">{b.hotelDetails.name}</h4>
                            </div>
                            <span className="text-xl font-serif">${b.hotelDetails.price || b.hotelDetails.originalData?.price} / night</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-[#fdfbf7]/70">
                              <div className="flex items-center gap-1.5"><MapPin size={14} /> {b.hotelDetails.location}</div>
                              <div className="flex items-center gap-1.5"><User size={14} /> {b.guests} Guests</div>
                            </div>
                            <button onClick={() => handleCancelBooking('hotel', b.id)} className="mt-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">Cancel Booking</button>
                        </div>
                      </div>
                    ))}
                  
                    <h4 className="text-xl font-serif text-[#fdfbf7] mb-2 mt-6 border-b border-[#fdfbf7]/20 pb-2">Vehicles</h4>
                    {vehicleBookings.length === 0 ? <p className="text-sm text-[#fdfbf7]/50 italic">No vehicle bookings found.</p> : vehicleBookings.map((b, i) => (
                      <div key={i} className="bg-[#fdfbf7]/5 border border-[#fdfbf7]/10 p-5 rounded-2xl flex flex-col md:flex-row gap-5 items-start md:items-center">
                        <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden shrink-0 bg-forest/20 flex items-center justify-center">
                          {b.vehicleDetails.image ? (
                             <img src={b.vehicleDetails.image} alt={b.vehicleDetails.name} className="w-full h-full object-cover" />
                          ) : (
                             <span className="text-2xl">🚗</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="bg-orange/20 text-orange text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm mb-2 inline-block">Confirmed</span>
                              <h4 className="font-bold text-lg">{b.vehicleDetails.name}</h4>
                            </div>
                            <span className="text-xl font-serif">{b.vehicleDetails.price}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-[#fdfbf7]/70">
                            {b.pickupDate && <div className="flex items-center gap-1.5"><Calendar size={14} /> Pickup: {b.pickupDate}</div>}
                            {b.pickupLocation && <div className="flex items-center gap-1.5"><MapPin size={14} /> Location: {b.pickupLocation}</div>}
                          </div>
                          <button onClick={() => handleCancelBooking('vehicle', b.id)} className="mt-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">Cancel Booking</button>
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
                      {passwordMsg.text && (
                        <div className={`p-3 rounded-lg text-sm mb-4 ${passwordMsg.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-green-500/10 border border-green-500/20 text-green-500'}`}>
                          {passwordMsg.text}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]">Current Password</label>
                          <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} placeholder="••••••••" className="bg-transparent border-b border-[#fdfbf7]/20 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                        </div>
                        <div className="hidden md:block"></div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]">New Password</label>
                          <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} placeholder="••••••••" className="bg-transparent border-b border-[#fdfbf7]/20 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]">Confirm New Password</label>
                          <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} placeholder="••••••••" className="bg-transparent border-b border-[#fdfbf7]/20 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                        </div>
                      </div>
                      <button onClick={handlePasswordChange} className="mt-6 bg-orange text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-forest dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-colors">
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
                            <input type="checkbox" checked={notifications.emailUpdates} onChange={() => handleNotificationToggle('emailUpdates')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-forest/20 dark:bg-[#fdfbf7]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange"></div>
                          </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-[#fdfbf7]/80 text-sm font-medium">Promotional offers & travel news</span>
                          <div className="relative">
                            <input type="checkbox" checked={notifications.promotionalOffers} onChange={() => handleNotificationToggle('promotionalOffers')} className="sr-only peer" />
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
