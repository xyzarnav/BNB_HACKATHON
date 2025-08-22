import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useProjectCount,
  useBidCount,
} from "../../../hooks/useContractRead";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read counts from blockchain
  const { data: projectCount, error: projectCountError } = useProjectCount();
  const { data: bidCount, error: bidCountError } = useBidCount();

  // Simple data loading
  useEffect(() => {
    if (projectCountError || bidCountError) {
      setError("Failed to load blockchain data");
      setLoading(false);
    } else if (projectCount !== undefined || bidCount !== undefined) {
      setLoading(false);
    }
  }, [projectCount, bidCount, projectCountError, bidCountError]);

  // ... [keep the rest of the component code as is, including the stats array and render logic]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching data from blockchain...</p>
          {error && (
            <p className="text-sm text-red-500 mt-2">Error: {error}</p>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching data from blockchain...</p>
          {error && (
            <p className="text-sm text-red-500 mt-2">Error: {error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
            <p className="text-gray-600">View and manage your active projects</p>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              View Projects →
            </Link>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">My Bids</h2>
            <p className="text-gray-600">Track your submitted bids</p>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              View Bids →
            </Link>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <p className="text-gray-600">Manage your account settings</p>
            <Link to="/profile" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              Edit Profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;