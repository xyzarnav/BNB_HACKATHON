import React, { useState } from 'react';
import { useProjectDetails, getProjectTypeString } from '../hooks/useProjectDetails';
import { useHasBidded, useIsBidder } from '../hooks/useContractRead';
import { useCreateBid, useCreateBidder } from '../hooks/useContractWrite';
import { useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { formatAddress } from '../utils/formatAddress';

interface ProjectDetailsProps {
  projectId: number;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId }) => {
  const { projectDetails, isLoading, error } = useProjectDetails(projectId);
  const { address } = useAccount();
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [proposalHash, setProposalHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidSubmitted, setBidSubmitted] = useState(false);

  // Check if user has already bid on this project
  const { data: hasBidded } = useHasBidded(address as `0x${string}`, projectId);
  
  // Check if user is a registered bidder
  const { data: isBidder, isLoading: isBidderLoading } = useIsBidder(address as `0x${string}`);

  // Hooks for contract interactions
  const { createBid, isPending: isBidPending } = useCreateBid();
  const { createBidder, isPending: isBidderPending } = useCreateBidder();

  if (isLoading) {
    return <div className="p-4">Loading project details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading project details: {error.message}</div>;
  }

  if (!projectDetails) {
    return <div className="p-4">No project details found</div>;
  }

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !proposalHash) return;

    // For fixed-rate projects, bid amount is not required as it's fixed
    if (projectDetails.projectType !== 1 && !bidAmount) return;

    // Validate bid amount for non-fixed-rate projects
    if (projectDetails.projectType !== 1) {
      try {
        const amount = parseEther(bidAmount);
        if (amount <= 0n) {
          alert('Bid amount must be greater than 0');
          return;
        }
      } catch (error) {
        alert('Please enter a valid bid amount');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // If user is not a bidder, create bidder first
      if (!isBidder) {
        await createBidder();
        // Wait a bit for the transaction to be processed
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Submit the bid
      const amount = projectDetails.projectType === 1 ? projectDetails.budget : parseEther(bidAmount);
      await createBid(projectId, proposalHash, amount);
      
      setShowBidForm(false);
      setBidAmount('');
      setProposalHash('');
      setBidSubmitted(true);
    } catch (error) {
      console.error('Error submitting bid:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canBid = address && 
                 address !== projectDetails.creator && 
                 projectDetails.posted && 
                 !projectDetails.isLate && 
                 !hasBidded &&
                 (isBidder !== false) && // Allow bidding if user is a bidder or if we're still checking
                 !isBidderLoading; // Don't show bidding section while loading bidder status

  const isPending = isBidPending || isBidderPending;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{projectDetails.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p><span className="font-semibold">Budget:</span> {formatEther(projectDetails.budget)} ETH</p>
          <p><span className="font-semibold">Project Type:</span> {getProjectTypeString(projectDetails.projectType)}</p>
          <p><span className="font-semibold">Creator:</span> {formatAddress(projectDetails.creator)}</p>
          <p><span className="font-semibold">Status:</span> {projectDetails.posted ? 'Active' : 'Closed'}</p>
          <p><span className="font-semibold">Time Period:</span> {Number(projectDetails.timePeriod)} seconds</p>
          <p><span className="font-semibold">Deadline:</span> {new Date(Number(projectDetails.deadline) * 1000).toLocaleString()}</p>
          {projectDetails.isLate && <p className="text-red-500">Project is past deadline</p>}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Description:</h3>
          <p className="whitespace-pre-wrap">{projectDetails.description}</p>
          
          {projectDetails.bidWinner && (
            <p className="mt-4">
              <span className="font-semibold">Winning Bid ID:</span> {Number(projectDetails.bidWinner)}
            </p>
          )}
        </div>
      </div>

      {/* Bidding Section */}
      {!address && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-800">
            <span className="font-semibold">Please connect your wallet to participate in this project.</span>
          </p>
          <p className="text-yellow-700 mt-1">
            You need to connect your wallet to view bidding options and submit proposals.
          </p>
          <p className="text-yellow-600 mt-1 text-sm">
            Connect your wallet using the button in the top navigation.
          </p>
        </div>
      )}

      {address && address !== projectDetails.creator && projectDetails.posted && !projectDetails.isLate && !hasBidded && !isBidderLoading && isBidder === false && (
        <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-orange-800">
            <span className="font-semibold">You need to register as a bidder first.</span>
          </p>
          <p className="text-orange-700 mt-1">
            Click the "Register & Participate" button below to automatically register as a bidder and submit your bid.
          </p>
        </div>
      )}

      {canBid && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900">Participate in this Project</h3>
            {!showBidForm && (
              <button
                onClick={() => setShowBidForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isPending || isBidderLoading}
              >
                {isPending ? 'Processing...' : (isBidderLoading ? 'Loading...' : (isBidder ? 'Participate in this Bid' : 'Register & Participate'))}
              </button>
            )}
          </div>

          {showBidForm && (
            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {projectDetails.projectType === 1 ? 'Bid Amount (Fixed Rate)' : 'Bid Amount (ETH)'}
                </label>
                <input
                  type="text"
                  value={projectDetails.projectType === 1 ? formatEther(projectDetails.budget) : bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={projectDetails.projectType === 1 ? 
                    `Fixed at ${formatEther(projectDetails.budget)} ETH` : 
                    'Enter your bid amount'
                  }
                  disabled={projectDetails.projectType === 1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={projectDetails.projectType !== 1}
                />
                {projectDetails.projectType === 1 && (
                  <p className="text-sm text-gray-600 mt-1">
                    This is a fixed-rate project. Your bid amount is automatically set to {formatEther(projectDetails.budget)} ETH.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposal IPFS Hash
                </label>
                <input
                  type="text"
                  value={proposalHash}
                  onChange={(e) => setProposalHash(e.target.value)}
                  placeholder="Enter your proposal IPFS hash"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  Upload your proposal document to IPFS and provide the hash here.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting || isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting || isPending ? 'Submitting...' : 'Submit Bid'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBidForm(false);
                    setBidAmount('');
                    setProposalHash('');
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Show success message after bid submission */}
      {bidSubmitted && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-800">
            <span className="font-semibold">Your bid has been submitted successfully! 🎉</span>
          </p>
          <p className="text-green-700 mt-1">
            The project creator will review all bids and select a winner.
          </p>
          <p className="text-green-600 mt-1 text-sm">
            You can now view this project in your "Your Bids" section.
          </p>
        </div>
      )}

      {/* Show message if user has already bid */}
      {hasBidded && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-800">
            <span className="font-semibold">You have already submitted a bid for this project.</span>
          </p>
          <p className="text-yellow-700 mt-1">
            You cannot submit multiple bids for the same project.
          </p>
          <p className="text-yellow-600 mt-1 text-sm">
            Wait for the project creator to evaluate all bids and select a winner.
          </p>
        </div>
      )}

      {/* Show message if user is the creator */}
      {address === projectDetails.creator && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">
            <span className="font-semibold">You cannot bid on your own project.</span>
          </p>
          <p className="text-gray-600 mt-1">
            As the project creator, you can review bids and select a winner.
          </p>
          <p className="text-gray-500 mt-1 text-sm">
            Use the bid evaluation function to select the winning bidder.
          </p>
        </div>
      )}

      {/* Show message if project is closed or late */}
      {(!projectDetails.posted || projectDetails.isLate) && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">
            <span className="font-semibold">
              {!projectDetails.posted ? 'This project is closed for bidding.' : 'This project is past the deadline.'}
            </span>
          </p>
          {projectDetails.isLate && (
            <p className="text-red-700 mt-1">
              The bidding deadline was {new Date(Number(projectDetails.deadline) * 1000).toLocaleString()}
            </p>
          )}
          {!projectDetails.posted && (
            <p className="text-red-700 mt-1">
              This project is no longer accepting new bids.
            </p>
          )}
        </div>
      )}

      {projectDetails.logs && projectDetails.logs.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Project Activity Log:</h3>
          <div className="space-y-2">
            {projectDetails.logs.map((log, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded">
                <p><span className="font-semibold">Action:</span> {log.action}</p>
                <p><span className="font-semibold">By:</span> {formatAddress(log.actor)}</p>
                <p><span className="font-semibold">Time:</span> {new Date(Number(log.timestamp) * 1000).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
