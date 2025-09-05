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
import { ProfileAvatar } from './UserProfile';

const Header = ({ menuOpen, setMenuOpen, onProfileClick }) => {
  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600 sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          {/* WTC image provides professional branding and visual identity */}
          <div className="relative">
            <img 
              src="/images/wtc.jpg" 
              alt="World Trade Center" 
              className="w-12 h-12 object-cover rounded-lg border-2 border-slate-400 shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback displays WTC initials if image fails to load */}
            <div className="w-12 h-12 bg-slate-600 rounded-lg border-2 border-slate-400 shadow-lg items-center justify-center hidden">
              <span className="text-white font-bold text-sm">WTC</span>
            </div>
          </div>
          
          {/* Clean app title and version */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white tracking-wide">VSC OPS Tracker</h1>
            <p className="text-sm text-slate-300 font-medium">World Trade Center Security</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* Profile avatar displays user selfie or initials with click handler */}
          <ProfileAvatar
            profile={JSON.parse(localStorage.getItem('userProfile') || '{}')}
            onClick={onProfileClick}
            size="large"
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
