import fs from 'fs';
let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');
content = content.replace("}, { merge: true }\n        });", "}, { merge: true });");
fs.writeFileSync('src/pages/ProfilePage.tsx', content);
