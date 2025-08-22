const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface ProjectTransaction {
  hash: string;
  type: 'creation' | 'update' | 'bid' | 'completion';
  timestamp: string;
  blockNumber?: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface Project {
  projectId: number;
  title: string;
  description: string;
  creator: string;
  budget: string;
  status: string;
  createdAt: string;
  creationTxHash: string;
  transactions: ProjectTransaction[];
  explorerUrl?: string;
  transactionUrls?: Array<{
    type: string;
    url: string;
    timestamp: string;
    status: string;
  }>;
}

export const saveProject = async (projectData: {
  projectId: number;
  title: string;
  description: string;
  creator: string;
  budget: string;
  txHash: string;
}): Promise<Project> => {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error('Failed to save project');
  }

  return response.json();
};

export const addProjectTransaction = async (
  projectId: number,
  txData: {
    txHash: string;
    type: ProjectTransaction['type'];
    blockNumber?: number;
  }
): Promise<Project> => {
  const response = await fetch(`${API_URL}/projects/${projectId}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(txData),
  });

  if (!response.ok) {
    throw new Error('Failed to add transaction');
  }

  return response.json();
};

export const getProject = async (projectId: number): Promise<Project> => {
  const response = await fetch(`${API_URL}/projects/${projectId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }

  return response.json();
};

export const getAllProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_URL}/projects`);

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  return response.json();
};
