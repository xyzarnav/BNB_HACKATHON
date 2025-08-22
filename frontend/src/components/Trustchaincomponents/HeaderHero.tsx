import React from "react";
import CTAButton from "./CTAButton";

const HeaderHero = () => {
  const handleScroll = (target: string) => {
    const element = document.getElementById(target);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Revolutionizing Government Procurement
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Revolutionizing{" "}
            <span className="text-gradient">Government Bond</span>{" "}
            Bidding with Web3
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            TrustChain leverages blockchain technology to bring unparalleled transparency, 
            security, and efficiency to government bond procurement.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <CTAButton
              text="Get Started"
              onClick={() => handleScroll("features")}
              className="btn btn-primary text-lg px-8 py-4"
            />
            <CTAButton
              text="Learn More"
              onClick={() => handleScroll("about")}
              className="btn btn-secondary text-lg px-8 py-4"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card p-8 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-3">100%</div>
              <div className="text-gray-700 font-semibold text-lg">Transparency</div>
              <div className="text-gray-500 text-sm mt-2">Complete visibility into all transactions</div>
            </div>
            <div className="card p-8 text-center">
              <div className="text-4xl font-bold text-green-600 mb-3">0%</div>
              <div className="text-gray-700 font-semibold text-lg">Corruption</div>
              <div className="text-gray-500 text-sm mt-2">Eliminated through smart contracts</div>
            </div>
            <div className="card p-8 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-3">24/7</div>
              <div className="text-gray-700 font-semibold text-lg">Accessibility</div>
              <div className="text-gray-500 text-sm mt-2">Round-the-clock platform access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20"></div>
    </section>
  );
};

export default HeaderHero;
