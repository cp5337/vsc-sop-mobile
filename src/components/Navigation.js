import React from 'react';
import { Shield, User, AlertCircle, Phone, CheckCircle } from 'lucide-react';

const Navigation = ({ activeSection, setActiveSection, setMenuOpen }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'posts', label: 'Post Orders', icon: User },
    { id: 'emergency', label: 'Emergency', icon: AlertCircle },
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'acknowledgment', label: 'Acknowledgment', icon: CheckCircle }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)}>
      <div className="fixed right-0 top-0 h-full w-64 bg-gray-800 border-l border-gray-700 p-4 pt-20">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              setMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
              activeSection === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
