import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

// For packages
content = content.replace(
  /<div className="flex flex-wrap gap-4 text-xs text-\[#fdfbf7\]\/70">\s*<div className="flex items-center gap-1\.5"><Calendar size=\{14\} \/> \{b\.packageDetails\.duration\}<\/div>\s*<div className="flex items-center gap-1\.5"><MapPin size=\{14\} \/> \{b\.packageDetails\.destinations\?\.length\} Destinations<\/div>\s*<\/div>/g,
  `<div className="flex flex-wrap gap-4 text-xs text-[#fdfbf7]/70">
                              <div className="flex items-center gap-1.5"><Calendar size={14} /> {b.packageDetails.duration}</div>
                              <div className="flex items-center gap-1.5"><MapPin size={14} /> {b.packageDetails.destinations?.length} Destinations</div>
                            </div>
                            <button onClick={() => handleCancelBooking('package', b.id)} className="mt-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">Cancel Booking</button>`
);

// For hotels
content = content.replace(
  /<div className="flex flex-wrap gap-4 text-xs text-\[#fdfbf7\]\/70">\s*<div className="flex items-center gap-1\.5"><MapPin size=\{14\} \/> \{b\.hotelDetails\.location\}<\/div>\s*<div className="flex items-center gap-1\.5"><User size=\{14\} \/> \{b\.guests\} Guests<\/div>\s*<\/div>/g,
  `<div className="flex flex-wrap gap-4 text-xs text-[#fdfbf7]/70">
                              <div className="flex items-center gap-1.5"><MapPin size={14} /> {b.hotelDetails.location}</div>
                              <div className="flex items-center gap-1.5"><User size={14} /> {b.guests} Guests</div>
                            </div>
                            <button onClick={() => handleCancelBooking('hotel', b.id)} className="mt-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">Cancel Booking</button>`
);

// Add vehicles section
const vehicleSection = `
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
`;

content = content.replace(
  /<\/div>\s*<\/div>\s*\)\}\s*\{activeTab === 'wishlist'/g,
  `${vehicleSection}\n                </div>\n              )}\n              {activeTab === 'wishlist'`
);

fs.writeFileSync('src/pages/ProfilePage.tsx', content);
