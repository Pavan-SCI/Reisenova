import fs from 'fs';
let content = fs.readFileSync('routes/bookingRoutes.js', 'utf8');

if (!content.includes('bookVehicle')) {
  content = content.replace(
    "import { bookPackage, bookHotel, getUserBookings }",
    "import { bookPackage, bookHotel, getUserBookings, bookVehicle }"
  );
  content = content.replace(
    "router.post('/hotel', bookHotel);",
    "router.post('/hotel', bookHotel);\nrouter.post('/vehicle', bookVehicle);"
  );
  fs.writeFileSync('routes/bookingRoutes.js', content);
}
