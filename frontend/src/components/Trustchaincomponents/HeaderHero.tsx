import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import CTAButton from "./CTAButton";

const HeaderHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const handleScroll = (target: string) => {
    const element = document.getElementById(target);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (heroRef.current) {
      // Hero entrance animation
      const tl = gsap.timeline();
      
      tl.fromTo(titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo(subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(statsRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.2"
      );

      // Floating animation for decorative elements
      gsap.to(".floating-element", {
        y: -20,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_50%)]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-500/20 rounded-full floating-element blur-sm"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full floating-element blur-sm"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-500/20 rounded-full floating-element blur-sm"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-cyan-500/20 rounded-full floating-element blur-sm"></div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-full text-sm font-medium mb-12 neon-border-cyan-400">
            <span className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-cyan-300 neon-text-cyan-400">Revolutionizing Government Procurement</span>
          </div>

          {/* Main Heading */}
          <h1 
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
          >
            Revolutionizing{" "}
            <span className="gradient-text neon-text">Government Bond</span>{" "}
            <br />
            <span className="text-cyan-400 neon-text-cyan-400">Bidding with Web3</span>
          </h1>

          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed"
          >
            TrustChain leverages blockchain technology to bring unparalleled{" "}
            <span className="text-cyan-400 neon-text-cyan-400">transparency</span>,{" "}
            <span className="text-purple-400 neon-text-purple-400">security</span>, and{" "}
            <span className="text-pink-400 neon-text-pink-400">efficiency</span> to government bond procurement.
          </p>

          {/* CTA Buttons */}
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <CTAButton
              text="Get Started"
              onClick={() => handleScroll("features")}
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 neon-border-cyan-400"
            />
            <CTAButton
              text="Learn More"
              onClick={() => handleScroll("about")}
              className="px-10 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-xl font-semibold text-lg hover:bg-cyan-400/10 hover:neon-text-cyan-400 transition-all duration-300 hover:scale-105"
            />
          </div>

          {/* Stats */}
          <div 
            ref={statsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <div className="glass-dark p-8 rounded-2xl text-center border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105 group">
              <div className="text-5xl font-bold text-cyan-400 mb-4 group-hover:neon-text-cyan-400 transition-all duration-300">100%</div>
              <div className="text-white font-semibold text-xl mb-2">Transparency</div>
              <div className="text-gray-400 text-sm">Complete visibility into all transactions</div>
            </div>
            <div className="glass-dark p-8 rounded-2xl text-center border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 group">
              <div className="text-5xl font-bold text-purple-400 mb-4 group-hover:neon-text-purple-400 transition-all duration-300">0%</div>
              <div className="text-white font-semibold text-xl mb-2">Corruption</div>
              <div className="text-gray-400 text-sm">Eliminated through smart contracts</div>
            </div>
            <div className="glass-dark p-8 rounded-2xl text-center border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:scale-105 group">
              <div className="text-5xl font-bold text-pink-400 mb-4 group-hover:neon-text-pink-400 transition-all duration-300">24/7</div>
              <div className="text-white font-semibold text-xl mb-2">Accessibility</div>
              <div className="text-gray-400 text-sm">Round-the-clock platform access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeaderHero;
