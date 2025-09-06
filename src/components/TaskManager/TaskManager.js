/**
 * Task Manager Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Task manager component for supervisors to create and manage action items
 * Refactored to use custom hooks and eliminate duplicate code patterns
 */

import React, { useState } from 'react';
import { Plus, Edit, Trash2, QrCode, Calendar, User, CheckCircle, X, MapPin } from 'lucide-react';
import { useTasks, useModal } from '../../hooks';
import Modal from '../Modal/Modal';

const TaskManager = ({ onClose }) => {
  // Use custom hooks for state management
  const { tasks, createTask, updateTask, deleteTask, error, clearError } = useTasks();
  const { isOpen: showCreateForm, open: openCreateForm, close: closeCreateForm } = useModal();
  
  // Local state for form management
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

  // Create task function adds new task to tasks array
  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description) {
      setMessage('Please fill in title and description.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const result = createTask(newTask);
    if (result) {
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: '',
        location: '',
        instructions: ''
      });
      closeCreateForm();
      setMessage('Task created successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error creating task. Please try again.');
    }
  };

  // Edit task function updates existing task
  const handleEditTask = (task) => {
    setNewTask(task);
    setEditingTask(task);
    openCreateForm();
  };

  // Update task function saves changes to existing task
  const handleUpdateTask = () => {
    if (!newTask.title || !newTask.description) {
      setMessage('Please fill in title and description.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    updateTask(editingTask.id, newTask);
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: '',
      location: '',
      instructions: ''
    });
    setEditingTask(null);
    closeCreateForm();
    setMessage('Task updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Delete task function removes task from tasks array
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      setMessage('Task deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Cancel form function resets form state
  const handleCancelForm = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: '',
      location: '',
      instructions: ''
    });
    setEditingTask(null);
    closeCreateForm();
  };

  // Get priority color function returns color class based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'low': return 'text-green-400 bg-green-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  // Get status color function returns color class based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-900/30';
      case 'active': return 'text-blue-400 bg-blue-900/30';
      case 'pending': return 'text-yellow-400 bg-yellow-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="xlarge">
      <Modal.Header onClose={onClose}>
        <h2 className="text-xl font-bold text-white">Task Manager</h2>
      </Modal.Header>
      
      <Modal.Body>
        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300 text-xs underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-3">
              <p className="text-green-400 text-sm">{message}</p>
            </div>
          )}

          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Action Items</h3>
            <button
              onClick={openCreateForm}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No tasks created yet</p>
                <p className="text-sm">Create your first task to get started</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-white">{task.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{task.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        {task.dueDate && (
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {task.assignedTo && (
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {task.assignedTo}
                          </span>
                        )}
                        {task.location && (
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {task.location}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Edit Task"
                      >
                        <Edit className="w-4 h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal.Body>

      {/* Create/Edit Task Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={handleCancelForm}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="Enter task description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Assigned To
                </label>
                <input
                  type="text"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter assignee name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newTask.location}
                  onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter task location"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Instructions
                </label>
                <textarea
                  value={newTask.instructions}
                  onChange={(e) => setNewTask({...newTask, instructions: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows="2"
                  placeholder="Enter additional instructions"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelForm}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingTask ? handleUpdateTask : handleCreateTask}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TaskManager;