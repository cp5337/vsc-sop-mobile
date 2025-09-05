import React, { useEffect, useRef } from 'react';
import { X, Download } from 'lucide-react';
import QRCode from 'qrcode';

const QRModal = ({ data, onClose }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
    }
  }, [data]);

  const downloadQR = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'vsc-sop-acknowledgment.png';
    link.href = url;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold">Acknowledgment QR Code</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg mb-4 flex justify-center">
          <canvas ref={canvasRef} />
        </div>
        
        <p className="text-sm text-gray-400 mb-4 text-center">
          Scan this code to confirm your acknowledgment of all post orders.
        </p>
        
        <button 
          onClick={downloadQR}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center"
        >
          <Download className="mr-2 w-4 h-4" />
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRModal;
