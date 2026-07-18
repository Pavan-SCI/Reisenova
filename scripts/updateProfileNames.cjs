const fs = require('fs');

let code = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf-8');

const stateCode = `
  const [userName, setUserName] = useState<string>('Explorer');
  const [userEmailAddress, setUserEmailAddress] = useState<string>('');
  
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) setUserEmailAddress(email);
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);
  }, []);
`;
code = code.replace(`const [activeTab, setActiveTab] = useState('profile');`, `const [activeTab, setActiveTab] = useState('profile');${stateCode}`);

code = code.replace(`<h3 className="text-xl font-serif font-bold text-[#fdfbf7]">John Doe</h3>`, `<h3 className="text-xl font-serif font-bold text-[#fdfbf7]">{userName}</h3>`);
code = code.replace(`<div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">John</div>`, `<div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userName.split(' ')[0] || 'N/A'}</div>`);
code = code.replace(`<div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">Doe</div>`, `<div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userName.split(' ').slice(1).join(' ') || 'N/A'}</div>`);
code = code.replace(`<div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">john.doe@example.com</div>`, `<div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userEmailAddress || 'N/A'}</div>`);

fs.writeFileSync('src/pages/ProfilePage.tsx', code);
