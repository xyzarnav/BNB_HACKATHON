import React, { useState } from 'react';
import { useCreateBid } from '../hooks/useContractWrite';
import { toast } from 'react-hot-toast';
import { parseEther } from 'viem';

interface BidFormProps {
  projectId: number;
  projectType: number;
  budget: bigint;
  onBidSubmitted?: () => void;
}

const BidForm: React.FC<BidFormProps> = ({ projectId, projectType, budget, onBidSubmitted }) => {
  const [amount, setAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const { createBid, isPending } = useCreateBid();

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

      await createBid(
        projectId,
        proposal,
        parseEther(amount)
      );

      toast.success('Bid submitted successfully!');
      setAmount('');
      setProposal('');
      onBidSubmitted?.();
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
    </div>
  );
};

export default BidForm;
