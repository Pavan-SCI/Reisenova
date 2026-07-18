import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

// Add vehicleBookings state
content = content.replace(
  "const [hotelBookings, setHotelBookings] = useState<any[]>([]);",
  "const [hotelBookings, setHotelBookings] = useState<any[]>([]);\n  const [vehicleBookings, setVehicleBookings] = useState<any[]>([]);"
);

// Fetch vehicleBookings and user id
content = content.replace(
  /fetch\(`\/api\/bookings\/user\/\$\{userEmail\}`\)/,
  "fetch(`/api/bookings/user/${userId}`)"
);

content = content.replace(
  "const userEmail = localStorage.getItem('userEmail');",
  "const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');"
);

content = content.replace(
  "setHotelBookings(data.hotels || []);",
  "setHotelBookings(data.hotels || []);\n          setVehicleBookings(data.vehicles || []);"
);

// Add cancel handler
const cancelHandler = `
  const handleCancelBooking = async (type: string, bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const res = await fetch(\`/api/bookings/\${type}/\${bookingId}\`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Booking cancelled successfully.');
        if (type === 'package') {
          setPackageBookings(prev => prev.filter(b => b.id !== bookingId));
        } else if (type === 'hotel') {
          setHotelBookings(prev => prev.filter(b => b.id !== bookingId));
        } else if (type === 'vehicle') {
          setVehicleBookings(prev => prev.filter(b => b.id !== bookingId));
        }
      } else {
        alert('Failed to cancel booking.');
      }
    } catch (err) {
      console.error(err);
      alert('Error cancelling booking.');
    }
  };
`;

content = content.replace(
  "const handleLogout = () => {",
  `${cancelHandler}\n  const handleLogout = () => {`
);

fs.writeFileSync('src/pages/ProfilePage.tsx', content);
