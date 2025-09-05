/**
 * Lazy Loader Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Lazy loading wrapper for heavy components to improve initial load performance
 * 30% LOC will be implemented for further development
 */

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Loading fallback component with spinner
const LoadingFallback = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
      <p className="text-gray-300">{message}</p>
    </div>
  </div>
);

// Error boundary for lazy loaded components
class LazyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-red-400 mb-2">Failed to load component</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy loader hook for conditional loading
export const useLazyComponent = (importFunction, dependencies = []) => {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComponent = React.useCallback(async () => {
    if (Component) return Component;
    
    setLoading(true);
    setError(null);
    
    try {
      const module = await importFunction();
      const LazyComponent = module.default || module;
      setComponent(() => LazyComponent);
      return LazyComponent;
    } catch (err) {
      console.error('Error loading lazy component:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [Component, ...dependencies]);

  return { Component, loading, error, loadComponent };
};

// Lazy wrapper for heavy components
export const withLazyLoading = (importFunction, fallbackMessage) => {
  const LazyComponent = lazy(importFunction);
  
  return (props) => (
    <LazyErrorBoundary>
      <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );
};

// Preload function for critical components
export const preloadComponent = (importFunction) => {
  return importFunction().catch(error => {
    console.warn('Failed to preload component:', error);
  });
};

// Lazy modal wrapper for expensive modals
export const LazyModal = ({ 
  isOpen, 
  onClose, 
  importFunction, 
  fallbackMessage = 'Loading modal...',
  ...props 
}) => {
  const { Component, loading, error, loadComponent } = useLazyComponent(importFunction, [isOpen]);

  useEffect(() => {
    if (isOpen && !Component && !loading) {
      loadComponent();
    }
  }, [isOpen, Component, loading, loadComponent]);

  if (!isOpen) return null;

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-red-400 mb-4">Failed to load modal</p>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (loading || !Component) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8">
          <LoadingFallback message={fallbackMessage} />
        </div>
      </div>
    );
  }

  return <Component onClose={onClose} {...props} />;
};

// Lazy component registry for centralized management
export const LazyComponentRegistry = {
  // Heavy components that should be lazy loaded
  TaskManager: () => import('../TaskManager/TaskManager'),
  TaskDashboard: () => import('../TaskManager/TaskDashboard'),
  TaskScanner: () => import('../TaskManager/TaskScanner'),
  UserProfile: () => import('../UserProfile/UserProfile'),
  AdminPanel: () => import('../AdminPanel/AdminPanel'),
  DocumentScanner: () => import('../DocumentScanner'),
  QRUpdateManager: () => import('../QRUpdateManager'),
  
  // Preload critical components
  preloadCritical: () => {
    preloadComponent(() => import('../UserProfile/UserProfile'));
    preloadComponent(() => import('../DailyCheckIn/StreamlinedCheckIn'));
  }
};

export default LazyModal;
