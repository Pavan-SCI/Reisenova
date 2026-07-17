import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  className?: string;
  alwaysShowArrows?: boolean;
  darkOverlay?: boolean;         // renders dark gradient inside carousel (above images, below arrows)
  darkOverlayOpacity?: string;   // e.g. 'bg-black/40' or 'bg-black/60'
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  className = '',
  alwaysShowArrows = false,
  darkOverlay = false,
  darkOverlayOpacity = 'bg-black/50',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const navigate = useCallback(
    (nextIdx: number) => {
      if (transitioning || nextIdx === currentIndex) return;
      resetTimer();
      setPrevIndex(currentIndex);
      setCurrentIndex(nextIdx);
      setTransitioning(true);
      setTimeout(() => {
        setPrevIndex(null);
        setTransitioning(false);
      }, 900);
    },
    [currentIndex, transitioning]
  );

  // Auto-slide
  useEffect(() => {
    if (!images || images.length <= 1) return;
    timerRef.current = setTimeout(() => {
      navigate((currentIndex + 1) % images.length);
    }, 4500);
    return resetTimer;
  }, [currentIndex, navigate, images]);

  if (!images || images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <img src={images[0]} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }

  const arrowVisibilityClass = alwaysShowArrows
    ? 'opacity-100'
    : 'opacity-0 group-hover:opacity-100';

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {/* Keyframes */}
      <style>{`
        @keyframes carousel-fade-in  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes carousel-fade-out { from { opacity: 1; } to { opacity: 0; } }
        @keyframes carousel-zoom-in  { from { transform: scale(1.08); } to { transform: scale(1); } }
        @keyframes carousel-zoom-out { from { transform: scale(1); } to { transform: scale(0.94); } }
      `}</style>

      {/* Outgoing image */}
      {prevIndex !== null && (
        <div
          key={`prev-${prevIndex}`}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 5, animation: 'carousel-fade-out 0.9s cubic-bezier(0.4,0,0.2,1) forwards' }}
        >
          <img
            src={images[prevIndex]}
            alt=""
            className="w-full h-full object-cover"
            style={{ animation: 'carousel-zoom-out 0.9s cubic-bezier(0.4,0,0.2,1) forwards' }}
          />
        </div>
      )}

      {/* Current image */}
      <div
        key={`curr-${currentIndex}`}
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 10,
          animation: transitioning ? 'carousel-fade-in 0.9s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
          opacity: transitioning ? 0 : 1,
        }}
      >
        <img
          src={images[currentIndex]}
          alt=""
          className="w-full h-full object-cover"
          style={{ animation: transitioning ? 'carousel-zoom-in 0.9s cubic-bezier(0.4,0,0.2,1) forwards' : 'none' }}
        />
      </div>

      {/* Dark overlay — sits between images (z-10) and arrows (z-30) */}
      {darkOverlay && (
        <div
          className={`absolute inset-0 pointer-events-none ${darkOverlayOpacity}`}
          style={{ zIndex: 20 }}
        />
      )}

      {/* Left Arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
        }}
        className={`absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30
          w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-forest
          transition-all duration-300 ease-out hover:scale-110 active:scale-95
          bg-white/90 hover:bg-orange hover:text-white backdrop-blur-md shadow-xl border border-black/5
          ${arrowVisibilityClass}`}
        aria-label="Previous image"
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate((currentIndex + 1) % images.length);
        }}
        className={`absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30
          w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-forest
          transition-all duration-300 ease-out hover:scale-110 active:scale-95
          bg-white/90 hover:bg-orange hover:text-white backdrop-blur-md shadow-xl border border-black/5
          ${arrowVisibilityClass}`}
        aria-label="Next image"
      >
        <ChevronRight size={22} strokeWidth={2.5} />
      </button>

      {/* Image counter badge */}
      <div
        className={`absolute top-5 right-5 z-30 text-white text-xs font-bold tracking-widest px-3 py-1.5 rounded-full
          transition-all duration-300 ${arrowVisibilityClass}`}
        style={{
          background: 'rgba(0,0,0,0.40)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); navigate(idx); }}
            className="rounded-full transition-all duration-500 ease-out hover:scale-125"
            style={{
              width: currentIndex === idx ? '2rem' : '0.45rem',
              height: '0.45rem',
              background: currentIndex === idx ? '#e07b54' : 'rgba(255,255,255,0.50)',
              boxShadow: currentIndex === idx ? '0 0 10px 2px rgba(224,123,84,0.6)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
