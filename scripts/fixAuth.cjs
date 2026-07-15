const fs = require('fs');

let loginCode = fs.readFileSync('src/pages/LoginPage.tsx', 'utf-8');
loginCode = loginCode.replace(/localStorage\.setItem\('userEmail', result\.user\.email \|\| ''\);/, 
  "localStorage.setItem('userEmail', result.user.email || '');\n      localStorage.setItem('userName', result.user.displayName || 'Traveler');");
fs.writeFileSync('src/pages/LoginPage.tsx', loginCode);

let signupCode = fs.readFileSync('src/pages/SignupPage.tsx', 'utf-8');
signupCode = signupCode.replace(/localStorage\.setItem\('userEmail', result\.user\.email \|\| ''\);/, 
  "localStorage.setItem('userEmail', result.user.email || '');\n      localStorage.setItem('userName', result.user.displayName || 'Traveler');");

signupCode = signupCode.replace(
  "const email = (formRef.current?.elements.namedItem('email') as HTMLInputElement)?.value;\n    localStorage.setItem('isUserLoggedIn', 'true');\n    if (email) localStorage.setItem('userEmail', email);\n    navigate('/');",
  "const email = (formRef.current?.elements.namedItem('email') as HTMLInputElement)?.value;\n    const name = (formRef.current?.elements.namedItem('name') as HTMLInputElement)?.value;\n    localStorage.setItem('isUserLoggedIn', 'true');\n    if (email) localStorage.setItem('userEmail', email);\n    if (name) localStorage.setItem('userName', name);\n    navigate('/');"
);

fs.writeFileSync('src/pages/SignupPage.tsx', signupCode);
