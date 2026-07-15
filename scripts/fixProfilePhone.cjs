const fs = require('fs');
let code = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf-8');

code = code.replace(
  `const [userEmailAddress, setUserEmailAddress] = useState<string>('');`,
  `const [userEmailAddress, setUserEmailAddress] = useState<string>('');\n  const [userPhone, setUserPhone] = useState<string>('');`
);

code = code.replace(
  `const name = localStorage.getItem('userName');
    if (name) setUserName(name);`,
  `const name = localStorage.getItem('userName');
    if (name) setUserName(name);
    const phone = localStorage.getItem('userPhone');
    if (phone) setUserPhone(phone);`
);

code = code.replace(
  `<div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">+1 234 567 8900</div>`,
  `<div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userPhone || 'Not provided'}</div>`
);

fs.writeFileSync('src/pages/ProfilePage.tsx', code);
