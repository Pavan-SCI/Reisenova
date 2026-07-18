import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

// 1. Add state variables
const stateVars = `
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  const handleEditClick = () => {
    const parts = userName.split(' ');
    setEditData({
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      email: userEmailAddress || '',
      phone: userPhone || ''
    });
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const newName = \`\${editData.firstName} \${editData.lastName}\`.trim();
    setUserName(newName);
    setUserEmailAddress(editData.email);
    setUserPhone(editData.phone);
    
    localStorage.setItem('userName', newName);
    localStorage.setItem('userEmail', editData.email);
    localStorage.setItem('userPhone', editData.phone);
    
    setIsEditing(false);
  };
`;
content = content.replace(
  "const [userPhone, setUserPhone] = useState<string>('');",
  "const [userPhone, setUserPhone] = useState<string>('');\n" + stateVars
);

// 2. Replace the HTML for Personal Information
const personalInfoBefore = `<div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-serif text-[#fdfbf7]">Personal Information</h3>
                    <button className="flex items-center gap-2 text-orange text-sm font-semibold tracking-widest uppercase hover:text-[#fdfbf7]/80 transition-colors">
                      <Edit2 size={14} /> Edit
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">First Name</label>
                      <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userName.split(' ')[0] || 'N/A'}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Last Name</label>
                      <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userName.split(' ').slice(1).join(' ') || 'N/A'}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Email Address</label>
                      <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userEmailAddress || 'N/A'}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Phone Number</label>
                      <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userPhone || 'Not provided'}</div>
                    </div>
                  </div>`;

const personalInfoAfter = `<div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-serif text-[#fdfbf7]">Personal Information</h3>
                    {!isEditing ? (
                      <button onClick={handleEditClick} className="flex items-center gap-2 text-orange text-sm font-semibold tracking-widest uppercase hover:text-[#fdfbf7]/80 transition-colors">
                        <Edit2 size={14} /> Edit
                      </button>
                    ) : (
                      <button onClick={handleSaveClick} className="flex items-center gap-2 text-green-400 text-sm font-semibold tracking-widest uppercase hover:text-green-300 transition-colors">
                        Save
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">First Name</label>
                      {isEditing ? (
                        <input type="text" value={editData.firstName} onChange={e => setEditData({...editData, firstName: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userName.split(' ')[0] || 'N/A'}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Last Name</label>
                      {isEditing ? (
                        <input type="text" value={editData.lastName} onChange={e => setEditData({...editData, lastName: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userName.split(' ').slice(1).join(' ') || 'N/A'}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Email Address</label>
                      {isEditing ? (
                        <input type="email" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userEmailAddress || 'N/A'}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Phone Number</label>
                      {isEditing ? (
                        <input type="tel" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} className="bg-transparent border-b border-orange/50 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                      ) : (
                        <div className="text-[#fdfbf7] font-medium border-b border-[#fdfbf7]/10 pb-2">{userPhone || 'Not provided'}</div>
                      )}
                    </div>
                  </div>`;

// Use regex or string replacement. Since there might be slight whitespace differences, we should be careful.
// Instead of replacing the whole block, let's use a regex to match it.

const regex = /<div className="flex justify-between items-center mb-8">[\s\S]*?<\/div>\s*<\/div>/;

if (content.match(regex)) {
  content = content.replace(regex, personalInfoAfter);
  fs.writeFileSync('src/pages/ProfilePage.tsx', content);
  console.log("Patched successfully");
} else {
  console.log("Could not find block to replace");
}

