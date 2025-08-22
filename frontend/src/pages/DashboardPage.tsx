import React from "react";
import NewNavbar from "../components/Trustchaincomponents/NewNavbar";
import Dashboard from "../components/Trustchaincomponents/PageComponents/Dashboard";

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavbar />
      <div className="pt-16">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
