/**
 * Task Scanner Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Task scanner component for personnel to scan QR codes and complete tasks
 * 30% LOC will be implemented for further development
 */

import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Clock, User, AlertCircle, Camera, FileText } from 'lucide-react';
import { ProfileAvatar } from '../UserProfile';
import { createLogEntry, getLogSummary } from '../../utils/hashUtils';

const TaskScanner = ({ onClose }) => {
  // State management for task scanning and completion
  const [userProfile, setUserProfile] = useState(null);
  const [scannedTask, setScannedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [manualInput, setManualInput] = useState('');

  // Effect hook loads user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  // Load user profile function retrieves profile from localStorage
  const loadUserProfile = () => {
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

  // Process QR code function handles scanned QR code data
  const processQRCode = (qrData) => {
    try {
      const taskData = JSON.parse(qrData);
      
      if (taskData.type === 'task') {
        setScannedTask(taskData);
        setShowTaskDetails(true);
        setMessage('Task scanned successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Invalid QR code. Please scan a task QR code.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      setMessage('Error processing QR code. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Manual input function processes manually entered QR data
  const handleManualInput = () => {
    if (manualInput.trim()) {
      processQRCode(manualInput.trim());
      setManualInput('');
    }
  };

  // Complete task function processes task completion
  const completeTask = async () => {
    if (!scannedTask || !userProfile) {
      setMessage('Missing task or profile information.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsLoading(true);

    try {
      // Create completion log entry
      const completionLog = createLogEntry(
        `Completed task: ${scannedTask.title}`,
        userProfile,
        scannedTask.taskId
      );

      // Add completion notes to log
      completionLog.completionNotes = completionNotes;
      completionLog.completionTime = new Date().toISOString();

      // Save completion log
      const existingLogs = JSON.parse(localStorage.getItem('taskCompletionLogs') || '[]');
      const updatedLogs = [...existingLogs, completionLog];
      localStorage.setItem('taskCompletionLogs', JSON.stringify(updatedLogs));

      // Update task status in tasks array
      const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const updatedTasks = existingTasks.map(task => {
        if (task.id === scannedTask.taskId) {
          return {
            ...task,
            completions: [...(task.completions || []), {
              completedBy: userProfile.name,
              badgeNumber: userProfile.badgeNumber,
              completedAt: new Date().toISOString(),
              notes: completionNotes
            }]
          };
        }
        return task;
      });
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));

      setMessage('Task completed successfully!');
      
      // Reset form and close after delay
      setTimeout(() => {
        setScannedTask(null);
        setShowTaskDetails(false);
        setCompletionNotes('');
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error completing task:', error);
      setMessage('Error completing task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel task function resets task selection
  const cancelTask = () => {
    setScannedTask(null);
    setShowTaskDetails(false);
    setCompletionNotes('');
  };

  // Get priority color function returns color class for priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-600 text-black';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  // Render function returns task scanner interface
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header section displays title and close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <QrCode className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Task Scanner</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content area displays scanner interface and task details */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
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

            {/* Scanner section provides QR code scanning interface */}
            {!showTaskDetails && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-4">Scan Task QR Code</h3>
                  <div className="bg-gray-700 p-8 rounded-lg">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-4">Point your camera at the task QR code</p>
                    <p className="text-sm text-gray-400">QR scanning functionality would be implemented here</p>
                  </div>
                </div>

                {/* Manual input section provides fallback for manual entry */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-3">Manual Entry</h4>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Paste QR code data here..."
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      rows={3}
                      className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
                    />
                    <button
                      onClick={handleManualInput}
                      disabled={!manualInput.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Process QR Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Task details section displays scanned task information */}
            {showTaskDetails && scannedTask && (
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-white font-medium">{scannedTask.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(scannedTask.priority)}`}>
                          {scannedTask.priority}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{scannedTask.description}</p>
                      
                      {scannedTask.instructions && (
                        <div className="mb-3">
                          <h4 className="text-white font-medium mb-1">Instructions:</h4>
                          <p className="text-gray-300 text-sm">{scannedTask.instructions}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        {scannedTask.dueDate && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Due: {new Date(scannedTask.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {scannedTask.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>Location: {scannedTask.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completion section provides task completion interface */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-3">Complete Task</h4>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Add completion notes (optional)..."
                      value={completionNotes}
                      onChange={(e) => setCompletionNotes(e.target.value)}
                      rows={3}
                      className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={completeTask}
                        disabled={isLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        {isLoading ? 'Completing...' : 'Complete Task'}
                      </button>
                      <button
                        onClick={cancelTask}
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

export default TaskScanner;
