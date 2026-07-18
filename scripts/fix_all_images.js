import fs from 'fs';
import path from 'path';

function fixImages(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImages(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;

      // For JungleBackground.tsx, w-[120%] is used for mouse movement parallax.
      // So we leave it as is or change to scale-110 if we want.
      // Let's only target the images in these specific components.

      if (file === 'Beauty.tsx' || file === 'Destinations.tsx' || file === 'DestinationsPage.tsx' || file === 'TourPackages.tsx') {
        
        // Remove left top offsets and 120/110 width
        content = content.replace(/className="w-\[120%\] max-w-none h-\[120%\] -top-\[10%\] -left-\[10%\] absolute object-cover"/g, 'className="w-full h-full absolute inset-0 object-cover"');
        content = content.replace(/className="w-\[120%\] max-w-none h-\[120%\] -bottom-\[10%\] -right-\[10%\] absolute object-cover"/g, 'className="w-full h-full absolute inset-0 object-cover"');
        
        // For Destinations and DestinationsPage
        content = content.replace(/className="w-\[110%\] max-w-none h-\[110%\] -left-\[5%\] -top-\[5%\] absolute object-cover /g, 'className="w-[115%] max-w-none h-[115%] -left-[7.5%] -top-[7.5%] absolute object-cover ');
        // Wait, for destinations, they have mouse movement x/y GSAP, so they NEED the overflow to not show background edges!
        // So the width must remain wider than 100%. BUT user said "photo eke edge eka eke athule penna bah" which was for TOUR PACKAGES.
      }

      if (content !== fs.readFileSync(fullPath, 'utf8')) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

fixImages(path.join(process.cwd(), 'src/components'));
fixImages(path.join(process.cwd(), 'src/pages'));

