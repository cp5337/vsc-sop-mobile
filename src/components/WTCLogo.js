/**
 * WTC Logo Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Reusable logo component for World Trade Center branding
 * 30% LOC will be implemented for further development
 */

import React from 'react';

const WTCLogo = ({ size = 'default', showTagline = true, className = '' }) => {
  const textSizes = {
    small: 'text-sm',
    default: 'text-lg',
    large: 'text-xl',
    xlarge: 'text-2xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center mr-3">
        {/* Twin Towers representation */}
        <div className="flex items-end space-x-1">
          <div className="w-2 bg-white h-6 rounded-sm"></div>
          <div className="w-2 bg-white h-8 rounded-sm"></div>
        </div>
      </div>
      <div>
        <div className={`font-bold text-white ${textSizes[size]}`}>
          World Trade Center
        </div>
        {showTagline && (
          <div className="text-blue-200 text-xs">
            Port Authority of NY & NJ
          </div>
        )}
      </div>
    </div>
  );
};

export default WTCLogo;
