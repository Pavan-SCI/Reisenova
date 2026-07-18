import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

const buttonRegex = /<button \s*onClick=\{\(\) => setActiveTab\('wishlist'\)\}[\s\S]*?Wishlist\s*<\/button>/;
content = content.replace(buttonRegex, '');

const contentRegex = /\{activeTab === 'wishlist' && \([\s\S]*?<\/div>\s*\)\}/;
content = content.replace(contentRegex, '');

fs.writeFileSync('src/pages/ProfilePage.tsx', content);
