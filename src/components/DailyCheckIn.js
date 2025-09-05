import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Clock, MapPin, Calendar, RefreshCw, X } from 'lucide-react';

const DailyCheckIn = ({ onClose }) => {
  const [checkIns, setCheckIns] = useState([]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [message, setMessage] = useState('');

  // Load check-ins from localStorage
  useEffect(() => {
    loadCheckIns();
  }, []);

  const loadCheckIns = () => {
    const saved = localStorage.getItem('daily_checkins');
    if (saved) {
      setCheckIns(JSON.parse(saved));
    }
  };

  const saveCheckIns = (newCheckIns) => {
    localStorage.setItem('daily_checkins', JSON.stringify(newCheckIns));
    setCheckIns(newCheckIns);
  };

  // Generate QR codes for specific tasks/posts
  const generateTaskQR = (taskId, taskName, location) => {
    const qrData = {
      type: 'daily_checkin',
      taskId: taskId,
      taskName: taskName,
      location: location,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(qrData);
  };

  // Process scanned QR code
  const handleQRScan = (qrData) => {
    try {
      const data = JSON.parse(qrData);
      
      if (data.type === 'daily_checkin') {
        const checkIn = {
          id: Date.now(),
          taskId: data.taskId,
          taskName: data.taskName,
          location: data.location,
          scannedAt: new Date().toISOString(),
          date: new Date().toDateString(),
          time: new Date().toLocaleTimeString(),
          status: 'completed'
        };

        // Check if already checked in today
        const today = new Date().toDateString();
        const existingCheckIn = checkIns.find(
          ci => ci.taskId === data.taskId && ci.date === today
        );

        if (existingCheckIn) {
          setMessage('⚠️ Already checked in for this task today');
          setTimeout(() => setMessage(''), 3000);
          return;
        }

        const newCheckIns = [...checkIns, checkIn];
        saveCheckIns(newCheckIns);
        setMessage('✅ Check-in recorded successfully!');
        setTimeout(() => setMessage(''), 3000);
        setShowQRScanner(false);
      } else {
        setMessage('❌ Invalid QR code - not a check-in code');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Error processing QR code: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Get today's check-ins
  const getTodaysCheckIns = () => {
    const today = new Date().toDateString();
    return checkIns.filter(ci => ci.date === today);
  };

  // Get check-in status for each post
  const getCheckInStatus = () => {
    const today = new Date().toDateString();
    const todaysCheckIns = checkIns.filter(ci => ci.date === today);
    
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

    return posts.map(post => {
      const checkIn = todaysCheckIns.find(ci => ci.taskId === post.id);
      return {
        ...post,
        checkedIn: !!checkIn,
        checkInTime: checkIn ? checkIn.time : null,
        checkInData: checkIn
      };
    });
  };

  // Generate QR code for a specific task
  const generateTaskQRCode = (taskId, taskName, location) => {
    const qrData = generateTaskQR(taskId, taskName, location);
    // In a real implementation, you'd use a QR code library
    // For now, we'll show the data that would be in the QR code
    alert(`QR Code Data for ${taskName}:\n\n${qrData}\n\nThis would be displayed as a QR code for scanning.`);
  };

  const checkInStatus = getCheckInStatus();
  const todaysCheckIns = getTodaysCheckIns();
  const completedCount = checkInStatus.filter(status => status.checkedIn).length;
  const totalCount = checkInStatus.length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-white font-semibold flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Daily Check-In System
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {message && (
            <div className={`mb-4 p-3 rounded-lg border ${
              message.includes('✅') 
                ? 'bg-green-900/30 border-green-600 text-green-400'
                : message.includes('⚠️')
                ? 'bg-yellow-900/30 border-yellow-600 text-yellow-400'
                : 'bg-red-900/30 border-red-600 text-red-400'
            }`}>
              {message}
            </div>
          )}

          {/* Summary */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Today's Progress
              </h3>
              <span className="text-2xl font-bold text-blue-400">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {completedCount === totalCount 
                ? '🎉 All posts checked in today!' 
                : `${totalCount - completedCount} posts remaining`}
            </p>
          </div>

          {/* Check-In Actions */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              Check-In Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setShowQRScanner(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Scan QR Code to Check In
              </button>
              <button
                onClick={() => {
                  const today = new Date().toDateString();
                  const newCheckIns = checkIns.filter(ci => ci.date !== today);
                  saveCheckIns(newCheckIns);
                  setMessage('🔄 Today\'s check-ins reset');
                  setTimeout(() => setMessage(''), 3000);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg flex items-center justify-center"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Reset Today's Check-Ins
              </button>
            </div>
          </div>

          {/* Post Status */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Post Check-In Status
            </h3>
            <div className="space-y-3">
              {checkInStatus.map((post) => (
                <div key={post.id} className={`p-3 rounded-lg border ${
                  post.checkedIn 
                    ? 'bg-green-900/20 border-green-600' 
                    : 'bg-gray-700 border-gray-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{post.name}</h4>
                      <p className="text-gray-400 text-sm">{post.location}</p>
                      {post.checkedIn && (
                        <p className="text-green-400 text-sm">
                          ✅ Checked in at {post.checkInTime}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {post.checkedIn ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-400" />
                      )}
                      <button
                        onClick={() => generateTaskQRCode(post.id, post.name, post.location)}
                        className="p-2 text-blue-400 hover:bg-blue-900/20 rounded"
                        title="Generate QR Code for this post"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Check-Ins */}
          {todaysCheckIns.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Today's Check-Ins
              </h3>
              <div className="space-y-2">
                {todaysCheckIns
                  .sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt))
                  .map((checkIn) => (
                    <div key={checkIn.id} className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">{checkIn.taskName}</p>
                          <p className="text-gray-400 text-sm">{checkIn.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 text-sm">{checkIn.time}</p>
                          <p className="text-gray-400 text-xs">{checkIn.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Check-ins are stored locally on your device
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

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black z-60 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-md">
            <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
              <h3 className="text-white font-semibold">Scan QR Code</h3>
              <button
                onClick={() => setShowQRScanner(false)}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="p-6 text-center">
              <QrCode className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-white mb-4">Position QR code within camera view</p>
              <p className="text-gray-400 text-sm mb-4">
                QR codes should contain check-in data for specific posts
              </p>
              <button
                onClick={() => {
                  // Simulate QR scan for demo
                  const demoQR = generateTaskQR('credentialer-entry', 'Credentialer - Entry Lane', 'Booth 324');
                  handleQRScan(demoQR);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Demo Scan (Entry Lane)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyCheckIn;
