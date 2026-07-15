import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

// Replace the old stateVars string with a new one that includes all fields
const newStateVars = `
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', email: '', phone: '', dob: '', nationality: '', address: '' });
  const [userDob, setUserDob] = useState<string>('');
  const [userNationality, setUserNationality] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    const dob = localStorage.getItem('userDob');
    if (dob) setUserDob(dob);
    const nationality = localStorage.getItem('userNationality');
    if (nationality) setUserNationality(nationality);
    const address = localStorage.getItem('userAddress');
    if (address) setUserAddress(address);
  }, []);

  const handleEditClick = () => {
    const parts = userName.split(' ');
    setEditData({
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      email: userEmailAddress || '',
      phone: userPhone || '',
      dob: userDob || '',
      nationality: userNationality || '',
      address: userAddress || ''
    });
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const newName = \`\${editData.firstName} \${editData.lastName}\`.trim();
    setUserName(newName);
    setUserEmailAddress(editData.email);
    setUserPhone(editData.phone);
    setUserDob(editData.dob);
    setUserNationality(editData.nationality);
    setUserAddress(editData.address);
    
    localStorage.setItem('userName', newName);
    localStorage.setItem('userEmail', editData.email);
    localStorage.setItem('userPhone', editData.phone);
    localStorage.setItem('userDob', editData.dob);
    localStorage.setItem('userNationality', editData.nationality);
    localStorage.setItem('userAddress', editData.address);
    
    setIsEditing(false);
  };
`;

// It looks like we already added isEditing previously. Let's just find and replace the whole section.
// We'll replace from `const [isEditing` to `setIsEditing(false);\n  };\n`

content = content.replace(/const \[isEditing[\s\S]*?setIsEditing\(false\);\n  };/, newStateVars.trim());

// Now for the HTML part. Let's fix the broken part.
// First, find the "Phone Number" block in the HTML and replace the rest of the file up to activeTab === 'bookings'
const oldHtmlRegex = /<div className="flex flex-col gap-2">\s*<label className="text-xs font-semibold uppercase tracking-widest text-\[#fdfbf7\]\/70">Phone Number<\/label>[\s\S]*?\{activeTab === 'bookings' && \(/;

const newHtml = `<div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Phone Number</label>
                      {isEditing ? (
                        <input type="tel" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" placeholder="+1 234 567 890" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userPhone || 'Not provided'}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Date of Birth</label>
                      {isEditing ? (
                        <input type="date" value={editData.dob} onChange={e => setEditData({...editData, dob: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userDob || 'Not provided'}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Nationality</label>
                      {isEditing ? (
                        <input type="text" value={editData.nationality} onChange={e => setEditData({...editData, nationality: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" placeholder="e.g. Sri Lankan" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userNationality || 'Not provided'}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Address</label>
                      {isEditing ? (
                        <input type="text" value={editData.address} onChange={e => setEditData({...editData, address: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" placeholder="123 Explorer St" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userAddress || 'Not provided'}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'bookings' && (`

if (content.match(oldHtmlRegex)) {
    content = content.replace(oldHtmlRegex, newHtml);
    fs.writeFileSync('src/pages/ProfilePage.tsx', content);
    console.log("Profile page fixed");
} else {
    console.log("Could not find html block");
}
