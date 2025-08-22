import React, { useState } from 'react';
import NewNavbar from '../components/Trustchaincomponents/NewNavbar';
import { useReadContract } from 'wagmi';
import { deployedContracts } from '../contracts/deployedContracts';

const BlockExplorerPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'transaction' | 'address' | 'block'>('transaction');

  // Example contract data fetching
  const { data: projectCount } = useReadContract({
    address: deployedContracts.TrustChain.address as `0x${string}`,
    abi: deployedContracts.TrustChain.abi,
    functionName: 'projectId',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    if (searchQuery) {
      window.open(`https://testnet.bscscan.com/${searchType}/${searchQuery}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NewNavbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-50 to-white py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              BNB Chain Block Explorer
            </h1>
            <p className="text-gray-600 mb-8">
              Search for transactions, addresses, and blocks on the BNB Chain
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as any)}
                >
                  <option value="transaction">Transaction</option>
                  <option value="address">Address</option>
                  <option value="block">Block</option>
                </select>
                <input
                  type="text"
                  placeholder="Search by address / txn hash / block"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-blue-600">{projectCount?.toString() || '0'}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Contract Address</h3>
            <p className="text-sm text-blue-600 break-all">
              <a 
                href={`https://testnet.bscscan.com/address/${deployedContracts.TrustChain.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {deployedContracts.TrustChain.address}
              </a>
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Network</h3>
            <p className="text-3xl font-bold text-blue-600">BNB Testnet</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Loading recent transactions...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockExplorerPage;