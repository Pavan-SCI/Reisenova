import fs from 'fs';

function patchPage(file, itemType) {
  let content = fs.readFileSync(file, 'utf8');

  // Add state for booked items
  content = content.replace(
    /const \[loading, setLoading\] = React\.useState\(true\);/,
    `const [loading, setLoading] = React.useState(true);\n  const [bookedItemIds, setBookedItemIds] = React.useState<Set<string>>(new Set());`
  );

  // In useEffect, fetch user bookings
  const fetchPackagesBlock = `fetchPackages();`;
  const fetchHotelsBlock = `fetchHotels();`;
  const fetchVehiclesBlock = `fetchVehicles();`;

  let blockToReplace = "";
  let pluralType = "";
  if (itemType === 'package') {
    blockToReplace = fetchPackagesBlock;
    pluralType = 'packages';
  } else if (itemType === 'hotel') {
    blockToReplace = fetchHotelsBlock;
    pluralType = 'hotels';
  } else if (itemType === 'vehicle') {
    blockToReplace = fetchVehiclesBlock;
    pluralType = 'vehicles';
  }

  content = content.replace(
    blockToReplace,
    `${blockToReplace}
    
    const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
    if (userId) {
      fetch(\`/api/bookings/user/\${userId}\`)
        .then(res => res.json())
        .then(data => {
          if (data.${pluralType}) {
            const ids = new Set<string>();
            data.${pluralType}.forEach((b: any) => ids.add(b.${itemType}Id));
            setBookedItemIds(ids);
          }
        })
        .catch(console.error);
    }`
  );

  // Replace button rendering
  let buttonSearchRegex;
  if (itemType === 'package') {
    buttonSearchRegex = /<button onClick=\{\(e\) => handleBookClick\(e, pkg\)\} className="w-full bg-forest dark:bg-\[#1a251e\] text-sand dark:text-\[#fdfbf7\] py-4 rounded-full font-bold uppercase tracking-widest hover:bg-orange dark:hover:bg-orange hover:text-\[#fdfbf7\] dark:hover:text-\[#fdfbf7\] text-center transition-colors duration-300 shadow-md text-sm mt-auto">\s*Book This Package\s*<\/button>/;
    
    content = content.replace(buttonSearchRegex, `{bookedItemIds.has(pkg.id) ? (
                  <button disabled className="w-full bg-forest/20 dark:bg-[#fdfbf7]/20 text-forest/50 dark:text-[#fdfbf7]/50 py-4 rounded-full font-bold uppercase tracking-widest cursor-not-allowed text-center transition-colors duration-300 shadow-md text-sm mt-auto">
                    Already Booked
                  </button>
                ) : (
                  <button onClick={(e) => handleBookClick(e, pkg)} className="w-full bg-forest dark:bg-[#1a251e] text-sand dark:text-[#fdfbf7] py-4 rounded-full font-bold uppercase tracking-widest hover:bg-orange dark:hover:bg-orange hover:text-[#fdfbf7] dark:hover:text-[#fdfbf7] text-center transition-colors duration-300 shadow-md text-sm mt-auto">
                    Book This Package
                  </button>
                )}`);
                
    // Modify handleBookClick to add to set
    content = content.replace(
      /alert\('Package booked successfully!'\);/,
      `alert('Package booked successfully!');\n        setBookedItemIds(prev => new Set(prev).add(pkg.id));`
    );

  } else if (itemType === 'hotel') {
    buttonSearchRegex = /<button onClick=\{\(e\) => handleBookClick\(e, hotel\)\} className="w-full bg-forest dark:bg-\[#1a251e\] text-sand dark:text-\[#fdfbf7\] py-4 rounded-full font-bold uppercase tracking-widest hover:bg-orange dark:hover:bg-orange hover:text-\[#fdfbf7\] dark:hover:text-\[#fdfbf7\] text-center transition-colors duration-300 shadow-md text-sm mt-auto">\s*Book This Hotel\s*<\/button>/;
    
    content = content.replace(buttonSearchRegex, `{bookedItemIds.has(hotel.id) ? (
                  <button disabled className="w-full bg-forest/20 dark:bg-[#fdfbf7]/20 text-forest/50 dark:text-[#fdfbf7]/50 py-4 rounded-full font-bold uppercase tracking-widest cursor-not-allowed text-center transition-colors duration-300 shadow-md text-sm mt-auto">
                    Already Booked
                  </button>
                ) : (
                  <button onClick={(e) => handleBookClick(e, hotel)} className="w-full bg-forest dark:bg-[#1a251e] text-sand dark:text-[#fdfbf7] py-4 rounded-full font-bold uppercase tracking-widest hover:bg-orange dark:hover:bg-orange hover:text-[#fdfbf7] dark:hover:text-[#fdfbf7] text-center transition-colors duration-300 shadow-md text-sm mt-auto">
                    Book This Hotel
                  </button>
                )}`);

    // Modify handleBookClick to add to set
    content = content.replace(
      /alert\('Hotel booked successfully!'\);/,
      `alert('Hotel booked successfully!');\n        setBookedItemIds(prev => new Set(prev).add(hotel.id));`
    );

  } else if (itemType === 'vehicle') {
    // Wait, Vehicle doesn't have a direct handleBookClick in VehiclesPage.tsx usually, but let's check
    console.log("Checking vehicles page")
  }

  fs.writeFileSync(file, content);
}

patchPage('src/pages/PackagesPage.tsx', 'package');
patchPage('src/pages/HotelsPage.tsx', 'hotel');
