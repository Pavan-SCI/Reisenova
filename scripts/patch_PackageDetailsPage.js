import fs from 'fs';

const file = 'src/pages/PackageDetailsPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const [loading, setLoading] = useState(true);",
  "const [loading, setLoading] = useState(true);\n  const [isBooked, setIsBooked] = useState(false);"
);

content = content.replace(
  "fetchPackage();\n  }, [id]);",
  `fetchPackage();
    
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(\`/api/bookings/user/\${userId}\`)
        .then(res => res.json())
        .then(data => {
          if (data.packages && data.packages.some((b: any) => b.packageId === id)) {
            setIsBooked(true);
          }
        })
        .catch(console.error);
    }
  }, [id]);`
);

content = content.replace(
  "alert('Booking confirmed! We will contact you shortly.');",
  "alert('Booking confirmed! We will contact you shortly.');\n      setIsBooked(true);"
);

content = content.replace(
  "<button onClick={handleBookClick} className=\"w-full flex items-center justify-center gap-2 bg-forest text-sand dark:bg-[#16201a] dark:text-[#fdfbf7] px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange dark:hover:bg-orange hover:text-[#fdfbf7] dark:hover:text-[#fdfbf7] transition-all shadow-lg hover:shadow-orange/30\">",
  `{isBooked ? (
                <button disabled className="w-full flex items-center justify-center gap-2 bg-forest/20 text-forest/50 dark:bg-[#fdfbf7]/20 dark:text-[#fdfbf7]/50 px-8 py-4 rounded-xl font-bold uppercase tracking-widest cursor-not-allowed">
                  Already Booked
                </button>
              ) : (
                <button onClick={handleBookClick} className="w-full flex items-center justify-center gap-2 bg-forest text-sand dark:bg-[#16201a] dark:text-[#fdfbf7] px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange dark:hover:bg-orange hover:text-[#fdfbf7] dark:hover:text-[#fdfbf7] transition-all shadow-lg hover:shadow-orange/30">`
);

content = content.replace(
  "Book This Package\n              </button>",
  "Book This Package\n                </button>\n              )}"
);

fs.writeFileSync(file, content);
