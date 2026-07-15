const fs = require('fs');

let code = fs.readFileSync('src/components/Hotels.tsx', 'utf-8');

const handleBookCode = `
  const navigate = useNavigate();
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
        hotelId: hotel.id,
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

code = code.replace(`import React, { useRef, useLayoutEffect, useState } from 'react';`, `import React, { useRef, useLayoutEffect, useState } from 'react';\nimport { useNavigate } from 'react-router-dom';`);

// Insert the handler
code = code.replace(`  const [activeFilter, setActiveFilter] = useState('All');`, `  const [activeFilter, setActiveFilter] = useState('All');\n${handleBookCode}`);

code = code.replace(
  `<Link to="/plan-trip" onClick={(e) => e.stopPropagation()} className="text-sm font-semibold tracking-widest uppercase text-[#fdfbf7] hover:text-orange transition-colors flex items-center gap-2">
                    Reserve
                    <div className="w-6 h-px bg-current"></div>
                  </Link>`,
  `<button onClick={(e) => handleBookClick(e, hotel)} className="text-sm font-semibold tracking-widest uppercase text-[#fdfbf7] hover:text-orange transition-colors flex items-center gap-2">
                    Reserve
                    <div className="w-6 h-px bg-current"></div>
                  </button>`
);

fs.writeFileSync('src/components/Hotels.tsx', code);
