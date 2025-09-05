/**
 * Custom Modal Hook
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Custom hook manages modal visibility state with optimized callback functions
 * 30% LOC will be implemented for further development
 */

// React hooks provide state management and callback optimization for component performance
import { useState, useCallback } from 'react';

/**
 * Custom hook manages modal visibility state with optimized callback functions
 * Hook provides modal control functionality for overlay components and user interactions
 * @param {boolean} initialOpen - The initial modal visibility state on component mount
 * @returns {object} - { isOpen, open, close, toggle } - Modal state and control functions
 */
const useModal = (initialOpen = false) => {
  // State variable tracks current modal visibility status
  const [isOpen, setIsOpen] = useState(initialOpen);

  // Callback function opens modal and sets visibility state to true
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Callback function closes modal and sets visibility state to false
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Callback function toggles modal visibility between open and closed states
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Hook returns modal state and control functions for component usage
  return {
    isOpen,
    open,
    close,
    toggle
  };
};

export default useModal;
