import React from 'react';
import UserInfo from '../components/Trustchaincomponents/PageComponents/UserInfo';
import { useAccount } from 'wagmi';

const ProfilePage: React.FC = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-blue-50 rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600">
              Please connect your wallet to view your profile and manage your projects and bids.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Profile</h1>
        <UserInfo />
      </div>
    </div>
  );
};

export default ProfilePage;