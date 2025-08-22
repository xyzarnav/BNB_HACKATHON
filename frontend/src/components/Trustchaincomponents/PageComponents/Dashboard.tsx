import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  useProjectCount,
  useBidCount,
} from "../../../hooks/useContractRead";
import { getAllProjects, type Project } from "../../../services/projectService";
import { QRCodeSVG } from "qrcode.react";

interface DashboardProject extends Project {
  showQR: boolean;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  useAccount(); // Keep the connection active

  // Read counts from blockchain
  const { data: projectCount } = useProjectCount();
  const { data: bidCount } = useBidCount();

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getAllProjects();
        setProjects(fetchedProjects.map(p => ({ ...p, showQR: false })));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects from backend');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Toggle QR code visibility
  const toggleQR = (projectId: number) => {
    setProjects(projects.map(p => 
      p.projectId === projectId ? { ...p, showQR: !p.showQR } : p
    ));
  };

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
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
            <p className="text-3xl font-bold text-blue-600">{projectCount?.toString() || '0'}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Total Bids</h2>
            <p className="text-3xl font-bold text-green-600">{bidCount?.toString() || '0'}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Active Projects</h2>
            <p className="text-3xl font-bold text-purple-600">
              {projects.filter(p => p.status === 'active').length}
            </p>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">My Projects</h2>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No projects found</p>
                <Link to="/create-project" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                  Create New Project →
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.projectId} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">
                            Creator: {project.creator}
                          </p>
                          <p className="text-sm text-gray-500">
                            Budget: {project.budget}
                          </p>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(project.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          project.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                        <button
                          onClick={() => toggleQR(project.projectId)}
                          className="text-blue-600 hover:text-blue-700 text-sm mt-4"
                        >
                          {project.showQR ? 'Hide QR' : 'Show QR'}
                        </button>
                      </div>
                    </div>

                    {/* QR Code and Transaction Links */}
                    {project.showQR && (
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <div className="flex items-start space-x-6">
                          {/* QR Code */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <QRCodeSVG value={project.explorerUrl || ''} size={160} />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              Creation Transaction
                            </p>
                          </div>

                          {/* Transaction List */}
                          <div className="flex-1">
                            <h4 className="text-lg font-medium mb-4">Transaction History</h4>
                            <div className="space-y-3">
                              {project.transactionUrls?.map((tx, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(tx.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                  <a
                                    href={tx.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                  >
                                    View on Explorer →
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex space-x-4">
                      <Link
                        to={`/project/${project.projectId}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                      {project.status === 'active' && (
                        <Link
                          to={`/bid/${project.projectId}`}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Submit Bid →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;