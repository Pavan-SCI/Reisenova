import fs from 'fs';

let content = fs.readFileSync('src/pages/SignupPage.tsx', 'utf8');

// replace the handleSubmit with firebase auth

const firebaseAuthImportBefore = "import { signInWithPopup } from 'firebase/auth';";
const firebaseAuthImportAfter = "import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';";
content = content.replace(firebaseAuthImportBefore, firebaseAuthImportAfter);

const handleSubmitRegex = /const handleSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?navigate\('\/'\);\n  \};/;
const newHandleSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (formRef.current?.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (formRef.current?.elements.namedItem('password') as HTMLInputElement)?.value;
    const name = (formRef.current?.elements.namedItem('name') as HTMLInputElement)?.value;
    const phone = (formRef.current?.elements.namedItem('phone') as HTMLInputElement)?.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem('isUserLoggedIn', 'true');
      localStorage.setItem('userEmail', userCredential.user.email || '');
      localStorage.setItem('userId', userCredential.user.uid);
      if (name) localStorage.setItem('userName', name);
      if (phone) localStorage.setItem('userPhone', phone);
      navigate('/');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setErrorMsg(error.message || 'Failed to sign up');
    }
  };`;

content = content.replace(handleSubmitRegex, newHandleSubmit);

fs.writeFileSync('src/pages/SignupPage.tsx', content);

