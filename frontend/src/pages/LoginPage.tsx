import React, { useRef, useLayoutEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, User, Lock, ArrowRight, Palmtree, Sun } from 'lucide-react';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const LoginPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.login-reveal',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
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
  };

  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem('isUserLoggedIn', 'true');
      localStorage.setItem('userEmail', result.user.email || '');
      localStorage.setItem('userId', result.user.uid);
      localStorage.setItem('userName', result.user.displayName || 'Traveler');
      navigate('/');
    } catch (error: any) {
      console.error('Google login error:', error);
      setErrorMsg(error.message || 'Failed to sign in with Google');
    }
  };

  return (
    <section ref={containerRef} className="min-h-screen pt-16 pb-24 md:pt-20 md:pb-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden flex flex-col justify-center">
      
      <div className="fixed top-8 left-8 z-50">
        <Link to="/" className="inline-flex items-center gap-2 bg-[#fdfbf7]/80 dark:bg-black/60 backdrop-blur-md border border-forest/10 dark:border-[#fdfbf7]/10 text-forest dark:text-[#fdfbf7] hover:bg-orange hover:text-[#fdfbf7] dark:hover:bg-orange transition-all uppercase tracking-widest text-[10px] md:text-xs font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 w-full flex justify-center items-center h-full">
        <div className="w-full max-w-md">
          <div className="mb-8 login-reveal text-center flex flex-col items-center">
            <Link to="/" className="inline-flex flex-col items-center mb-6 group cursor-pointer">
              <div className="relative flex items-center justify-center h-12 w-16 mb-2">
                <Palmtree size={40} className="text-forest dark:text-[#fdfbf7] absolute left-0 bottom-0 z-10 -rotate-12 group-hover:rotate-0 transition-all duration-500" />
                <Palmtree size={28} className="text-forest dark:text-[#fdfbf7] absolute right-2 bottom-1 z-10 rotate-12 group-hover:rotate-0 transition-all duration-500" />
                <Sun size={24} className="text-orange absolute bottom-2 left-5 z-0 fill-current group-hover:scale-125 transition-transform duration-700" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-orange font-serif text-3xl tracking-[0.2em] uppercase font-bold italic leading-none group-hover:text-forest dark:group-hover:text-[#fdfbf7] transition-colors duration-500">
                  Reisenova
                </span>
                <span className="text-forest dark:text-[#fdfbf7] text-[10px] tracking-[0.3em] font-medium uppercase mt-2 pl-1 transition-colors duration-500">
                  Travel & Tours
                </span>
              </div>
            </Link>

            <h2 className="text-4xl md:text-5xl font-serif text-forest dark:text-[#fdfbf7] mb-4 leading-tight drop-shadow-md">
              Welcome <br />
              <span className="italic text-orange font-light">Back</span>
            </h2>
            <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light text-base">
              Sign in to continue planning your journey.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="bg-[#fdfbf7]/5 dark:bg-[#0a0f0d]/30 backdrop-blur-xl border border-forest/10 dark:border-[#fdfbf7]/10 p-8 md:p-10 rounded-3xl shadow-2xl login-reveal text-left transform-style-3d">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                {errorMsg}
              </div>
            )}
            
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex flex-col gap-2 relative">
                <label className="text-xs font-semibold uppercase tracking-widest text-forest/70 dark:text-[#fdfbf7]/70">Email Address</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/50 dark:text-[#fdfbf7]/50" />
                  <input 
                    type="email" 
                    name="email"
                    required 
                    className="w-full bg-transparent border-b border-forest/20 dark:border-[#fdfbf7]/20 p-3 pl-10 outline-none focus:border-orange transition-colors duration-300 text-forest dark:text-[#fdfbf7] placeholder:text-forest/30 dark:text-[#fdfbf7]/30" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="text-xs font-semibold uppercase tracking-widest text-forest/70 dark:text-[#fdfbf7]/70">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/50 dark:text-[#fdfbf7]/50" />
                  <input 
                    type="password" 
                    name="password"
                    required 
                    className="w-full bg-transparent border-b border-forest/20 dark:border-[#fdfbf7]/20 p-3 pl-10 outline-none focus:border-orange transition-colors duration-300 text-forest dark:text-[#fdfbf7] placeholder:text-forest/30 dark:text-[#fdfbf7]/30" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 border border-forest/40 dark:border-[#fdfbf7]/40 rounded flex items-center justify-center group-hover:border-orange transition-colors relative">
                    <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer peer" />
                    <div className="w-2 h-2 bg-orange rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-200" />
                  </div>
                  <span className="text-forest/70 dark:text-[#fdfbf7]/70 group-hover:text-forest dark:group-hover:text-[#fdfbf7] font-medium transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-forest/70 dark:text-[#fdfbf7]/70 hover:text-orange dark:hover:text-orange font-medium transition-colors">Forgot password?</a>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-orange text-[#fdfbf7] px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-forest dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-all shadow-lg hover:shadow-orange/30 group">
                <span className="group-hover:-translate-x-1 transition-transform">Sign In</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-forest/10 dark:border-[#fdfbf7]/10"></div>
                </div>
                <div className="relative bg-white/50 dark:bg-black/50 px-4 text-[10px] font-bold text-forest/50 dark:text-[#fdfbf7]/50 uppercase tracking-widest rounded-full backdrop-blur-sm">Or</div>
              </div>

              <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-3 bg-white/80 dark:bg-black/40 text-forest dark:text-[#fdfbf7] border border-forest/20 dark:border-[#fdfbf7]/20 px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest hover:bg-white dark:hover:bg-black/60 transition-all shadow-sm group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continue with Google
              </button>

              <p className="text-forest/50 dark:text-[#fdfbf7]/50 text-xs mt-6 font-medium">
                Don't have an account? <Link to="/signup" className="text-orange hover:text-forest dark:hover:text-[#fdfbf7] uppercase tracking-widest transition-colors font-bold ml-1">Sign Up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
