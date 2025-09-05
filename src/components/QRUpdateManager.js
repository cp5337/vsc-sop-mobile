/**
 * QR Update Manager Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * QR code-based data distribution system for updating app content across devices
 * Implements QR code generation, data serialization, and update distribution
 */
import React, { useState } from 'react';
import { QrCode, Upload, Smartphone, MessageSquare, X } from 'lucide-react';

const QRUpdateManager = ({ onClose }) => {
  const [updateData, setUpdateData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');

  // Generate QR code for current app data
  const generateUpdateQR = async () => {
    setIsGenerating(true);
    try {
      // Get current app data
      const currentData = {
        type: 'sop_update',
        version: '2.1',
        timestamp: new Date().toISOString(),
        content: {
          posts: JSON.parse(localStorage.getItem('vsc_posts') || '[]'),
          contacts: JSON.parse(localStorage.getItem('vsc_emergency_contacts') || '[]'),
          codes: JSON.parse(localStorage.getItem('vsc_emergency_codes') || '[]')
        },
        checksum: generateChecksum(),
        author: 'supervisor'
      };

      // Create QR code data URL
      const qrData = JSON.stringify(currentData);
      const qrUrl = await generateQRCode(qrData);
      
      setUpdateData(currentData);
      setQrCodeUrl(qrUrl);
      setMessage('✅ QR code generated successfully!');
    } catch (error) {
      setMessage('❌ Error generating QR code: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate checksum for data integrity
  const generateChecksum = () => {
    const data = localStorage.getItem('vsc_posts') + 
                 localStorage.getItem('vsc_emergency_contacts') + 
                 localStorage.getItem('vsc_emergency_codes');
    // Simple checksum - in production use crypto hash
    return btoa(data).slice(0, 16);
  };

  // Simple QR code generation (in production use a real library)
  const generateQRCode = async (data) => {
    // This is a placeholder - in production you'd use qrcode.js
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">
          QR Code: ${data.slice(0, 20)}...
        </text>
      </svg>
    `)}`;
  };

  // Process scanned QR code
  // const processScannedQR = (qrData) => {
  //   try {
  //     const update = JSON.parse(qrData);
  //     
  //     if (update.type === 'sop_update' && update.checksum) {
  //       // Validate checksum
  //       if (validateUpdate(update)) {
  //         // Apply update
  //         applyUpdate(update);
  //         setMessage('✅ Update applied successfully!');
  //       } else {
  //         setMessage('❌ Invalid update - checksum mismatch');
  //       }
  //     } else {
  //       setMessage('❌ Invalid QR code format');
  //     }
  //   } catch (error) {
  //     setMessage('❌ Error processing QR code: ' + error.message);
  //   }
  // };

  // Validate update integrity
  // const validateUpdate = (update) => {
  //   // In production, implement proper checksum validation
  //   return update.checksum && update.content;
  // };

  // Apply update to local storage
  // const applyUpdate = (update) => {
  //   if (update.content.posts) {
  //     localStorage.setItem('vsc_posts', JSON.stringify(update.content.posts));
  //   }
  //   if (update.content.contacts) {
  //     localStorage.setItem('vsc_emergency_contacts', JSON.stringify(update.content.contacts));
  //   }
  //   if (update.content.codes) {
  //     localStorage.setItem('vsc_emergency_codes', JSON.stringify(update.content.codes));
  //   }
  //   
  //   // Reload app data
  //   window.location.reload();
  // };

  // Native communication functions
  const sendSMS = (number, message) => {
    const smsUrl = `sms:${number}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
  };

  // const sendEmail = (email, subject, body) => {
  //   const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  //   window.open(emailUrl, '_blank');
  // };

  const makePhoneCall = (number) => {
    window.open(`tel:${number}`, '_blank');
  };

  // Emergency broadcast
  const sendEmergencyBroadcast = () => {
    const contacts = JSON.parse(localStorage.getItem('vsc_emergency_contacts') || '[]');
    const message = 'EMERGENCY: VSC SOP Update Required - Please scan QR code for latest procedures';
    
    contacts.forEach(contact => {
      if (contact.priority === 'primary') {
        sendSMS(contact.number, message);
      }
    });
    
    setMessage('📱 Emergency broadcast sent to all primary contacts');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-white font-semibold flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            QR Update Manager
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
          {message && (
            <div className={`p-3 rounded-lg border ${
              message.includes('✅') 
                ? 'bg-green-900/30 border-green-600 text-green-400'
                : 'bg-red-900/30 border-red-600 text-red-400'
            }`}>
              {message}
            </div>
          )}

          {/* Generate QR Section */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Generate Update QR Code
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Create a QR code containing current SOP data for distribution to other devices.
            </p>
            <button
              onClick={generateUpdateQR}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </>
              )}
            </button>
          </div>

          {/* QR Code Display */}
          {qrCodeUrl && (
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <h3 className="text-white font-semibold mb-3">Generated QR Code</h3>
              <img src={qrCodeUrl} alt="SOP Update QR Code" className="mx-auto mb-4" />
              <p className="text-gray-400 text-sm">
                Version: {updateData?.version} | Generated: {new Date(updateData?.timestamp).toLocaleString()}
              </p>
            </div>
          )}

          {/* Communication Tools */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              Communication Tools
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={sendEmergencyBroadcast}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg flex items-center justify-center"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Emergency Broadcast
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => sendSMS('(212) 435-5903', 'VSC SOP Update Available')}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg flex items-center justify-center text-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  SMS SACC
                </button>
                <button
                  onClick={() => makePhoneCall('(212) 435-5903')}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center justify-center text-sm"
                >
                  <Smartphone className="w-4 h-4 mr-1" />
                  Call SACC
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-3">How to Use QR Updates</h3>
            <div className="text-gray-400 text-sm space-y-2">
              <p><strong>1. Generate:</strong> Create QR code with current SOP data</p>
              <p><strong>2. Distribute:</strong> Share QR code with other devices</p>
              <p><strong>3. Scan:</strong> Use QR scanner to apply updates</p>
              <p><strong>4. Verify:</strong> Check that updates were applied correctly</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              QR updates work offline - no internet required
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

export default QRUpdateManager;
