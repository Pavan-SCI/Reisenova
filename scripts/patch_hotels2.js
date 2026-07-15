import fs from 'fs';

let content = fs.readFileSync('src/pages/HotelsPage.tsx', 'utf8');

const startStr = "useLayoutEffect(() => {\n    const ctx = gsap.context(() => {\n      gsap.fromTo(\n        '.hotel-reveal',";
const endStr = "return () => ctx.revert();\n  }, [hotels]);";

const startIndex = content.indexOf("  useLayoutEffect(() => {\n    const ctx = gsap.context(() => {\n      gsap.fromTo(\n        '.hotel-reveal'");
const endIndex = content.indexOf(endStr, startIndex) + endStr.length;

if (startIndex !== -1 && endIndex > startIndex) {
  const replacement = `useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hotel-reveal',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (hotels.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.hotel-card-page').forEach((card: any) => {
        gsap.fromTo(card, 
          { y: 100, opacity: 0, },
          {
            y: 0, opacity: 1, 
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, [hotels]);`;
  
  content = content.substring(0, startIndex) + "  " + replacement + content.substring(endIndex);
  fs.writeFileSync('src/pages/HotelsPage.tsx', content);
  console.log("Patched HotelsPage.tsx manually");
} else {
  console.log("Could not find the block using indexOf");
}
