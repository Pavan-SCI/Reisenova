const fs = require('fs');

let hotelCode = fs.readFileSync('src/pages/HotelDetailsPage.tsx', 'utf-8');
hotelCode = hotelCode.replace(
  `            found = {
              name: data.name,`,
  `            found = {
              id: data.id || id,
              name: data.name,`
);
// Also for static hotelData fallback, ensure id exists
hotelCode = hotelCode.replace(
  `        if (id && hotelData[id as keyof typeof hotelData]) {
          found = hotelData[id as keyof typeof hotelData];
        } else if (id) {`,
  `        if (id && hotelData[id as keyof typeof hotelData]) {
          found = { id, ...hotelData[id as keyof typeof hotelData] };
        } else if (id) {`
);
// and also in handleBookClick, fallback to `id` from URL
hotelCode = hotelCode.replace(
  `hotelId: hotel.id,`,
  `hotelId: hotel?.id || id,`
);
fs.writeFileSync('src/pages/HotelDetailsPage.tsx', hotelCode);


let pkgCode = fs.readFileSync('src/pages/PackageDetailsPage.tsx', 'utf-8');
pkgCode = pkgCode.replace(
  `            found = {
              name: data.name,`,
  `            found = {
              id: data.id || id,
              name: data.name,`
);
pkgCode = pkgCode.replace(
  `        if (id && allPackages[id as keyof typeof allPackages]) {
          found = allPackages[id as keyof typeof allPackages];
        } else if (id) {`,
  `        if (id && allPackages[id as keyof typeof allPackages]) {
          found = { id, ...allPackages[id as keyof typeof allPackages] };
        } else if (id) {`
);
pkgCode = pkgCode.replace(
  `packageId: pkg.id,`,
  `packageId: pkg?.id || id,`
);
fs.writeFileSync('src/pages/PackageDetailsPage.tsx', pkgCode);
