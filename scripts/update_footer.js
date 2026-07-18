import fs from 'fs';
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');
content = content.replace(
  '<li><a href="/hotels" className="hover:text-orange transition-colors block transform hover:translate-x-1 duration-300">Luxury Hotels</a></li>',
  '<li><a href="/hotels" className="hover:text-orange transition-colors block transform hover:translate-x-1 duration-300">Luxury Hotels</a></li>\n              <li><a href="/vehicles" className="hover:text-orange transition-colors block transform hover:translate-x-1 duration-300">Premium Rentals</a></li>'
);
fs.writeFileSync('src/components/Footer.tsx', content);
