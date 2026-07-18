import fs from 'fs';

const file = 'src/pages/HotelDetailsPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const [loading, setLoading] = React.useState(true);",
  "const [loading, setLoading] = React.useState(true);\n  const [isBooked, setIsBooked] = React.useState(false);"
);

content = content.replace(
  "fetchHotel();\n  }, [id]);",
  `fetchHotel();
    
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(\`/api/bookings/user/\${userId}\`)
        .then(res => res.json())
        .then(data => {
          if (data.hotels && data.hotels.some((b: any) => b.hotelId === id)) {
            setIsBooked(true);
          }
        })
        .catch(console.error);
    }
  }, [id]);`
);

content = content.replace(
  "alert('Hotel booked successfully!');",
  "alert('Hotel booked successfully!');\n      setIsBooked(true);"
);

content = content.replace(
  "<button onClick={handleBookClick} className=\"w-full flex items-center justify-center gap-2 bg-orange text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange/90 transition-all shadow-lg\">",
  `{isBooked ? (
                <button disabled className="w-full flex items-center justify-center gap-2 bg-forest/20 text-forest/50 dark:bg-[#fdfbf7]/20 dark:text-[#fdfbf7]/50 px-8 py-4 rounded-xl font-bold uppercase tracking-widest cursor-not-allowed">
                  Already Booked
                </button>
              ) : (
                <button onClick={handleBookClick} className="w-full flex items-center justify-center gap-2 bg-orange text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange/90 transition-all shadow-lg">`
);

content = content.replace(
  "Book This Hotel\n              </button>",
  "Book This Hotel\n                </button>\n              )}"
);

fs.writeFileSync(file, content);
