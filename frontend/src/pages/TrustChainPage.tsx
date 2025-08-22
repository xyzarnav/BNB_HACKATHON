import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import HeaderHero from "../components/Trustchaincomponents/HeaderHero";
import MainContent from "../components/Trustchaincomponents/MainContent";
import Aurora from "../components/Trustchaincomponents/aurora";
/**
 * TrustChain Landing Page
 */
const TrustchainPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current) {
      // Page entrance animation
      gsap.fromTo(pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" }
      );

      // Animate children with stagger
      const children = pageRef.current.children;
      gsap.fromTo(children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out", delay: 0.3 }
      );
    }
  }, []);

  return (
    <div ref={pageRef} className="bg-black min-h-screen">
      {/* Hero Section */}
      <HeaderHero />

      {/* Main Content */}
      <MainContent />
    </div>
  );
};

export default TrustchainPage;