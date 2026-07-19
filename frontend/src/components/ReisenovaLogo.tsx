import React from 'react';

interface ReisenovaLogoProps {
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  textColorClass?: string; // Optional custom text color class for "TRAVEL & TOURS"
  palmTreeColorClass?: string; // Optional custom color class for the palm trees & waves
  isCentered?: boolean;
  hasShadow?: boolean;
}

export default function ReisenovaLogo({
  className = '',
  iconSize = 'md',
  textColorClass = 'text-black',
  palmTreeColorClass = 'text-black',
  isCentered = false,
  hasShadow = false
}: ReisenovaLogoProps) {
  // Sizing mapping for the SVG icon
  const iconSizes = {
    sm: 'h-10 w-12',
    md: 'h-12 w-14',
    lg: 'h-16 w-20',
    xl: 'h-24 w-28'
  };

  const selectedIconSize = iconSizes[iconSize] || iconSizes.md;

  return (
    <div className={`flex items-center gap-3.5 group cursor-pointer transition-all duration-300 ${isCentered ? 'flex-col text-center' : 'flex-row text-left'} ${className}`}>
      {/* Exact Hand-Drawn Styled Palm Tree and Sun SVG Icon */}
      <div className={`relative shrink-0 ${selectedIconSize} transition-transform duration-500 group-hover:scale-105`}>
        <svg
          viewBox="0 0 75 75"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="white-glow" x="-30%" y="-30%" width="160%" height="160%">
              {/* Thicken the shape to create a strong outline */}
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="1.4" />
              {/* Blur the dilated shape slightly */}
              <feGaussianBlur in="dilated" result="blurred" stdDeviation="1.5" />
              {/* Flood with solid white */}
              <feFlood floodColor="white" floodOpacity="1" result="white-flood" />
              {/* Clip the flood to the blurred dilated outline */}
              <feComposite in="white-flood" in2="blurred" operator="in" result="glow" />
              
              {/* Soft atmospheric white glow */}
              <feGaussianBlur in="SourceAlpha" result="soft-blur" stdDeviation="4" />
              <feFlood floodColor="white" floodOpacity="0.9" result="soft-white-flood" />
              <feComposite in="soft-white-flood" in2="soft-blur" operator="in" result="soft-glow" />

              {/* Merge everything: soft glow, multiple layers of strong outline glow, and original graphic */}
              <feMerge>
                <feMergeNode in="soft-glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#white-glow)">
            {/* 1. Large orange-red sun circle behind the trees */}
            <circle 
              cx="34" 
              cy="52" 
              r="13" 
              fill="#f15a24" 
              className="transition-transform duration-700 group-hover:scale-110 group-hover:translate-y-[-1px]"
            />

            {/* Group that dynamically shifts colors or stays light as configured */}
            <g className={`${palmTreeColorClass} transition-colors duration-500`}>
            {/* 2. Left Palm Tree (Shorter, curves left) */}
            {/* Trunk */}
            <path 
              d="M 28 65 Q 26 50 18 44 Q 21 50 29 65 Z" 
              fill="currentColor" 
            />
            {/* Leaves Crown */}
            <path d="M 18 44 Q 10 40 4 46 C 10 45 14 44 18 44" fill="currentColor" />
            <path d="M 18 44 Q 8 46 3 54 C 9 51 14 48 18 44" fill="currentColor" />
            <path d="M 18 44 Q 22 36 28 38 C 24 40 21 42 18 44" fill="currentColor" />
            <path d="M 18 44 Q 24 44 28 50 C 23 48 20 46 18 44" fill="currentColor" />
            <path d="M 18 44 Q 12 50 8 56 C 12 52 15 48 18 44" fill="currentColor" />
            <path d="M 18 44 Q 16 34 14 28 C 16 34 17 39 18 44" fill="currentColor" />

            {/* 3. Right Palm Tree (Taller, curves right) */}
            {/* Trunk */}
            <path 
              d="M 39 65 Q 36 46 47 33 Q 39 44 40 65 Z" 
              fill="currentColor" 
            />
            {/* Leaves Crown */}
            <path d="M 47 33 Q 45 21 42 14 C 45 21 46 27 47 33" fill="currentColor" />
            <path d="M 47 33 Q 37 27 29 33 C 37 32 42 32 47 33" fill="currentColor" />
            <path d="M 47 33 Q 35 35 28 43 C 36 39 42 36 47 33" fill="currentColor" />
            <path d="M 47 33 Q 57 25 65 30 C 57 30 52 31 47 33" fill="currentColor" />
            <path d="M 47 33 Q 59 34 67 42 C 58 38 52 35 47 33" fill="currentColor" />
            <path d="M 47 33 Q 56 43 61 51 C 54 45 50 39 47 33" fill="currentColor" />
            <path d="M 47 33 Q 41 41 36 48 C 41 41 44 37 47 33" fill="currentColor" />

            {/* 4. Grassy Island Base & Shrubbery */}
            <path 
              d="M 12 65 Q 28 62 48 65 Q 40 63 12 65" 
              fill="currentColor" 
            />
            {/* Individual dynamic Grass Tufts */}
            <path 
              d="M 18 65 L 17 60 L 19 65 L 21 58 L 22 65 L 25 59 L 26 65 L 29 58 L 31 65 L 34 61 L 35 65 L 38 58 L 39 65" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="currentColor" 
            />
            <path 
              d="M 40 65 L 41 61 L 43 65 L 44 59 L 45 65" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="currentColor" 
            />

            {/* 5. Elegant Water Waves Rippling below island */}
            <path 
              d="M 10 68 C 18 67, 22 69, 30 68 C 38 67, 42 69, 50 68" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              strokeLinecap="round" 
            />
            <path 
              d="M 15 71 C 21 70, 25 72, 31 71 C 37 70, 41 72, 45 71" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.8" 
              strokeLinecap="round" 
            />
          </g>
          </g>
        </svg>
      </div>

      {/* Brand Text Section */}
      <div className={`flex flex-col ${isCentered ? 'items-center' : 'items-start'}`}>
        {/* REISENOVA: Italicized, Bold, Hand-drawn script style */}
        <span 
          className="font-logo text-3xl font-bold tracking-[0.04em] uppercase text-[#f15a24] italic leading-none transition-transform duration-300 group-hover:scale-[1.02]"
          style={{ 
            fontFamily: '"Permanent Marker", "Caveat", "Playfair Display", cursive',
            letterSpacing: '0.04em',
            textShadow: '1px 1px 0px rgba(255,255,255,1), -1px 1px 0px rgba(255,255,255,1), 1px -1px 0px rgba(255,255,255,1), -1px -1px 0px rgba(255,255,255,1), 0 0 6px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,0.9), 0 0 15px rgba(255,255,255,0.8)'
          }}
        >
          REISENOVA
        </span>
        {/* TRAVEL & TOURS: Modern Sans-serif, extremely wide-tracked, theme-adaptive color */}
        <span 
          className="font-sans text-[10px] tracking-[0.28em] font-semibold uppercase mt-1.5 transition-colors duration-500 text-black"
          style={{ 
            letterSpacing: '0.28em',
            textShadow: '1px 1px 0px rgba(255,255,255,1), -1px 1px 0px rgba(255,255,255,1), 1px -1px 0px rgba(255,255,255,1), -1px -1px 0px rgba(255,255,255,1), 0 0 5px rgba(255,255,255,1), 0 0 8px rgba(255,255,255,0.9), 0 0 12px rgba(255,255,255,0.8)'
          }}
        >
          TRAVEL & TOURS
        </span>
      </div>
    </div>
  );
}
