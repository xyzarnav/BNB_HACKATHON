import React, { useState } from 'react';
import { useProjectDetails, getProjectTypeString } from '../hooks/useProjectDetails';
import { useHasBidded, useIsBidder, useEvaluatedBids, useBid, useProjectBidWinner, useBondForProject, useCompletionLevel, getCompletionPercentage, getNextCompletionLevel, getCompletionLevelName, useMilestoneApproved, useBondStatus, useBondObligor, useBondAmount, getBondStatusName, canApproveMilestone } from '../hooks/useContractRead';
import { useProjectBidsReal } from '../hooks/useProjectBidsReal';
import { useCreateBid, useCreateBidder, useBidEvaluation, useAwardBond, useReleasePayment, useSubmitMilestone, useApproveAuditorMilestone, useCreateProjectDispute, useCreateDispute, useApproveCompletion } from '../hooks/useContractWrite';
import { useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { formatAddress } from '../utils/formatAddress';
import { toast } from 'react-hot-toast';

interface ProjectDetailsProps {
  projectId: number;
}

// Simple BidCard component for displaying bid information
const BidCard: React.FC<{ bidId: number; isWinner: boolean }> = ({ bidId, isWinner }) => {
  const { data: bid } = useBid(bidId);
  
  if (!bid) {
    return (
      <div className="p-3 bg-white rounded border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className={`p-3 bg-white rounded border ${isWinner ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Bid #{bid.bidId}</span>
            {isWinner && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Winner 🏆</span>}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Amount:</span> {formatEther(bid.amount)} BNB
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Bidder:</span> {formatAddress(bid.bidder)}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {bid.accepted ? 'Accepted' : 'Pending'}
        </div>
      </div>
      {bid.proposalIPFHash && (
        <div className="text-xs text-gray-500 mt-2 truncate">
          <span className="font-medium">Proposal:</span> {bid.proposalIPFHash}
        </div>
      )}
    </div>
  );
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId }) => {
  const { projectDetails, isLoading, error } = useProjectDetails(projectId);
  const { address } = useAccount();
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [proposalHash, setProposalHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [showBidsManagement, setShowBidsManagement] = useState(false);

  // Check if user has already bid on this project
  const { data: hasBidded } = useHasBidded(address as `0x${string}`, projectId);
  
  // Check if user is a registered bidder
  const { data: isBidder, isLoading: isBidderLoading } = useIsBidder(address as `0x${string}`);

  // Check if bids have been evaluated
  const { data: bidsEvaluated } = useEvaluatedBids(projectId);
  
  // Get project bids (array of bid IDs) - using real implementation
  const { data: projectBidIds } = useProjectBidsReal(projectId);
  
  // Get winning bid ID if evaluated
  const { data: winningBidId } = useProjectBidWinner(projectId);

  // Get winning bid details if there's a winner
  const { data: winningBid } = useBid(winningBidId ? Number(winningBidId) : 0);

  // Get bond information for progress tracking
  const { data: bondId } = useBondForProject(projectId);
  const { data: completionLevel } = useCompletionLevel(bondId ? Number(bondId) : 0);
  const { data: bondStatus } = useBondStatus(bondId ? Number(bondId) : 0);
  const { data: bondObligor } = useBondObligor(bondId ? Number(bondId) : 0);
  const { data: bondAmount } = useBondAmount(bondId ? Number(bondId) : 0);
  
  // Check milestone approval status for next level
  const nextMilestone = getNextCompletionLevel(Number(completionLevel || 0));
  const { data: isNextMilestoneApproved } = useMilestoneApproved(
    bondId ? Number(bondId) : 0, 
    nextMilestone || 0
  );

  // Hooks for contract interactions
  const { createBid, isPending: isBidPending } = useCreateBid();
  const { createBidder, isPending: isBidderPending } = useCreateBidder();
  const { evaluateBid, isPending: isEvaluating } = useBidEvaluation();
  const { awardBond, isPending: isAwarding } = useAwardBond();
  const { releasePayment, isPending: isReleasingPayment } = useReleasePayment();
  const { submitMilestone, isPending: isSubmittingMilestone } = useSubmitMilestone();
  const { approveMilestone, isPending: isApprovingMilestone } = useApproveAuditorMilestone();
  const { createDispute: createProjectDispute, isPending: isCreatingProjectDispute } = useCreateProjectDispute();
  const { createDispute, isPending: isCreatingDispute } = useCreateDispute();
  const { approveCompletion, isPending: isApprovingCompletion } = useApproveCompletion();

  // State for milestone management
  const [showMilestoneDetails, setShowMilestoneDetails] = useState(false);
  const [milestoneEvidence, setMilestoneEvidence] = useState('');
  const [disputeEvidence, setDisputeEvidence] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);

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
      } catch {
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
    } catch (err) {
      console.error('Error submitting bid:', err);
      toast.error("Failed to submit bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle bid evaluation for project creators
  const handleEvaluateBids = async () => {
    if (!address || address !== projectDetails?.creator) {
      toast.error("Only project creator can evaluate bids");
      return;
    }

    try {
      toast.loading("Evaluating bids...", { id: "evaluate-bids" });
      await evaluateBid(projectId);
      toast.success("Bids evaluated successfully! Winner has been selected.", { id: "evaluate-bids" });
    } catch (err) {
      console.error('Error evaluating bids:', err);
      toast.error("Failed to evaluate bids. Please try again.", { id: "evaluate-bids" });
    }
  };

  // Handle bond awarding for project creators
  const handleAwardBond = async () => {
    if (!address || address !== projectDetails?.creator) {
      toast.error("Only project creator can award bonds");
      return;
    }

    if (!winningBidId || winningBidId === 0n) {
      toast.error("No winning bid found. Please evaluate bids first.");
      return;
    }

    if (!winningBid) {
      toast.error("Could not fetch winning bid details");
      return;
    }

    try {
      toast.loading("Awarding bond to winner...", { id: "award-bond" });
      await awardBond(projectId, Number(winningBidId), winningBid.amount);
      toast.success("Bond awarded successfully! Initial payment sent to winner.", { id: "award-bond" });
    } catch (err) {
      console.error('Error awarding bond:', err);
      toast.error("Failed to award bond. Please try again.", { id: "award-bond" });
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
          <p><span className="font-semibold">Budget:</span> {formatEther(projectDetails.budget)} BNB</p>
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
                  {projectDetails.projectType === 1 ? 'Bid Amount (Fixed Rate)' : 'Bid Amount (BNB)'}
                </label>
                <input
                  type="text"
                  value={projectDetails.projectType === 1 ? formatEther(projectDetails.budget) : bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={projectDetails.projectType === 1 ? 
                    `Fixed at ${formatEther(projectDetails.budget)} BNB` : 
                    'Enter your bid amount'
                  }
                  disabled={projectDetails.projectType === 1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={projectDetails.projectType !== 1}
                />
                {projectDetails.projectType === 1 && (
                  <p className="text-sm text-gray-600 mt-1">
                    This is a fixed-rate project. Your bid amount is automatically set to {formatEther(projectDetails.budget)} BNB.
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

      {/* Debug information - remove in production */}
      {projectDetails && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Debug Info</h3>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>Your Address: {address}</p>
            <p>Project Creator: {projectDetails.creator}</p>
            <p>Is Creator: {address === projectDetails.creator ? 'Yes' : 'No'}</p>
            <p>Bids Evaluated: {bidsEvaluated ? 'Yes' : 'No'}</p>
            <p>Project Bid IDs: {projectBidIds?.length || 0}</p>
            <p>Winning Bid ID: {winningBidId ? Number(winningBidId) : 'None'}</p>
            <p>Project Posted: {projectDetails.posted ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}

      {/* Show message if user is the creator */}
      {address === projectDetails.creator && (
        <div className="mt-6 space-y-4">
          {/* Project Creator Management */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Project Management</h3>
            <p className="text-blue-700 mb-4">
              As the project creator, you can evaluate submitted bids and award the project to the winning bidder.
            </p>
            
            {/* Bid Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{projectBidIds?.length || 0}</div>
                <div className="text-sm text-gray-600">Total Bids</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{bidsEvaluated ? 'Yes' : 'No'}</div>
                <div className="text-sm text-gray-600">Evaluated</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{winningBidId ? Number(winningBidId) : 'None'}</div>
                <div className="text-sm text-gray-600">Winner ID</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{!projectDetails.posted ? 'Awarded' : 'Open'}</div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {/* Always show Evaluate Bids button, but disable if no bids */}
              {projectDetails.posted && !bidsEvaluated && (
                <button
                  onClick={handleEvaluateBids}
                  disabled={isEvaluating || !projectBidIds || projectBidIds.length === 0}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={(!projectBidIds || projectBidIds.length === 0) ? "No bids available to evaluate" : "Evaluate all submitted bids"}
                >
                  {isEvaluating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Evaluating...
                    </div>
                  ) : (
                    `Evaluate Bids ${projectBidIds?.length ? `(${projectBidIds.length})` : '(0)'}`
                  )}
                </button>
              )}

              {/* Always show Award Bond button, but disable if conditions not met */}
              {projectDetails.posted && (
                <button
                  onClick={handleAwardBond}
                  disabled={isAwarding || !bidsEvaluated || !winningBidId}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!bidsEvaluated ? "Please evaluate bids first" : !winningBidId ? "No winner selected" : "Award project to winning bidder"}
                >
                  {isAwarding ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Awarding...
                    </div>
                  ) : (
                    'Award Bond to Winner'
                  )}
                </button>
              )}

              {/* Show Complete Project button if bids evaluated and winner selected */}
              {!projectDetails.posted && winningBidId && (
                <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg border border-blue-200">
                  ✅ Project Awarded to Bid #{Number(winningBidId)}
                </div>
              )}

              <button
                onClick={() => setShowBidsManagement(!showBidsManagement)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showBidsManagement ? 'Hide Bids' : `View All Bids ${projectBidIds?.length ? `(${projectBidIds.length})` : '(0)'}`}
              </button>
            </div>

            {/* Winning Bid Details */}
            {bidsEvaluated && winningBid && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">🏆 Winning Bid</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-green-700">Bid ID:</span> {winningBid.bidId}
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Amount:</span> {formatEther(winningBid.amount)} BNB
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Bidder:</span> {formatAddress(winningBid.bidder)}
                  </div>
                  <div className="md:col-span-3">
                    <span className="font-medium text-green-700">Proposal:</span> {winningBid.proposalIPFHash}
                  </div>
                </div>
              </div>
            )}

            {/* All Bids List */}
            {showBidsManagement && projectBidIds && projectBidIds.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">All Submitted Bids</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {projectBidIds.map((bidId: number) => (
                    <BidCard key={bidId} bidId={bidId} isWinner={Number(winningBidId) === bidId} />
                  ))}
                </div>
              </div>
            )}

            {/* No Bids Message */}
            {projectDetails.posted && (!projectBidIds || projectBidIds.length === 0) && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-600">No bids submitted yet for this project.</p>
                <p className="text-gray-500 text-sm mt-1">Share your project to attract more bidders.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Progress and Completion Section */}
      {winningBidId && winningBid && bondId && (
        <div className="mt-6 space-y-4">
          {/* Progress Section for Everyone */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Project Progress</h3>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-green-700">Completion Progress</span>
                <span className="text-sm font-medium text-green-700">
                  {getCompletionPercentage(Number(completionLevel || 0))}%
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionPercentage(Number(completionLevel || 0))}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-green-600">
                Current Stage: {getCompletionLevelName(Number(completionLevel || 0))}
              </div>
            </div>

            {/* Project Information */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {formatEther(winningBid.amount)} BNB
                </div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {formatEther(BigInt(Math.floor(Number(winningBid.amount) * getCompletionPercentage(Number(completionLevel || 0)) / 100)))} BNB
                </div>
                <div className="text-sm text-gray-600">Paid So Far</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-lg font-bold text-orange-600">
                  {formatAddress(winningBid.bidder)}
                </div>
                <div className="text-sm text-gray-600">Contractor</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-lg font-bold text-purple-600">#{Number(winningBidId)}</div>
                <div className="text-sm text-gray-600">Winning Bid</div>
              </div>
            </div>

            {/* Enhanced Actions for Bidder (Contractor) */}
            {address === winningBid.bidder && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">🔨 Contractor Dashboard</h4>
                
                {getNextCompletionLevel(Number(completionLevel || 0)) !== null ? (
                  <div className="space-y-4">
                    {/* Current Task Overview */}
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="font-medium text-gray-900 mb-2">Current Milestone</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-600">Current Stage:</span>
                          <div className="font-medium text-blue-700">
                            {getCompletionLevelName(Number(completionLevel || 0))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Next Payment:</span>
                          <div className="font-medium text-green-600">
                            {formatEther(BigInt(Math.floor(Number(winningBid.amount) * 20 / 100)))} BNB
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress to Next Milestone */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress to {getCompletionPercentage(getNextCompletionLevel(Number(completionLevel || 0)) || 0)}%</span>
                          <span>Ready to submit?</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: '80%' }} // Simulate work progress
                          ></div>
                        </div>
                      </div>

                      {/* Milestone Submission */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Work Evidence/Description
                          </label>
                          <textarea
                            value={milestoneEvidence}
                            onChange={(e) => setMilestoneEvidence(e.target.value)}
                            placeholder="Describe the work completed for this milestone..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={async () => {
                              try {
                                const nextLevel = getNextCompletionLevel(Number(completionLevel || 0));
                                if (nextLevel !== null && bondId) {
                                  await submitMilestone(Number(bondId), nextLevel);
                                  toast.success(`Milestone submitted for ${getCompletionPercentage(nextLevel)}% completion!`);
                                  setMilestoneEvidence('');
                                }
                              } catch (err) {
                                console.error('Error submitting milestone:', err);
                                toast.error("Failed to submit milestone");
                              }
                            }}
                            disabled={isSubmittingMilestone}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            {isSubmittingMilestone ? 'Submitting...' : `Submit Milestone (${getCompletionPercentage(getNextCompletionLevel(Number(completionLevel || 0)) || 0)}%)`}
                          </button>
                          
                          <button
                            onClick={() => setMilestoneEvidence('')}
                            className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Milestone Guidelines */}
                    <div className="bg-blue-100 p-3 rounded-lg border border-blue-300">
                      <h6 className="font-medium text-blue-900 mb-2">📋 Milestone Guidelines</h6>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Complete the required work for this milestone</li>
                        <li>• Submit evidence of completion above</li>
                        <li>• Wait for project creator approval</li>
                        <li>• Payment will be released automatically upon approval</li>
                        {projectDetails.hasAuditor && <li>• Auditor review may be required</li>}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <h5 className="font-medium text-green-900">Congratulations! Project Completed!</h5>
                        <p className="text-sm text-green-700">You have successfully completed all milestones. Well done!</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Actions for Project Creator */}
            {address === projectDetails.creator && (
              <div className="mt-4 space-y-4">
                {/* Milestone Management Section */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-3">🏗️ Project Creator Dashboard</h4>
                  
                  {/* Current Status Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-sm text-gray-600">Current Stage</div>
                      <div className="font-semibold text-yellow-700">
                        {getCompletionLevelName(Number(completionLevel || 0))}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-sm text-gray-600">Payments Released</div>
                      <div className="font-semibold text-green-600">
                        {formatEther(BigInt(Math.floor(Number(winningBid.amount) * getCompletionPercentage(Number(completionLevel || 0)) / 100)))} BNB
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-sm text-gray-600">Remaining</div>
                      <div className="font-semibold text-blue-600">
                        {formatEther(BigInt(Math.floor(Number(winningBid.amount) * (100 - getCompletionPercentage(Number(completionLevel || 0))) / 100)))} BNB
                      </div>
                    </div>
                  </div>

                  {/* Milestone Actions */}
                  {getNextCompletionLevel(Number(completionLevel || 0)) !== null ? (
                    <div className="space-y-4">
                      {/* Next Milestone Info */}
                      <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-medium text-gray-900 mb-2">Next Milestone</h5>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-600">
                            Progress to {getCompletionPercentage(getNextCompletionLevel(Number(completionLevel || 0)) || 0)}%
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            Payment: {formatEther(BigInt(Math.floor(Number(winningBid.amount) * 20 / 100)))} BNB
                          </span>
                        </div>
                        
                        {/* Milestone Actions */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setShowMilestoneDetails(!showMilestoneDetails)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                          >
                            {showMilestoneDetails ? 'Hide' : 'Show'} Details
                          </button>
                          
                          {/* Release Payment Button */}
                          <button
                            onClick={async () => {
                              try {
                                const nextLevel = getNextCompletionLevel(Number(completionLevel || 0));
                                if (nextLevel !== null && bondId) {
                                  await releasePayment(Number(bondId), nextLevel);
                                  toast.success(`Payment released for ${getCompletionPercentage(nextLevel)}% milestone!`);
                                }
                              } catch (err) {
                                console.error('Error releasing payment:', err);
                                toast.error("Failed to release payment");
                              }
                            }}
                            disabled={isReleasingPayment}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {isReleasingPayment ? 'Processing...' : `Release Payment (${getCompletionPercentage(getNextCompletionLevel(Number(completionLevel || 0)) || 0)}%)`}
                          </button>

                          {/* Approve Milestone Button (if auditor is needed) */}
                          {projectDetails.hasAuditor && (
                            <button
                              onClick={async () => {
                                try {
                                  const nextLevel = getNextCompletionLevel(Number(completionLevel || 0));
                                  if (nextLevel !== null && bondId) {
                                    await approveCompletion(Number(bondId), nextLevel);
                                    toast.success("Milestone approved!");
                                  }
                                } catch (err) {
                                  console.error('Error approving milestone:', err);
                                  toast.error("Failed to approve milestone");
                                }
                              }}
                              disabled={isApprovingCompletion}
                              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                              {isApprovingCompletion ? 'Approving...' : 'Approve Milestone'}
                            </button>
                          )}

                          {/* Create Dispute Button */}
                          <button
                            onClick={() => setShowDisputeForm(!showDisputeForm)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                          >
                            Create Dispute
                          </button>
                        </div>
                      </div>

                      {/* Milestone Details Expansion */}
                      {showMilestoneDetails && (
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <h6 className="font-medium text-gray-900 mb-3">Milestone Requirements</h6>
                          <div className="space-y-2 text-sm text-gray-700">
                            <p>• Contractor must submit evidence of work completion</p>
                            <p>• Review and verify the deliverables meet project requirements</p>
                            {projectDetails.hasAuditor && <p>• Auditor approval may be required before payment release</p>}
                            <p>• Payment will be released automatically upon approval</p>
                          </div>
                          
                          {/* Evidence Input */}
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Milestone Evidence/Notes
                            </label>
                            <textarea
                              value={milestoneEvidence}
                              onChange={(e) => setMilestoneEvidence(e.target.value)}
                              placeholder="Add notes about this milestone completion..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={3}
                            />
                          </div>
                        </div>
                      )}

                      {/* Dispute Form */}
                      {showDisputeForm && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h6 className="font-medium text-red-900 mb-3">Create Dispute</h6>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-red-700 mb-2">
                                Dispute Description
                              </label>
                              <input
                                type="text"
                                value={disputeDescription}
                                onChange={(e) => setDisputeDescription(e.target.value)}
                                placeholder="Brief title/summary of the dispute..."
                                className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-red-700 mb-2">
                                Evidence & Details
                              </label>
                              <textarea
                                value={disputeEvidence}
                                onChange={(e) => setDisputeEvidence(e.target.value)}
                                placeholder="Provide detailed evidence and reasons for the dispute..."
                                className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                rows={4}
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={async () => {
                                  try {
                                    if (bondId && disputeEvidence.trim() && disputeDescription.trim()) {
                                      const fullEvidence = `${disputeDescription}: ${disputeEvidence}`;
                                      await createDispute(Number(bondId), fullEvidence);
                                      toast.success("Dispute created successfully!");
                                      setShowDisputeForm(false);
                                      setDisputeEvidence('');
                                      setDisputeDescription('');
                                    } else {
                                      toast.error("Please provide both description and evidence");
                                    }
                                  } catch (err) {
                                    console.error('Error creating dispute:', err);
                                    toast.error("Failed to create dispute");
                                  }
                                }}
                                disabled={isCreatingDispute || !disputeEvidence.trim() || !disputeDescription.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                {isCreatingDispute ? 'Creating...' : 'Submit Dispute'}
                              </button>
                              <button
                                onClick={() => {
                                  setShowDisputeForm(false);
                                  setDisputeEvidence('');
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🎉</span>
                        <div>
                          <h5 className="font-medium text-green-900">Project Completed Successfully!</h5>
                          <p className="text-sm text-green-700">All milestones have been completed and payments released.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment History Section */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">💰 Payment History</h4>
                  <div className="space-y-2">
                    {[0, 1, 2, 3, 4].map((level) => {
                      const percentage = getCompletionPercentage(level);
                      const amount = BigInt(Math.floor(Number(winningBid.amount) * 20 / 100)); // Each milestone is 20%
                      const isPaid = level <= Number(completionLevel || 0);
                      
                      return (
                        <div key={level} className={`flex justify-between items-center p-2 rounded ${isPaid ? 'bg-green-100 border border-green-300' : 'bg-white border border-gray-200'}`}>
                          <div className="flex items-center space-x-2">
                            <span className={`w-4 h-4 rounded-full ${isPaid ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            <span className="text-sm font-medium">
                              {getCompletionLevelName(level)} - {percentage}%
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className={`font-medium ${isPaid ? 'text-green-700' : 'text-gray-500'}`}>
                              {formatEther(amount)} BNB
                            </span>
                            {isPaid && <span className="text-green-600 ml-2">✓ Paid</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Comprehensive Bond Management Section */}
                {bondId && (
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 mb-3">🔐 Bond Management Dashboard</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Bond Status Card */}
                      <div className="bg-white p-3 rounded border border-indigo-200">
                        <h6 className="font-medium text-indigo-800 mb-2">Bond Status</h6>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Status:</span> 
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                              bondStatus === 0 ? 'bg-blue-100 text-blue-800' :
                              bondStatus === 1 ? 'bg-green-100 text-green-800' :
                              bondStatus === 2 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {getBondStatusName(Number(bondStatus || 0))}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Bond Amount:</span> 
                            <span className="ml-1 text-indigo-700">{formatEther(bondAmount || BigInt(0))} BNB</span>
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Obligor:</span> 
                            <span className="ml-1 text-gray-600">{formatAddress(bondObligor || '')}</span>
                          </p>
                        </div>
                      </div>

                      {/* Milestone Status Card */}
                      <div className="bg-white p-3 rounded border border-indigo-200">
                        <h6 className="font-medium text-indigo-800 mb-2">Current Milestone</h6>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Stage:</span> 
                            <span className="ml-1 text-indigo-700">
                              {getCompletionLevelName(Number(completionLevel || 0))}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Completion:</span> 
                            <span className="ml-1 text-indigo-700">
                              {getCompletionPercentage(Number(completionLevel || 0))}%
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Next Payment:</span> 
                            <span className="ml-1 text-green-600">
                              {formatEther(BigInt(Math.floor(Number(winningBid.amount) * 20 / 100)))} BNB
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Milestone Actions */}
                    <div className="bg-white p-4 rounded border border-indigo-200">
                      <h6 className="font-medium text-indigo-800 mb-3">Milestone Management Actions</h6>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        {/* Milestone Approval Status */}
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm font-medium text-gray-700">Milestone Approved</p>
                          <div className="mt-1">
                            {milestoneApproved ? (
                              <span className="inline-flex items-center space-x-1 text-green-600">
                                <span>✓</span>
                                <span className="text-sm">Yes</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-orange-600">
                                <span>⏳</span>
                                <span className="text-sm">Pending</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Auditor Status */}
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm font-medium text-gray-700">Auditor Review</p>
                          <div className="mt-1">
                            {projectDetails.hasAuditor ? (
                              <span className="inline-flex items-center space-x-1 text-blue-600">
                                <span>👨‍💼</span>
                                <span className="text-sm">Required</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-gray-600">
                                <span>—</span>
                                <span className="text-sm">Not Required</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Payment Status */}
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm font-medium text-gray-700">Payment Ready</p>
                          <div className="mt-1">
                            {milestoneApproved ? (
                              <span className="inline-flex items-center space-x-1 text-green-600">
                                <span>💰</span>
                                <span className="text-sm">Ready</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-gray-600">
                                <span>⏸️</span>
                                <span className="text-sm">Waiting</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-indigo-100">
                        <button
                          onClick={() => setShowMilestoneDetails(!showMilestoneDetails)}
                          className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition-colors"
                        >
                          {showMilestoneDetails ? 'Hide' : 'Show'} Milestone Details
                        </button>
                        
                        {!showDisputeForm && (
                          <button
                            onClick={() => setShowDisputeForm(true)}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                          >
                            Create Dispute
                          </button>
                        )}

                        {projectDetails.hasAuditor && canApproveMilestone(Number(completionLevel || 0), milestoneApproved || false) && (
                          <button
                            onClick={async () => {
                              try {
                                const nextLevel = getNextCompletionLevel(Number(completionLevel || 0));
                                if (nextLevel !== null && bondId) {
                                  await approveCompletion(Number(bondId), nextLevel);
                                  toast.success("Milestone approved by auditor!");
                                }
                              } catch (err) {
                                console.error('Error approving milestone:', err);
                                toast.error("Failed to approve milestone");
                              }
                            }}
                            disabled={isApprovingCompletion}
                            className="px-3 py-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors disabled:opacity-50"
                          >
                            {isApprovingCompletion ? 'Approving...' : 'Approve as Auditor'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
