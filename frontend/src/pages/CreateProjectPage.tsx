import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useWriteContract } from "wagmi";
import { deployedContracts } from "../contracts/deployedContracts";
import { toast } from "react-hot-toast";

// Enum to match the smart contract's ProjectClassification
enum ProjectClassification {
  MaxRate = 0,
  FixRate = 1,
  MinRate = 2
}

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timePeriod: "", // in seconds
    budget: "",
    projectType: ProjectClassification.FixRate,
  });

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
      // Convert budget to wei
      const budgetInWei = BigInt(parseFloat(formData.budget) * 10 ** 18);
      
      // Convert time period to seconds
      const timePeriodInSeconds = parseInt(formData.timePeriod) * 24 * 60 * 60; // Convert days to seconds

      writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'createProject',
        args: [
          formData.title,
          formData.description,
          BigInt(timePeriodInSeconds),
          budgetInWei,
          parseInt(formData.projectType.toString())
        ],
      });

      toast.success("Project creation transaction submitted!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    }
  };

  if (!isConnected) {
    return (
      <Layout>
        <div className="pt-20">
          <div className="container py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Wallet Not Connected
              </h1>
              <p className="text-gray-600 mb-8">
                Please connect your wallet to create a new project.
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
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20">
        <div className="container py-16">
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProjectPage;