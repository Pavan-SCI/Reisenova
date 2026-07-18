const fs = require('fs');

let code = fs.readFileSync('src/components/Hotels.tsx', 'utf-8');

const handleBookCode = `
  const handleBookClick = async (e: React.MouseEvent, hotel: any) => {
    e.preventDefault();
    e.stopPropagation();
    const isUser = localStorage.getItem('isUserLoggedIn') === 'true';
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');

    if (!isUser && !isAdmin) {
      navigate('/login');
      return;
    }

    try {
      const payload = {
        userId: userEmail || 'unknown_user',
        userEmail: userEmail || 'unknown_user',
        hotelId: hotel.name.toLowerCase().replace(/\\s+/g, '-'),
        hotelDetails: hotel,
        guests: 1
      };
      
      const res = await fetch('/api/bookings/hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Hotel booked successfully!');
      } else {
        alert('Failed to book hotel.');
      }
    } catch (err) {
      console.error(err);
      alert('Error booking hotel.');
    }
  };
`;

code = code.replace(
  `  const navigate = useNavigate();`,
  `  const navigate = useNavigate();\n${handleBookCode}`
);

fs.writeFileSync('src/components/Hotels.tsx', code);
