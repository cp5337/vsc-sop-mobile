/**
 * User Profile Hook
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Custom hook manages user profile state and provides profile utilities
 * 30% LOC will be implemented for further development
 */

import { useState, useEffect, useCallback } from 'react';

const useUserProfile = () => {
  // Profile state manages user information and selfie data
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved) : {
        name: '',
        badgeNumber: '',
        position: '',
        selfie: null,
        lastUpdated: null
      };
    } catch (error) {
      console.error('Error loading user profile:', error);
      return {
        name: '',
        badgeNumber: '',
        position: '',
        selfie: null,
        lastUpdated: null
      };
    }
  });

  // Profile loaded state tracks whether profile has been initialized
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // Effect hook loads profile from localStorage on component mount
  useEffect(() => {
    const loadProfile = () => {
      try {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
          const parsedProfile = JSON.parse(saved);
          setProfile(parsedProfile);
        }
        setIsProfileLoaded(true);
      } catch (error) {
        console.error('Error loading user profile:', error);
        setIsProfileLoaded(true);
      }
    };

    loadProfile();
  }, []);

  // Update profile function saves profile to localStorage and updates state
  const updateProfile = useCallback((newProfile) => {
    try {
      const updatedProfile = {
        ...newProfile,
        lastUpdated: new Date().toISOString()
      };
      
      setProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }, []);

  // Get profile display name function returns formatted name for logs
  const getProfileDisplayName = useCallback(() => {
    if (profile.name && profile.badgeNumber) {
      return `${profile.name} (Badge #${profile.badgeNumber})`;
    } else if (profile.name) {
      return profile.name;
    } else if (profile.badgeNumber) {
      return `Badge #${profile.badgeNumber}`;
    } else {
      return 'Unknown User';
    }
  }, [profile]);

  // Get profile initials function returns initials for avatar display
  const getProfileInitials = useCallback(() => {
    if (profile.name) {
      const names = profile.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      } else {
        return names[0][0].toUpperCase();
      }
    }
    return 'U';
  }, [profile]);

  // Check if profile is complete function validates required fields
  const isProfileComplete = useCallback(() => {
    return profile.name && profile.badgeNumber && profile.position;
  }, [profile]);

  // Get profile summary function returns formatted profile information
  const getProfileSummary = useCallback(() => {
    return {
      displayName: getProfileDisplayName(),
      initials: getProfileInitials(),
      position: profile.position || 'Position not set',
      hasSelfie: !!profile.selfie,
      lastUpdated: profile.lastUpdated,
      isComplete: isProfileComplete()
    };
  }, [profile, getProfileDisplayName, getProfileInitials, isProfileComplete]);

  // Add profile to log entry function enhances log entries with user information
  const addProfileToLog = useCallback((logEntry) => {
    const profileSummary = getProfileSummary();
    
    return {
      ...logEntry,
      user: {
        name: profile.name,
        badgeNumber: profile.badgeNumber,
        position: profile.position,
        displayName: profileSummary.displayName,
        initials: profileSummary.initials,
        hasSelfie: profileSummary.hasSelfie
      },
      timestamp: new Date().toISOString()
    };
  }, [profile, getProfileSummary]);

  // Clear profile function removes profile from localStorage
  const clearProfile = useCallback(() => {
    try {
      localStorage.removeItem('userProfile');
      setProfile({
        name: '',
        badgeNumber: '',
        position: '',
        selfie: null,
        lastUpdated: null
      });
    } catch (error) {
      console.error('Error clearing user profile:', error);
    }
  }, []);

  // Hook returns profile state and utility functions
  return {
    profile,
    isProfileLoaded,
    updateProfile,
    getProfileDisplayName,
    getProfileInitials,
    isProfileComplete,
    getProfileSummary,
    addProfileToLog,
    clearProfile
  };
};

export default useUserProfile;
