const fs = require('fs');

let code = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf-8');

const importStatement = `import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';`;
code = code.replace(`import React, { useRef, useLayoutEffect, useState } from 'react';`, importStatement);

const stateCode = `
  const [packageBookings, setPackageBookings] = useState<any[]>([]);
  const [hotelBookings, setHotelBookings] = useState<any[]>([]);
  
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      fetch(\`/api/bookings/user/\${userEmail}\`)
        .then(res => res.json())
        .then(data => {
          setPackageBookings(data.packages || []);
          setHotelBookings(data.hotels || []);
        })
        .catch(err => console.error('Failed to fetch bookings:', err));
    }
  }, []);
`;
code = code.replace(`const [activeTab, setActiveTab] = useState('profile');`, `const [activeTab, setActiveTab] = useState('profile');${stateCode}`);

const newBookingsCode = `
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
                            <span className="text-xl font-serif">$\\{b.packageDetails.price || b.packageDetails.originalData?.price\\}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-[#fdfbf7]/70">
                            <div className="flex items-center gap-1.5"><Calendar size={14} /> {b.packageDetails.duration}</div>
                            <div className="flex items-center gap-1.5"><MapPin size={14} /> {b.packageDetails.destinations?.length} Destinations</div>
                          </div>
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
                            <span className="text-xl font-serif">$\\{b.hotelDetails.price || b.hotelDetails.originalData?.price\\} / night</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-[#fdfbf7]/70">
                            <div className="flex items-center gap-1.5"><MapPin size={14} /> {b.hotelDetails.location}</div>
                            <div className="flex items-center gap-1.5"><User size={14} /> {b.guests} Guests</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
`;

code = code.replace(/\{activeTab === 'bookings' && \([\s\S]*?\)\}/, newBookingsCode);

fs.writeFileSync('src/pages/ProfilePage.tsx', code);
