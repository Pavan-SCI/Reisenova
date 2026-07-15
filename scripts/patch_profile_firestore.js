import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

// Ensure firebase imports
const firebaseImports = `import { doc, getDoc, updateDoc } from 'firebase/firestore';\nimport { auth, db } from '../lib/firebase';`;
if (!content.includes('import { doc, getDoc, updateDoc } from \'firebase/firestore\';')) {
  content = content.replace("import { LogOut, Calendar, MapPin, Map, User, Heart, Settings, Edit2 } from 'lucide-react';", "import { LogOut, Calendar, MapPin, Map, User, Heart, Settings, Edit2 } from 'lucide-react';\n" + firebaseImports);
}

// Modify useEffect to load from firestore
const oldUseEffectRegex = /useEffect\(\(\) => \{\n    const email = localStorage.getItem\('userEmail'\);\n[\s\S]*?if \(address\) setUserAddress\(address\);\n  \}, \[\]\);/;

const newUseEffect = `useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem('userEmail');
      if (email) setUserEmailAddress(email);
      const name = localStorage.getItem('userName');
      if (name) setUserName(name);
      
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.name) setUserName(data.name);
            if (data.phone) setUserPhone(data.phone);
            if (data.dob) setUserDob(data.dob);
            if (data.nationality) setUserNationality(data.nationality);
            if (data.address) setUserAddress(data.address);
          }
        }
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };
    fetchUserData();
  }, []);`;

content = content.replace(oldUseEffectRegex, newUseEffect);

// Modify handleSaveClick to save to firestore
const oldSaveRegex = /const handleSaveClick = \(\) => \{[\s\S]*?setIsEditing\(false\);\n  \};/;

const newSave = `const handleSaveClick = async () => {
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
        await updateDoc(doc(db, 'users', userId), {
          name: newName,
          phone: editData.phone,
          dob: editData.dob,
          nationality: editData.nationality,
          address: editData.address
        });
      }
    } catch (err) {
      console.error("Error updating user data", err);
    }
    
    setIsEditing(false);
  };`;

content = content.replace(oldSaveRegex, newSave);

fs.writeFileSync('src/pages/ProfilePage.tsx', content);

