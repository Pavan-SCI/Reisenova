import fs from 'fs';
let content = fs.readFileSync('src/pages/HotelsPage.tsx', 'utf8');

const regex = /<button onClick=\{\(e\) => handleBookClick\(e, hotel\)\} className="text-sm font-semibold tracking-widest uppercase text-\[#fdfbf7\] hover:text-orange transition-colors flex items-center gap-2">\s*Inquire to Book\s*<div className="w-6 h-px bg-current"><\/div>\s*<\/button>/;

content = content.replace(regex, `{bookedItemIds.has(hotel.id) ? (
                    <button disabled className="text-sm font-semibold tracking-widest uppercase text-[#fdfbf7]/50 cursor-not-allowed flex items-center gap-2">
                      Already Booked
                      <div className="w-6 h-px bg-current"></div>
                    </button>
                  ) : (
                    <button onClick={(e) => handleBookClick(e, hotel)} className="text-sm font-semibold tracking-widest uppercase text-[#fdfbf7] hover:text-orange transition-colors flex items-center gap-2">
                      Inquire to Book
                      <div className="w-6 h-px bg-current"></div>
                    </button>
                  )}`);

fs.writeFileSync('src/pages/HotelsPage.tsx', content);
