import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import {
  useProjectCount,
  useBidCount,
  useProject,
  useBid,
  formatBigIntToEther,
  formatAddress,
  formatTimestamp,
  type Project as BlockchainProject,
  type Bid as BlockchainBid,
} from "../../../hooks/useContract";

// ... [keep the interfaces as they are]
interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  status: string;
  deadline: string;
  bids: number;
  creator: string;
  posted: boolean;
}

interface Bid {
  id: number;
  projectId: number;
  projectTitle: string;
  amount: string;
  status: string;
  submittedDate: string;
  bidder: string;
  accepted: boolean;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  // Read counts from blockchain
  const { data: projectCount, error: projectCountError } = useProjectCount();
  const { data: bidCount, error: bidCountError } = useBidCount();

  // Fetch all projects from blockchain
  const fetchAllProjects = async () => {
    console.log("Fetching all projects...");
    console.log("Project count:", projectCount);

    if (!projectCount) {
      console.log("No project count available");
      return;
    }

    const projectCountNum = Number(projectCount);
    const fetchedProjects: Project[] = [];
    const projectPromises: Promise<void>[] = [];

    for (let i = 1; i <= projectCountNum; i++) {
      const projectId = i;
      console.log(`Fetching project ${projectId}...`);

      const promise = (async () => {
        try {
          const { data: projectData } = useProject(projectId);
          console.log(`Project ${projectId} data:`, projectData);

          if (projectData) {
            const project = projectData as unknown as BlockchainProject;
            fetchedProjects.push({
              id: projectId,
              title: project.title || `Project ${projectId}`,
              description: project.description || "No description available",
              budget: formatBigIntToEther(project.budget) + " BNB",
              status: project.posted ? "Active" : "Draft",
              deadline: formatTimestamp(project.deadline),
              bids: 0,
              creator: project.creator,
              posted: project.posted,
            });
            console.log(`Successfully processed project ${projectId}`);
          }
        } catch (error) {
          console.error(`Error fetching project ${projectId}:`, error);
        }
      })();

      projectPromises.push(promise);
    }

    try {
      await Promise.all(projectPromises);
      console.log("All projects fetched:", fetchedProjects);
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch all projects");
    }
  };

  // Fetch all bids from blockchain
  const fetchAllBids = async () => {
    console.log("Fetching all bids...");
    console.log("Bid count:", bidCount);

    if (!bidCount) {
      console.log("No bid count available");
      return;
    }

    const bidCountNum = Number(bidCount);
    const fetchedBids: Bid[] = [];
    const bidPromises: Promise<void>[] = [];

    for (let i = 1; i <= bidCountNum; i++) {
      const bidId = i;
      console.log(`Fetching bid ${bidId}...`);

      const promise = (async () => {
        try {
          const { data: bidData } = useBid(bidId);
          console.log(`Bid ${bidId} data:`, bidData);

          if (bidData) {
            const bid = bidData as unknown as BlockchainBid;
            const { data: projectData } = useProject(Number(bid.projectId));
            const project = projectData as unknown as BlockchainProject;

            fetchedBids.push({
              id: bidId,
              projectId: Number(bid.projectId),
              projectTitle: project?.title || `Project ${bid.projectId}`,
              amount: formatBigIntToEther(bid.amount) + " BNB",
              status: bid.accepted ? "Accepted" : "Under Review",
              submittedDate: new Date().toLocaleDateString(),
              bidder: bid.bidder,
              accepted: bid.accepted,
            });
            console.log(`Successfully processed bid ${bidId}`);
          }
        } catch (error) {
          console.error(`Error fetching bid ${bidId}:`, error);
        }
      })();

      bidPromises.push(promise);
    }

    try {
      await Promise.all(bidPromises);
      console.log("All bids fetched:", fetchedBids);
      setBids(fetchedBids);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      console.log("Starting data load...");
      setLoading(true);
      setError(null);

      try {
        if (projectCountError) {
          throw new Error("Failed to load project count: " + projectCountError.message);
        }
        if (bidCountError) {
          throw new Error("Failed to load bid count: " + bidCountError.message);
        }

        await Promise.all([
          fetchAllProjects(),
          fetchAllBids()
        ]);

        console.log("Data loading completed");
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error instanceof Error ? error.message : "Failed to load data");
        setLoading(false);
      }
    };

    loadData();
  }, [projectCount, bidCount, projectCountError, bidCountError]);

  // Loading timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached");
        setLoading(false);
        setError("Loading timeout - please check your connection and wallet");
      }
    }, 30000); // Increased to 30 seconds

    return () => clearTimeout(timeout);
  }, [loading]);

  // ... [keep the rest of the component code as is, including the stats array and render logic]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching data from blockchain...</p>
          {error && (
            <p className="text-sm text-red-500 mt-2">Error: {error}</p>
          )}
        </div>
      </div>
    );
  }

  // ... [keep the rest of the component code as is]

  return (
    // ... [keep the existing return JSX]
  );
};

export default Dashboard;