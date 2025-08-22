import React from "react";
import { Link } from "react-router-dom";

const UseCasesPage = () => {
  const useCases = [
    {
      title: "Government Bonds",
      description: "Transparent and immutable issuance and management of government securities on blockchain.",
      icon: "/aboutBlockchain.png",
      link: "/usecases/govbonds",
    },
    {
      title: "TenderNet",
      description: "Decentralized tender network for secure and transparent bidding processes.",
      icon: "/aboutCoin.png",
      link: "/usecases/tendernet",
    },
    {
      title: "Auction Platform",
      description: "Transparent auction systems with verifiable bids and automated settlement.",
      icon: "/aboutSecure.png",
      link: "/usecases/auction",
    },
    {
      title: "Supply Chain Tracking",
      description: "End-to-end visibility and verification of government supply chains.",
      icon: "/aboutBlockchain.png",
      link: "/usecases/supply-chain",
    },
    {
      title: "Funds Distribution",
      description: "Transparent tracking of public funds allocation and utilization.",
      icon: "/aboutCoin.png",
      link: "/usecases/funds-distribution",
    },
    {
      title: "Digital Identity",
      description: "Secure and portable identity verification for citizens and government officials.",
      icon: "/aboutSecure.png",
      link: "/usecases/digital-identity",
    },
  ];

  return (
    <div className="bg-white py-8">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-50 to-white py-10 mt-10">
        <div className="absolute inset-0 bg-[size:60px_60px] opacity-5 bg-grid"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-5">
            <h1 className="text-5xl font-bold mt-15 mb-2 text-blue-600">
              Blockchain Use Cases for Anti-Corruption
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mt-5">
              Explore how our blockchain technology is transforming transparency and accountability in various sectors.
            </p>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {useCases.map((useCase, index) => (
            <Link to={useCase.link} key={index} className="block group">
              <div className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-200 overflow-hidden group-hover:border-blue-200 relative rounded-xl">
                {/* Card Background */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-all duration-300">
                  <img
                    src={useCase.icon}
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-white/60 z-0"></div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-bl-full z-0 opacity-70 group-hover:opacity-100 transition-all duration-300"></div>

                <div className="p-6 relative z-10">
                  <div className="flex items-center mb-5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md mr-4">
                      <span className="text-2xl font-bold">{useCase.title.charAt(0)}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{useCase.title}</h2>
                  </div>

                  <p className="text-gray-600 leading-relaxed">{useCase.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    

    </div>
  );
};

export default UseCasesPage;