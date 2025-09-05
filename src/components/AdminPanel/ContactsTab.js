/**
 * Contacts Tab Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Emergency contacts management tab component handles contact creation, editing, and deletion
 * 30% LOC will be implemented for further development
 */

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const ContactsTab = ({ contacts, setContacts, onSave }) => {
  // Form state manages new contact creation and editing functionality
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({});

  // Add function creates new contact and updates contacts array
  const addItem = () => {
    if (newItem.name && newItem.number && newItem.purpose) {
      const item = {
        id: newItem.id || `contact-${Date.now()}`,
        name: newItem.name,
        number: newItem.number,
        purpose: newItem.purpose,
        priority: newItem.priority || 'secondary'
      };
      setContacts([...contacts, item]);
      setNewItem({});
      setShowAddForm(false);
      onSave();
    }
  };

  // Edit function updates existing contact in contacts array
  const editItem = (item) => {
    setEditingItem(item);
    setNewItem(item);
    setShowAddForm(true);
  };

  // Save edit function updates contact and closes form
  const saveEdit = () => {
    if (newItem.name && newItem.number && newItem.purpose) {
      setContacts(contacts.map(c => c.id === editingItem.id ? newItem : c));
      setEditingItem(null);
      setNewItem({});
      setShowAddForm(false);
      onSave();
    }
  };

  // Delete function removes contact from contacts array
  const deleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(c => c.id !== id));
      onSave();
    }
  };

  // Cancel function closes form and resets state
  const cancelEdit = () => {
    setEditingItem(null);
    setNewItem({});
    setShowAddForm(false);
  };

  // Render function returns contacts tab content with list and form
  return (
    <div className="space-y-4">
      {/* Header section displays title and add button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Emergency Contacts</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Contacts list displays all contacts with edit and delete actions */}
      <div className="space-y-2">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h4 className="text-white font-medium">{contact.name}</h4>
              <p className="text-gray-300 text-sm">{contact.number}</p>
              <p className="text-gray-400 text-xs">{contact.purpose}</p>
              <span className={`inline-block px-2 py-1 rounded text-xs ${
                contact.priority === 'primary' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-yellow-600 text-black'
              }`}>
                {contact.priority}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => editItem(contact)}
                className="p-2 text-blue-400 hover:bg-gray-600 rounded transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteItem(contact.id)}
                className="p-2 text-red-400 hover:bg-gray-600 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit form provides contact creation and editing functionality */}
      {showAddForm && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">
            {editingItem ? 'Edit Contact' : 'Add New Contact'}
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Contact Name"
              value={newItem.name || ''}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newItem.number || ''}
              onChange={(e) => setNewItem({...newItem, number: e.target.value})}
              className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Purpose/Description"
              value={newItem.purpose || ''}
              onChange={(e) => setNewItem({...newItem, purpose: e.target.value})}
              className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            />
            <select
              value={newItem.priority || 'secondary'}
              onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
              className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={editingItem ? saveEdit : addItem}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{editingItem ? 'Save Changes' : 'Add Contact'}</span>
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

export default ContactsTab;
