/**
 * Allied Universal Logo Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Reusable logo component for Allied Universal Security branding
 * Provides consistent branding with customizable size and tagline options
 */
import React from 'react';
import { Shield } from 'lucide-react';

const AlliedUniversalLogo = ({ size = 'default', showTagline = true, className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    default: 'text-lg',
    large: 'text-xl',
    xlarge: 'text-2xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Shield className={`${sizeClasses[size]} text-white mr-3`} />
      <div>
        <div className={`font-bold text-white ${textSizes[size]}`}>
          Security Operations
        </div>
        {showTagline && (
          <div className="text-blue-200 text-xs">
            Securing Your World
          </div>
        )}
      </div>
    </div>
  );
};

export default AlliedUniversalLogo;
