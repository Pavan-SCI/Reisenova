import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');
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

content = content.replace("  useLayoutEffect(() => {", cancelHandler + "\n  useLayoutEffect(() => {");
fs.writeFileSync('src/pages/ProfilePage.tsx', content);
