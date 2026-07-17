import React, { useState } from 'react';
import { Phone, X, Loader2 } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface PhonePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: (phone: string) => void;
}

const PhonePromptModal: React.FC<PhonePromptModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSuccess
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+94');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const countryCodes = [
    { code: '+94', name: 'LK' },
    { code: '+1', name: 'US/CA' },
    { code: '+44', name: 'UK' },
    { code: '+61', name: 'AU' },
    { code: '+91', name: 'IN' },
    { code: '+49', name: 'DE' },
    { code: '+33', name: 'FR' },
    { code: '+81', name: 'JP' },
    { code: '+86', name: 'CN' },
    { code: '+971', name: 'AE' },
    { code: '+65', name: 'SG' },
    { code: '+60', name: 'MY' },
    { code: '+39', name: 'IT' },
    { code: '+7', name: 'RU' }
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const finalPhone = `${countryCode} ${phoneNumber.trim()}`;

    try {
      if (userId) {
        // Save to Firestore users collection
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, { phone: finalPhone }, { merge: true });
        
        // Save to localStorage so we don't have to fetch it next time
        localStorage.setItem('userPhone', finalPhone);
      }
      
      onSuccess(finalPhone);
    } catch (err: any) {
      console.error('Error saving phone number:', err);
      setErrorMsg(err.message || 'Failed to update contact info. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-[#fdfbf7] dark:bg-[#121915] text-forest dark:text-[#fdfbf7] p-8 rounded-2xl w-full max-w-md shadow-2xl relative border border-forest/10 dark:border-[#fdfbf7]/10 animate-fade-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 opacity-50 hover:opacity-100 hover:text-orange transition-colors"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center text-orange mb-3">
            <Phone size={24} />
          </div>
          <h3 className="text-2xl font-serif font-medium mb-2">Phone Number Required</h3>
          <p className="text-sm opacity-70 leading-relaxed">
            Please provide your WhatsApp or Phone number to confirm this booking. 
            Our travel consultants require this to coordinate your reservation details.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-semibold uppercase tracking-widest opacity-70">
              WhatsApp / Contact Number
            </label>
            <div className="flex relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-1/3 bg-transparent border-b border-forest/20 dark:border-[#fdfbf7]/20 p-3 pl-10 pr-2 outline-none focus:border-orange transition-colors duration-300 text-forest dark:text-[#fdfbf7] cursor-pointer appearance-none text-sm"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                disabled={isSubmitting}
              >
                {countryCodes.map(c => (
                  <option key={c.code} value={c.code} className="bg-white dark:bg-[#0a0f0d]">
                    {c.code} ({c.name})
                  </option>
                ))}
              </select>
              <input 
                type="tel" 
                required 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-2/3 bg-transparent border-b border-forest/20 dark:border-[#fdfbf7]/20 p-3 pl-4 outline-none focus:border-orange transition-colors duration-300 text-forest dark:text-[#fdfbf7] placeholder:opacity-30 text-sm" 
                placeholder="71 234 5678" 
                disabled={isSubmitting}
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              {errorMsg}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-1/2 bg-transparent hover:bg-forest/5 dark:hover:bg-white/5 border border-forest/20 dark:border-[#fdfbf7]/20 text-forest dark:text-[#fdfbf7] py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 bg-orange hover:bg-orange/90 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Confirm Book</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhonePromptModal;
