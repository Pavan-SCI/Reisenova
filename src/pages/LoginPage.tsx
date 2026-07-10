import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, User, Lock, ArrowRight, Palmtree, Sun } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login functionality will be implemented soon!");
  };

  return (
    <section ref={containerRef} className="min-h-screen pt-24 pb-24 md:pt-32 md:pb-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden flex flex-col justify-center">
      
      <div className="absolute top-8 left-8 z-20 login-reveal">
        <Link to="/" className="inline-flex items-center gap-2 bg-[#fdfbf7]/80 dark:bg-black/60 backdrop-blur-md border border-forest/10 dark:border-[#fdfbf7]/10 text-forest dark:text-[#fdfbf7] hover:bg-orange hover:text-[#fdfbf7] dark:hover:bg-orange transition-all uppercase tracking-widest text-[10px] md:text-xs font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 w-full flex justify-center items-center h-full">
        <div className="w-full max-w-md">
          <div className="mb-12 login-reveal text-center flex flex-col items-center">
            <Link to="/" className="inline-flex flex-col items-center mb-8 group cursor-pointer">
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
            
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex flex-col gap-2 relative">
                <label className="text-xs font-semibold uppercase tracking-widest text-forest/70 dark:text-[#fdfbf7]/70">Email Address</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/50 dark:text-[#fdfbf7]/50" />
                  <input 
                    type="email" 
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
