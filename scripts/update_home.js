import fs from 'fs';
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!content.includes('Vehicles')) {
  content = content.replace(
    "import Hotels from '../components/Hotels';",
    "import Hotels from '../components/Hotels';\nimport Vehicles from '../components/Vehicles';"
  );
  content = content.replace(
    "<Hotels />",
    "<Hotels />\n      <Vehicles />"
  );
  fs.writeFileSync('src/pages/Home.tsx', content);
}
