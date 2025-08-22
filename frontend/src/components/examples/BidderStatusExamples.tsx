import React from 'react';
import BidderStatusCard from '../BidderStatusCard';

/**
 * Example usage of BidderStatusCard in different contexts
 */

// 1. In a form or modal (compact version)
export const CompactBidderStatus: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Bidder Status</h3>
      <BidderStatusCard 
        compact={true}
        showTitle={false}
        onStatusChange={(hasProfile) => {
          console.log('Bidder profile status:', hasProfile);
        }}
      />
    </div>
  );
};

// 2. In a dashboard card (full version)
export const FullBidderStatus: React.FC = () => {
  return (
    <div className="max-w-2xl">
      <BidderStatusCard 
        showTitle={true}
        compact={false}
      />
    </div>
  );
};

// 3. In a navigation bar or header (inline compact)
export const NavbarBidderStatus: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-600">Status:</span>
      <BidderStatusCard 
        compact={true}
        showTitle={false}
      />
    </div>
  );
};
