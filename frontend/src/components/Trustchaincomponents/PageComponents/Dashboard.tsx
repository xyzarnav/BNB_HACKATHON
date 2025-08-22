import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  useProjectCount,
  useBidCount,
  useProject,
  useBid,
  formatBigIntToEther,
  formatAddress,
  formatTimestamp,
  type Project as BlockchainProject,
  type Bid as BlockchainBid,
} from "../../../hooks/useContract";

interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  status: string;
  deadline: string;
  bids: number;
  creator: string;
  posted: boolean;
}

interface Bid {
  id: number;
  projectId: number;
  projectTitle: string;
  amount: string;
  status: string;
  submittedDate: string;
  bidder: string;
  accepted: boolean;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useAccount(); // Keep the connection active

  // Read project count from blockchain
  const { data: projectCount, error: projectCountError } = useProjectCount();

  // Read bid count from blockchain
  const { data: bidCount, error: bidCountError } = useBidCount();

  // Function to fetch a single project by ID
  const fetchProject = async (projectId: number): Promise<Project | null> => {
    try {
      const { data: projectData } = useProject(projectId);

      if (projectData) {
        const project = projectData as unknown as BlockchainProject;
        return {
          id: projectId,
          title: project.title || `Project ${projectId}`,
          description: project.description || "No description available",
          budget: formatBigIntToEther(project.budget) + " BNB",
          status: project.posted ? "Active" : "Draft",
          deadline: formatTimestamp(project.deadline),
          bids: 0, // Will be updated later
          creator: project.creator,
          posted: project.posted,
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching project ${projectId}:`, error);
      return null;
    }
  };

  // Function to fetch a single bid by ID
  const fetchBid = async (bidId: number): Promise<Bid | null> => {
    try {
      const { data: bidData } = useBid(bidId);

      if (bidData) {
        const bid = bidData as unknown as BlockchainBid;
        // Fetch project data to get the title
        const { data: projectData } = useProject(Number(bid.projectId));
        const project = projectData as unknown as BlockchainProject;

        return {
          id: bidId,
          projectId: Number(bid.projectId),
          projectTitle: project?.title || `Project ${bid.projectId}`,
          amount: formatBigIntToEther(bid.amount) + " BNB",
          status: bid.accepted ? "Accepted" : "Under Review",
          submittedDate: new Date().toLocaleDateString(), // Default since timestamp not available
          bidder: bid.bidder,
          accepted: bid.accepted,
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching bid ${bidId}:`, error);
      return null;
    }
  };

  // Fetch all projects from blockchain
  const fetchAllProjects = async () => {
    if (!projectCount) return;

    const projectCountNum = Number(projectCount);
    const fetchedProjects: Project[] = [];

    for (let i = 1; i <= projectCountNum; i++) {
      try {
        const project = await fetchProject(i);
        if (project) {
          fetchedProjects.push(project);
        }
      } catch (error) {
        console.error(`Error fetching project ${i}:`, error);
      }
    }

    setProjects(fetchedProjects);
  };

  // Fetch all bids from blockchain
  const fetchAllBids = async () => {
    if (!bidCount) return;

    const bidCountNum = Number(bidCount);
    const fetchedBids: Bid[] = [];

    for (let i = 1; i <= bidCountNum; i++) {
      try {
        const bid = await fetchBid(i);
        if (bid) {
          fetchedBids.push(bid);
        }
      } catch (error) {
        console.error(`Error fetching bid ${i}:`, error);
      }
    }

    setBids(fetchedBids);
  };

  // Set a timeout to stop loading after 15 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("Loading timeout - please check your connection");
      }
    }, 15000);

    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    // Handle project count data
    if (projectCountError) {
      console.error("Error loading project count:", projectCountError);
      setError("Failed to load project count from blockchain");
      setLoading(false);
      return;
    }

    if (projectCount !== undefined) {
      fetchAllProjects();
    }
  }, [projectCount, projectCountError]);

  useEffect(() => {
    // Handle bid count data
    if (bidCountError) {
      console.error("Error loading bid count:", bidCountError);
      // Don't set error for bids, just log it
      return;
    }

    if (bidCount !== undefined) {
      fetchAllBids();
    }
  }, [bidCount, bidCountError]);

  // Set loading to false when we have data
  useEffect(() => {
    if (projects.length > 0 || bids.length > 0) {
      setLoading(false);
    }
  }, [projects, bids]);

  const stats = [
    {
      title: "Active Projects",
      value: projects.filter(p => p.posted).length,
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Total Bids",
      value: bids.length,
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Completed Projects",
      value: projects.filter(p => !p.posted).length,
      change: "+15%",
      changeType: "positive",
    },
    {
      title: "Total Value",
      value: projects.reduce((sum, p) => sum + parseFloat(p.budget.split(' ')[0]), 0).toFixed(1) + " BNB",
      change: "+23%",
      changeType: "positive",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching data from blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's what's happening with your projects.
              </p>
              {error && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ {error}
                  </p>
                </div>
              )}
              {projects.length === 0 && !loading && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ℹ️ No projects found on blockchain. Create your first project!
                  </p>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <Link
                to="/create-project"
                className="btn btn-primary"
              >
                Create Project
              </Link>
              <Link
                to="/dashboard"
                className="btn btn-secondary"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", name: "Overview" },
                { id: "projects", name: "All Projects" },
                { id: "bids", name: "My Bids" },
                { id: "reports", name: "Reports" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No projects found on blockchain.</p>
                      <Link
                        to="/create-project"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                      >
                        Create your first project →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.slice(0, 3).map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {project.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {project.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Creator: {formatAddress(project.creator)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {project.budget}
                            </p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              project.posted
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {project.posted ? "Active" : "Draft"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    All Projects ({projects.length})
                  </h3>
                  <Link
                    to="/create-project"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Create New Project →
                  </Link>
                </div>
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No projects found on blockchain.</p>
                    <Link
                      to="/create-project"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                    >
                      Create your first project →
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Creator
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Budget
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Deadline
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {projects.map((project) => (
                          <tr key={project.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {project.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {project.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatAddress(project.creator)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {project.budget}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                project.posted
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {project.posted ? "Active" : "Draft"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {project.deadline}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link
                                to={`/project/${project.id}`}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                View
                              </Link>
                              {project.posted && (
                                <Link
                                  to={`/bid/${project.id}`}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Bid
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "bids" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  All Bids ({bids.length})
                </h3>
                {bids.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No bids found on blockchain.</p>
                    <Link
                      to="/dashboard"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                    >
                      Browse available projects →
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bidder
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bid Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submitted
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bids.map((bid) => (
                          <tr key={bid.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {bid.projectTitle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatAddress(bid.bidder)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {bid.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                bid.accepted
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {bid.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {bid.submittedDate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reports" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Blockchain Analytics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Total Projects</h4>
                    <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Projects created on blockchain</p>
                  </div>
                  <div className="card p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Total Bids</h4>
                    <p className="text-3xl font-bold text-green-600">{bids.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Bids submitted on blockchain</p>
                  </div>
                  <div className="card p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Active Projects</h4>
                    <p className="text-3xl font-bold text-purple-600">{projects.filter(p => p.posted).length}</p>
                    <p className="text-sm text-gray-600 mt-1">Currently active projects</p>
                  </div>
                  <div className="card p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Total Value</h4>
                    <p className="text-3xl font-bold text-orange-600">{projects.reduce((sum, p) => sum + parseFloat(p.budget.split(' ')[0]), 0).toFixed(1)} BNB</p>
                    <p className="text-sm text-gray-600 mt-1">Total project value</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;