import fs from 'fs';
import path from 'path';

const controllersDir = path.join(process.cwd(), 'controllers');
const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(controllersDir, file), 'utf8');
    
    // Replace await someRef.get() with await getDoc(someRef)
    content = content.replace(/await (\w+Ref)\.get\(\)/g, "await getDoc($1)");
    
    fs.writeFileSync(path.join(controllersDir, file), content);
    console.log(`Updated ${file}`);
});
