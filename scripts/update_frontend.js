import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src/pages');
const compDir = path.join(process.cwd(), 'src/components');

function replaceInFile(filePath, search, replace) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(search)) {
      content = content.replace(search, replace);
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
}

// Update login and signup
let loginPath = path.join(pagesDir, 'LoginPage.tsx');
let loginContent = fs.readFileSync(loginPath, 'utf8');
loginContent = loginContent.replace("localStorage.setItem('userEmail', email);", "localStorage.setItem('userEmail', email);\n      localStorage.setItem('userId', email);");
loginContent = loginContent.replace("localStorage.setItem('userEmail', result.user.email || '');", "localStorage.setItem('userEmail', result.user.email || '');\n      localStorage.setItem('userId', result.user.uid);");
fs.writeFileSync(loginPath, loginContent);

let signupPath = path.join(pagesDir, 'SignupPage.tsx');
let signupContent = fs.readFileSync(signupPath, 'utf8');
signupContent = signupContent.replace("if (email) localStorage.setItem('userEmail', email);", "if (email) {\n      localStorage.setItem('userEmail', email);\n      localStorage.setItem('userId', email);\n    }");
signupContent = signupContent.replace("localStorage.setItem('userEmail', result.user.email || '');", "localStorage.setItem('userEmail', result.user.email || '');\n      localStorage.setItem('userId', result.user.uid);");
fs.writeFileSync(signupPath, signupContent);

// Update booking payloads
const filesToUpdate = [
  path.join(pagesDir, 'HotelDetailsPage.tsx'),
  path.join(pagesDir, 'HotelsPage.tsx'),
  path.join(compDir, 'Hotels.tsx'),
  path.join(pagesDir, 'PackageDetailsPage.tsx'),
  path.join(pagesDir, 'PackagesPage.tsx'),
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/const userEmail = localStorage\.getItem\('userEmail'\);/g, "const userEmail = localStorage.getItem('userEmail');\n    const userId = localStorage.getItem('userId');");
    content = content.replace(/userId: userEmail \|\| 'unknown_user',/g, "userId: userId || userEmail || 'unknown_user',");
    fs.writeFileSync(file, content);
  }
});
console.log("Done updating frontend");
