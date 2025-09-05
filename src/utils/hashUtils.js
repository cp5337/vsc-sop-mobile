/**
 * Hash Utilities
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Utility functions for creating immutable hashes and log entries
 * 30% LOC will be implemented for further development
 */

// Simple hash function creates deterministic hash from input string
const simpleHash = (input) => {
  let hash = 0;
  if (input.length === 0) return hash.toString();
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
};

// Create immutable log entry function generates hash and timestamp
const createLogEntry = (action, userProfile, postId = null) => {
  const timestamp = new Date().toISOString();
  const userInfo = userProfile ? {
    name: userProfile.name || 'Unknown',
    badge: userProfile.badgeNumber || 'N/A',
    position: userProfile.position || 'N/A'
  } : { name: 'Unknown', badge: 'N/A', position: 'N/A' };
  
  // Create log data object with all relevant information
  const logData = {
    action,
    user: userInfo,
    postId,
    timestamp,
    date: timestamp.split('T')[0] // YYYY-MM-DD format
  };
  
  // Create hash from log data for immutability
  const dataString = JSON.stringify(logData);
  const hash = simpleHash(dataString);
  
  // Return immutable log entry with hash
  return {
    ...logData,
    hash,
    immutable: true
  };
};

// Create check-in log entry function generates specific check-in log
const createCheckInLog = (userProfile, postId, acknowledged) => {
  const action = acknowledged 
    ? `Checked in to ${postId} with acknowledged post orders`
    : `Checked in to ${postId} - post orders not acknowledged`;
  
  return createLogEntry(action, userProfile, postId);
};

// Create acknowledgment log entry function generates acknowledgment log
const createAcknowledgmentLog = (userProfile, postId) => {
  const action = `Acknowledged post orders for ${postId}`;
  return createLogEntry(action, userProfile, postId);
};

// Validate log entry function checks hash integrity
const validateLogEntry = (logEntry) => {
  if (!logEntry.hash || !logEntry.immutable) {
    return false;
  }
  
  // Recreate hash from log data
  const { hash, immutable, ...logData } = logEntry;
  const dataString = JSON.stringify(logData);
  const expectedHash = simpleHash(dataString);
  
  return hash === expectedHash;
};

// Get log summary function creates human-readable log summary
const getLogSummary = (logEntry) => {
  const time = new Date(logEntry.timestamp).toLocaleTimeString();
  const date = new Date(logEntry.timestamp).toLocaleDateString();
  
  return `${date} ${time} - ${logEntry.user.name} (Badge #${logEntry.user.badge}) ${logEntry.action}`;
};

export {
  simpleHash,
  createLogEntry,
  createCheckInLog,
  createAcknowledgmentLog,
  validateLogEntry,
  getLogSummary
};
