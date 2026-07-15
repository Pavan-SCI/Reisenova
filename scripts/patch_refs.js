import fs from 'fs';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // For the first useLayoutEffect with [], remove containerRef scope
  const regex = /const ctx = gsap\.context\(\(\) => \{\s*gsap\.fromTo\([\s\S]*?\}\s*\);\s*\}, containerRef\);\s*return \(\) => ctx\.revert\(\);\s*\}, \[\]\);/g;
  
  content = content.replace(regex, (match) => {
    return match.replace("}, containerRef);", "});");
  });
  
  fs.writeFileSync(filePath, content);
  console.log("Fixed " + filePath);
}

fixFile('src/pages/VehiclesPage.tsx');
fixFile('src/pages/HotelsPage.tsx');
fixFile('src/pages/PackagesPage.tsx');
fixFile('src/pages/DestinationsPage.tsx');

