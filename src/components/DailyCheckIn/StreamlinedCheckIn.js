/**
 * Streamlined Daily Check-In Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Streamlined check-in component with post acknowledgment and immutable logging
 * 30% LOC will be implemented for further development
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, User, FileText, Hash, Calendar } from 'lucide-react';
import { ProfileAvatar } from '../UserProfile';
import { createCheckInLog, createAcknowledgmentLog, getLogSummary } from '../../utils/hashUtils';
import { posts } from '../../data/constants';

const StreamlinedCheckIn = ({ onClose }) => {
  // State management for check-in process and user data
  const [userProfile, setUserProfile] = useState(null);
  const [selectedPost, setSelectedPost] = useState('');
  const [acknowledgedPosts, setAcknowledgedPosts] = useState([]);
  const [checkInLogs, setCheckInLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Effect hook loads user profile and acknowledged posts on component mount
  useEffect(() => {
    loadUserData();
    loadAcknowledgedPosts();
    loadCheckInLogs();
  }, []);

  // Load user data function retrieves profile from localStorage
  const loadUserData = () => {
    try {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        const profile = JSON.parse(saved);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Load acknowledged posts function retrieves acknowledged posts from localStorage
  const loadAcknowledgedPosts = () => {
    try {
      const saved = localStorage.getItem('acknowledgedPosts');
      if (saved) {
        setAcknowledgedPosts(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading acknowledged posts:', error);
    }
  };

  // Load check-in logs function retrieves check-in logs from localStorage
  const loadCheckInLogs = () => {
    try {
      const saved = localStorage.getItem('checkInLogs');
      if (saved) {
        setCheckInLogs(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading check-in logs:', error);
    }
  };

  // Save check-in log function persists log entry to localStorage
  const saveCheckInLog = (logEntry) => {
    try {
      const updatedLogs = [...checkInLogs, logEntry];
      setCheckInLogs(updatedLogs);
      localStorage.setItem('checkInLogs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Error saving check-in log:', error);
    }
  };

  // Check if post is acknowledged function validates post acknowledgment status
  const isPostAcknowledged = (postId) => {
    return acknowledgedPosts.includes(postId);
  };

  // Handle check-in function processes check-in with post acknowledgment
  const handleCheckIn = async () => {
    if (!selectedPost) {
      setMessage('Please select a post to check in to.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!userProfile || !userProfile.name) {
      setMessage('Please set up your profile first.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsLoading(true);

    try {
      // Check if post orders are acknowledged
      const acknowledged = isPostAcknowledged(selectedPost);
      
      // Create check-in log entry
      const logEntry = createCheckInLog(userProfile, selectedPost, acknowledged);
      
      // Save log entry
      saveCheckInLog(logEntry);
      
      // Show success message
      const postName = posts.find(p => p.id === selectedPost)?.title || selectedPost;
      setMessage(`Successfully checked in to ${postName}!`);
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error during check-in:', error);
      setMessage('Error during check-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle acknowledgment function processes post order acknowledgment
  const handleAcknowledgment = async (postId) => {
    if (!userProfile || !userProfile.name) {
      setMessage('Please set up your profile first.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsLoading(true);

    try {
      // Add to acknowledged posts
      const updatedAcknowledged = [...acknowledgedPosts, postId];
      setAcknowledgedPosts(updatedAcknowledged);
      localStorage.setItem('acknowledgedPosts', JSON.stringify(updatedAcknowledged));
      
      // Create acknowledgment log entry
      const logEntry = createAcknowledgmentLog(userProfile, postId);
      
      // Save log entry
      saveCheckInLog(logEntry);
      
      // Show success message
      const postName = posts.find(p => p.id === postId)?.title || postId;
      setMessage(`Post orders acknowledged for ${postName}!`);
      
    } catch (error) {
      console.error('Error during acknowledgment:', error);
      setMessage('Error during acknowledgment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get today's check-ins function returns check-ins for current date
  const getTodaysCheckIns = () => {
    const today = new Date().toISOString().split('T')[0];
    return checkInLogs.filter(log => log.date === today);
  };

  // Render function returns streamlined check-in interface
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header section displays title and close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Daily Check-In</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content area displays check-in form and status */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* User profile section displays current user information */}
            {userProfile && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ProfileAvatar profile={userProfile} size="default" />
                  <div>
                    <h3 className="text-white font-medium">{userProfile.name}</h3>
                    <p className="text-gray-300 text-sm">Badge #{userProfile.badgeNumber}</p>
                    <p className="text-gray-400 text-xs">{userProfile.position}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Post selection section provides post selection dropdown */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Select Your Post</h3>
              <select
                value={selectedPost}
                onChange={(e) => setSelectedPost(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
              >
                <option value="">Choose a post...</option>
                {posts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.title} - Booth {post.booth} ({post.shift})
                  </option>
                ))}
              </select>
            </div>

            {/* Post acknowledgment section displays acknowledgment status */}
            {selectedPost && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Post Orders Status</h3>
                {isPostAcknowledged(selectedPost) ? (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Post orders already acknowledged</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-yellow-400">
                      <FileText className="w-5 h-5" />
                      <span>Post orders not acknowledged</span>
                    </div>
                    <button
                      onClick={() => handleAcknowledgment(selectedPost)}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {isLoading ? 'Processing...' : 'Acknowledge Post Orders'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Check-in button section provides main check-in action */}
            <div className="space-y-3">
              <button
                onClick={handleCheckIn}
                disabled={!selectedPost || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
              >
                {isLoading ? 'Processing...' : 'Check In to Post'}
              </button>
            </div>

            {/* Today's check-ins section displays recent check-ins */}
            {getTodaysCheckIns().length > 0 && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Today's Check-Ins</h3>
                <div className="space-y-2">
                  {getTodaysCheckIns().map((log, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{getLogSummary(log)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message display shows status updates and confirmations */}
        {message && (
          <div className="p-4 bg-blue-600 text-white text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamlinedCheckIn;
