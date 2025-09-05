/**
 * Memoized Component Wrapper
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Higher-order component for memoization and performance optimization
 * 30% LOC will be implemented for further development
 */

import React, { memo, useMemo, useCallback } from 'react';

// Memoized component wrapper with performance optimizations
const withMemoization = (Component, options = {}) => {
  const {
    displayName,
    areEqual,
    memoizeProps = true,
    memoizeChildren = true
  } = options;

  const MemoizedComponent = memo(Component, areEqual);
  
  if (displayName) {
    MemoizedComponent.displayName = displayName;
  }

  return MemoizedComponent;
};

// Memoized button component for consistent performance
export const MemoizedButton = memo(({ 
  children, 
  onClick, 
  className, 
  disabled, 
  type = 'button',
  ...props 
}) => {
  // Memoized click handler prevents unnecessary re-renders
  const handleClick = useCallback((e) => {
    if (onClick && !disabled) {
      onClick(e);
    }
  }, [onClick, disabled]);

  // Memoized className prevents unnecessary re-renders
  const memoizedClassName = useMemo(() => {
    const baseClasses = 'px-4 py-2 rounded-lg transition-colors font-medium';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
    return `${baseClasses} ${className || ''} ${disabledClasses}`.trim();
  }, [className, disabled]);

  return (
    <button
      type={type}
      onClick={handleClick}
      className={memoizedClassName}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

// Memoized input component for form performance
export const MemoizedInput = memo(({ 
  value, 
  onChange, 
  placeholder, 
  className, 
  type = 'text',
  ...props 
}) => {
  // Memoized change handler prevents unnecessary re-renders
  const handleChange = useCallback((e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  }, [onChange]);

  // Memoized className prevents unnecessary re-renders
  const memoizedClassName = useMemo(() => {
    const baseClasses = 'w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none';
    return `${baseClasses} ${className || ''}`.trim();
  }, [className]);

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={memoizedClassName}
      {...props}
    />
  );
});

// Memoized modal wrapper for expensive modal components
export const MemoizedModal = memo(({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'default' 
}) => {
  // Don't render if not open
  if (!isOpen) return null;

  // Memoized size classes prevent unnecessary re-renders
  const sizeClasses = useMemo(() => {
    const sizes = {
      small: 'max-w-md',
      default: 'max-w-2xl',
      large: 'max-w-4xl',
      xlarge: 'max-w-6xl'
    };
    return sizes[size] || sizes.default;
  }, [size]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className={`bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses} max-h-[90vh] flex flex-col`}>
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
});

// Performance monitoring hook for development
export const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const currentTime = Date.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered ${renderCount.current} times. Time since last render: ${timeSinceLastRender}ms`);
    }
    
    lastRenderTime.current = currentTime;
  });

  return renderCount.current;
};

export { withMemoization };
