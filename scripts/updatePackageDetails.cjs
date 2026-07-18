const fs = require('fs');

let code = fs.readFileSync('src/pages/PackageDetailsPage.tsx', 'utf-8');

code = code.replace(
  `const handleBookClick = (e: React.MouseEvent) => {
    const isUser = localStorage.getItem('isUserLoggedIn') === 'true';
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isUser && !isAdmin) {
      e.preventDefault();
      navigate('/login');
    }
  };`,
  `const handleBookClick = async (e: React.MouseEvent) => {
    e.preventDefault();
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
        packageId: pkg.id,
        packageDetails: pkg
      };
      const res = await fetch('/api/bookings/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Package booked successfully!');
      } else {
        alert('Failed to book package.');
      }
    } catch (err) {
      console.error(err);
      alert('Error booking package.');
    }
  };`
);

code = code.replace(
  `<Link to="/plan-trip" onClick={handleBookClick} className="w-full flex items-center justify-center gap-2 bg-forest text-sand dark:bg-[#16201a] dark:text-[#fdfbf7] px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange dark:hover:bg-orange hover:text-[#fdfbf7] dark:hover:text-[#fdfbf7] transition-all shadow-lg hover:shadow-orange/30">
                <CalendarCheck size={18} />
                Book This Package
              </Link>`,
  `<button onClick={handleBookClick} className="w-full flex items-center justify-center gap-2 bg-forest text-sand dark:bg-[#16201a] dark:text-[#fdfbf7] px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange dark:hover:bg-orange hover:text-[#fdfbf7] dark:hover:text-[#fdfbf7] transition-all shadow-lg hover:shadow-orange/30">
                <CalendarCheck size={18} />
                Book This Package
              </button>`
);

fs.writeFileSync('src/pages/PackageDetailsPage.tsx', code);
