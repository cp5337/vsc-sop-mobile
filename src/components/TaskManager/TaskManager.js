/**
 * Task Manager Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Task manager component for supervisors to create and manage action items
 * 30% LOC will be implemented for further development
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, QrCode, Calendar, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { createLogEntry, getLogSummary } from '../../utils/hashUtils';

const TaskManager = ({ onClose }) => {
  // State management for tasks and UI
  const [tasks, setTasks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    location: '',
    instructions: ''
  });
  const [message, setMessage] = useState('');

  // Effect hook loads tasks from localStorage on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Load tasks function retrieves tasks from localStorage
  const loadTasks = () => {
    try {
      const saved = localStorage.getItem('tasks');
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  // Save tasks function persists tasks to localStorage
  const saveTasks = (updatedTasks) => {
    try {
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Create task function adds new task to tasks array
  const createTask = () => {
    if (!newTask.title || !newTask.description) {
      setMessage('Please fill in title and description.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const task = {
      id: `task-${Date.now()}`,
      ...newTask,
      createdAt: new Date().toISOString(),
      status: 'active',
      qrCode: null,
      completions: []
    };

    const updatedTasks = [...tasks, task];
    saveTasks(updatedTasks);
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: '',
      location: '',
      instructions: ''
    });
    setShowCreateForm(false);
    
    setMessage('Task created successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Generate QR code function creates QR code for task
  const generateQRCode = (task) => {
    const qrData = {
      type: 'task',
      taskId: task.id,
      title: task.title,
      description: task.description,
      instructions: task.instructions,
      priority: task.priority,
      dueDate: task.dueDate,
      location: task.location
    };

    const qrCodeString = JSON.stringify(qrData);
    
    // Update task with QR code data
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, qrCode: qrCodeString } : t
    );
    saveTasks(updatedTasks);
    
    setMessage('QR code generated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Delete task function removes task from tasks array
  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      saveTasks(updatedTasks);
      
      setMessage('Task deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Edit task function enables task editing
  const editTask = (task) => {
    setEditingTask(task);
    setNewTask(task);
    setShowCreateForm(true);
  };

  // Save edit function updates existing task
  const saveEdit = () => {
    if (!newTask.title || !newTask.description) {
      setMessage('Please fill in title and description.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const updatedTasks = tasks.map(t => 
      t.id === editingTask.id ? { ...t, ...newTask } : t
    );
    saveTasks(updatedTasks);
    
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: '',
      location: '',
      instructions: ''
    });
    setShowCreateForm(false);
    
    setMessage('Task updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Cancel edit function discards changes
  const cancelEdit = () => {
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: '',
      location: '',
      instructions: ''
    });
    setShowCreateForm(false);
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

  // Get status color function returns color class for status
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-600 text-white';
      case 'completed': return 'bg-green-600 text-white';
      case 'overdue': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  // Render function returns task manager interface
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header section displays title and close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Task Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content area displays tasks and creation form */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Header section displays title and create button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Action Items</h3>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>

            {/* Tasks list displays all tasks with actions */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-white font-medium">{task.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{task.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        {task.dueDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {task.assignedTo && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>Assigned to: {task.assignedTo}</span>
                          </div>
                        )}
                        {task.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>Location: {task.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => generateQRCode(task)}
                        className="p-2 text-blue-400 hover:bg-gray-600 rounded transition-colors"
                        title="Generate QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editTask(task)}
                        className="p-2 text-yellow-400 hover:bg-gray-600 rounded transition-colors"
                        title="Edit Task"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-red-400 hover:bg-gray-600 rounded transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* QR Code display shows generated QR code */}
                  {task.qrCode && (
                    <div className="mt-3 p-3 bg-gray-600 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <QrCode className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-white">QR Code Generated</span>
                      </div>
                      <div className="text-xs text-gray-300 break-all">
                        {task.qrCode.substring(0, 100)}...
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Create/Edit form provides task creation and editing functionality */}
            {showCreateForm && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-4">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                  <textarea
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={3}
                    className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Assigned To (optional)"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Location (optional)"
                    value={newTask.location}
                    onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                    className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                  <textarea
                    placeholder="Special Instructions (optional)"
                    value={newTask.instructions}
                    onChange={(e) => setNewTask({...newTask, instructions: e.target.value})}
                    rows={2}
                    className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={editingTask ? saveEdit : createTask}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{editingTask ? 'Update Task' : 'Create Task'}</span>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message display shows status updates and confirmations */}
        {message && (
          <div className="p-4 bg-blue-600 text-white text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
