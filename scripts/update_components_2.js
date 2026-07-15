import fs from 'fs';
import path from 'path';

// Update Hotels.tsx
let hotelsPath = path.join(process.cwd(), 'src/components/Hotels.tsx');
let hotelsContent = fs.readFileSync(hotelsPath, 'utf8');

if (!hotelsContent.includes("const [fetchedHotels, setFetchedHotels] = React.useState<any[]>([]);")) {
  hotelsContent = hotelsContent.replace(
    "const Hotels = () => {",
    "const Hotels = () => {\n  const [fetchedHotels, setFetchedHotels] = React.useState<any[]>([]);\n  useEffect(() => {\n    fetch('/api/hotels').then(res => res.json()).then(data => {\n      if (data && data.length > 0) {\n        setFetchedHotels(data.slice(0, 3).map((d: any) => ({ name: d.name, location: d.location, rating: Number(d.rating) || 5, img: d.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop' })));\n      }\n    }).catch(console.error);\n  }, []);\n  const displayHotels = fetchedHotels.length > 0 ? fetchedHotels : hotels;"
  );
  hotelsContent = hotelsContent.replace(/hotels\.map/g, "displayHotels.map");
  fs.writeFileSync(hotelsPath, hotelsContent);
  console.log("Updated Hotels.tsx");
}

