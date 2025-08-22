import React from "react";
import NewNavbar from "../components/Trustchaincomponents/NewNavbar";
import HeaderHero from "../components/Trustchaincomponents/HeaderHero";
import MainContent from "../components/Trustchaincomponents/MainContent";
import Footer from "../components/Trustchaincomponents/Footer";

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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TrustchainPage;
