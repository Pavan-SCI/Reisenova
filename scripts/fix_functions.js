import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

const functionsCode = `
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

  const handleSaveClick = async () => {
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
  };

`;

content = content.replace("const [packageBookings, setPackageBookings] = useState<any[]>([]);", functionsCode + "const [packageBookings, setPackageBookings] = useState<any[]>([]);");

fs.writeFileSync('src/pages/ProfilePage.tsx', content);

