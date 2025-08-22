import React from "react";

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            About TrustChain
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powering Trust with Technology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure. Transparent. Decentralized.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Transforming Government Bond Bidding
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                TrustChain is a pioneering Web3 platform dedicated to transforming the conventional 
                landscape of government bond bidding. Our mission is to introduce unparalleled 
                transparency, security, and efficiency to government procurement processes.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                By building on Web3 principles, TrustChain enables secure and decentralized 
                governance over the bond bidding process. Smart contracts automate the entire 
                lifecycle, from bid submission to payment distribution, ensuring fairness and 
                eliminating human bias.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Fraud and favoritism are minimized</h4>
                  <p className="text-gray-600">Smart contracts ensure fair and transparent processes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Taxpayers benefit from fair, open processes</h4>
                  <p className="text-gray-600">Complete transparency in all transactions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Equitable access for all bidders</h4>
                  <p className="text-gray-600">Level playing field for all participants</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="card p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Blockchain Technology</h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Immutable, transparent, and secure record-keeping for all transactions
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-200 rounded-full opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-indigo-200 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
