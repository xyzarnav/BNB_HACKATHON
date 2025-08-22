import { useProjectCount } from '../hooks/useContract';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import { deployedContracts } from '../contracts/deployedContracts';

export function ContractInteraction() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  // Read from contract
  const { data: projectCount } = useProjectCount();
  
  // Write to contract
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const handleCreateProject = async () => {
    if (!writeContract) return;
    
    try {
      await writeContract({
        address: deployedContracts.TrustChain.address as `0x${string}`,
        abi: deployedContracts.TrustChain.abi,
        functionName: 'createProject',
        args: [title, description, BigInt(budget)],
      });
      setTitle('');
      setDescription('');
      setBudget('');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="contract-interaction">
      <h2>TrustChain Contract</h2>
      
      <div className="stats">
        <p>Total Projects: {projectCount?.toString() || '0'}</p>
      </div>

      <div className="form">
        <h3>Create New Project</h3>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Budget (in wei)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <button 
          onClick={handleCreateProject}
          disabled={isPending || isConfirming || !title || !description || !budget}
        >
          {isPending ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </div>
  );
}
