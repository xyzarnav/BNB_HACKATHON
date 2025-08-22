import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AuroraBackground: React.FC = () => {
  const auroraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (auroraRef.current) {
      // Create flowing aurora animation
      const aurora = auroraRef.current;
      
      // Animate the aurora layers
      gsap.to(aurora.children, {
        y: -100,
        duration: 20,
        ease: "none",
        stagger: 2,
        repeat: -1,
        yoyo: true
      });

      // Add subtle rotation
      gsap.to(aurora, {
        rotation: 5,
        duration: 30,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true
      });

      // Pulse the opacity
      gsap.to(aurora.children, {
        opacity: 0.7,
        duration: 4,
        ease: "power2.inOut",
        stagger: 1,
        repeat: -1,
        yoyo: true
      });
    }
  }, []);

  return (
    <div 
      ref={auroraRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Aurora Layer 1 */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-30"
        style={{
          background: 'radial-gradient(ellipse 800px 400px at 50% 50%, rgba(0, 212, 255, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
          transform: 'translateY(-50%)'
        }}
      />
      
      {/* Aurora Layer 2 */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-20"
        style={{
          background: 'radial-gradient(ellipse 600px 300px at 30% 60%, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'translateY(-30%)'
        }}
      />
      
      {/* Aurora Layer 3 */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-15"
        style={{
          background: 'radial-gradient(ellipse 1000px 500px at 70% 40%, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          transform: 'translateY(-70%)'
        }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Animated Grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}
      />
      
      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  );
};

export default AuroraBackground; 