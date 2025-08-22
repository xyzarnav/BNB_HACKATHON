import React from "react";
import NewNavbar from "../components/Trustchaincomponents/NewNavbar";
import HeaderHero from "../components/Trustchaincomponents/HeaderHero";
import MainContent from "../components/Trustchaincomponents/MainContent";

/**
 * TrustChain Landing Page
 */
const TrustchainPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <NewNavbar />

      {/* Hero Section */}
      <HeaderHero />

      {/* Main Content */}
      <MainContent />
    </div>
  );
};

export default TrustchainPage;