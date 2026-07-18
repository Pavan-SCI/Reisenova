import fs from 'fs';

let content = fs.readFileSync('src/pages/VehiclesPage.tsx', 'utf8');

const regex = /<div className="relative z-10 text-center">/;
const replacement = `<div className="relative z-10 text-center vehicle-reveal">`;
content = content.replace(regex, replacement);

const useLayoutRegex = /useLayoutEffect\(\(\) => \{\n    if \(vehicles.length === 0\) return;\n    const ctx = gsap.context\(\(\) => \{\n      gsap.fromTo\('\.vehicle-card-item',/;
const useLayoutReplacement = `useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.vehicle-reveal',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (vehicles.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.vehicle-card-item',`;

content = content.replace(useLayoutRegex, useLayoutReplacement);

fs.writeFileSync('src/pages/VehiclesPage.tsx', content);
console.log("Added vehicle-reveal to VehiclesPage.tsx");
