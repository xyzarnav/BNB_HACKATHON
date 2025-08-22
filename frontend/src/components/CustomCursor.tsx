import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  elementType: 'link' | 'button' | 'input' | 'draggable' | 'default';
}

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorState = useRef<CursorState>({
    isHovering: false,
    isClicking: false,
    elementType: 'default'
  });

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorRing = cursorRingRef.current;

    if (!cursor || !cursorDot || !cursorRing) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Mouse enter/leave handlers for interactive elements
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      cursorState.current.isHovering = true;

      // Determine element type
      if (target.tagName === 'A' || target.closest('a')) {
        cursorState.current.elementType = 'link';
      } else if (target.tagName === 'BUTTON' || target.closest('button')) {
        cursorState.current.elementType = 'button';
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('input')) {
        cursorState.current.elementType = 'input';
      } else if (target.getAttribute('data-draggable') === 'true') {
        cursorState.current.elementType = 'draggable';
      } else {
        cursorState.current.elementType = 'default';
      }

      // Apply hover animations
      gsap.to(cursorRing, {
        scale: 1.5,
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to(cursorDot, {
        scale: 0.5,
        duration: 0.3,
        ease: "power2.out"
      });

      // Add magnetic effect
      if (cursorState.current.elementType === 'button' || cursorState.current.elementType === 'link') {
        gsap.to(target, {
          x: 5,
          y: 5,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      cursorState.current.isHovering = false;
      cursorState.current.elementType = 'default';

      // Reset hover animations
      gsap.to(cursorRing, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to(cursorDot, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });

      // Reset magnetic effect
      gsap.to(target, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // Mouse down/up handlers
    const handleMouseDown = () => {
      cursorState.current.isClicking = true;
      gsap.to(cursorRing, {
        scale: 0.8,
        duration: 0.1,
        ease: "power2.out"
      });
      gsap.to(cursorDot, {
        scale: 1.5,
        duration: 0.1,
        ease: "power2.out"
      });
    };

    const handleMouseUp = () => {
      cursorState.current.isClicking = false;
      gsap.to(cursorRing, {
        scale: cursorState.current.isHovering ? 1.5 : 1,
        duration: 0.1,
        ease: "power2.out"
      });
      gsap.to(cursorDot, {
        scale: cursorState.current.isHovering ? 0.5 : 1,
        duration: 0.1,
        ease: "power2.out"
      });
    };

    // Animation loop
    const animateCursor = () => {
      // Smooth cursor following with different speeds for dot and ring
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;

      // Apply transforms
      gsap.set(cursorRing, {
        x: cursorX - 20,
        y: cursorY - 20
      });

      gsap.set(cursorDot, {
        x: dotX - 4,
        y: dotY - 4
      });

      requestAnimationFrame(animateCursor);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [data-draggable="true"]');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    // Start animation
    animateCursor();

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });

      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {/* Cursor Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-10 h-10 border-2 border-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-all duration-300"
        style={{
          transform: 'translate(-50%, -50%)',
          backdropFilter: 'blur(1px)'
        }}
      />
      
      {/* Cursor Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-all duration-300"
        style={{
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px rgba(0, 212, 255, 0.8)'
        }}
      />
    </>
  );
};

export default CustomCursor; 