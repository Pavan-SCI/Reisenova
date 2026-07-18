import fs from 'fs';

let content = fs.readFileSync('src/pages/VehiclesPage.tsx', 'utf8');

const regex = /return \(\n    <>\n    \{\/\* Hero Banner Section \*\/\}/;
const replacement = `return (
    <>
      {/* Fixed Back Button */}
      <div className="fixed top-6 left-4 md:left-8 z-50">
        <Link to="/" className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-forest/10 dark:border-white/10 text-forest dark:text-[#fdfbf7] hover:bg-orange hover:text-[#fdfbf7] dark:hover:bg-orange transition-all uppercase tracking-widest text-[10px] md:text-xs font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    {/* Hero Banner Section */}`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/pages/VehiclesPage.tsx', content);

