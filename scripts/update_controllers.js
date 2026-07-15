import fs from 'fs';
import path from 'path';

const controllersDir = path.join(process.cwd(), 'controllers');
const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(controllersDir, file), 'utf8');
    
    if (content.includes("import { db } from '../config/firebase.js';") && !content.includes("firebase/firestore")) {
        content = content.replace(
            "import { db } from '../config/firebase.js';",
            "import { db } from '../config/firebase.js';\nimport { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';"
        );
        
        // Replace get() loops
        content = content.replace(/db\.collection\('([^']+)'\)\.orderBy\('([^']+)',\s*'([^']+)'\)\.get\(\)/g, "getDocs(query(collection(db, '$1'), orderBy('$2', '$3')))");
        content = content.replace(/db\.collection\('([^']+)'\)\.get\(\)/g, "getDocs(collection(db, '$1'))");
        content = content.replace(/db\.collection\('([^']+)'\)\.where\('([^']+)',\s*'([^']+)',\s*([^)]+)\)\.get\(\)/g, "getDocs(query(collection(db, '$1'), where('$2', '$3', $4)))");
        content = content.replace(/\.forEach\(doc =>/g, ".forEach(docSnap =>");
        content = content.replace(/doc\.id/g, "docSnap.id");
        content = content.replace(/doc\.data\(\)/g, "docSnap.data()");

        // Replace getDoc
        content = content.replace(/db\.collection\('([^']+)'\)\.doc\(([^)]+)\)\.get\(\)/g, "getDoc(doc(db, '$1', $2))");
        content = content.replace(/db\.collection\('([^']+)'\)\.doc\(([^)]+)\)/g, "doc(db, '$1', $2)");
        
        // Replace add
        content = content.replace(/db\.collection\('([^']+)'\)\.add\(([^)]+)\)/g, "addDoc(collection(db, '$1'), $2)");
        
        // update/delete
        content = content.replace(/await ([^.]+)\.update\(([^)]+)\)/g, "await updateDoc($1, $2)");
        content = content.replace(/await ([^.]+)\.delete\(\)/g, "await deleteDoc($1)");
        
        // .exists
        content = content.replace(/\.exists([^(])/g, ".exists()$1");
        
        fs.writeFileSync(path.join(controllersDir, file), content);
        console.log(`Updated ${file}`);
    }
});
