import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Overview from './components/Overview';
import PostOrders from './components/PostOrders';
import Emergency from './components/Emergency';
import Contacts from './components/Contacts';
import Acknowledgment from './components/Acknowledgment';
import { posts, emergencyContacts, emergencyCodes } from './data/constants';

const App = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [acknowledgedPosts, setAcknowledgedPosts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('acknowledgedPosts');
    if (saved) {
      setAcknowledgedPosts(JSON.parse(saved));
    }
  }, []);

  const handleAcknowledge = (postId) => {
    const updated = [...acknowledgedPosts, postId];
    setAcknowledgedPosts(updated);
    localStorage.setItem('acknowledgedPosts', JSON.stringify(updated));
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'posts':
        return <PostOrders posts={posts} acknowledgedPosts={acknowledgedPosts} onAcknowledge={handleAcknowledge} />;
      case 'emergency':
        return <Emergency emergencyCodes={emergencyCodes} />;
      case 'contacts':
        return <Contacts contacts={emergencyContacts} />;
      case 'acknowledgment':
        return <Acknowledgment posts={posts} acknowledgedPosts={acknowledgedPosts} onAcknowledge={handleAcknowledge} />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      
      {menuOpen && (
        <Navigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          setMenuOpen={setMenuOpen} 
        />
      )}

      <main className="p-4 pb-20">
        {renderSection()}
      </main>
    </div>
  );
};

export default App;
