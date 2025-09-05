/**
 * Modal Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Modal component provides overlay functionality with compound component pattern
 * 30% LOC will be implemented for further development
 */

// React library provides component functionality and JSX rendering capabilities
import React from 'react';
// Lucide React provides icon components for user interface elements
import { X } from 'lucide-react';

/**
 * Modal component provides overlay functionality with compound component pattern
 * Component creates modal dialog with backdrop and configurable size options
 * @param {React.ReactNode} children - Child components to render inside modal
 * @param {boolean} isOpen - Modal visibility state controls component rendering
 * @param {function} onClose - Close handler function manages modal dismissal
 * @param {string} size - Size variant determines modal width and layout constraints
 */
const Modal = ({ children, isOpen, onClose, size = 'default' }) => {
  // Conditional rendering prevents modal display when visibility state is false
  if (!isOpen) return null;

  // Size configuration object maps size variants to Tailwind CSS width classes
  const sizeClasses = {
    small: 'max-w-md',
    default: 'max-w-2xl',
    large: 'max-w-4xl',
    xlarge: 'max-w-6xl'
  };

  // Modal container provides backdrop overlay and centered positioning
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-gray-900 rounded-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}>
        {children}
      </div>
    </div>
  );
};

/**
 * Modal header sub-component provides title display and close button functionality
 * Component creates header section with background styling and action buttons
 * @param {React.ReactNode} children - Header content to display in title area
 * @param {function} onClose - Close handler function triggers modal dismissal
 * @param {string} className - Additional CSS classes for custom styling
 */
Modal.Header = ({ children, onClose, className = '' }) => (
  <div className={`bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700 ${className}`}>
    <div className="flex-1">{children}</div>
    {onClose && (
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>
    )}
  </div>
);

/**
 * Modal body sub-component provides content area with scrolling functionality
 * Component creates main content section with padding and overflow handling
 * @param {React.ReactNode} children - Body content to display in main area
 * @param {string} className - Additional CSS classes for custom styling
 */
Modal.Body = ({ children, className = '' }) => (
  <div className={`p-6 overflow-y-auto max-h-[70vh] ${className}`}>
    {children}
  </div>
);

/**
 * Modal footer sub-component provides action button area with border styling
 * Component creates footer section with background styling and border separation
 * @param {React.ReactNode} children - Footer content to display in action area
 * @param {string} className - Additional CSS classes for custom styling
 */
Modal.Footer = ({ children, className = '' }) => (
  <div className={`bg-gray-800 p-4 border-t border-gray-700 ${className}`}>
    {children}
  </div>
);

export default Modal;
