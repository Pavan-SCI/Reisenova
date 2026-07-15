import fs from 'fs';
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

content = content.replace(
  '<Link to="/hotels" className="hover:text-orange transition-colors">Hotels</Link>',
  '<Link to="/hotels" className="hover:text-orange transition-colors">Hotels</Link>\n            <Link to="/vehicles" className="hover:text-orange transition-colors">Vehicles</Link>'
);

content = content.replace(
  '<Link to="/hotels" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors">Hotels</Link>',
  '<Link to="/hotels" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors">Hotels</Link>\n              <Link to="/vehicles" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange transition-colors">Vehicles</Link>'
);

fs.writeFileSync('src/components/Hero.tsx', content);
