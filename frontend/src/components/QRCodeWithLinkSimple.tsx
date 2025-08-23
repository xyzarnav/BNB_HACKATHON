import React, { useState } from 'react';
import QRCode from 'react-qr-code';

interface QRCodeWithLinkProps {
  value: string;
  label: string;
  explorerUrl: string;
  size?: number;
}

const QRCodeWithLinkSimple: React.FC<QRCodeWithLinkProps> = ({ 
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
          <span>📱</span>
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
          <span>🔗</span>
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

export default QRCodeWithLinkSimple;


