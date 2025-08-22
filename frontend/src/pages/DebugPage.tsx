import React from "react";
import { ContractInteraction } from "../components/ContractInteraction";

const DebugPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Debug Contracts</h1>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">Contract Interaction</h2>
          <p className="text-gray-300 mb-4">Test and interact with smart contracts.</p>
          <ContractInteraction />
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
