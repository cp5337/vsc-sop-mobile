/**
 * Codes Tab Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Emergency codes management tab component handles code creation, editing, and deletion
 * 30% LOC will be implemented for further development
 */

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const CodesTab = ({ codes, setCodes, onSave }) => {
  // Form state manages new code creation and editing functionality
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({});

  // Add function creates new code and updates codes array
  const addItem = () => {
    if (newItem.code && newItem.description && newItem.action) {
      const item = {
        id: newItem.id || `code-${Date.now()}`,
        code: newItem.code,
        description: newItem.description,
        action: newItem.action,
        severity: newItem.severity || 'warning'
      };
      setCodes([...codes, item]);
      setNewItem({});
      setShowAddForm(false);
      onSave();
    }
  };

  // Edit function updates existing code in codes array
  const editItem = (item) => {
    setEditingItem(item);
    setNewItem(item);
    setShowAddForm(true);
  };

  // Save edit function updates code and closes form
  const saveEdit = () => {
    if (newItem.code && newItem.description && newItem.action) {
      setCodes(codes.map(c => c.id === editingItem.id ? newItem : c));
      setEditingItem(null);
      setNewItem({});
      setShowAddForm(false);
      onSave();
    }
  };

  // Delete function removes code from codes array
  const deleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this code?')) {
      setCodes(codes.filter(c => c.id !== id));
      onSave();
    }
  };

  // Cancel function closes form and resets state
  const cancelEdit = () => {
    setEditingItem(null);
    setNewItem({});
    setShowAddForm(false);
  };

  // Render function returns codes tab content with list and form
  return (
    <div className="space-y-4">
      {/* Header section displays title and add button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Emergency Codes</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Code</span>
        </button>
      </div>

      {/* Codes list displays all codes with edit and delete actions */}
      <div className="space-y-2">
        {codes.map((code) => (
          <div key={code.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h4 className="text-white font-medium">{code.code}</h4>
              <p className="text-gray-300 text-sm">{code.description}</p>
              <p className="text-gray-400 text-xs">{code.action}</p>
              <span className={`inline-block px-2 py-1 rounded text-xs ${
                code.severity === 'critical' 
                  ? 'bg-red-600 text-white' 
                  : code.severity === 'warning'
                  ? 'bg-yellow-600 text-black'
                  : 'bg-gray-600 text-white'
              }`}>
                {code.severity}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => editItem(code)}
                className="p-2 text-blue-400 hover:bg-gray-600 rounded transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteItem(code.id)}
                className="p-2 text-red-400 hover:bg-gray-600 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit form provides code creation and editing functionality */}
      {showAddForm && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">
            {editingItem ? 'Edit Code' : 'Add New Code'}
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Code (e.g., 10-2, Code Yellow)"
              value={newItem.code || ''}
              onChange={(e) => setNewItem({...newItem, code: e.target.value})}
              className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description || ''}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            />
            <textarea
              placeholder="Action/Response"
              value={newItem.action || ''}
              onChange={(e) => setNewItem({...newItem, action: e.target.value})}
              rows={3}
              className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            />
            <select
              value={newItem.severity || 'warning'}
              onChange={(e) => setNewItem({...newItem, severity: e.target.value})}
              className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            >
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={editingItem ? saveEdit : addItem}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{editingItem ? 'Save Changes' : 'Add Code'}</span>
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
  );
};

export default CodesTab;
