/**
 * Admin Panel Main Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Main admin panel component coordinates data management and tab navigation
 * 30% LOC will be implemented for further development
 */
import React, { useState, useEffect } from 'react';

import { Settings, X } from 'lucide-react';
import PostsTab from './PostsTab';
import ContactsTab from './ContactsTab';
import CodesTab from './CodesTab';

const AdminPanel = ({ onClose }) => {
  // Tab state manages current active tab for content display
  const [activeTab, setActiveTab] = useState('posts');
  
  // Data state manages posts, contacts, and emergency codes arrays
  const [posts, setPosts] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [emergencyCodes, setEmergencyCodes] = useState([]);
  
  // UI state manages message display and form visibility
  const [message, setMessage] = useState('');

  // Effect hook loads data from localStorage on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Load function retrieves data from localStorage or sets default values
  const loadData = () => {
    const savedPosts = localStorage.getItem('vsc_posts');
    const savedContacts = localStorage.getItem('vsc_emergency_contacts');
    const savedCodes = localStorage.getItem('vsc_emergency_codes');

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts([
        { id: 'credentialer-entry', title: 'Credentialer - Entry Lane', booth: '324', shift: '24/7' },
        { id: 'credentialer-exit', title: 'Credentialer - Exit Lane', booth: '314', shift: '24/7' },
        { id: 'screening-inspector', title: 'Screening Inspector', booth: '325', shift: '24/7' },
        { id: 'lane-controller', title: 'Screening Lane Controller', booth: '282', shift: '24/7' },
        { id: 'equipment-operator', title: 'Equipment Operator', booth: 'M227/M229', shift: '24/7' },
        { id: 'image-interpreter', title: 'Image Interpreter', booth: 'M106', shift: '24/7' },
        { id: 'facility-coordinator', title: 'Facility Coordinator', booth: 'VSOC', shift: '0800-1600' },
        { id: 'radiation-officer', title: 'Radiation Safety Officer', booth: 'VSOC', shift: '0800-1600' },
        { id: 'vsc-manager', title: 'VSC Screening Manager', booth: 'M106', shift: '24/7' }
      ]);
    }

    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    } else {
      setEmergencyContacts([
        { name: 'SACC', number: '(212) 435-5903', purpose: 'All incidents', priority: 'primary' },
        { name: 'Project Manager', number: '(718) 872-8717', purpose: 'Major incidents', priority: 'primary' },
        { name: 'Hub OCC', number: '(212) 435-4700', purpose: 'Equipment only', priority: 'secondary' },
        { name: 'VS3 Desk', number: '(212) 435-5909', purpose: 'Vehicle screening', priority: 'secondary' }
      ]);
    }

    if (savedCodes) {
      setEmergencyCodes(JSON.parse(savedCodes));
    } else {
      setEmergencyCodes([
        { code: '10-2', description: 'Security Emergency - Lockdown', action: 'Immediate lockdown procedures', severity: 'critical' },
        { code: '10-3', description: 'Security Emergency - Threat', action: 'Secure position, await instructions', severity: 'critical' },
        { code: 'Code Yellow', description: 'Access Control Failure', action: 'Redeploy to designated location', severity: 'warning' }
      ]);
    }
  };

  // Save function persists all data to localStorage for offline storage
  const saveData = () => {
    localStorage.setItem('vsc_posts', JSON.stringify(posts));
    localStorage.setItem('vsc_emergency_contacts', JSON.stringify(emergencyContacts));
    localStorage.setItem('vsc_emergency_codes', JSON.stringify(emergencyCodes));
    setMessage('Data saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Tab change handler updates active tab state for content switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Render function determines which tab content to display based on active state
  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <PostsTab
            posts={posts}
            setPosts={setPosts}
            onSave={saveData}
          />
        );
      case 'contacts':
        return (
          <ContactsTab
            contacts={emergencyContacts}
            setContacts={setEmergencyContacts}
            onSave={saveData}
          />
        );
      case 'codes':
        return (
          <CodesTab
            codes={emergencyCodes}
            setCodes={setEmergencyCodes}
            onSave={saveData}
          />
        );
      default:
        return null;
    }
  };

  // Main render function returns admin panel layout with tabs and content
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header section displays title and close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Admin Panel</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Tab navigation provides content switching functionality */}
        <div className="flex border-b border-gray-700">
          {['posts', 'contacts', 'codes'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content area displays current tab component */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderTabContent()}
        </div>

        {/* Message display shows save confirmation and status updates */}
        {message && (
          <div className="p-4 bg-green-600 text-white text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
