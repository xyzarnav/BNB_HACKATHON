import React, { useState } from 'react';
import QRCode from 'react-qr-code';

// Simple SVG Icons as fallback
const QrCodeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zM3 13h6v6H3v-6zm2 2v2h2v-2H5zM13 3h6v6h-6V3zm2 2v2h2V5h-2zM13 13h2v2h-2v-2zM15 15h2v2h-2v-2zM17 13h2v2h-2v-2zM19 15h2v2h-2v-2zM13 17h2v2h-2v-2zM15 19h2v2h-2v-2zM17 17h2v2h-2v-2z"/>
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
    />
  </svg>
);

interface QRCodeWithLinkProps {
  value: string;
  label: string;
  explorerUrl: string;
  size?: number;
}

const QRCodeWithLink: React.FC<QRCodeWithLinkProps> = ({ 
  value, 
  label, 
  explorerUrl, 
  size = 120 
}) => {
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex space-x-2">
        {/* QR Code Toggle Button */}
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
          title={`${showQR ? 'Hide' : 'Show'} QR Code for ${label}`}
        >
          <QrCodeIcon className="w-4 h-4" />
          <span>{showQR ? 'Hide' : 'QR'}</span>
        </button>

        {/* Block Explorer Link */}
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
          title={`View ${label} on Block Explorer`}
        >
          <ExternalLinkIcon className="w-4 h-4" />
          <span>Explorer</span>
        </a>
      </div>

      {/* QR Code Display */}
      {showQR && (
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <QRCode
            size={size}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={explorerUrl}
            viewBox={`0 0 256 256`}
          />
          <p className="text-xs text-gray-500 mt-2 text-center max-w-[120px] break-all">
            {label}
          </p>
        </div>
      )}
    </div>
  );
};

export default QRCodeWithLink;
