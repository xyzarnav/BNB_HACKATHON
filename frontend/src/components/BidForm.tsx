import React, { useState, useEffect } from 'react';
import { useCreateBid } from '../hooks/useContractWrite';
import { useMLContract } from '../hooks/useMLContract';
import { toast } from 'react-hot-toast';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import RiskAssessment from './MLComponents/RiskAssessment';

interface BidFormProps {
  projectId: number;
  projectType: number;
  budget: bigint;
  contractAddress: string;
  onBidSubmitted?: () => void;
}

const BidForm: React.FC<BidFormProps> = ({ projectId, projectType, budget, contractAddress, onBidSubmitted }) => {
  const [amount, setAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const [currentBidId, setCurrentBidId] = useState<number | null>(null);
  
  const { createBid, isPending } = useCreateBid();
  const { address } = useAccount();
  const { performCompleteAssessment, isSubmittingAssessment, assessmentError } = useMLContract(contractAddress);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !proposal) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // For fixed rate projects, amount must match budget
      if (projectType === 1) { // FixRate
        if (parseEther(amount) !== budget) {
          toast.error('For fixed rate projects, bid amount must match the project budget');
          return;
        }
      }

      const bidResult = await createBid(
        projectId,
        proposal,
        parseEther(amount)
      );

      // Get the bid ID from the transaction result
      if (bidResult && bidResult.hash) {
        // For demo purposes, we'll use a timestamp-based ID
        // In production, you'd parse this from the transaction receipt
        const bidId = Math.floor(Date.now() / 1000);
        setCurrentBidId(bidId);
        
        // Show risk assessment after successful bid
        setShowRiskAssessment(true);
        toast.success('Bid submitted successfully! Now performing AI risk assessment...');
      } else {
        toast.success('Bid submitted successfully!');
        setAmount('');
        setProposal('');
        onBidSubmitted?.();
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Failed to submit bid. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Your Bid</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Bid Amount (ETH) {projectType === 1 && <span className="text-red-500">*Must match project budget</span>}
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="amount"
              step="0.000000000000000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter bid amount"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="proposal" className="block text-sm font-medium text-gray-700">
            Proposal Details
          </label>
          <div className="mt-1">
            <textarea
              id="proposal"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your proposal details or IPFS hash"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting Bid...
            </div>
          ) : (
            'Submit Bid'
          )}
        </button>
      </form>

      {/* ML Risk Assessment Section */}
      {showRiskAssessment && currentBidId && (
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              🤖 AI Risk Assessment
            </h4>
            <button
              onClick={() => setShowRiskAssessment(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <RiskAssessment
            onAssessmentComplete={async (assessment) => {
              try {
                // Submit assessment to blockchain
                await performCompleteAssessment(
                  {
                    bidder_address: address || '',
                    bid_type: projectType === 0 ? 'MinRate' : projectType === 1 ? 'FixRate' : 'MaxRate',
                    bid_amount: parseFloat(amount),
                    project_budget: Number(budget) / 1e18
                  },
                  currentBidId
                );
                
                toast.success('Risk assessment completed and stored on blockchain!');
                setShowRiskAssessment(false);
                setAmount('');
                setProposal('');
                onBidSubmitted?.();
              } catch (error: any) {
                toast.error(`Risk assessment failed: ${error.message}`);
              }
            }}
            className="border border-gray-200 rounded-lg"
          />
          
          {assessmentError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              ❌ {assessmentError}
            </div>
          )}
          
          {isSubmittingAssessment && (
            <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">
              🔄 Submitting risk assessment to blockchain...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BidForm;
