import fs from 'fs';

let signupContent = fs.readFileSync('src/pages/SignupPage.tsx', 'utf8');

signupContent = signupContent.replace(
    'type="text" \n                    required',
    'name="name"\n                    type="text" \n                    required'
);

signupContent = signupContent.replace(
    'type="email" \n                    required',
    'name="email"\n                    type="email" \n                    required'
);

signupContent = signupContent.replace(
    'type="password" \n                    required',
    'name="password"\n                    type="password" \n                    required'
);

// We should also store data to firestore database if possible, or just local storage. We are already saving to local storage.
fs.writeFileSync('src/pages/SignupPage.tsx', signupContent);


let loginContent = fs.readFileSync('src/pages/LoginPage.tsx', 'utf8');

const loginImportBefore = "import { signInWithPopup } from 'firebase/auth';";
const loginImportAfter = "import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';";
loginContent = loginContent.replace(loginImportBefore, loginImportAfter);

const loginSubmitRegex = /const handleSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?alert\("Please enter valid credentials\."\);\n    \}\n  \};/;
const newLoginSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (formRef.current?.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (formRef.current?.elements.namedItem('password') as HTMLInputElement)?.value;

    if (email === 'admin@reisenova.com' && password === 'admin') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/');
      return;
    }

    if (email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('isUserLoggedIn', 'true');
        localStorage.setItem('userEmail', userCredential.user.email || '');
        localStorage.setItem('userId', userCredential.user.uid);
        navigate('/');
      } catch (error: any) {
        console.error('Login error:', error);
        setErrorMsg(error.message || 'Invalid credentials');
      }
    } else {
      setErrorMsg("Please enter valid credentials.");
    }
  };`;
loginContent = loginContent.replace(loginSubmitRegex, newLoginSubmit);
fs.writeFileSync('src/pages/LoginPage.tsx', loginContent);
