import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

// Add imports
if (!content.includes("import { auth, db }")) {
  content = content.replace("import { ArrowLeft", "import { doc, getDoc, setDoc } from 'firebase/firestore';\nimport { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';\nimport { auth, db } from '../lib/firebase';\nimport { ArrowLeft");
}

// Combine the useEffects into one fetchUserData
const oldUseEffectsRegex = /useEffect\(\(\) => \{\n    const dob = localStorage.getItem\('userDob'\);[\s\S]*?if \(phone\) setUserPhone\(phone\);\n  \}, \[\]\);/g;

const newFetchEffect = `
  useEffect(() => {
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
            
            // set notifications state if available
            if (data.notifications) {
              setNotifications(data.notifications);
            }
          }
        } catch (err) {
          console.error("Error fetching user data", err);
        }
      }
    };
    fetchUserData();
  }, []);
`;

// wait, the old file has two use effects at lines 19 and 74.
// Let's just find and replace the whole thing.

fs.writeFileSync('src/pages/ProfilePage.tsx', content);

