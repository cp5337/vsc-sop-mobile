/**
 * User Profile Redux Slice
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Redux slice for user profile state management
 * 30% LOC will be implemented for further development
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for loading user profile from localStorage
export const loadUserProfile = createAsyncThunk(
  'userProfile/loadUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        return JSON.parse(saved);
      }
      return {
        name: '',
        badgeNumber: '',
        position: '',
        selfie: null,
        lastUpdated: null
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for saving user profile to localStorage
export const saveUserProfile = createAsyncThunk(
  'userProfile/saveUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const updatedProfile = {
        ...profileData,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state for user profile
const initialState = {
  profile: {
    name: '',
    badgeNumber: '',
    position: '',
    selfie: null,
    lastUpdated: null
  },
  loading: false,
  error: null,
  isProfileComplete: false
};

// User profile slice with reducers and extra reducers
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    // Update profile field reducer
    updateProfileField: (state, action) => {
      const { field, value } = action.payload;
      state.profile[field] = value;
      state.isProfileComplete = checkProfileComplete(state.profile);
    },
    
    // Update selfie reducer
    updateSelfie: (state, action) => {
      state.profile.selfie = action.payload;
      state.profile.lastUpdated = new Date().toISOString();
    },
    
    // Clear profile reducer
    clearProfile: (state) => {
      state.profile = initialState.profile;
      state.isProfileComplete = false;
      localStorage.removeItem('userProfile');
    },
    
    // Clear error reducer
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load profile cases
      .addCase(loadUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.isProfileComplete = checkProfileComplete(action.payload);
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save profile cases
      .addCase(saveUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.isProfileComplete = checkProfileComplete(action.payload);
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Helper function to check if profile is complete
const checkProfileComplete = (profile) => {
  return !!(profile.name && profile.badgeNumber && profile.position);
};

// Selectors for accessing user profile state
export const selectUserProfile = (state) => state.userProfile.profile;
export const selectProfileLoading = (state) => state.userProfile.loading;
export const selectProfileError = (state) => state.userProfile.error;
export const selectIsProfileComplete = (state) => state.userProfile.isProfileComplete;

// Selector for profile display name
export const selectProfileDisplayName = (state) => {
  const profile = state.userProfile.profile;
  if (profile.name && profile.badgeNumber) {
    return `${profile.name} (Badge #${profile.badgeNumber})`;
  } else if (profile.name) {
    return profile.name;
  } else if (profile.badgeNumber) {
    return `Badge #${profile.badgeNumber}`;
  } else {
    return 'Unknown User';
  }
};

// Selector for profile initials
export const selectProfileInitials = (state) => {
  const profile = state.userProfile.profile;
  if (profile.name) {
    const names = profile.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    } else {
      return names[0][0].toUpperCase();
    }
  }
  return 'U';
};

export const { 
  updateProfileField, 
  updateSelfie, 
  clearProfile, 
  clearError 
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
