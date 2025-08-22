import { useProjectCount } from '../hooks/useContractRead';
import { useCreateProject } from '../hooks/useContractWrite';
import { useState } from 'react';
import { parseEther } from 'viem';

export function ContractInteraction() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [timePeriod, setTimePeriod] = useState('30'); // Default 30 days
  const [projectType, setProjectType] = useState('0'); // Default project type

  // Read from contract
  const { data: projectCount } = useProjectCount();
  
  // Write to contract
  const { createProject, isPending, error } = useCreateProject();

  const handleCreateProject = async () => {
    if (!title || !description || !budget || !timePeriod) return;
    
    try {
      const budgetInWei = parseEther(budget); // Convert ETH/BNB to wei
      await createProject(
        title,
        description,
        parseInt(timePeriod),
        budgetInWei,
        parseInt(projectType)
      );
      
      // Clear form on success
      setTitle('');
      setDescription('');
      setBudget('');
      setTimePeriod('30');
      setProjectType('0');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="contract-interaction p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">TrustChain Contract</h2>
      
      <div className="stats mb-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-lg">Total Projects: <span className="font-semibold">{projectCount?.toString() || '0'}</span></p>
      </div>

      <div className="form space-y-4">
        <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error.message}
          </div>
        )}

        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="number"
          step="0.01"
          placeholder="Budget (in BNB/ETH)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="number"
          placeholder="Time Period (days)"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <select
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="0">Infrastructure</option>
          <option value="1">Healthcare</option>
          <option value="2">Education</option>
          <option value="3">Transportation</option>
          <option value="4">Other</option>
        </select>
        
        <button 
          onClick={handleCreateProject}
          disabled={isPending || !title || !description || !budget || !timePeriod}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            isPending || !title || !description || !budget || !timePeriod
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isPending ? 'Creating Project...' : 'Create Project'}
        </button>
      </div>
    </div>
  );
}
