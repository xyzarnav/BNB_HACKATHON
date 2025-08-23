import React, { useState, useEffect } from 'react';
import { mlService, BidderStats } from '../../services/mlService';

const BidderAnalytics: React.FC = () => {
  const [bidders, setBidders] = useState<BidderStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadBidderStats();
  }, []);

  const loadBidderStats = async () => {
    try {
      setLoading(true);
      const data = await mlService.getBidderStats();
      setBidders(data.bidders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBidders = () => {
    switch (filter) {
      case 'high_reputation':
        return bidders.filter(b => b.reputation_score >= 8);
      case 'low_reputation':
        return bidders.filter(b => b.reputation_score < 5);
      case 'high_completion':
        return bidders.filter(b => b.completion_rate >= 0.9);
      case 'low_completion':
        return bidders.filter(b => b.completion_rate < 0.7);
      default:
        return bidders;
    }
  };

  const getAverageStats = () => {
    if (bidders.length === 0) return null;
    
    const total = bidders.reduce((acc, bidder) => ({
      reputation: acc.reputation + bidder.reputation_score,
      completion: acc.completion + bidder.completion_rate,
      quality: acc.quality + bidder.quality_score,
      projects: acc.projects + bidder.total_projects
    }), { reputation: 0, completion: 0, quality: 0, projects: 0 });

    return {
      reputation: total.reputation / bidders.length,
      completion: total.completion / bidders.length,
      quality: total.quality / bidders.length,
      projects: total.projects / bidders.length
    };
  };

  const getRiskCategory = (bidder: BidderStats) => {
    let riskScore = 0;
    riskScore += (1 - bidder.completion_rate) * 30;
    riskScore += (10 - bidder.reputation_score) * 5;
    riskScore += (10 - bidder.quality_score) * 3;
    
    if (riskScore < 30) return { category: 'Low', color: 'text-green-600 bg-green-100' };
    if (riskScore < 70) return { category: 'Medium', color: 'text-yellow-600 bg-yellow-100' };
    return { category: 'High', color: 'text-red-600 bg-red-100' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        ❌ Error loading bidder analytics: {error}
      </div>
    );
  }

  const filteredBidders = getFilteredBidders();
  const averageStats = getAverageStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📊 Bidder Analytics Dashboard
        </h2>
        <p className="text-gray-600">
          AI-powered insights into bidder performance and risk assessment
        </p>
      </div>

      {/* Summary Cards */}
      {averageStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bidders</p>
                <p className="text-2xl font-bold text-gray-900">{bidders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Reputation</p>
                <p className="text-2xl font-bold text-gray-900">{averageStats.reputation.toFixed(1)}/10</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-gray-900">{(averageStats.completion * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Projects</p>
                <p className="text-2xl font-bold text-gray-900">{averageStats.projects.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Bidders
          </button>
          <button
            onClick={() => setFilter('high_reputation')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'high_reputation' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            High Reputation (8+)
          </button>
          <button
            onClick={() => setFilter('low_reputation')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'low_reputation' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Low Reputation (&lt;5)
          </button>
          <button
            onClick={() => setFilter('high_completion')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'high_completion' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            High Completion (90%+)
          </button>
          <button
            onClick={() => setFilter('low_completion')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'low_completion' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Low Completion (&lt;70%)
          </button>
        </div>
      </div>

      {/* Bidders Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Bidders ({filteredBidders.length} of {bidders.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reputation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBidders.map((bidder, index) => {
                const risk = getRiskCategory(bidder);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bidder.bidder_address.slice(0, 8)}...{bidder.bidder_address.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bidder.total_projects}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${bidder.completion_rate * 100}%` }}
                          ></div>
                        </div>
                        <span>{(bidder.completion_rate * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        {bidder.reputation_score.toFixed(1)}/10
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="text-blue-500 mr-1">🎯</span>
                        {bidder.quality_score.toFixed(1)}/10
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${risk.color}`}>
                        {risk.category}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={loadBidderStats}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default BidderAnalytics;
