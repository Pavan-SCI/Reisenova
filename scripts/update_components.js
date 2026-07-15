import fs from 'fs';
import path from 'path';

// Update Destinations.tsx
let destPath = path.join(process.cwd(), 'src/components/Destinations.tsx');
let destContent = fs.readFileSync(destPath, 'utf8');

if (!destContent.includes("const [fetchedDestinations, setFetchedDestinations] = React.useState<any[]>([]);")) {
  destContent = destContent.replace(
    "const Destinations = () => {",
    "const Destinations = () => {\n  const [fetchedDestinations, setFetchedDestinations] = React.useState<any[]>([]);\n  useEffect(() => {\n    fetch('/api/destinations').then(res => res.json()).then(data => {\n      if (data && data.length > 0) {\n        setFetchedDestinations(data.slice(0, 4).map((d: any) => ({ name: d.name, desc: d.description || d.location, img: d.image || 'https://images.unsplash.com/photo-1588258524451-24905d53a992?q=80&w=1000&auto=format&fit=crop' })));\n      }\n    }).catch(console.error);\n  }, []);\n  const displayDests = fetchedDestinations.length > 0 ? fetchedDestinations : destinations;"
  );
  destContent = destContent.replace(/destinations\.map/g, "displayDests.map");
  fs.writeFileSync(destPath, destContent);
  console.log("Updated Destinations.tsx");
}

