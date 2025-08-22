import React from "react";
import AboutSection from "./AboutSection";
import FeatureSection from "./FeatureSection";
import UseCasesSection from "./UsecaseSection";

const MainContent: React.FC = () => {
  return (
    <main className="bg-white">
      {/* About Section */}
      <AboutSection />
      
      {/* Features Section */}
      <FeatureSection />
      
      {/* Use Cases Section */}
      <UseCasesSection />
    </main>
  );
};

export default MainContent;
