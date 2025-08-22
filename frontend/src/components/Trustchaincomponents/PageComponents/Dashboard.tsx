import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  useProjectCount,
  useBidCount,
  useActiveProjects,
  useUserBids,
  type Project as BlockchainProject,
  type Bid as BlockchainBid,
} from "../../../hooks/useContractRead";
import { QRCodeSVG } from "qrcode.react";
import { deployedContracts } from "../../../contracts/deployedContracts";

interface DashboardProject extends BlockchainProject {
  showQR: boolean;
  formattedBudget: string;
  formattedDeadline: string;
}

interface DashboardBid extends BlockchainBid {
  formattedAmount: string;
  projectTitle: string;
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

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [bids, setBids] = useState<DashboardBid[]>([]);
  const { address } = useAccount();

  // Read data from blockchain
  console.log('Current wallet address:', address);
  
  const { data: projectCount, isLoading: isProjectCountLoading } = useProjectCount();
  console.log('Project count:', projectCount?.toString());
  
  const { data: bidCount, isLoading: isBidCountLoading } = useBidCount();
  console.log('Bid count:', bidCount?.toString());
  
  const { data: activeProjects, isLoading: isProjectsLoading, error: activeProjectsError } = useActiveProjects();
  console.log('Active projects loading:', isProjectsLoading);
  console.log('Active projects error:', activeProjectsError);
  
  const { data: userBids, isLoading: isBidsLoading, error: userBidsError } = useUserBids(address as `0x${string}`);
  console.log('User bids loading:', isBidsLoading);
  console.log('User bids error:', userBidsError);

  // Process active projects
  useEffect(() => {
    if (!isProjectsLoading && activeProjects) {
      try {
        console.log('Processing active projects:', activeProjects);
        
        // Filter and process projects
        const processedProjects: DashboardProject[] = activeProjects
          .filter(project => project && typeof project === 'object' && project.posted) // Only active projects
          .map((project: BlockchainProject) => {
            console.log('Processing project:', project);
            return {
              ...project,
              showQR: false,
              formattedBudget: formatBigIntToBNB(project.budget),
              formattedDeadline: formatTimestamp(project.deadline),
            };
          });

        console.log('Processed projects:', processedProjects);
        setProjects(processedProjects);
      } catch (err) {
        console.error('Error processing projects:', err);
        setError(`Error processing blockchain data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
      setLoading(false);
    }
  }, [activeProjects, isProjectsLoading]);

  // Process user bids
  useEffect(() => {
    if (userBidsError) {
      console.error('Error loading user bids:', userBidsError);
      return;
    }

    if (!isBidsLoading && userBids && address) {
      try {
        console.log('Processing bids:', userBids);
        const processedBids: DashboardBid[] = (userBids as unknown as BlockchainBid[])
          .filter(bid => bid.bidder.toLowerCase() === address.toLowerCase())
          .map(bid => ({
            ...bid,
            formattedAmount: formatBigIntToBNB(bid.amount),
            projectTitle: `Project ${bid.projectId}`, // You might want to fetch actual titles
          }));
        setBids(processedBids);
      } catch (err) {
        console.error('Error processing bids:', err);
      }
    }
  }, [userBids, userBidsError, address, isBidsLoading]);

  // Update loading state based on all data fetching states
  useEffect(() => {
    const isLoading = Boolean(isProjectCountLoading || isBidCountLoading || isProjectsLoading || (address && isBidsLoading));
    setLoading(isLoading);
  }, [isProjectCountLoading, isBidCountLoading, isProjectsLoading, isBidsLoading, address]);

  // Toggle QR code visibility
  const toggleQR = (projectId: number) => {
    setProjects(projects.map(p => 
      p.projectId === projectId ? { ...p, showQR: !p.showQR } : p
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Projects...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching data from blockchain</p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show empty state when no projects
  if (!loading && (!projects || projects.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
          <svg
            className="mx-auto h-24 w-24 text-gray-400 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Active Projects</h2>
          <p className="text-gray-600 mb-6">
            There are currently no active projects available. Check back later or create a new project to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/create-project" 
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors"
            >
              Create New Project
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rest of the component remains the same...
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
            <p className="text-3xl font-bold text-purple-600">{projects.length}</p>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Active Projects</h2>
              <Link 
                to="/create-project" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Project
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No active projects found</p>
                <Link to="/create-project" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                  Create your first project →
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
                            Creator: {formatAddress(project.creator)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Budget: {project.formattedBudget}
                          </p>
                          <p className="text-sm text-gray-500">
                            Deadline: {project.formattedDeadline}
                          </p>
                          {project.hasAuditor && (
                            <p className="text-sm text-gray-500">
                              Auditor: {formatAddress(project.auditor)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          project.posted
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.posted ? 'Active' : 'Draft'}
                        </span>
                        <Link
                          to={`/project/${Number(project.projectId)}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                        <button
                          onClick={() => toggleQR(project.projectId)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          {project.showQR ? 'Hide QR' : 'Show QR'}
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
                              View on BSCScan
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-4">
                      {project.posted && address && address.toLowerCase() !== project.creator.toLowerCase() && (
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

        {/* My Bids Section */}
        {address && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">My Bids</h2>
              {bids.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">You haven't submitted any bids yet</p>
                  <Link to="/active-projects" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                    Browse Active Projects →
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
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bids.map((bid) => (
                        <tr key={bid.bidId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {bid.projectTitle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {bid.formattedAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              bid.accepted
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {bid.accepted ? 'Accepted' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;