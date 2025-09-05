/**
 * Incident Report Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Incident reporting component for documenting security incidents and suspicious activities
 * 30% LOC will be implemented for further development
 */
import React, { useState } from 'react';

import { FileWarning, X, Save, Camera, MapPin, Clock, User, AlertTriangle, MessageSquare, Mail } from 'lucide-react';
import { emergencyContacts } from '../data/constants';

const IncidentReport = ({ onClose }) => {
  // State management for incident report form data
  const [incidentData, setIncidentData] = useState({
    incidentType: '',
    location: '',
    description: '',
    time: new Date().toISOString().slice(0, 16),
    reporter: '',
    severity: 'medium',
    witnesses: '',
    actions: '',
    photos: []
  });

  // Incident types based on security operations
  const incidentTypes = [
    'Suspicious Activity',
    'Equipment Malfunction',
    'Access Control Violation',
    'Radiation Alert',
    'Vehicle Incident',
    'Personnel Issue',
    'Security Breach',
    'Medical Emergency',
    'Fire/Safety Hazard',
    'Other'
  ];

  // Severity levels for incident classification
  const severityLevels = [
    { value: 'low', label: 'Low', color: 'text-green-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { value: 'high', label: 'High', color: 'text-orange-400' },
    { value: 'critical', label: 'Critical', color: 'text-red-400' }
  ];

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setIncidentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle photo capture
  const handlePhotoCapture = () => {
    // Photo capture functionality would be implemented here
    alert('Photo capture functionality - would open camera to document incident');
  };

  // Handle form submission and save to localStorage
  const handleSubmit = () => {
    // Generate incident number
    const incidentNumber = `INC-${Date.now().toString().slice(-6)}`;
    
    // Create incident report object
    const report = {
      ...incidentData,
      incidentNumber,
      timestamp: new Date().toISOString(),
      status: 'submitted'
    };

    // Save to localStorage (in production, this would go to a server)
    const existingReports = JSON.parse(localStorage.getItem('incidentReports') || '[]');
    existingReports.push(report);
    localStorage.setItem('incidentReports', JSON.stringify(existingReports));

    alert(`Incident Report ${incidentNumber} saved successfully!`);
    onClose();
  };

  // Handle sending report via text message
  const handleSendText = () => {
    const incidentNumber = `INC-${Date.now().toString().slice(-6)}`;
    const report = {
      ...incidentData,
      incidentNumber,
      timestamp: new Date().toISOString(),
      status: 'submitted'
    };

    // Save to localStorage first
    const existingReports = JSON.parse(localStorage.getItem('incidentReports') || '[]');
    existingReports.push(report);
    localStorage.setItem('incidentReports', JSON.stringify(existingReports));

    // Format report for text message
    const textMessage = `INCIDENT REPORT ${incidentNumber}
Type: ${report.incidentType}
Location: ${report.location}
Time: ${new Date(report.time).toLocaleString()}
Reporter: ${report.reporter}
Severity: ${report.severity.toUpperCase()}

Description: ${report.description}

${report.witnesses ? `Witnesses: ${report.witnesses}` : ''}
${report.actions ? `Actions Taken: ${report.actions}` : ''}

Reported via VSC SOP Mobile App`;

    // Use native SMS functionality
    const smsUrl = `sms:${emergencyContacts[0].number.replace(/[^\d]/g, '')}&body=${encodeURIComponent(textMessage)}`;
    window.open(smsUrl, '_blank');
    
    alert(`Incident Report ${incidentNumber} sent via text message!`);
    onClose();
  };

  // Handle sending report via email
  const handleSendEmail = () => {
    const incidentNumber = `INC-${Date.now().toString().slice(-6)}`;
    const report = {
      ...incidentData,
      incidentNumber,
      timestamp: new Date().toISOString(),
      status: 'submitted'
    };

    // Save to localStorage first
    const existingReports = JSON.parse(localStorage.getItem('incidentReports') || '[]');
    existingReports.push(report);
    localStorage.setItem('incidentReports', JSON.stringify(existingReports));

    // Format report for email
    const emailSubject = `VSC Incident Report ${incidentNumber} - ${report.incidentType}`;
    const emailBody = `INCIDENT REPORT ${incidentNumber}
Generated: ${new Date().toLocaleString()}

INCIDENT DETAILS:
Type: ${report.incidentType}
Location: ${report.location}
Date/Time: ${new Date(report.time).toLocaleString()}
Reporter: ${report.reporter}
Severity Level: ${report.severity.toUpperCase()}

DESCRIPTION:
${report.description}

${report.witnesses ? `WITNESSES:
${report.witnesses}` : ''}

${report.actions ? `ACTIONS TAKEN:
${report.actions}` : ''}

This report was generated using the VSC SOP Mobile Application.
For immediate response, contact SACC at (212) 435-5903.

---
VSC SOP Mobile App
World Trade Center Security Operations`;

    // Use native email functionality
    const emailUrl = `mailto:security@wtc.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(emailUrl, '_blank');
    
    alert(`Incident Report ${incidentNumber} sent via email!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <div className="flex items-center space-x-3">
            <FileWarning className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold text-white">Incident Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Incident Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Incident Type *
            </label>
            <select
              value={incidentData.incidentType}
              onChange={(e) => handleInputChange('incidentType', e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Select incident type...</option>
              {incidentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Location and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                value={incidentData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Entry Lane 1, Booth 324"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Date & Time *
              </label>
              <input
                type="datetime-local"
                value={incidentData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Reporter and Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Reporter *
              </label>
              <input
                type="text"
                value={incidentData.reporter}
                onChange={(e) => handleInputChange('reporter', e.target.value)}
                placeholder="Your name and badge number"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Severity Level *
              </label>
              <select
                value={incidentData.severity}
                onChange={(e) => handleInputChange('severity', e.target.value)}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                {severityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Incident Description *
            </label>
            <textarea
              value={incidentData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide a detailed description of what happened..."
              rows={4}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Witnesses */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Witnesses
            </label>
            <textarea
              value={incidentData.witnesses}
              onChange={(e) => handleInputChange('witnesses', e.target.value)}
              placeholder="List any witnesses and their contact information..."
              rows={2}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Actions Taken */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Actions Taken
            </label>
            <textarea
              value={incidentData.actions}
              onChange={(e) => handleInputChange('actions', e.target.value)}
              placeholder="Describe any actions taken in response to the incident..."
              rows={3}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Photo Documentation */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Camera className="w-4 h-4 inline mr-1" />
              Photo Documentation
            </label>
            <button
              onClick={handlePhotoCapture}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white hover:bg-slate-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Camera className="w-5 h-5" />
              <span>Capture Photo</span>
            </button>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-3">Emergency Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                  <div>
                    <span className="text-white font-medium">{contact.name}</span>
                    <p className="text-sm text-gray-400">{contact.purpose}</p>
                  </div>
                  <a
                    href={`tel:${contact.number}`}
                    className="text-orange-400 hover:text-orange-300 font-mono text-sm"
                  >
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-600">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!incidentData.incidentType || !incidentData.location || !incidentData.description || !incidentData.reporter}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Only</span>
            </button>
          </div>
          
          {/* Native Communication Options */}
          <div className="space-y-3">
            <p className="text-sm text-gray-400 text-center">Send Report Via:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSendText}
                disabled={!incidentData.incidentType || !incidentData.location || !incidentData.description || !incidentData.reporter}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Text Message</span>
              </button>
              <button
                onClick={handleSendEmail}
                disabled={!incidentData.incidentType || !incidentData.location || !incidentData.description || !incidentData.reporter}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Reports will be saved locally and sent via your device's native messaging apps
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReport;
