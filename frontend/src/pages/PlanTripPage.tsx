import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft } from 'lucide-react';

const PlanTripPage = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isUserLoggedIn && !isAdminLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.planner-reveal',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());
    
    // Get all checked interests
    const interests = formData.getAll('interests');
    data.interests = interests as any;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        formRef.current.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errData = await response.json();
        setErrorMessage(errData.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage("Failed to connect to the server. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultName = localStorage.getItem('userName') || '';
  const defaultEmail = localStorage.getItem('userEmail') || '';
  const defaultPhone = localStorage.getItem('userPhone') || '';

  return (
    <section ref={containerRef} className="min-h-screen pt-24 pb-24 md:pt-32 md:pb-32 bg-transparent text-forest dark:text-[#fdfbf7] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1544079868-87422f281e05?q=80&w=2864&auto=format&fit=crop')] bg-cover bg-center pointer-events-none" />
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-t from-black dark:from-[#060a08] to-transparent pointer-events-none" />
      
      {/* Fixed Back Button */}
      <div className="fixed top-6 left-4 md:left-8 z-50">
        <Link to="/" className="inline-flex items-center gap-2 bg-[#fdfbf7]/80 dark:bg-black/60 backdrop-blur-md border border-forest/10 dark:border-[#fdfbf7]/10 text-forest dark:text-[#fdfbf7] hover:bg-orange hover:text-white dark:hover:text-white dark:hover:bg-orange transition-all uppercase tracking-widest text-[10px] md:text-xs font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-16 planner-reveal text-center">
          <p className="text-orange uppercase tracking-[0.4em] text-sm font-semibold mb-6">Let's Create Your Journey</p>
          <h2 className="text-5xl md:text-7xl font-serif text-forest dark:text-[#fdfbf7] mb-6 leading-tight drop-shadow-md">
            Start Planning <br />
            <span className="italic text-orange font-light">Your Trip</span>
          </h2>
          <p className="text-forest/70 dark:text-[#fdfbf7]/70 font-light text-lg max-w-2xl mx-auto">
            Tell us about your dream vacation and our local experts will craft a personalized itinerary just for you.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-black/60 dark:bg-[#0a0f0d]/30 backdrop-blur-xl border border-[#d97736]/30 dark:border-[#fdfbf7]/10 p-8 md:p-12 lg:p-16 rounded-3xl shadow-2xl planner-reveal text-center text-[#fdfbf7] max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-orange/20 border border-orange rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <svg className="w-10 h-10 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-serif text-[#fdfbf7] mb-4">Trip Inquiry Submitted!</h3>
            <p className="text-[#fdfbf7]/80 text-base md:text-lg font-light mb-8 leading-relaxed">
              Thank you for planning your journey with <strong>Reisenova Travel & Tours</strong>.
            </p>
            
            <div className="bg-white/5 dark:bg-white/5 border border-white/10 rounded-2xl p-6 text-left mb-8">
              <h4 className="text-orange text-xs uppercase tracking-widest font-bold mb-3">What happens next?</h4>
              <ul className="space-y-3 text-sm text-[#fdfbf7]/70 font-light">
                <li className="flex items-start gap-2">
                  <span className="text-orange font-bold">✓</span>
                  <span>An automated confirmation has been sent to your email with your preferences.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange font-bold">✓</span>
                  <span>Our travel experts have been notified and are reviewing your details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange font-bold">✓</span>
                  <span>We will custom-craft your perfect itinerary and contact you within 24 hours.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setIsSubmitted(false)} className="bg-transparent border border-white/20 text-[#fdfbf7] px-8 py-3.5 rounded-full font-semibold uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer text-xs">
                Plan Another Trip
              </button>
              <Link to="/" className="bg-orange text-white px-8 py-3.5 rounded-full font-semibold uppercase tracking-widest hover:bg-orange/90 transition-colors shadow-lg shadow-orange/20 text-xs">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="bg-black/60 dark:bg-[#0a0f0d]/30 backdrop-blur-xl border border-white/10 dark:border-[#fdfbf7]/10 p-8 md:p-12 lg:p-16 rounded-3xl shadow-2xl planner-reveal text-left transform-style-3d text-[#fdfbf7] max-w-5xl mx-auto">
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl p-4 mb-8 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}
            
            <h3 className="text-2xl font-serif text-[#fdfbf7] mb-8 border-b border-[#fdfbf7]/20 pb-4">1. Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Full Name *</label>
              <input type="text" name="fullName" required defaultValue={defaultName} className="bg-transparent border-b border-[#fdfbf7]/20 p-3 outline-none focus:border-orange transition-colors duration-300 text-[#fdfbf7] placeholder:text-[#fdfbf7]/30" placeholder="John Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Email Address *</label>
              <input type="email" name="email" required defaultValue={defaultEmail} className="bg-transparent border-b border-[#fdfbf7]/20 p-3 outline-none focus:border-orange transition-colors duration-300 text-[#fdfbf7] placeholder:text-[#fdfbf7]/30" placeholder="john@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-[#fdfbf7]/70">WhatsApp / Phone *</label>
              <input type="tel" name="phone" required defaultValue={defaultPhone} className="bg-transparent border-b border-[#fdfbf7]/20 p-3 outline-none focus:border-orange transition-colors duration-300 text-[#fdfbf7] placeholder:text-[#fdfbf7]/30" placeholder="+1 234 567 8900" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Country of Residence</label>
              <input type="text" name="country" className="bg-transparent border-b border-[#fdfbf7]/20 p-3 outline-none focus:border-orange transition-colors duration-300 text-[#fdfbf7] placeholder:text-[#fdfbf7]/30" placeholder="United Kingdom" />
            </div>
          </div>

          <h3 className="text-2xl font-serif text-[#fdfbf7] mb-8 border-b border-[#fdfbf7]/20 pb-4">2. Trip Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Estimated Arrival</label>
              <input type="date" name="arrivalDate" className="bg-transparent border-b border-[#fdfbf7]/20 p-3 outline-none focus:border-orange transition-colors duration-300 text-[#fdfbf7] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Duration (Days)</label>
              <input type="number" name="duration" min="1" className="bg-transparent border-b border-[#fdfbf7]/20 p-3 outline-none focus:border-orange transition-colors duration-300 text-[#fdfbf7] placeholder:text-[#fdfbf7]/30" placeholder="e.g., 10" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Adults</label>
              <input type="number" name="adults" min="1" className="bg-transparent border-b border-[#fdfbf7]/20 p-3 outline-none focus:border-orange transition-colors duration-300 text-[#fdfbf7] placeholder:text-[#fdfbf7]/30" placeholder="2" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Children (Under 12)</label>
              <input type="number" name="children" min="0" className="bg-transparent border-b border-[#fdfbf7]/20 p-3 outline-none focus:border-orange transition-colors duration-300 text-[#fdfbf7] placeholder:text-[#fdfbf7]/30" placeholder="0" />
            </div>
          </div>

          <h3 className="text-2xl font-serif text-[#fdfbf7] mb-8 border-b border-[#fdfbf7]/20 pb-4">3. Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Accommodation Standard</label>
              <select name="accommodation" className="bg-transparent border-b border-[#fdfbf7]/20 p-3 outline-none focus:border-orange transition-colors duration-300 text-[#fdfbf7] appearance-none cursor-pointer">
                <option value="" className="text-forest dark:text-[#fdfbf7]">Select Standard</option>
                <option value="luxury" className="text-forest dark:text-[#fdfbf7]">Luxury (5-Star & Boutique)</option>
                <option value="premium" className="text-forest dark:text-[#fdfbf7]">Premium (4-Star)</option>
                <option value="standard" className="text-forest dark:text-[#fdfbf7]">Standard (3-Star & Guesthouses)</option>
                <option value="mixed" className="text-forest dark:text-[#fdfbf7]">Mixed Standard</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Estimated Budget (Per Person)</label>
              <select name="budget" className="bg-transparent border-b border-[#fdfbf7]/20 p-3 outline-none focus:border-orange transition-colors duration-300 text-[#fdfbf7] appearance-none cursor-pointer">
                <option value="" className="text-forest dark:text-[#fdfbf7]">Select Budget</option>
                <option value="standard" className="text-forest dark:text-[#fdfbf7]">$500 - $1,000</option>
                <option value="premium" className="text-forest dark:text-[#fdfbf7]">$1,000 - $2,500</option>
                <option value="luxury" className="text-forest dark:text-[#fdfbf7]">$2,500 - $5,000</option>
                <option value="ultra-luxury" className="text-forest dark:text-[#fdfbf7]">$5,000+</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-12">
            <label className="text-sm font-semibold uppercase tracking-widest text-[#fdfbf7]/70 mb-4">Interests (Select all that apply)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Wildlife & Safari', 'Culture & Heritage', 'Beaches & Relaxation', 'Adventure & Hiking', 'Wellness & Ayurveda', 'Culinary Experiences', 'Romantic / Honeymoon', 'Family Friendly'].map((interest) => (
                <label key={interest} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 border border-[#fdfbf7]/40 rounded flex items-center justify-center group-hover:border-orange transition-colors relative">
                    <input type="checkbox" name="interests" value={interest} className="opacity-0 absolute inset-0 cursor-pointer peer" />
                    <div className="w-3 h-3 bg-orange rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-200" />
                  </div>
                  <span className="text-[#fdfbf7]/80 group-hover:text-orange text-sm font-medium transition-colors">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-10">
            <label className="text-sm font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Additional Information</label>
            <textarea name="additionalInfo" className="bg-transparent border-b border-[#fdfbf7]/20 p-3 outline-none focus:border-orange transition-colors duration-300 text-[#fdfbf7] placeholder:text-[#fdfbf7]/30 resize-none h-32" placeholder="Tell us more about your perfect trip, specific places you want to visit, dietary requirements, or any special occasions..."></textarea>
          </div>

          <div className="text-center mt-12">
            <button type="submit" disabled={isSubmitting} className="bg-orange text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-forest dark:hover:bg-[#fdfbf7] dark:hover:text-[#0a0f0d] transition-colors duration-300 shadow-xl hover:shadow-[0_10px_30px_-10px_rgba(242,101,34,0.5)] cursor-pointer text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit Trip Request"
              )}
            </button>
            <p className="text-[#fdfbf7]/50 text-xs mt-6 uppercase tracking-widest font-semibold">We will respond within 24 hours</p>
          </div>
        </form>
        )}
      </div>
    </section>
  );
};

export default PlanTripPage;
