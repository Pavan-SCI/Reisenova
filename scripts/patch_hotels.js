import fs from 'fs';

let content = fs.readFileSync('src/pages/HotelsPage.tsx', 'utf8');

const regex = /useLayoutEffect\(\(\) => \{\s*const ctx = gsap\.context\(\(\) => \{\s*gsap\.fromTo\([\s\S]*?\}\);\s*gsap\.utils\.toArray\('\.hotel-card-page'\)\.forEach\(\(card: any\) => \{\s*gsap\.fromTo\(card,[\s\S]*?\}\s*\);\s*\}\);\s*\}, containerRef\);\s*return \(\) => ctx\.revert\(\);\s*\}, \[hotels\]\);/;

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

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/HotelsPage.tsx', content);
  console.log("Patched HotelsPage.tsx");
} else {
  console.log("Could not patch HotelsPage.tsx - regex failed");
}
