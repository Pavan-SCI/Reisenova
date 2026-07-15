import fs from 'fs';

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    "const userId = localStorage.getItem('userId');\n    if (userId) {\n      fetch(`/api/bookings/user/${userId}`)",
    "const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');\n    if (userId) {\n      fetch(`/api/bookings/user/${userId}`)"
  );
  content = content.replace(
    "const userId = localStorage.getItem('userId');\n    if (userId) {\n      fetch(`\\`/api/bookings/user/\\${userId}\\``)",
    "const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');\n    if (userId) {\n      fetch(`\\`/api/bookings/user/\\${userId}\\``)"
  );
  fs.writeFileSync(file, content);
}

patchFile('src/pages/PackageDetailsPage.tsx');
patchFile('src/pages/HotelDetailsPage.tsx');
patchFile('src/pages/VehicleDetailsPage.tsx');
