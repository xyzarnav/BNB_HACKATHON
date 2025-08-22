import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useAuth } from "../hooks/useAuth";

interface DashboardStats {
  totalProjects: number;
  totalBids: number;
  userProjects: number;
  userBids: number;
}

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalBids: 0,
    userProjects: 0,
    userBids: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { user } = useAuth();

  // Format address
  const formatAddress = (address: string): string => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isConnected || !address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // For now, use dummy data until blockchain integration is working
        const newStats: DashboardStats = {
          totalProjects: 0,
          totalBids: 0,
          userProjects: 0,
          userBids: 0,
        };
        setStats(newStats);

        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Connect Your Wallet</h2>
            <p className="text-gray-600">Please connect your wallet to access the dashboard</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Use the Connect Wallet button in the top right corner</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-900">Loading dashboard...</p>
            <p className="text-sm text-gray-600 mt-2">Fetching data from blockchain...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow">
            Connected: {formatAddress(address || "")}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Common stats for all roles */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.totalProjects}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.totalBids}</div>
            <div className="text-sm text-gray-600">Total Bids</div>
          </div>

          {/* Role-specific stats */}
          {user?.role === 'bond_issuer' && (
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{stats.userProjects}</div>
              <div className="text-sm text-gray-600">My Projects</div>
            </div>
          )}
          {user?.role === 'bidder' && (
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{stats.userBids}</div>
              <div className="text-sm text-gray-600">My Bids</div>
            </div>
          )}
          {user?.role === 'auditor' && (
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalProjects}</div>
              <div className="text-sm text-gray-600">Projects to Audit</div>
            </div>
          )}
        </div>

        {/* User Info Display */}
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-700">
              <strong>Note:</strong> User profile data not loaded. This might be due to authentication issues.
            </p>
          </div>
        )}

        {/* Tab Navigation - Role-specific tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "overview"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Overview
          </button>
          
          {user?.role === 'bond_issuer' && (
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "projects"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              My Projects
            </button>
          )}
          
          {user?.role === 'bidder' && (
            <button
              onClick={() => setActiveTab("bids")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "bids"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              My Bids
            </button>
          )}

          {user?.role === 'auditor' && (
            <button
              onClick={() => setActiveTab("audits")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "audits"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Projects to Audit
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Role-specific actions */}
            {user?.role === 'bond_issuer' && (
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Create Project</h2>
                <p className="text-gray-600">Launch a new transparent project</p>
                <Link to="/create-project" className="text-blue-600 hover:text-blue-700 mt-4 inline-block font-medium">
                  Create Project →
                </Link>
              </div>
            )}
            
            {user?.role === 'bidder' && (
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Browse Projects</h2>
                <p className="text-gray-600">Find and bid on active projects</p>
                <Link to="/projects" className="text-blue-600 hover:text-blue-700 mt-4 inline-block font-medium">
                  Browse Active Projects →
                </Link>
              </div>
            )}

            {user?.role === 'auditor' && (
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Audit Projects</h2>
                <p className="text-gray-600">Review and verify project milestones</p>
                <Link to="/dashboard/audit" className="text-blue-600 hover:text-blue-700 mt-4 inline-block font-medium">
                  View Projects to Audit →
                </Link>
              </div>
            )}

            {/* Common actions for all roles */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">View Projects</h2>
              <p className="text-gray-600">Browse all active projects</p>
              <Link to="/projects" className="text-blue-600 hover:text-blue-700 mt-4 inline-block font-medium">
                View All Projects →
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Profile</h2>
              <p className="text-gray-600">Manage your account settings</p>
              <Link to="/profile" className="text-blue-600 hover:text-blue-700 mt-4 inline-block font-medium">
                Edit Profile →
              </Link>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm text-center">
              <p className="text-gray-600">No projects created yet</p>
              <Link to="/create-project" className="text-blue-600 hover:text-blue-700 mt-4 inline-block font-medium">
                Create Your First Project →
              </Link>
            </div>
          </div>
        )}

        {activeTab === "bids" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm text-center">
              <p className="text-gray-600">No bids submitted yet</p>
              <Link to="/active-projects" className="text-blue-600 hover:text-blue-700 mt-4 inline-block font-medium">
                Browse Active Projects →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
