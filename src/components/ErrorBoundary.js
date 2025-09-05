/**
 * Error Boundary Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Error boundary component provides graceful error handling and fallback UI
 * Implements Error Boundary pattern for consistent error management
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  // Static method catches errors during render
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Method catches errors in lifecycle methods and constructors
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  // Reset error state function
  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-6">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.resetError}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-900 rounded text-xs text-red-400 overflow-auto max-h-32">
                  <pre>{this.state.error.toString()}</pre>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
