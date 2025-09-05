import React, { useState } from 'react';

import { CheckCircle, QrCode } from 'lucide-react';
import QRModal from './QRModal';

const Acknowledgment = ({ posts, acknowledgedPosts, onAcknowledge }) => {
  const [showQR, setShowQR] = useState(false);

  const generateQRData = () => {
    const data = {
      userId: 'USER_ID',
      timestamp: new Date().toISOString(),
      acknowledgedPosts: acknowledgedPosts,
      version: '2.0',
      date: 'September 4, 2025'
    };
    return JSON.stringify(data);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Post Order Acknowledgment</h3>
          <p className="text-gray-300 mb-6">
            By acknowledging, you confirm that you have read and understand the VSC Standard Operating Procedures Version 2.0.
          </p>
          
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <span className="text-sm">{post.title}</span>
                {acknowledgedPosts.includes(post.id) ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <button
                    onClick={() => onAcknowledge(post.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            ))}
          </div>

          {acknowledgedPosts.length === posts.length && (
            <div className="mt-6">
              <button
                onClick={() => setShowQR(true)}
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center justify-center"
              >
                <QrCode className="mr-2" />
                Generate QR Code
              </button>
            </div>
          )}
        </div>
      </div>

      {showQR && (
        <QRModal data={generateQRData()} onClose={() => setShowQR(false)} />
      )}
    </>
  );
};

export default Acknowledgment;
