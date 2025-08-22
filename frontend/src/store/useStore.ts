import { create } from 'zustand';

interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  status: string;
  deadline: string;
  bids: number;
  creator: string;
  category: string;
}

interface Bid {
  id: number;
  projectId: number;
  projectTitle: string;
  amount: string;
  status: string;
  submittedDate: string;
}

interface User {
  address: string;
  reputation: number;
  totalBids: number;
  completedProjects: number;
}

interface AppState {
  // State
  projects: Project[];
  bids: Bid[];
  user: User | null;
  loading: boolean;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: number, updates: Partial<Project>) => void;
  setBids: (bids: Bid[]) => void;
  addBid: (bid: Bid) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Computed
  getActiveProjects: () => Project[];
  getUserBids: () => Bid[];
  getUserProjects: () => Project[];
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  projects: [],
  bids: [],
  user: null,
  loading: false,

  // Actions
  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(project =>
      project.id === id ? { ...project, ...updates } : project
    )
  })),
  
  setBids: (bids) => set({ bids }),
  
  addBid: (bid) => set((state) => ({
    bids: [...state.bids, bid]
  })),
  
  setUser: (user) => set({ user }),
  
  setLoading: (loading) => set({ loading }),

  // Computed values
  getActiveProjects: () => {
    const { projects } = get();
    return projects.filter(project => project.status === 'Active' || project.status === 'Bidding');
  },

  getUserBids: () => {
    const { bids, user } = get();
    if (!user) return [];
    return bids.filter(bid => bid.projectId); // In real app, filter by user address
  },

  getUserProjects: () => {
    const { projects, user } = get();
    if (!user) return [];
    return projects.filter(project => project.creator === user.address);
  },
}));

