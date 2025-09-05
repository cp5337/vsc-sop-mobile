/**
 * Application Entry Point
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Main entry point for the VSC OPS Tracker React application
 * Initializes React root and renders the main App component
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
