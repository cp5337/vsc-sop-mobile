/**
 * Application Header Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Header component displays application branding and navigation controls
 * 30% LOC will be implemented for further development
 */

import React from 'react';
import { Menu, X } from 'lucide-react';
import WTCLogo from './WTCLogo';
import { ProfileAvatar } from './UserProfile';

const Header = ({ menuOpen, setMenuOpen, onProfileClick }) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700 sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <WTCLogo size="small" showTagline={false} />
          <div>
            <h1 className="text-xl font-bold text-white">VSC SOP</h1>
            <p className="text-xs text-blue-200">v2.0</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* Profile avatar displays user selfie or initials with click handler */}
          <ProfileAvatar
            profile={JSON.parse(localStorage.getItem('userProfile') || '{}')}
            onClick={onProfileClick}
            size="default"
          />
          
          {/* Menu toggle button controls navigation visibility */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
