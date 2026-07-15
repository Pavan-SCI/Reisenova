import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

// 1. Add missing imports if not present
if (!content.includes('import { doc, getDoc, setDoc }')) {
  content = content.replace("import { ArrowLeft", "import { doc, getDoc, setDoc } from 'firebase/firestore';\nimport { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';\nimport { auth, db } from '../lib/firebase';\nimport { ArrowLeft");
}

// 2. Add notification and password states
const stateAdditions = `
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    promotionalOffers: false
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    try {
      const user = auth.currentUser;
      if (!user) {
        setPasswordMsg({ type: 'error', text: 'You must be logged in to change password' });
        return;
      }
      
      if (user.providerData.some(provider => provider.providerId === 'google.com')) {
         setPasswordMsg({ type: 'error', text: 'You are signed in with Google, you cannot change password here.' });
         return;
      }
      
      const credential = EmailAuthProvider.credential(user.email!, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);
      
      setPasswordMsg({ type: 'success', text: 'Password updated successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error(error);
      setPasswordMsg({ type: 'error', text: error.message || 'Failed to update password' });
    }
  };
  
  const handleNotificationToggle = async (key: 'emailUpdates' | 'promotionalOffers') => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
         await setDoc(doc(db, 'users', userId), { notifications: newNotifications }, { merge: true });
      }
    } catch (err) {
       console.error("Failed to update notifications", err);
    }
  };
`;

if (!content.includes('const [passwordData')) {
  content = content.replace("const [userAddress, setUserAddress] = useState<string>('');", "const [userAddress, setUserAddress] = useState<string>('');\n" + stateAdditions);
}

// 3. Update useEffect for fetching user data
const useEffectsRegex = /useEffect\(\(\) => \{\n    const dob = localStorage.getItem\('userDob'\);[\s\S]*?if \(phone\) setUserPhone\(phone\);\n  \}, \[\]\);/;

const newUseEffect = `useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem('userEmail');
      if (email) setUserEmailAddress(email);
      const name = localStorage.getItem('userName');
      if (name) setUserName(name);
      
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.name) setUserName(data.name);
            if (data.phone) setUserPhone(data.phone);
            if (data.dob) setUserDob(data.dob);
            if (data.nationality) setUserNationality(data.nationality);
            if (data.address) setUserAddress(data.address);
            if (data.notifications) setNotifications(data.notifications);
          }
        } catch (err) {
          console.error("Error fetching user data", err);
        }
      }
    };
    fetchUserData();
  }, []);`;

content = content.replace(useEffectsRegex, newUseEffect);

// 4. Update handleSaveClick to save to Firestore
const handleSaveClickRegex = /const handleSaveClick = \(\) => \{[\s\S]*?setIsEditing\(false\);\n  \};/;
const newHandleSaveClick = `const handleSaveClick = async () => {
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
    
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        await setDoc(doc(db, 'users', userId), {
          name: newName,
          phone: editData.phone,
          dob: editData.dob,
          nationality: editData.nationality,
          address: editData.address
        }, { merge: true });
      }
    } catch (err) {
      console.error("Error updating user data", err);
    }
    
    setIsEditing(false);
  };`;
content = content.replace(handleSaveClickRegex, newHandleSaveClick);

// 5. Replace Settings UI
const settingsUIRegex = /<h4 className="text-lg font-bold text-\[#fdfbf7\] mb-4">Change Password<\/h4>[\s\S]*?<h4 className="text-lg font-bold text-\[#fdfbf7\] mb-4">Notifications<\/h4>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const newSettingsUI = `<h4 className="text-lg font-bold text-[#fdfbf7] mb-4">Change Password</h4>
                      {passwordMsg.text && (
                        <div className={\`p-3 rounded-lg text-sm mb-4 \${passwordMsg.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-green-500/10 border border-green-500/20 text-green-500'}\`}>
                          {passwordMsg.text}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]">Current Password</label>
                          <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} placeholder="••••••••" className="bg-transparent border-b border-[#fdfbf7]/20 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                        </div>
                        <div className="hidden md:block"></div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]">New Password</label>
                          <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} placeholder="••••••••" className="bg-transparent border-b border-[#fdfbf7]/20 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]">Confirm New Password</label>
                          <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} placeholder="••••••••" className="bg-transparent border-b border-[#fdfbf7]/20 p-2 outline-none focus:border-orange transition-colors text-[#fdfbf7]" />
                        </div>
                      </div>
                      <button onClick={handlePasswordChange} className="mt-6 bg-orange text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-forest dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-colors">
                        Update Password
                      </button>
                    </div>

                    <div className="w-full h-[1px] bg-[#fdfbf7]/10"></div>

                    {/* Notifications Section */}
                    <div>
                      <h4 className="text-lg font-bold text-[#fdfbf7] mb-4">Notifications</h4>
                      <div className="flex flex-col gap-6">
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-[#fdfbf7]/80 text-sm font-medium">Email updates on bookings</span>
                          <div className="relative">
                            <input type="checkbox" checked={notifications.emailUpdates} onChange={() => handleNotificationToggle('emailUpdates')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-forest/20 dark:bg-[#fdfbf7]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange"></div>
                          </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-[#fdfbf7]/80 text-sm font-medium">Promotional offers & travel news</span>
                          <div className="relative">
                            <input type="checkbox" checked={notifications.promotionalOffers} onChange={() => handleNotificationToggle('promotionalOffers')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-forest/20 dark:bg-[#fdfbf7]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>`;

if (content.match(settingsUIRegex)) {
  content = content.replace(settingsUIRegex, newSettingsUI);
} else {
  console.log("Could not find settings UI block");
}

fs.writeFileSync('src/pages/ProfilePage.tsx', content);
