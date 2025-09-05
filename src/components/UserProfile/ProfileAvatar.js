/**
 * Profile Avatar Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Profile avatar component displays user selfie or initials in header
 * 30% LOC will be implemented for further development
 */

import React from 'react';
import { User } from 'lucide-react';

const ProfileAvatar = ({ profile, onClick, size = 'default', showName = false }) => {
  // Size configuration object maps size variants to CSS classes
  const sizeClasses = {
    small: {
      container: 'w-8 h-8',
      text: 'text-xs',
      icon: 'w-4 h-4'
    },
    default: {
      container: 'w-10 h-10',
      text: 'text-sm',
      icon: 'w-5 h-5'
    },
    large: {
      container: 'w-12 h-12',
      text: 'text-base',
      icon: 'w-6 h-6'
    }
  };

  // Get profile initials function returns formatted initials for display
  const getInitials = () => {
    if (profile?.name) {
      const names = profile.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      } else {
        return names[0][0].toUpperCase();
      }
    }
    return '?';
  };

  // Get profile display name function returns formatted name for tooltip
  const getDisplayName = () => {
    if (profile?.name && profile?.badgeNumber) {
      return `${profile.name} (Badge #${profile.badgeNumber})`;
    } else if (profile?.name) {
      return profile.name;
    } else if (profile?.badgeNumber) {
      return `Badge #${profile.badgeNumber}`;
    } else {
      return 'Set up your profile';
    }
  };

  // Size configuration provides CSS classes for different avatar sizes
  const sizeConfig = sizeClasses[size] || sizeClasses.default;

  // Render function returns profile avatar with selfie or initials
  return (
    <div className="flex items-center space-x-2">
      {/* Avatar container displays selfie or initials with click handler */}
      <button
        onClick={onClick}
        className={`${sizeConfig.container} rounded-full border-2 border-blue-400 overflow-hidden bg-gray-600 hover:bg-gray-500 transition-colors flex items-center justify-center`}
        title={getDisplayName()}
      >
        {profile?.selfie ? (
          <img
            src={profile.selfie}
            alt="User profile"
            className="w-full h-full object-cover"
          />
        ) : profile?.name ? (
          <span className={`${sizeConfig.text} font-semibold text-white`}>
            {getInitials()}
          </span>
        ) : (
          <User className={`${sizeConfig.icon} text-white`} />
        )}
      </button>

      {/* Name display shows user name when showName prop is true */}
      {showName && (
        <div className="text-white">
          <div className="text-sm font-medium">
            {profile?.name || 'Unknown User'}
          </div>
          {profile?.position && (
            <div className="text-xs text-gray-300">
              {profile.position}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
