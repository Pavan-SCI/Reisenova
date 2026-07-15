const fs = require('fs');
let code = fs.readFileSync('src/pages/HotelsPage.tsx', 'utf-8');
code = code.replace(
  `hotelId: hotel.id,`,
  `hotelId: hotel.id || hotel.name.toLowerCase().replace(/\\s+/g, '-'),`
);
fs.writeFileSync('src/pages/HotelsPage.tsx', code);
