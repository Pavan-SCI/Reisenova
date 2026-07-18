import fs from 'fs';

const file = 'src/pages/VehicleDetailsPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const [bookingForm, setBookingForm] = useState({ pickupDate: '', dropoffDate: '', pickupLocation: '' });",
  "const [bookingForm, setBookingForm] = useState({ pickupDate: '', dropoffDate: '', pickupLocation: '' });\n  const [isBooked, setIsBooked] = useState(false);"
);

content = content.replace(
  "useEffect(() => {",
  `useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(\`/api/bookings/user/\${userId}\`)
        .then(res => res.json())
        .then(data => {
          if (data.vehicles && data.vehicles.some((b: any) => b.vehicleId === id)) {
            setIsBooked(true);
          }
        })
        .catch(console.error);
    }`
);

content = content.replace(
  "alert('Booking successful! We will contact you soon.');",
  "alert('Booking successful! We will contact you soon.');\n        setIsBooked(true);"
);

content = content.replace(
  "<button onClick={() => setIsBookingModalOpen(true)} className=\"w-full bg-orange text-white py-5 rounded-2xl font-bold tracking-widest uppercase text-sm hover:bg-orange/90 transition-colors shadow-lg\">",
  `{isBooked ? (
              <button disabled className="w-full bg-forest/20 dark:bg-[#fdfbf7]/20 text-forest/50 dark:text-[#fdfbf7]/50 py-5 rounded-2xl font-bold tracking-widest uppercase text-sm cursor-not-allowed">
                Already Booked
              </button>
            ) : (
              <button onClick={() => setIsBookingModalOpen(true)} className="w-full bg-orange text-white py-5 rounded-2xl font-bold tracking-widest uppercase text-sm hover:bg-orange/90 transition-colors shadow-lg">`
);

content = content.replace(
  "Book this Vehicle\n            </button>",
  "Book this Vehicle\n              </button>\n            )}"
);

fs.writeFileSync(file, content);
