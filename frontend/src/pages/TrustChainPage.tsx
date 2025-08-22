import React from "react";
import HeaderHero from "../components/Trustchaincomponents/HeaderHero";
import MainContent from "../components/Trustchaincomponents/MainContent";

/**
 * TrustChain Landing Page
 */
const TrustchainPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeaderHero />

      {/* Main Content */}
      <MainContent />
    </div>
  );
};

export default TrustchainPage;