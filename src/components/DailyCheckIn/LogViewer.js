/**
 * Log Viewer Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Log viewer component displays check-in logs for supervisors
 * 30% LOC will be implemented for further development
 */

import React, { useState, useEffect } from 'react';
import { Calendar, User, Hash, Download, Filter, Search } from 'lucide-react';
import { validateLogEntry, getLogSummary } from '../../utils/hashUtils';

const LogViewer = ({ onClose }) => {
  // State management for log display and filtering
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  // Effect hook loads logs from localStorage on component mount
  useEffect(() => {
    loadLogs();
  }, []);

  // Effect hook applies filters when search terms or filters change
  useEffect(() => {
    applyFilters();
  }, [logs, searchTerm, dateFilter, userFilter]);

  // Load logs function retrieves check-in logs from localStorage
  const loadLogs = () => {
    try {
      const saved = localStorage.getItem('checkInLogs');
      if (saved) {
        const parsedLogs = JSON.parse(saved);
        // Sort logs by timestamp (newest first)
        const sortedLogs = parsedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(sortedLogs);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  // Apply filters function filters logs based on search terms and date
  const applyFilters = () => {
    let filtered = [...logs];

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.postId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(log => log.date === dateFilter);
    }

    // Apply user filter
    if (userFilter) {
      filtered = filtered.filter(log => log.user.badge === userFilter);
    }

    setFilteredLogs(filtered);
  };

  // Export logs function downloads logs as JSON file
  const exportLogs = () => {
    try {
      const dataStr = JSON.stringify(logs, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `check-in-logs-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  // Get unique users function returns list of unique badge numbers
  const getUniqueUsers = () => {
    const users = [...new Set(logs.map(log => log.user.badge))];
    return users.filter(badge => badge !== 'N/A');
  };

  // Get unique dates function returns list of unique dates
  const getUniqueDates = () => {
    const dates = [...new Set(logs.map(log => log.date))];
    return dates.sort((a, b) => new Date(b) - new Date(a));
  };

  // Get log statistics function returns summary statistics
  const getLogStatistics = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysLogs = logs.filter(log => log.date === today);
    const uniqueUsers = new Set(logs.map(log => log.user.badge)).size;
    
    return {
      totalLogs: logs.length,
      todaysLogs: todaysLogs.length,
      uniqueUsers: uniqueUsers
    };
  };

  // Render function returns log viewer interface
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header section displays title and close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Hash className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Check-In Logs</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Statistics section displays log summary information */}
        <div className="p-4 border-b border-gray-700">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">{getLogStatistics().totalLogs}</div>
              <div className="text-sm text-gray-300">Total Logs</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">{getLogStatistics().todaysLogs}</div>
              <div className="text-sm text-gray-300">Today's Logs</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">{getLogStatistics().uniqueUsers}</div>
              <div className="text-sm text-gray-300">Unique Users</div>
            </div>
          </div>
        </div>

        {/* Filters section provides search and filter controls */}
        <div className="p-4 border-b border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
              />
            </div>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
            >
              <option value="">All Dates</option>
              {getUniqueDates().map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
            
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
            >
              <option value="">All Users</option>
              {getUniqueUsers().map(badge => (
                <option key={badge} value={badge}>Badge #{badge}</option>
              ))}
            </select>
            
            <button
              onClick={exportLogs}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Logs list displays filtered log entries */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No logs found matching your criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">{log.user.name}</span>
                        <span className="text-gray-400">(Badge #{log.user.badge})</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{log.action}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        {log.postId && (
                          <div className="flex items-center space-x-1">
                            <Hash className="w-3 h-3" />
                            <span>{log.postId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1">Hash</div>
                      <div className="text-xs text-gray-500 font-mono">{log.hash}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
