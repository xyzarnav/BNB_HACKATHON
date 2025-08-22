import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { useAccount } from 'wagmi';
import { useProjectsByCreator, useUserBids } from '../../../hooks/useContractRead';

const UserInfo: React.FC = () => {
  const { address } = useAccount();
  const { data: userProjects } = useProjectsByCreator(address as `0x${string}`);
  const { data: userBids } = useUserBids(address as `0x${string}`);

  const projectCount = userProjects?.length || 0;
  const bidCount = userBids?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* User Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Your Address</p>
            <p className="text-lg font-semibold text-blue-600 break-all">{address}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Activity Summary</p>
            <p className="text-lg font-semibold text-blue-600">
              {projectCount} Projects · {bidCount} Bids
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Your Projects Card */}
        <Link
          to="/profile/projects"
          className="group relative bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-[1.02]"
        >
          <div className="absolute top-0 right-0 p-4">
            <DocumentTextIcon className="h-8 w-8 text-blue-500 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Projects</h3>
            <p className="text-gray-600 mb-4">
              Manage and track all your created projects. View status, bids, and progress.
            </p>
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center text-blue-500 group-hover:text-blue-600">
                View Projects
                <svg
                  className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="text-2xl font-bold text-blue-500">{projectCount}</span>
            </div>
          </div>
        </Link>

        {/* Your Bids Card */}
        <Link
          to="/profile/bids"
          className="group relative bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-[1.02]"
        >
          <div className="absolute top-0 right-0 p-4">
            <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-500 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Bids</h3>
            <p className="text-gray-600 mb-4">
              Track your submitted bids and their status. Monitor accepted and pending proposals.
            </p>
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center text-blue-500 group-hover:text-blue-600">
                View Bids
                <svg
                  className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="text-2xl font-bold text-blue-500">{bidCount}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserInfo;
