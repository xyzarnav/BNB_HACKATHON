import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useAuth } from "../hooks/useAuth";
import {
  useProjectCount,
  useBidCount,
  useAllProjects,
  useUserBids,
  useProjectsByCreator,
  type Project as BlockchainProject,
  type Bid as BlockchainBid,
} from "../hooks/useContractRead";
import QRCodeWithLink from "../components/QRCodeWithLink";
import { 
  generateProjectExplorerUrl, 
  generateBlockExplorerUrl 
} from "../utils/blockExplorer";

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
  const [userProjects, setUserProjects] = useState<BlockchainProject[]>([]);
  const [userBids, setUserBids] = useState<BlockchainBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { user } = useAuth();

  // Contract read hooks
  const { data: projectCount, error: projectCountError } = useProjectCount();
  const { data: bidCount, error: bidCountError } = useBidCount();
  const { error: allProjectsError } = useAllProjects();
  const { data: userBidsData, error: userBidsError } = useUserBids(address as `0x${string}`);
  const { data: userProjectsData, error: userProjectsError } = useProjectsByCreator(address as `0x${string}`);

  // Format timestamp
  const formatTimestamp = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString();
  };

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

        // Update stats
        const newStats: DashboardStats = {
          totalProjects: projectCount ? Number(projectCount) : 0,
          totalBids: bidCount ? Number(bidCount) : 0,
          userProjects: userProjectsData && Array.isArray(userProjectsData) ? userProjectsData.length : 0,
          userBids: userBidsData && Array.isArray(userBidsData) ? userBidsData.length : 0,
        };
        setStats(newStats);

        // Set user projects and bids
        if (userProjectsData && Array.isArray(userProjectsData)) {
          setUserProjects(userProjectsData as BlockchainProject[]);
        }
        if (userBidsData && Array.isArray(userBidsData)) {
          setUserBids(userBidsData as BlockchainBid[]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [
    isConnected,
    address,
    projectCount,
    bidCount,
    userProjectsData,
    userBidsData,
    projectCountError,
    bidCountError,
    userBidsError,
    userProjectsError
  ]);

  // Handle errors
  useEffect(() => {
    if (projectCountError || bidCountError || allProjectsError || userBidsError || userProjectsError) {
      const errorMessage = projectCountError?.message || 
                          bidCountError?.message || 
                          allProjectsError?.message || 
                          userBidsError?.message || 
                          userProjectsError?.message || 
                          "Unknown error occurred";
      setError(errorMessage);
    }
  }, [projectCountError, bidCountError, allProjectsError, userBidsError, userProjectsError]);

  if (!isConnected) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Connect Your Wallet</h2>
            <p className="text-gray-600">Please connect your wallet to access the dashboard</p>
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
            {userProjects.length === 0 ? (
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm text-center">
                <p className="text-gray-600">No projects created yet</p>
                <Link to="/create-project" className="text-blue-600 hover:text-blue-700 mt-4 inline-block font-medium">
                  Create Your First Project →
                </Link>
              </div>
            ) : (
              userProjects.map((project, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-gray-600 mt-2">{project.description}</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {formatEther(project.budget)} BNB
                        </div>
                        <div className={`text-sm px-2 py-1 rounded ${
                          project.posted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {project.posted ? "Active" : "Draft"}
                        </div>
                      </div>
                      <QRCodeWithLink
                        value={generateProjectExplorerUrl(project.projectId)}
                        label={`Project #${project.projectId}`}
                        explorerUrl={generateProjectExplorerUrl(project.projectId)}
                        size={100}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-4">
                      <Link
                        to={`/project/${Number(project.projectId)}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <a
                        href={generateProjectExplorerUrl(project.projectId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        View on Explorer
                      </a>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <div className="flex space-x-4">
                      <span>Deadline: {formatTimestamp(project.deadline)}</span>
                      <span>Project ID: {project.projectId}</span>
                    </div>
                    <a
                      href={generateBlockExplorerUrl('address', project.creator)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-xs"
                      title="View creator address on block explorer"
                    >
                      Creator: {formatAddress(project.creator)}
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "bids" && (
          <div className="space-y-4">
            {userBids.length === 0 ? (
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm text-center">
                <p className="text-gray-600">No bids submitted yet</p>
                <Link to="/active-projects" className="text-blue-600 hover:text-blue-700 mt-4 inline-block font-medium">
                  Browse Active Projects →
                </Link>
              </div>
            ) : (
              userBids.map((bid, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">Bid #{bid.bidId}</h3>
                      <p className="text-gray-600 mt-2">Project ID: {bid.projectId}</p>
                      {bid.proposalIPFHash && (
                        <p className="text-sm text-gray-500 mt-1">
                          Proposal: {bid.proposalIPFHash.slice(0, 20)}...
                        </p>
                      )}
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {formatEther(bid.amount)} BNB
                        </div>
                        <div className={`text-sm px-2 py-1 rounded ${
                          bid.accepted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {bid.accepted ? "Accepted" : "Under Review"}
                        </div>
                      </div>
                      <QRCodeWithLink
                        value={generateProjectExplorerUrl(bid.projectId)}
                        label={`Bid #${bid.bidId}`}
                        explorerUrl={generateProjectExplorerUrl(bid.projectId)}
                        size={100}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Bid ID: {bid.bidId}</span>
                    <a
                      href={generateBlockExplorerUrl('address', bid.bidder)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-xs"
                      title="View bidder address on block explorer"
                    >
                      Bidder: {formatAddress(bid.bidder)}
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
