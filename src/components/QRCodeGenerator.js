import React, { useState } from 'react';
import { QrCode, Printer, Copy, CheckCircle, X } from 'lucide-react';

const QRCodeGenerator = ({ onClose }) => {
  const [selectedPost, setSelectedPost] = useState('');
  const [generatedQR, setGeneratedQR] = useState('');
  const [copied, setCopied] = useState(false);

  const posts = [
    { id: 'credentialer-entry', name: 'Credentialer - Entry Lane', location: 'Booth 324' },
    { id: 'credentialer-exit', name: 'Credentialer - Exit Lane', location: 'Booth 314' },
    { id: 'screening-inspector', name: 'Screening Inspector', location: 'Booth 325' },
    { id: 'lane-controller', name: 'Screening Lane Controller', location: 'Booth 282' },
    { id: 'equipment-operator', name: 'Equipment Operator', location: 'M227/M229' },
    { id: 'image-interpreter', name: 'Image Interpreter', location: 'M106' },
    { id: 'facility-coordinator', name: 'Facility Coordinator', location: 'VSOC' },
    { id: 'radiation-officer', name: 'Radiation Safety Officer', location: 'VSOC' },
    { id: 'vsc-manager', name: 'VSC Screening Manager', location: 'M106' }
  ];

  const generateQRCode = () => {
    if (!selectedPost) return;

    const post = posts.find(p => p.id === selectedPost);
    if (!post) return;

    const qrData = {
      type: 'daily_checkin',
      taskId: post.id,
      taskName: post.name,
      location: post.location,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    const qrString = JSON.stringify(qrData);
    setGeneratedQR(qrString);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedQR);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const printQRCode = () => {
    const post = posts.find(p => p.id === selectedPost);
    if (!post) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${post.name}</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .qr-container { border: 2px solid #000; padding: 20px; margin: 20px auto; max-width: 400px; }
            .qr-code { font-size: 12px; word-break: break-all; background: #f0f0f0; padding: 10px; margin: 10px 0; }
            .post-info { margin: 10px 0; }
            .instructions { font-size: 14px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>VSC Daily Check-In QR Code</h1>
          <div class="qr-container">
            <div class="post-info">
              <h2>${post.name}</h2>
              <p><strong>Location:</strong> ${post.location}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div class="qr-code">
              ${generatedQR}
            </div>
            <div class="instructions">
              <p><strong>Instructions:</strong></p>
              <p>1. Print this QR code</p>
              <p>2. Post it at the designated location</p>
              <p>3. Personnel scan to check in daily</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-white font-semibold flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            QR Code Generator
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Post Selection */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-3">Select Post</h3>
            <select
              value={selectedPost}
              onChange={(e) => setSelectedPost(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="">Choose a post...</option>
              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.name} - {post.location}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={generateQRCode}
              disabled={!selectedPost}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center mx-auto"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Generate QR Code
            </button>
          </div>

          {/* Generated QR Code */}
          {generatedQR && (
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-white font-semibold mb-3">Generated QR Code</h3>
              
              {/* QR Code Display */}
              <div className="bg-white p-4 rounded-lg mb-4 text-center">
                <div className="text-black text-xs break-all">
                  {generatedQR}
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  (In production, this would be a visual QR code)
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={copyToClipboard}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg flex items-center justify-center"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copy QR Data
                    </>
                  )}
                </button>
                
                <button
                  onClick={printQRCode}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex items-center justify-center"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print QR Code
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-3">Instructions</h3>
            <div className="text-gray-400 text-sm space-y-2">
              <p><strong>1. Select Post:</strong> Choose the post location for the QR code</p>
              <p><strong>2. Generate:</strong> Create the QR code with check-in data</p>
              <p><strong>3. Print:</strong> Print the QR code and post at the location</p>
              <p><strong>4. Scan:</strong> Personnel scan daily to check in</p>
              <p><strong>5. Track:</strong> View check-in status in Daily Check-In system</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              QR codes work offline - no internet required
            </div>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
