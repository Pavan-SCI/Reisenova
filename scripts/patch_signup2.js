import fs from 'fs';

let content = fs.readFileSync('src/pages/SignupPage.tsx', 'utf8');

const importBefore = "import { auth, googleProvider } from '../lib/firebase';";
const importAfter = "import { auth, googleProvider, db } from '../lib/firebase';\nimport { doc, setDoc } from 'firebase/firestore';";
if (!content.includes('import { doc, setDoc }')) {
    content = content.replace(importBefore, importAfter);
}

const handleSubmitRegex = /const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?navigate\('\/'\);\n    \} catch \(error: any\) \{/;

const newHandleSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (formRef.current?.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (formRef.current?.elements.namedItem('password') as HTMLInputElement)?.value;
    const name = (formRef.current?.elements.namedItem('name') as HTMLInputElement)?.value;
    const phone = (formRef.current?.elements.namedItem('phone') as HTMLInputElement)?.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        name: name || '',
        phone: phone || '',
        createdAt: new Date().toISOString()
      });

      localStorage.setItem('isUserLoggedIn', 'true');
      localStorage.setItem('userEmail', userCredential.user.email || '');
      localStorage.setItem('userId', userCredential.user.uid);
      if (name) localStorage.setItem('userName', name);
      if (phone) localStorage.setItem('userPhone', phone);
      navigate('/');
    } catch (error: any) {`;

content = content.replace(handleSubmitRegex, newHandleSubmit);

// Same for Google sign up
const googleRegex = /const handleGoogleSignup = async \(\) => \{[\s\S]*?const result = await signInWithPopup\(auth, googleProvider\);[\s\S]*?localStorage\.setItem\('isUserLoggedIn', 'true'\);/;

const newGoogle = `const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Save user to Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email || '',
        name: result.user.displayName || 'Traveler',
        phone: result.user.phoneNumber || '',
        createdAt: new Date().toISOString()
      }, { merge: true });

      localStorage.setItem('isUserLoggedIn', 'true');`;

content = content.replace(googleRegex, newGoogle);

fs.writeFileSync('src/pages/SignupPage.tsx', content);

