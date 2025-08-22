import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  useActiveProjects as useActiveProjectsHook,
  type Project as BlockchainProject,
} from "../../../hooks/useContractRead";
import { QRCodeSVG } from "qrcode.react";
import { deployedContracts } from "../../../contracts/deployedContracts";

interface ActiveProject extends BlockchainProject {
  showQR: boolean;
  formattedBudget: string;
  formattedDeadline: string;
}

const formatBigIntToBNB = (value: bigint): string => {
  return (Number(value) / 10 ** 18).toFixed(2) + " BNB";
};

const formatTimestamp = (value: bigint): string => {
  return new Date(Number(value) * 1000).toLocaleDateString();
};

const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getBSCScanUrl = (projectId: number): string => {
  const network = import.meta.env.VITE_NETWORK || 'testnet';
  const baseUrl = network === 'mainnet' 
    ? 'https://bscscan.com'
    : 'https://testnet.bscscan.com';
  return `${baseUrl}/address/${deployedContracts.TrustChain.address}?a=${projectId}`;
};

const ActiveProjects: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ActiveProject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { address } = useAccount();

  // Read active projects from blockchain
  const { data: activeProjects, isLoading: isProjectsLoading, error: projectsError } = useActiveProjectsHook();

  // Process projects data
  useEffect(() => {
    if (projectsError) {
      console.error('Error loading projects:', projectsError);
      setError('Failed to load projects from blockchain');
      setLoading(false);
      return;
    }

    if (!isProjectsLoading && activeProjects) {
      try {
        console.log('Processing projects:', activeProjects);
        const processedProjects: ActiveProject[] = activeProjects.map(project => ({
          ...project,
          showQR: false,
          formattedBudget: formatBigIntToBNB(project.budget),
          formattedDeadline: formatTimestamp(project.deadline),
        }));
        setProjects(processedProjects);
        setFilteredProjects(processedProjects);
        setLoading(false);
      } catch (err) {
        console.error('Error processing projects:', err);
        setError('Error processing blockchain data');
        setLoading(false);
      }
    }
  }, [activeProjects, projectsError, isProjectsLoading]);

  // Filter projects based on search
  useEffect(() => {
    let filtered = [...projects];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.creator.toLowerCase().includes(term)
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  // Toggle QR code visibility
  const toggleQR = (projectId: number) => {
    setFilteredProjects(projects.map(p => 
      p.projectId === projectId ? { ...p, showQR: !p.showQR } : p
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading active projects...</p>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Active Projects</h1>
          <Link 
            to="/create-project" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Project
          </Link>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search active projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No active projects found</p>
                <Link to="/create-project" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                  Create your first project →
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <div key={project.projectId} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        
                        {/* Project Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{project.formattedBudget}</p>
                            <p className="text-sm text-gray-500">Budget</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-lg font-semibold text-green-600">
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Status</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-lg font-semibold">#{Number(project.projectId)}</p>
                            <p className="text-sm text-gray-500">Project ID</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-lg font-semibold">{project.formattedDeadline}</p>
                            <p className="text-sm text-gray-500">Deadline</p>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500 flex items-center">
                            <span className="font-medium mr-2">Creator:</span>
                            {formatAddress(project.creator)}
                          </p>
                          {project.hasAuditor && (
                            <p className="text-sm text-gray-500 flex items-center">
                              <span className="font-medium mr-2">Auditor:</span>
                              {formatAddress(project.auditor)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Side Actions */}
                      <div className="flex flex-col items-end ml-4 space-y-2">
                        <Link
                          to={`/project/${Number(project.projectId)}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                        <button
                          onClick={() => toggleQR(project.projectId)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          {project.showQR ? 'Hide QR' : 'Show QR Code'}
                        </button>
                        <a 
                          href={getBSCScanUrl(project.projectId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View on Explorer
                        </a>
                      </div>
                    </div>

                    {/* QR Code Section */}
                    {project.showQR && (
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <div className="flex items-start space-x-6">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <QRCodeSVG 
                              value={getBSCScanUrl(project.projectId)} 
                              size={160} 
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              Scan to view on BSCScan
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-4">
                      {address && address.toLowerCase() !== project.creator.toLowerCase() && (
                        <Link
                          to={`/bid/${Number(project.projectId)}`}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Submit Bid
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Active Projects</h2>
            <p className="text-3xl font-bold text-green-600">
              {projects.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Total Value</h2>
            <p className="text-3xl font-bold text-purple-600">
              {projects.reduce((sum, p) => sum + parseFloat(p.formattedBudget), 0).toFixed(2)} BNB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveProjects;