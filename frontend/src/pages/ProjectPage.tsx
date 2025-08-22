import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount, useReadContract } from "wagmi";
import { deployedContracts } from "../contracts/deployedContracts";
import NewNavbar from "../components/Trustchaincomponents/NewNavbar";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  category: string;
  requirements: string;
  status: string;
  bidCount: number;
  creator: string;
}

interface Bid {
  id: string;
  bidder: string;
  amount: string;
  proposal: string;
  timestamp: string;
}

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [project, setProject] = useState<Project | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  // Read project details from blockchain
  const { data: projectData } = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getProject',
    args: [projectId],
  });

  // Read project bids from blockchain
  const { data: bidsData } = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'getProjectBids',
    args: [projectId],
  });

  useEffect(() => {
    if (projectData) {
      // Parse project data from blockchain
      const [id, title, description, budget, deadline, category, requirements, status, bidCount, creator] = projectData as any[];
      
      setProject({
        id: id.toString(),
        title,
        description,
        budget: (Number(budget) / 10 ** 18).toFixed(2), // Convert from wei to BNB
        deadline: new Date(Number(deadline) * 1000).toLocaleDateString(),
        category,
        requirements,
        status: status === 0 ? "Open" : status === 1 ? "In Progress" : "Completed",
        bidCount: Number(bidCount),
        creator,
      });
      setLoading(false);
    }
  }, [projectData]);

  useEffect(() => {
    if (bidsData) {
      // Parse bids data from blockchain
      const parsedBids = (bidsData as any[]).map((bid: any, index: number) => ({
        id: index.toString(),
        bidder: bid.bidder,
        amount: (Number(bid.amount) / 10 ** 18).toFixed(2),
        proposal: bid.proposal,
        timestamp: new Date(Number(bid.timestamp) * 1000).toLocaleDateString(),
      }));
      setBids(parsedBids);
    }
  }, [bidsData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NewNavbar />
        <div className="pt-20">
          <div className="container py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading project details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NewNavbar />
        <div className="pt-20">
          <div className="container py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Project Not Found
              </h1>
              <p className="text-gray-600 mb-8">
                The project you're looking for doesn't exist.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-primary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavbar />
      <div className="pt-20">
        <div className="container py-16">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {project.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="capitalize">{project.category}</span>
                  <span>•</span>
                  <span>{project.bidCount} bids</span>
                  <span>•</span>
                  <span>Deadline: {project.deadline}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/bid/${projectId}`}
                  className="btn btn-primary"
                >
                  Submit Bid
                </Link>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn btn-ghost"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Project Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Description</h2>
                  <p className="text-gray-600 leading-relaxed">{project.description}</p>
                </div>

                {project.requirements && (
                  <div className="card p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements & Specifications</h2>
                    <p className="text-gray-600 leading-relaxed">{project.requirements}</p>
                  </div>
                )}

                {/* Bids Section */}
                <div className="card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Bids ({bids.length})</h2>
                    {project.status === "Open" && (
                      <Link
                        to={`/bid/${projectId}`}
                        className="btn btn-primary"
                      >
                        Submit Bid
                      </Link>
                    )}
                  </div>
                  
                  {bids.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No bids submitted yet. Be the first to bid on this project!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {bids.map((bid) => (
                        <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {bid.bidder.slice(0, 6)}...{bid.bidder.slice(-4)}
                              </p>
                              <p className="text-sm text-gray-500">{bid.timestamp}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-600">{bid.amount} BNB</p>
                            </div>
                          </div>
                          <p className="text-gray-600">{bid.proposal}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Project Info Sidebar */}
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Project Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                        project.status === "Open" ? "bg-green-100 text-green-800" :
                        project.status === "In Progress" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Budget</p>
                      <p className="text-lg font-bold text-gray-900">{project.budget} BNB</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="text-gray-900 capitalize">{project.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Deadline</p>
                      <p className="text-gray-900">{project.deadline}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Bids</p>
                      <p className="text-gray-900">{project.bidCount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created by</p>
                      <p className="text-gray-900 font-mono text-sm">
                        {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>

                {project.status === "Open" && (
                  <div className="card p-6 bg-blue-50 border-blue-200">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">Ready to Bid?</h3>
                    <p className="text-blue-700 text-sm mb-4">
                      This project is currently accepting bids. Submit your proposal to get started.
                    </p>
                    <Link
                      to={`/bid/${projectId}`}
                      className="w-full btn btn-primary"
                    >
                      Submit Bid Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
