import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useCreateProject } from "../hooks/useContractWrite";
import { toast } from "react-hot-toast";
import { parseEther } from "viem";
import QRCodeWithLink from "../components/QRCodeWithLink";
import { generateTransactionExplorerUrl } from "../utils/blockExplorer";

// Project classification constants to match the smart contract
const ProjectClassification = {
  MaxRate: 0,
  FixRate: 1,
  MinRate: 2
} as const;

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { createProject, isPending, error, hash } = useCreateProject();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timePeriod: "", // in seconds
    budget: "",
    projectType: ProjectClassification.FixRate,
  });
  const [transactionHash, setTransactionHash] = useState<string>("");

  // Watch for transaction hash changes from the hook
  useEffect(() => {
    if (hash && hash !== transactionHash) {
      console.log('New transaction hash detected:', hash);
      setTransactionHash(hash);
      toast.success("Transaction confirmed! Hash: " + hash.slice(0, 10) + "...");
    }
  }, [hash, transactionHash]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!formData.title || !formData.description || !formData.budget || !formData.timePeriod) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Convert budget to wei using parseEther
      const budgetInWei = parseEther(formData.budget);
      
      // Convert time period to seconds
      const timePeriodInSeconds = parseInt(formData.timePeriod) * 24 * 60 * 60; // Convert days to seconds

      await createProject(
        formData.title,
        formData.description,
        timePeriodInSeconds,
        budgetInWei,
        parseInt(formData.projectType.toString())
      );

      console.log('Transaction submitted, waiting for hash...');
      console.log('Current hook hash:', hash);
      
      // The transaction hash should be available in the hash from the hook
      if (hash) {
        console.log('Using transaction hash from hook:', hash);
        setTransactionHash(hash);
        toast.success(`Transaction submitted! Hash: ${hash.slice(0, 10)}...`);
      } else {
        console.log('Transaction submitted, hash will be available shortly');
        toast.success("Transaction submitted successfully! Hash will appear shortly...");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Wallet Not Connected
            </h1>
            <p className="text-gray-600 mb-8">
              Please connect your wallet to create a new project.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create New Project
            </h1>
            <p className="text-xl text-gray-600">
              Submit a new government project for bidding on the blockchain
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">Error: {error.message}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the project in detail"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (BNB) *
                  </label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700 mb-2">
                    Time Period (Days) *
                  </label>
                  <input
                    type="number"
                    id="timePeriod"
                    name="timePeriod"
                    value={formData.timePeriod}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter number of days"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type *
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value={ProjectClassification.MaxRate}>Max Rate (Highest Bid Wins)</option>
                    <option value={ProjectClassification.FixRate}>Fix Rate (Fixed Budget)</option>
                    <option value={ProjectClassification.MinRate}>Min Rate (Lowest Bid Wins)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isPending ? "Creating Project..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>

          {/* Transaction Success Section */}
          {transactionHash && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  🎉 Project Creation Transaction Submitted!
                </h3>
                <p className="text-green-700 mb-6">
                  Your project has been submitted to the blockchain. Use the QR code or link below to track your transaction.
                </p>
                
                <div className="flex justify-center mb-4">
                  <QRCodeWithLink
                    value={generateTransactionExplorerUrl(transactionHash)}
                    label={`TX: ${transactionHash.slice(0, 8)}...`}
                    explorerUrl={generateTransactionExplorerUrl(transactionHash)}
                    size={150}
                  />
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600 mb-2">Transaction Hash:</p>
                  <p className="font-mono text-sm break-all text-gray-800 bg-gray-100 p-2 rounded">
                    {transactionHash}
                  </p>
                  <div className="mt-3 flex justify-center">
                    <a
                      href={generateTransactionExplorerUrl(transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View on BscScan →
                    </a>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setTransactionHash("");
                      setFormData({
                        title: "",
                        description: "",
                        timePeriod: "",
                        budget: "",
                        projectType: ProjectClassification.FixRate,
                      });
                    }}
                    className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    Create Another Project
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;