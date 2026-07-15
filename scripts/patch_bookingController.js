import fs from 'fs';

const file = 'controllers/bookingController.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const packageBookings = [];",
  "const vehiclesSnapshot = await getDocs(query(collection(db, 'vehicle_bookings'), where('userId', '==', userId)));\n    const packageBookings = [];"
);

content = content.replace(
  "res.status(200).json({",
  `const vehicleBookings = [];
    vehiclesSnapshot.forEach(docSnap => {
      vehicleBookings.push({ id: docSnap.id, type: 'vehicle', ...docSnap.data() });
    });
    res.status(200).json({`
);

fs.writeFileSync(file, content);
