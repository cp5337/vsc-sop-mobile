/**
 * Tasks Management Hook
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Custom hook manages tasks state and localStorage persistence
 * Eliminates duplicate localStorage access patterns across TaskManager components
 */

import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const useTasks = () => {
  // Use existing useLocalStorage hook for consistency
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [completionLogs, setCompletionLogs] = useLocalStorage('taskCompletionLogs', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create new task function
  const createTask = useCallback((taskData) => {
    try {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (error) {
      setError('Error creating task: ' + error.message);
      return null;
    }
  }, [setTasks]);

  // Update task function
  const updateTask = useCallback((taskId, updates) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));
    } catch (error) {
      setError('Error updating task: ' + error.message);
    }
  }, [setTasks]);

  // Delete task function
  const deleteTask = useCallback((taskId) => {
    try {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      setError('Error deleting task: ' + error.message);
    }
  }, [setTasks]);

  // Complete task function
  const completeTask = useCallback((taskId, completionData) => {
    try {
      const completionLog = {
        id: Date.now().toString(),
        taskId,
        completedAt: new Date().toISOString(),
        ...completionData
      };
      
      setCompletionLogs(prev => [...prev, completionLog]);
      updateTask(taskId, { status: 'completed', completedAt: new Date().toISOString() });
      
      return completionLog;
    } catch (error) {
      setError('Error completing task: ' + error.message);
      return null;
    }
  }, [setCompletionLogs, updateTask]);

  // Get task statistics
  const getTaskStats = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = total - completed;
    
    return { total, completed, pending };
  }, [tasks]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tasks,
    completionLogs,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    getTaskStats,
    clearError
  };
};

export default useTasks;
