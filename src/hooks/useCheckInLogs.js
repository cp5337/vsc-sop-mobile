/**
 * Check-In Logs Management Hook
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Custom hook manages check-in logs state and localStorage persistence
 * Eliminates duplicate localStorage access patterns across DailyCheckIn components
 */

import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const useCheckInLogs = () => {
  // Use existing useLocalStorage hook for consistency
  const [checkInLogs, setCheckInLogs] = useLocalStorage('checkInLogs', []);
  const [acknowledgedPosts, setAcknowledgedPosts] = useLocalStorage('acknowledgedPosts', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add check-in log function
  const addCheckInLog = useCallback((logData) => {
    try {
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...logData
      };
      
      setCheckInLogs(prev => [...prev, newLog]);
      return newLog;
    } catch (error) {
      setError('Error adding check-in log: ' + error.message);
      return null;
    }
  }, [setCheckInLogs]);

  // Acknowledge post function
  const acknowledgePost = useCallback((postId) => {
    try {
      if (!acknowledgedPosts.includes(postId)) {
        setAcknowledgedPosts(prev => [...prev, postId]);
        
        // Create acknowledgment log entry
        const acknowledgmentLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type: 'acknowledgment',
          postId,
          action: 'Post order acknowledged'
        };
        
        setCheckInLogs(prev => [...prev, acknowledgmentLog]);
        return true;
      }
      return false;
    } catch (error) {
      setError('Error acknowledging post: ' + error.message);
      return false;
    }
  }, [acknowledgedPosts, setAcknowledgedPosts, setCheckInLogs]);

  // Check if post is acknowledged
  const isPostAcknowledged = useCallback((postId) => {
    return acknowledgedPosts.includes(postId);
  }, [acknowledgedPosts]);

  // Get today's check-ins
  const getTodaysCheckIns = useCallback(() => {
    const today = new Date().toDateString();
    return checkInLogs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    );
  }, [checkInLogs]);

  // Export logs function
  const exportLogs = useCallback(() => {
    try {
      const dataStr = JSON.stringify(checkInLogs, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', `check-in-logs-${new Date().toISOString().split('T')[0]}.json`);
      linkElement.click();
      
      return true;
    } catch (error) {
      setError('Error exporting logs: ' + error.message);
      return false;
    }
  }, [checkInLogs]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    checkInLogs,
    acknowledgedPosts,
    isLoading,
    error,
    addCheckInLog,
    acknowledgePost,
    isPostAcknowledged,
    getTodaysCheckIns,
    exportLogs,
    clearError
  };
};

export default useCheckInLogs;
