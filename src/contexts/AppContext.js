/**
 * Application Context
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Global application context for state management
 * Implements Context API pattern to eliminate props drilling
 */

import React, { createContext, useContext, useReducer } from 'react';

// Initial state for application context
const initialState = {
  // Navigation state
  activeSection: 'overview',
  menuOpen: false,
  
  // Modal states
  modals: {
    showCamera: false,
    showQRScanner: false,
    showDocumentScanner: false,
    showAdminPanel: false,
    showQRUpdateManager: false,
    showDailyCheckIn: false,
    showQRCodeGenerator: false,
    showUserProfile: false,
    showLogViewer: false,
    showTaskManager: false,
    showTaskScanner: false,
    showTaskDashboard: false,
    showIncidentReport: false
  },
  
  // User state
  user: {
    profile: null,
    acknowledgedPosts: []
  },
  
  // Application state
  app: {
    capturedImages: [],
    message: null
  }
};

// Action types for reducer
const ActionTypes = {
  SET_ACTIVE_SECTION: 'SET_ACTIVE_SECTION',
  SET_MENU_OPEN: 'SET_MENU_OPEN',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  CLOSE_ALL_MODALS: 'CLOSE_ALL_MODALS',
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  SET_ACKNOWLEDGED_POSTS: 'SET_ACKNOWLEDGED_POSTS',
  ADD_ACKNOWLEDGED_POST: 'ADD_ACKNOWLEDGED_POST',
  SET_CAPTURED_IMAGES: 'SET_CAPTURED_IMAGES',
  ADD_CAPTURED_IMAGE: 'ADD_CAPTURED_IMAGE',
  SET_MESSAGE: 'SET_MESSAGE',
  CLEAR_MESSAGE: 'CLEAR_MESSAGE'
};

// Reducer function for state management
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_SECTION:
      return {
        ...state,
        activeSection: action.payload
      };
      
    case ActionTypes.SET_MENU_OPEN:
      return {
        ...state,
        menuOpen: action.payload
      };
      
    case ActionTypes.OPEN_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: true
        }
      };
      
    case ActionTypes.CLOSE_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: false
        }
      };
      
    case ActionTypes.CLOSE_ALL_MODALS:
      return {
        ...state,
        modals: Object.keys(state.modals).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {})
      };
      
    case ActionTypes.SET_USER_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          profile: action.payload
        }
      };
      
    case ActionTypes.SET_ACKNOWLEDGED_POSTS:
      return {
        ...state,
        user: {
          ...state.user,
          acknowledgedPosts: action.payload
        }
      };
      
    case ActionTypes.ADD_ACKNOWLEDGED_POST:
      return {
        ...state,
        user: {
          ...state.user,
          acknowledgedPosts: [...state.user.acknowledgedPosts, action.payload]
        }
      };
      
    case ActionTypes.SET_CAPTURED_IMAGES:
      return {
        ...state,
        app: {
          ...state.app,
          capturedImages: action.payload
        }
      };
      
    case ActionTypes.ADD_CAPTURED_IMAGE:
      return {
        ...state,
        app: {
          ...state.app,
          capturedImages: [...state.app.capturedImages, action.payload]
        }
      };
      
    case ActionTypes.SET_MESSAGE:
      return {
        ...state,
        app: {
          ...state.app,
          message: action.payload
        }
      };
      
    case ActionTypes.CLEAR_MESSAGE:
      return {
        ...state,
        app: {
          ...state.app,
          message: null
        }
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    setActiveSection: (section) => 
      dispatch({ type: ActionTypes.SET_ACTIVE_SECTION, payload: section }),
      
    setMenuOpen: (isOpen) => 
      dispatch({ type: ActionTypes.SET_MENU_OPEN, payload: isOpen }),
      
    openModal: (modalName) => 
      dispatch({ type: ActionTypes.OPEN_MODAL, payload: modalName }),
      
    closeModal: (modalName) => 
      dispatch({ type: ActionTypes.CLOSE_MODAL, payload: modalName }),
      
    closeAllModals: () => 
      dispatch({ type: ActionTypes.CLOSE_ALL_MODALS }),
      
    setUserProfile: (profile) => 
      dispatch({ type: ActionTypes.SET_USER_PROFILE, payload: profile }),
      
    setAcknowledgedPosts: (posts) => 
      dispatch({ type: ActionTypes.SET_ACKNOWLEDGED_POSTS, payload: posts }),
      
    addAcknowledgedPost: (postId) => 
      dispatch({ type: ActionTypes.ADD_ACKNOWLEDGED_POST, payload: postId }),
      
    setCapturedImages: (images) => 
      dispatch({ type: ActionTypes.SET_CAPTURED_IMAGES, payload: images }),
      
    addCapturedImage: (image) => 
      dispatch({ type: ActionTypes.ADD_CAPTURED_IMAGE, payload: image }),
      
    setMessage: (message) => 
      dispatch({ type: ActionTypes.SET_MESSAGE, payload: message }),
      
    clearMessage: () => 
      dispatch({ type: ActionTypes.CLEAR_MESSAGE })
  };

  const value = {
    state,
    actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Export action types for external use
export { ActionTypes };

export default AppContext;
