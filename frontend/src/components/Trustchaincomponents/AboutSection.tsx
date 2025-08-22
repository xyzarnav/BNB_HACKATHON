import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";


const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline();
            
            tl.fromTo(titleRef.current,
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            )
            .fromTo(contentRef.current,
              { x: -50, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
              "-=0.4"
            )
            .fromTo(visualRef.current,
              { x: 50, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
              "-=0.4"
            );

            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(sectionRef.current);
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden"
    >
      {/* Background Elements */}
      

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          
          <h2 
            ref={titleRef}
            className="text-5xl md:text-6xl font-bold text-white mb-8"
          >
            Powering Trust{" "}
            <span className="gradient-text neon-text"></span>{" "}
            with Technology
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
            <span className="text-cyan-400 neon-text-cyan-400">Secure.</span>{" "}
            <span className="text-purple-400 neon-text-purple-400">Transparent.</span>{" "}
            <span className="text-pink-400 neon-text-pink-400">Decentralized.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Content */}
          <div ref={contentRef} className="space-y-10">
            <div>
              <h3 className="text-3xl font-bold text-white mb-8">
                Transforming Government Bond Bidding
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                TrustChain is a pioneering Web3 platform dedicated to transforming the conventional 
                landscape of government bond bidding. Our mission is to introduce unparalleled 
                transparency, security, and efficiency to government procurement processes.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                By building on Web3 principles, TrustChain enables secure and decentralized 
                governance over the bond bidding process. Smart contracts automate the entire 
                lifecycle, from bid submission to payment distribution, ensuring fairness and 
                eliminating human bias.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-8">
              <div className="flex items-start space-x-6 group">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-green-500/30 group-hover:border-green-500/60 transition-all duration-300">
                  <svg className="w-7 h-7 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-xl mb-3 group-hover:neon-text-green-400 transition-all duration-300">
                    Fraud and favoritism are minimized
                  </h4>
                  <p className="text-gray-400">Smart contracts ensure fair and transparent processes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-500/60 transition-all duration-300">
                  <svg className="w-7 h-7 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-xl mb-3 group-hover:neon-text-cyan-400 transition-all duration-300">
                    Taxpayers benefit from fair, open processes
                  </h4>
                  <p className="text-gray-400">Complete transparency in all transactions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-purple-500/30 group-hover:border-purple-500/60 transition-all duration-300">
                  <svg className="w-7 h-7 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-xl mb-3 group-hover:neon-text-purple-400 transition-all duration-300">
                    Equitable access for all bidders
                  </h4>
                  <p className="text-gray-400">Level playing field for all participants</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div ref={visualRef} className="relative">
            <div className="glass-dark p-10 rounded-3xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105 group">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-cyan-500/30 group-hover:border-cyan-500/60 transition-all duration-300">
                  <svg className="w-12 h-12 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 group-hover:neon-text-cyan-400 transition-all duration-300">
                  Blockchain Technology
                </h3>
                <p className="text-gray-300 text-xl leading-relaxed">
                  Immutable, transparent, and secure record-keeping for all transactions
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-cyan-500/20 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-purple-500/20 rounded-full blur-sm animate-pulse"></div>
          </div>
        </div>
      </div>
     
    </section>
  );
};

export default AboutSection;
