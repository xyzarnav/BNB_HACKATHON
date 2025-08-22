import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import CTAButton from "./CTAButton";
import AuroraBackground from "../AuroraBackground";
import Aurora from "./aurora";
import SpotlightCard from './Spotlight';

const HeaderHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const handleScroll = (target: string) => {
    const element = document.getElementById(target);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (heroRef.current) {
      // Hero entrance animation with text reveal
      const tl = gsap.timeline();
      
      // Animate badge
      tl.fromTo(badgeRef.current,
        { y: -50, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
      );

      // Animate title with character reveal
      const titleChars = titleRef.current?.querySelectorAll('.char');
      if (titleChars) {
        tl.fromTo(titleChars,
          { y: 100, opacity: 0, rotationX: -90 },
          { 
            y: 0, 
            opacity: 1, 
            rotationX: 0, 
            duration: 0.6, 
            stagger: 0.03, 
            ease: "back.out(1.7)" 
          },
          "-=0.4"
        );
      }

      // Animate subtitle
      tl.fromTo(subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      );

      // Animate buttons
      tl.fromTo(buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.2"
      );

      // Animate stats with stagger
      const statItems = statsRef.current?.children;
      if (statItems) {
        tl.fromTo(statItems,
          { y: 50, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" },
          "-=0.2"
        );
      }

      // Floating animation for decorative elements
      gsap.to(".floating-element", {
        y: -20,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      // Continuous text glow animation
      gsap.to(".neon-text", {
        textShadow: "0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor",
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  }, []);

  // Function to split text into characters for animation
  const splitText = (text: string, className: string = 'char') => {
    return text.split('').map((char, index) => (
      <span key={index} className={className}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center  overflow-hidden"
    >

     
  

  

      {/* Aurora Background */}
      
  


      {/* Additional Background Elements */}
      

      
      {/* Floating Elements */}
     

    
      <div className="absolute inset-0 w-full h-full -z-10">
  <Aurora
    colorStops={["#0A2f57", "#b19eef", "#5227ff"]}
    blend={0.5}
    amplitude={1.0}
    speed={0.5}
  />
  </div>
 
  <div className="w-full px-6">
    <div className="text-center mx-auto w-full">
      {/* Main Heading */}
      <h1
        ref={titleRef}
        className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-12 leading-tight break-words whitespace-normal"
      >
        {splitText("Revolutionizing", "char")}
        <br />
        <span>{splitText("Government Bonds", "char")}</span>
        <br />
        <span className="text-purple-500 neon-text-cyan-400 inline-block">
          {splitText("Bidding with Web3", "char")}
        </span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="text-2xl md:text-3xl text-gray-300 mb-20 max-w-5xl mx-auto leading-relaxed"
      >
        TrustChain leverages blockchain technology to bring unparalleled{" "}
        <span className="text-cyan-400 neon-text-cyan-400">transparency</span>,{" "}
        <span className="text-purple-400 neon-text-purple-400">security</span>, and{" "}
        <span className="text-pink-400 neon-text-pink-400">efficiency</span> to government bond procurement.
      </p>

      {/* CTA Buttons */}
      <div
        ref={buttonsRef}
        className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-24"
      >
        <CTAButton
          text="Get Started"
          onClick={() => handleScroll("features")}
          className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-semibold text-xl hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/25 neon-border-cyan-400 transform hover:-translate-y-1"
        />
        <CTAButton
          text="Learn More"
          onClick={() => handleScroll("about")}
          className="px-12 py-5 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-2xl font-semibold text-xl hover:bg-cyan-400/10 hover:neon-text-cyan-400 transition-all duration-300 hover:scale-110 hover:border-cyan-300 transform hover:-translate-y-1"
        />
      </div>

      {/* Stats */}
      <div
        ref={statsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl mx-auto"
      >
        <div className="glass-dark p-10 rounded-3xl text-center border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:scale-110 group transform hover:-translate-y-2">
        <SpotlightCard
  className="custom-spotlight-card w-full bg-transparent"
  spotlightColor="rgba(0, 100, 0, 0.4)"
>
          <div className="text-6xl font-bold text-cyan-400 mb-6 group-hover:neon-text-cyan-400 transition-all duration-500">100%</div>
          <div className="text-white font-semibold text-2xl mb-4">Transparency</div>
          <div className="text-gray-400 text-lg">Complete visibility into all transactions</div>
          </SpotlightCard>
        </div>
        <div className="glass-dark p-10 rounded-3xl text-center border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:scale-110 group transform hover:-translate-y-2">
         <SpotlightCard
  className="custom-spotlight-card w-full bg-transparent"
  spotlightColor="rgba(42, 42, 110, 0.8)"
>
          <div className="text-6xl font-bold text-purple-400 mb-6 group-hover:neon-text-purple-400 transition-all duration-500">0%</div>
          <div className="text-white font-semibold text-2xl mb-4">Corruption</div>
          <div className="text-gray-400 text-lg">Eliminated through smart contracts</div>
          </SpotlightCard>
        </div>
        <div className="glass-dark p-10 rounded-3xl text-center border border-pink-500/20 hover:border-pink-500/40 transition-all duration-500 hover:scale-110 group transform hover:-translate-y-2">
        <SpotlightCard
  className="custom-spotlight-card w-full bg-transparent"
  spotlightColor="rgba(150, 0, 0, 0.3)"
>
          <div className="text-6xl font-bold text-pink-400 mb-6 group-hover:neon-text-pink-400 transition-all duration-500">24/7</div>
          <div className="text-white font-semibold text-2xl mb-4">Accessibility</div>
          <div className="text-gray-400 text-lg">Round-the-clock platform access</div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  </div>

    </section>
  );
};

export default HeaderHero;
