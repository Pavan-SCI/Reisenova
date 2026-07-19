import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const phoneNumber = "94713850594";

const suggestions = [
  "I'd like to plan a custom trip to Sri Lanka.",
  "Can you tell me more about your tour packages?",
  "I'm looking for hotel accommodations.",
  "I need to rent a vehicle for my tour.",
  "I have a question about my booking."
];

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setCustomMessage("");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={popoverRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 max-w-[calc(100vw-3rem)] bg-[#fdfbf7] rounded-2xl shadow-2xl overflow-hidden border border-black/10"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 text-[#ffffff] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ffffff]/20 rounded-full flex items-center justify-center">
                  <WhatsAppIcon size={24} className="text-[#ffffff]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-tight text-[#ffffff]">Reisenova</h3>
                  <p className="text-xs text-[#ffffff]/80">Typically replies in minutes</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[#ffffff]/20 rounded-full transition-colors"
              >
                <X size={20} className="text-[#ffffff]" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-95">
              <div className="bg-[#ffffff] p-3 rounded-xl rounded-tl-none shadow-sm border border-black/5 mb-4 inline-block max-w-[85%]">
                <p className="text-sm text-[#111111]">Hi there! 👋 How can we help you today?</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-[#555555] uppercase tracking-wider ml-1">Suggested Topics</p>
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="text-left text-sm bg-[#ffffff] border border-[#25D366]/30 hover:border-[#25D366] text-[#111111] px-3 py-2 rounded-lg transition-colors flex justify-between items-center group shadow-sm"
                  >
                    <span>{suggestion}</span>
                    <ChevronRight size={16} className="text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#ffffff] border-t border-black/10 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-[#f0f0f0] border border-black/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#25D366] transition-colors text-[#111111] placeholder:text-[#555555]"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend(customMessage);
                  }
                }}
              />
              <button 
                onClick={() => handleSend(customMessage)}
                className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center hover:bg-[#20b858] transition-colors flex-shrink-0 disabled:opacity-50"
                disabled={!customMessage.trim()}
              >
                <Send size={18} className="text-[#ffffff] ml-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#25D366] rounded-full shadow-xl flex items-center justify-center hover:bg-[#20b858] hover:scale-110 transition-all z-50 overflow-hidden group"
      >
        <WhatsAppIcon size={32} className="text-[#ffffff] relative z-10" />
        <div className="absolute inset-0 bg-[#ffffff]/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300"></div>
      </button>
    </div>
  );
}
