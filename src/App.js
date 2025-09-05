/**
 * VSC SOP Mobile Application
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Main application component manages global state and routing functionality
 * 30% LOC will be implemented for further development
 */

// React imports provide component functionality and state management hooks
import React, { useState, useEffect } from 'react';

// Component imports provide clean barrel exports for better organization
import {
  Header,
  Navigation,
  Overview,
  PostOrders,
  Emergency,
  Contacts,
  Acknowledgment,
  DailyChecklist,
  CameraCapture,
  QRScanner,
  DocumentScanner,
  AdminPanel,
  QRUpdateManager,
  QRCodeGenerator,
  UserProfile,
  TaskManager,
  TaskScanner,
  TaskDashboard,
  StreamlinedCheckIn,
  LogViewer
} from './components';
import IncidentReport from './components/IncidentReport';

// Data imports provide static configuration and emergency information
import { posts, emergencyContacts, emergencyCodes } from './data/constants';

/**
 * Main application component manages global state and routing functionality
 * App component coordinates user interface navigation and modal interactions
 */
const App = () => {
  // Navigation state manages current section display and menu visibility
  const [activeSection, setActiveSection] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Data state manages acknowledged posts and captured image storage
  const [acknowledgedPosts, setAcknowledgedPosts] = useState([]);
  const [capturedImages, setCapturedImages] = useState([]);
  
  // Modal state controls visibility of overlay components and user interactions
  const [showCamera, setShowCamera] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showQRUpdateManager, setShowQRUpdateManager] = useState(false);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [showQRCodeGenerator, setShowQRCodeGenerator] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLogViewer, setShowLogViewer] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);
  const [showTaskScanner, setShowTaskScanner] = useState(false);
  const [showTaskDashboard, setShowTaskDashboard] = useState(false);
  const [showIncidentReport, setShowIncidentReport] = useState(false);


  // Effect hook loads acknowledged posts from local storage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('acknowledgedPosts');
    if (saved) {
      setAcknowledgedPosts(JSON.parse(saved));
    }
  }, []);

  // Handler function processes post acknowledgment and updates local storage
  const handleAcknowledge = (postId) => {
    const updated = [...acknowledgedPosts, postId];
    setAcknowledgedPosts(updated);
    localStorage.setItem('acknowledgedPosts', JSON.stringify(updated));
  };

  // Handler function processes quick action buttons and manages navigation state
  const handleQuickAction = (action) => {
    switch (action) {
      case 'emergency':
        setActiveSection('emergency');
        break;
      case 'incident-report':
        setShowIncidentReport(true);
        break;
      case 'checklist':
        setActiveSection('checklist');
        break;
      case 'posts':
        setActiveSection('posts');
        break;
      case 'camera':
        setShowCamera(true);
        break;
      case 'qr':
        setShowQRScanner(true);
        break;
      case 'document':
        setShowDocumentScanner(true);
        break;
      case 'admin':
        setShowAdminPanel(true);
        break;
      case 'qr-updates':
        setShowQRUpdateManager(true);
        break;
      case 'daily-checkin':
        setShowDailyCheckIn(true);
        break;
      case 'qr-generator':
        setShowQRCodeGenerator(true);
        break;
      case 'view-logs':
        setShowLogViewer(true);
        break;
      case 'task-manager':
        setShowTaskManager(true);
        break;
      case 'task-scanner':
        setShowTaskScanner(true);
        break;
      case 'task-dashboard':
        setShowTaskDashboard(true);
        break;
      default:
        break;
    }
  };

  // Handler function processes captured image data and updates storage state
  const handleImageCapture = (imageData) => {
    const newImage = {
      id: Date.now(),
      data: imageData,
      timestamp: new Date().toISOString()
    };
    setCapturedImages(prev => [...prev, newImage]);
    localStorage.setItem('capturedImages', JSON.stringify([...capturedImages, newImage]));
  };

  // Handler function processes QR code scan data and displays result
  const handleQRScan = (qrData) => {
    alert(`QR Code scanned: ${qrData}`);
  };

  // Handler function processes document scan data for future processing
  const handleDocumentScan = (document) => {
    // Document processing could add data to list or send to server
  };

  // Profile update handler processes user profile changes and updates state
  const handleProfileUpdate = (updatedProfile) => {
    // Profile update could trigger additional actions like log updates
    console.log('Profile updated:', updatedProfile);
  };

  // Render function determines which section component to display based on active state
  const renderSection = () => {
    try {
      switch (activeSection) {
        case 'overview':
          return <Overview onQuickAction={handleQuickAction} />;
        case 'posts':
          return <PostOrders posts={posts} acknowledgedPosts={acknowledgedPosts} onAcknowledge={handleAcknowledge} />;
        case 'emergency':
          return <Emergency emergencyCodes={emergencyCodes} onBack={() => setActiveSection('overview')} />;
        case 'contacts':
          return <Contacts contacts={emergencyContacts} onBack={() => setActiveSection('overview')} />;
        case 'acknowledgment':
          return <Acknowledgment posts={posts} acknowledgedPosts={acknowledgedPosts} onAcknowledge={handleAcknowledge} />;
        case 'checklist':
          return <DailyChecklist onBack={() => setActiveSection('overview')} />;
        default:
          return <Overview onQuickAction={handleQuickAction} />;
      }
    } catch (error) {
      console.error('Error rendering section:', error);
      return (
        <div className="p-4">
          <h2 className="text-red-400 text-xl font-bold">Error Loading Section</h2>
          <p className="text-gray-300 mt-2">There was an error loading the {activeSection} section.</p>
          <p className="text-sm text-gray-500 mt-2">Check the console for details.</p>
        </div>
      );
    }
  };

  // Main render function returns application layout with header, navigation, and content
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header component displays application title, profile avatar, and menu toggle button */}
      <Header 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        onProfileClick={() => setShowUserProfile(true)}
      />
      
      {/* Navigation component displays sidebar menu when menu state is open */}
      {menuOpen && (
        <Navigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          setMenuOpen={setMenuOpen} 
        />
      )}

      {/* Main content area renders current section based on active state */}
      <main className="p-4 pb-20">
        {renderSection()}
      </main>

      {/* Camera capture modal provides photo taking functionality for security documentation */}
      {showCamera && (
        <CameraCapture
          onCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* QR scanner modal provides code scanning functionality for quick access */}
      {showQRScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {/* Document scanner modal provides document capture functionality for credential verification */}
      {showDocumentScanner && (
        <DocumentScanner
          onScan={handleDocumentScan}
          onClose={() => setShowDocumentScanner(false)}
        />
      )}

      {/* Admin panel modal provides content management functionality for supervisors */}
      {showAdminPanel && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
        />
      )}

      {/* QR update manager modal provides update distribution functionality for system maintenance */}
      {showQRUpdateManager && (
        <QRUpdateManager
          onClose={() => setShowQRUpdateManager(false)}
        />
      )}

      {/* Daily check-in modal provides streamlined check-in with post acknowledgment */}
      {showDailyCheckIn && (
        <StreamlinedCheckIn
          onClose={() => setShowDailyCheckIn(false)}
        />
      )}

      {/* QR code generator modal provides code creation functionality for task assignment */}
      {showQRCodeGenerator && (
        <QRCodeGenerator
          onClose={() => setShowQRCodeGenerator(false)}
        />
      )}

      {/* User profile modal provides profile management and selfie capture functionality */}
      {showUserProfile && (
        <UserProfile
          onClose={() => setShowUserProfile(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      {/* Log viewer modal provides check-in log viewing functionality for supervisors */}
      {showLogViewer && (
        <LogViewer
          onClose={() => setShowLogViewer(false)}
        />
      )}

      {/* Task manager modal provides task creation and management functionality for supervisors */}
      {showTaskManager && (
        <TaskManager
          onClose={() => setShowTaskManager(false)}
        />
      )}

      {/* Task scanner modal provides task scanning and completion functionality for personnel */}
      {showTaskScanner && (
        <TaskScanner
          onClose={() => setShowTaskScanner(false)}
        />
      )}

      {/* Task dashboard modal provides task completion monitoring functionality for supervisors */}
      {showTaskDashboard && (
        <TaskDashboard
          onClose={() => setShowTaskDashboard(false)}
        />
      )}

      {/* Incident report modal provides incident documentation functionality for security personnel */}
      {showIncidentReport && (
        <IncidentReport
          onClose={() => setShowIncidentReport(false)}
        />
      )}
    </div>
  );
};

export default App;
