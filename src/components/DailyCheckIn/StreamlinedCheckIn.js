/**
 * Streamlined Daily Check-In Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Streamlined check-in component with post acknowledgment and immutable logging
 * Refactored to use custom hooks and eliminate duplicate code patterns
 */

import React, { useState } from 'react';

import { CheckCircle, FileText, Hash, X } from 'lucide-react';
import { ProfileAvatar } from '../UserProfile';
import { useUserProfile, useCheckInLogs } from '../../hooks';
import { createCheckInLog, createAcknowledgmentLog, getLogSummary } from '../../utils/hashUtils';
import { posts } from '../../data/constants';
import Modal from '../Modal/Modal';

const StreamlinedCheckIn = ({ onClose }) => {
  // Use custom hooks for state management
  const { profile: userProfile } = useUserProfile();
  const { 
    checkInLogs, 
    acknowledgedPosts, 
    addCheckInLog, 
    acknowledgePost, 
    isPostAcknowledged,
    getTodaysCheckIns,
    error,
    clearError
  } = useCheckInLogs();
  
  // Local state for form management
  const [selectedPost, setSelectedPost] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if post orders are acknowledged function validates acknowledgment status
  const isPostAcknowledgedCheck = (postId) => {
    return isPostAcknowledged(postId);
  };

  // Handle check-in function processes daily check-in with logging
  const handleCheckIn = async () => {
    if (!selectedPost) {
      setMessage('Please select a post for check-in.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!userProfile) {
      setMessage('User profile not found. Please set up your profile first.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if post orders are acknowledged
      const acknowledged = isPostAcknowledgedCheck(selectedPost);
      
      if (!acknowledged) {
        setMessage('Please acknowledge post orders before checking in.');
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      // Create check-in log entry
      const checkInLog = createCheckInLog({
        postId: selectedPost,
        userId: userProfile.badgeNumber || 'unknown',
        userName: userProfile.name || 'Unknown User',
        action: 'Daily check-in completed',
        details: {
          post: posts.find(p => p.id === selectedPost)?.title || selectedPost,
          timestamp: new Date().toISOString(),
          acknowledged: true
        }
      });

      // Save check-in log
      const result = addCheckInLog(checkInLog);
      
      if (result) {
        setMessage('✅ Check-in completed successfully!');
        setTimeout(() => setMessage(''), 3000);
        setSelectedPost('');
      } else {
        setMessage('❌ Error during check-in. Please try again.');
      }
    } catch (error) {
      console.error('Error during check-in:', error);
      setMessage('❌ Error during check-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle acknowledgment function processes post order acknowledgment
  const handleAcknowledgment = async (postId) => {
    if (!userProfile) {
      setMessage('User profile not found. Please set up your profile first.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setIsLoading(true);
      
      // Add to acknowledged posts
      const result = acknowledgePost(postId);
      
      if (result) {
        setMessage('✅ Post order acknowledged successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Error during acknowledgment. Please try again.');
      }
    } catch (error) {
      console.error('Error during acknowledgment:', error);
      setMessage('❌ Error during acknowledgment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get today's check-ins function returns check-ins for current day
  const todaysCheckIns = getTodaysCheckIns();

  return (
    <Modal isOpen={true} onClose={onClose} size="large">
      <Modal.Header onClose={onClose}>
        <h2 className="text-xl font-bold text-white">Daily Check-In</h2>
      </Modal.Header>
      
      <Modal.Body>
        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300 text-xs underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-3">
              <p className="text-green-400 text-sm">{message}</p>
            </div>
          )}

          {/* User Profile Section */}
          {userProfile && (
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <ProfileAvatar profile={userProfile} size="small" />
                <span className="ml-3">Check-in for {userProfile.name || 'Unknown User'}</span>
              </h3>
              <div className="text-sm text-gray-300">
                <p>Badge: {userProfile.badgeNumber || 'Not set'}</p>
                <p>Position: {userProfile.position || 'Not set'}</p>
              </div>
            </div>
          )}

          {/* Post Selection */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Select Your Post</h3>
            <select
              value={selectedPost}
              onChange={(e) => setSelectedPost(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Choose your post...</option>
              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title} - Booth {post.booth} ({post.shift})
                </option>
              ))}
            </select>
          </div>

          {/* Post Orders Acknowledgment */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Post Orders Acknowledgment
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              You must acknowledge all post orders before checking in.
            </p>
            
            <div className="space-y-2">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div>
                    <span className="text-white font-medium">{post.title}</span>
                    <span className="text-gray-400 text-sm ml-2">Booth {post.booth}</span>
                  </div>
                  {isPostAcknowledgedCheck(post.id) ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <button
                      onClick={() => handleAcknowledgment(post.id)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Check-in Actions */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Check-in Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleCheckIn}
                disabled={!selectedPost || isLoading || !userProfile}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete Check-in
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Today's Check-ins Summary */}
          {todaysCheckIns.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Hash className="w-5 h-5 mr-2" />
                Today's Check-ins
              </h3>
              <div className="space-y-2">
                {todaysCheckIns.map((log) => (
                  <div key={log.id} className="p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{log.details?.post || 'Unknown Post'}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default StreamlinedCheckIn;