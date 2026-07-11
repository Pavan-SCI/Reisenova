import React, { useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    
    // Set initial positions
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out'
      });
      
      gsap.to(follower, {
        x: mouseX,
        y: mouseY,
        duration: 0.6,
        ease: 'power2.out'
      });
    };

    const onMouseHover = () => {
      gsap.to(cursor, { scale: 1.5, duration: 0.3 });
      gsap.to(follower, { scale: 1.5,  duration: 0.3 });
    };

    const onMouseHoverOut = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(follower, { scale: 1,  duration: 0.3 });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Add hover effects to all clickable elements
    const clickables = document.querySelectorAll('a, button, input, .cursor-pointer');
    clickables.forEach((el) => {
      el.addEventListener('mouseenter', onMouseHover);
      el.addEventListener('mouseleave', onMouseHoverOut);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clickables.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseHover);
        el.removeEventListener('mouseleave', onMouseHoverOut);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={followerRef} className="custom-cursor-follower" />
    </>
  );
};

export default CustomCursor;
