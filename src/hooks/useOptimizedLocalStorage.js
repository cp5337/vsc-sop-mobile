/**
 * Optimized LocalStorage Hook
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Optimized localStorage hook with caching and batch operations
 * 30% LOC will be implemented for further development
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Global cache for localStorage data
const localStorageCache = new Map();
const pendingWrites = new Map();

// Debounced write function to batch localStorage operations
const debouncedWrite = (() => {
  let timeoutId = null;
  
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // Batch write all pending operations
      pendingWrites.forEach((value, key) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          localStorageCache.set(key, value);
        } catch (error) {
          console.error(`Error writing to localStorage key "${key}":`, error);
        }
      });
      pendingWrites.clear();
    }, 100); // 100ms debounce
  };
})();

const useOptimizedLocalStorage = (key, initialValue) => {
  // State variable tracks current value with caching
  const [storedValue, setStoredValue] = useState(() => {
    // Check cache first
    if (localStorageCache.has(key)) {
      return localStorageCache.get(key);
    }
    
    try {
      const item = localStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;
      localStorageCache.set(key, value);
      return value;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Ref tracks if component is mounted to prevent memory leaks
  const isMountedRef = useRef(true);

  // Cleanup effect prevents memory leaks on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Optimized setter function with caching and debounced writes
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update cache immediately
      localStorageCache.set(key, valueToStore);
      
      // Update state only if component is mounted
      if (isMountedRef.current) {
        setStoredValue(valueToStore);
      }
      
      // Queue for debounced write
      pendingWrites.set(key, valueToStore);
      debouncedWrite();
      
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Batch update function for multiple keys
  const batchUpdate = useCallback((updates) => {
    try {
      Object.entries(updates).forEach(([updateKey, updateValue]) => {
        const valueToStore = updateValue instanceof Function ? updateValue(storedValue) : updateValue;
        localStorageCache.set(updateKey, valueToStore);
        pendingWrites.set(updateKey, valueToStore);
      });
      
      if (isMountedRef.current) {
        setStoredValue(updates[key] || storedValue);
      }
      
      debouncedWrite();
    } catch (error) {
      console.error('Error in batch update:', error);
    }
  }, [key, storedValue]);

  // Clear cache function for specific key
  const clearCache = useCallback((clearKey = key) => {
    localStorageCache.delete(clearKey);
    pendingWrites.delete(clearKey);
  }, [key]);

  // Hook returns optimized value and setter functions
  return [storedValue, setValue, { batchUpdate, clearCache }];
};

export default useOptimizedLocalStorage;
