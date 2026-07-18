import fs from 'fs';

let content = fs.readFileSync('src/pages/DestinationsPage.tsx', 'utf8');

const endStr = "return () => ctx.revert();\n  }, []);";
const startIndex = content.indexOf("  useLayoutEffect(() => {\n    const ctx = gsap.context(() => {\n      gsap.fromTo(\n        '.dest-reveal'");
const endIndex = content.indexOf(endStr, startIndex) + endStr.length;

if (startIndex !== -1 && endIndex > startIndex) {
  const replacement = `useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dest-reveal',
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
    if (destinations.length === 0) return;
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card: any) => {
        if (!card) return;
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
  }, [destinations]);`;
  
  content = content.substring(0, startIndex) + "  " + replacement + content.substring(endIndex);
  fs.writeFileSync('src/pages/DestinationsPage.tsx', content);
  console.log("Patched DestinationsPage.tsx manually");
} else {
  console.log("Could not find the block using indexOf in DestinationsPage");
}
