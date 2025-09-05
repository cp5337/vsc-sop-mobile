/**
 * Task Dashboard Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Task dashboard component for supervisors to view task completion status
 * 30% LOC will be implemented for further development
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, User, Calendar, Download, Filter, Search } from 'lucide-react';
import { validateLogEntry, getLogSummary } from '../../utils/hashUtils';

const TaskDashboard = ({ onClose }) => {
  // State management for tasks and completion logs
  const [tasks, setTasks] = useState([]);
  const [completionLogs, setCompletionLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  // Effect hook loads data from localStorage on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Effect hook applies filters when search terms or filters change
  useEffect(() => {
    applyFilters();
  }, [completionLogs, searchTerm, dateFilter, userFilter]);

  // Load data function retrieves tasks and completion logs from localStorage
  const loadData = () => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      const savedLogs = localStorage.getItem('taskCompletionLogs');
      
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
      
      if (savedLogs) {
        const parsedLogs = JSON.parse(savedLogs);
        // Sort logs by timestamp (newest first)
        const sortedLogs = parsedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setCompletionLogs(sortedLogs);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Apply filters function filters completion logs based on search terms and date
  const applyFilters = () => {
    let filtered = [...completionLogs];

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

  // Export data function downloads tasks and logs as JSON file
  const exportData = () => {
    try {
      const exportData = {
        tasks: tasks,
        completionLogs: completionLogs,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `task-dashboard-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  // Get unique users function returns list of unique badge numbers
  const getUniqueUsers = () => {
    const users = [...new Set(completionLogs.map(log => log.user.badge))];
    return users.filter(badge => badge !== 'N/A');
  };

  // Get unique dates function returns list of unique dates
  const getUniqueDates = () => {
    const dates = [...new Set(completionLogs.map(log => log.date))];
    return dates.sort((a, b) => new Date(b) - new Date(a));
  };

  // Get task statistics function returns summary statistics
  const getTaskStatistics = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysCompletions = completionLogs.filter(log => log.date === today);
    const uniqueUsers = new Set(completionLogs.map(log => log.user.badge)).size;
    const activeTasks = tasks.filter(task => task.status === 'active').length;
    const completedTasks = tasks.filter(task => task.completions && task.completions.length > 0).length;
    
    return {
      totalTasks: tasks.length,
      activeTasks: activeTasks,
      completedTasks: completedTasks,
      todaysCompletions: todaysCompletions.length,
      uniqueUsers: uniqueUsers
    };
  };

  // Get priority color function returns color class for priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-600 text-black';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  // Render function returns task dashboard interface
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header section displays title and close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Task Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Statistics section displays task and completion summary */}
        <div className="p-4 border-b border-gray-700">
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">{getTaskStatistics().totalTasks}</div>
              <div className="text-sm text-gray-300">Total Tasks</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">{getTaskStatistics().activeTasks}</div>
              <div className="text-sm text-gray-300">Active Tasks</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">{getTaskStatistics().completedTasks}</div>
              <div className="text-sm text-gray-300">Completed Tasks</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">{getTaskStatistics().todaysCompletions}</div>
              <div className="text-sm text-gray-300">Today's Completions</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">{getTaskStatistics().uniqueUsers}</div>
              <div className="text-sm text-gray-300">Active Users</div>
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
                placeholder="Search completions..."
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
              onClick={exportData}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Content area displays tasks and completion logs */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks section displays all tasks with completion status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Tasks Overview</h3>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-white font-medium">{task.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{task.description}</p>
                      </div>
                    </div>
                    
                    {/* Completion status displays completion information */}
                    <div className="mt-3">
                      {task.completions && task.completions.length > 0 ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Completed {task.completions.length} time(s)</span>
                          </div>
                          {task.completions.map((completion, index) => (
                            <div key={index} className="text-xs text-gray-400 ml-6">
                              {completion.completedBy} (Badge #{completion.badgeNumber}) - {new Date(completion.completedAt).toLocaleString()}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-yellow-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Not completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion logs section displays filtered completion logs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Recent Completions</h3>
              <div className="space-y-3">
                {filteredLogs.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    No completions found matching your criteria.
                  </div>
                ) : (
                  filteredLogs.map((log, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="w-4 h-4 text-blue-400" />
                            <span className="text-white font-medium">{log.user.name}</span>
                            <span className="text-gray-400">(Badge #{log.user.badge})</span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{log.action}</p>
                          {log.completionNotes && (
                            <p className="text-gray-400 text-xs mb-2">Notes: {log.completionNotes}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-1">Hash</div>
                          <div className="text-xs text-gray-500 font-mono">{log.hash}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
