const fs = require('fs');
let code = fs.readFileSync('src/pages/SignupPage.tsx', 'utf-8');

code = code.replace(
  `const name = (formRef.current?.elements.namedItem('name') as HTMLInputElement)?.value;`,
  `const name = (formRef.current?.elements.namedItem('name') as HTMLInputElement)?.value;\n    const phone = (formRef.current?.elements.namedItem('phone') as HTMLInputElement)?.value;`
);
code = code.replace(
  `    if (email) localStorage.setItem('userEmail', email);\n    if (name) localStorage.setItem('userName', name);`,
  `    if (email) localStorage.setItem('userEmail', email);\n    if (name) localStorage.setItem('userName', name);\n    if (phone) localStorage.setItem('userPhone', phone);`
);

// We need to name the input 'phone'
code = code.replace(
  `<input \n                    type="tel" \n                    required`,
  `<input \n                    name="phone"\n                    type="tel" \n                    required`
);

fs.writeFileSync('src/pages/SignupPage.tsx', code);
