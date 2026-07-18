import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

const stateRegex = /const \[userName, setUserName\] = useState<string>\('Explorer'\);/;
const stateReplacement = `const [userName, setUserName] = useState<string>('Explorer');
  const [profileImage, setProfileImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('userProfileImage', base64String);
        
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            await setDoc(doc(db, 'users', userId), { profileImage: base64String }, { merge: true });
          }
        } catch (err) {
          console.error("Error saving profile image", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };`;

content = content.replace(stateRegex, stateReplacement);

const fetchRegex = /const name = localStorage\.getItem\('userName'\);\n      if \(name\) setUserName\(name\);/;
const fetchReplacement = `const name = localStorage.getItem('userName');
      if (name) setUserName(name);
      const savedImage = localStorage.getItem('userProfileImage');
      if (savedImage) setProfileImage(savedImage);`;

content = content.replace(fetchRegex, fetchReplacement);

const docRegex = /if \(data\.notifications\) setNotifications\(data\.notifications\);/;
const docReplacement = `if (data.notifications) setNotifications(data.notifications);
            if (data.profileImage) {
              setProfileImage(data.profileImage);
              localStorage.setItem('userProfileImage', data.profileImage);
            }`;

content = content.replace(docRegex, docReplacement);

const uiRegex = /<div className="relative mb-4 group cursor-pointer">[\s\S]*?<div className="w-full h-full rounded-full bg-\[#fdfbf7\]\/10 flex items-center justify-center overflow-hidden">[\s\S]*?<User size=\{40\} className="text-\[#fdfbf7\]\/40" \/>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<div className="absolute bottom-0 right-0 bg-orange text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">[\s\S]*?<Camera size=\{14\} \/>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const uiReplacement = `<div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange p-1">
                    <div className="w-full h-full rounded-full bg-[#fdfbf7]/10 flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} className="text-[#fdfbf7]/40" />
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-orange text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Camera size={14} />
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>`;

content = content.replace(uiRegex, uiReplacement);

fs.writeFileSync('src/pages/ProfilePage.tsx', content);

