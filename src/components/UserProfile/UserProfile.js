/**
 * User Profile Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * User profile component manages personal information and selfie capture
 * 30% LOC will be implemented for further development
 */

import React, { useState, useRef } from 'react';
import { Camera, User, Save, Edit, X, CheckCircle } from 'lucide-react';

const UserProfile = ({ onClose, onProfileUpdate }) => {
  // Profile state manages user information and selfie data
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: '',
      badgeNumber: '',
      position: '',
      selfie: null,
      lastUpdated: null
    };
  });
  
  // UI state manages form editing and camera capture
  const [isEditing, setIsEditing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [message, setMessage] = useState('');
  
  // Camera reference manages video stream for selfie capture
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera function initializes video stream for selfie capture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Camera access denied:', error);
      setMessage('Camera access denied. Please allow camera access to take a selfie.');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Capture selfie function takes photo from video stream
  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0);
      
      // Convert canvas to data URL for storage
      const selfieData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Update profile with new selfie
      const updatedProfile = {
        ...profile,
        selfie: selfieData,
        lastUpdated: new Date().toISOString()
      };
      
      setProfile(updatedProfile);
      setTempProfile(updatedProfile);
      setShowCamera(false);
      
      // Stop camera stream
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      
      setMessage('Selfie captured successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Stop camera function closes video stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  // Edit profile function enables form editing mode
  const editProfile = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
  };

  // Save profile function updates profile and persists to localStorage
  const saveProfile = () => {
    if (tempProfile.name && tempProfile.badgeNumber && tempProfile.position) {
      const updatedProfile = {
        ...tempProfile,
        lastUpdated: new Date().toISOString()
      };
      
      setProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setIsEditing(false);
      
      // Notify parent component of profile update
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
      
      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Please fill in all required fields.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Cancel edit function discards changes and exits edit mode
  const cancelEdit = () => {
    setTempProfile({});
    setIsEditing(false);
  };

  // Input change handler updates temporary profile state
  const handleInputChange = (field, value) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  // Render function returns user profile interface with selfie and form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header section displays title and close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">User Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content area displays profile information and editing form */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Selfie section displays current photo and capture controls */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Your Selfie</h3>
              <div className="flex flex-col items-center space-y-4">
                {profile.selfie ? (
                  <div className="relative">
                    <img
                      src={profile.selfie}
                      alt="User selfie"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center border-4 border-gray-500">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                <button
                  onClick={startCamera}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>{profile.selfie ? 'Update Selfie' : 'Take Selfie'}</span>
                </button>
              </div>
            </div>

            {/* Profile information section displays user details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Profile Information</h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={tempProfile.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Badge Number *
                    </label>
                    <input
                      type="text"
                      value={tempProfile.badgeNumber || ''}
                      onChange={(e) => handleInputChange('badgeNumber', e.target.value)}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
                      placeholder="Enter your badge number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Position *
                    </label>
                    <input
                      type="text"
                      value={tempProfile.position || ''}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
                      placeholder="Enter your position (e.g., Security Officer, Supervisor)"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={saveProfile}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Profile</span>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                        <p className="text-white">{profile.name || 'Not set'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Badge Number</label>
                        <p className="text-white">{profile.badgeNumber || 'Not set'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                        <p className="text-white">{profile.position || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={editProfile}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message display shows status updates and confirmations */}
        {message && (
          <div className="p-4 bg-blue-600 text-white text-center">
            {message}
          </div>
        )}

        {/* Camera modal provides selfie capture interface */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-60 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-4 max-w-md w-full">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Take Your Selfie</h3>
              
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                
                <div className="flex space-x-3">
                  <button
                    onClick={captureSelfie}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Capture Selfie
                  </button>
                  <button
                    onClick={stopCamera}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
