/**
 * Async Operation Hook
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Custom hook manages async operations with loading, error, and success states
 * Eliminates duplicate async operation patterns across components
 */

import { useState, useCallback } from 'react';

const useAsyncOperation = (initialState = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(initialState.data || null);
  const [success, setSuccess] = useState(false);

  // Execute async operation function
  const execute = useCallback(async (asyncFunction, ...args) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await asyncFunction(...args);
      
      setData(result);
      setSuccess(true);
      return result;
    } catch (error) {
      setError(error.message || 'An error occurred');
      setSuccess(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset state function
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(initialState.data || null);
    setSuccess(false);
  }, [initialState.data]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Set success function
  const setSuccessState = useCallback((successState) => {
    setSuccess(successState);
  }, []);

  return {
    isLoading,
    error,
    data,
    success,
    execute,
    reset,
    clearError,
    setSuccessState
  };
};

export default useAsyncOperation;
