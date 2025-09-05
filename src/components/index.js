/**
 * Components Barrel Exports
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Barrel export file provides clean import paths for all components
 * 30% LOC will be implemented for further development
 */

// Core UI Components
export { default as Header } from './Header';
export { default as Navigation } from './Navigation';
export { default as Overview } from './Overview';
export { default as PostOrders } from './PostOrders';
export { default as Emergency } from './Emergency';
export { default as Contacts } from './Contacts';
export { default as Acknowledgment } from './Acknowledgment';
export { default as DailyChecklist } from './DailyChecklist';

// Modal Components
export { default as CameraCapture } from './CameraCapture';
export { default as QRScanner } from './QRScanner';
export { default as DocumentScanner } from './DocumentScanner';
export { default as QRUpdateManager } from './QRUpdateManager';
export { default as DailyCheckIn } from './DailyCheckIn';
export { default as QRCodeGenerator } from './QRCodeGenerator';

// Branding Components
export { default as WTCLogo } from './WTCLogo';

// Admin Panel Components
export * from './AdminPanel';

// User Profile Components
export * from './UserProfile';

// Daily Check-In Components
export { default as StreamlinedCheckIn } from './DailyCheckIn/StreamlinedCheckIn';
export { default as LogViewer } from './DailyCheckIn/LogViewer';

// Task Manager Components
export * from './TaskManager';

// Modal Compound Component
export { default as Modal } from './Modal/Modal';

// Error Handling Components
export { default as ErrorBoundary } from './ErrorBoundary';
