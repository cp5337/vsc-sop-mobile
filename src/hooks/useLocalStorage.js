/**
 * Custom LocalStorage Hook
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Custom hook manages localStorage persistence with React state synchronization
 * 30% LOC will be implemented for further development
 */

// React hooks provide state management and effect functionality for component lifecycle
import { useState, useEffect } from 'react';

/**
 * Custom hook manages localStorage persistence with React state synchronization
 * Hook provides automatic data persistence and retrieval functionality for offline applications
 * @param {string} key - The localStorage key identifier for data storage
 * @param {*} initialValue - The default value if localStorage key does not exist
 * @returns {[*, function]} - [storedValue, setValue] - Current value and setter function
 */
const useLocalStorage = (key, initialValue) => {
  // State initialization retrieves data from localStorage and parses JSON format
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Setter function updates both React state and localStorage with new value
  const setValue = (value) => {
    try {
      // Function parameter allows value updates based on previous state
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // React state update triggers component re-render with new data
      setStoredValue(valueToStore);
      
      // localStorage update persists data across browser sessions
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Hook returns current value and setter function for component usage
  return [storedValue, setValue];
};

export default useLocalStorage;
