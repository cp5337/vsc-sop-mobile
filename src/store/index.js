/**
 * Redux Store Configuration
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Centralized Redux store for application state management
 * 30% LOC will be implemented for further development
 */

import { configureStore } from '@reduxjs/toolkit';
import userProfileReducer from './slices/userProfileSlice';
import navigationReducer from './slices/navigationSlice';
import tasksReducer from './slices/tasksSlice';
import logsReducer from './slices/logsSlice';
import adminReducer from './slices/adminSlice';
import uiReducer from './slices/uiSlice';

// Redux store configuration with middleware and dev tools
export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    navigation: navigationReducer,
    tasks: tasksReducer,
    logs: logsReducer,
    admin: adminReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Type definitions for TypeScript-like development
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
