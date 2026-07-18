import fs from 'fs';

let content = fs.readFileSync('src/pages/VehicleDetailsPage.tsx', 'utf8');
content = content.replace(
  "const userId = localStorage.getItem('userId');\n    const userEmail = localStorage.getItem('userEmail');\n    if (!userId) {",
  "const userId = localStorage.getItem('userId');\n    const userEmail = localStorage.getItem('userEmail');\n    const loggedInId = userId || userEmail;\n    if (!loggedInId) {"
);
content = content.replace(
  "userId,\n          userEmail,",
  "userId: loggedInId,\n          userEmail,"
);
fs.writeFileSync('src/pages/VehicleDetailsPage.tsx', content);
