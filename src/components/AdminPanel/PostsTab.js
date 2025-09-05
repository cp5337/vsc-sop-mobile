/**
 * Posts Tab Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Posts management tab component handles post creation, editing, and deletion
 * 30% LOC will be implemented for further development
 */

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const PostsTab = ({ posts, setPosts, onSave }) => {
  // Form state manages new post creation and editing functionality
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({});

  // Add function creates new post and updates posts array
  const addItem = () => {
    if (newItem.title && newItem.booth && newItem.shift) {
      const item = {
        id: newItem.id || `post-${Date.now()}`,
        title: newItem.title,
        booth: newItem.booth,
        shift: newItem.shift
      };
      setPosts([...posts, item]);
      setNewItem({});
      setShowAddForm(false);
      onSave();
    }
  };

  // Edit function updates existing post in posts array
  const editItem = (item) => {
    setEditingItem(item);
    setNewItem(item);
    setShowAddForm(true);
  };

  // Save edit function updates post and closes form
  const saveEdit = () => {
    if (newItem.title && newItem.booth && newItem.shift) {
      setPosts(posts.map(p => p.id === editingItem.id ? newItem : p));
      setEditingItem(null);
      setNewItem({});
      setShowAddForm(false);
      onSave();
    }
  };

  // Delete function removes post from posts array
  const deleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== id));
      onSave();
    }
  };

  // Cancel function closes form and resets state
  const cancelEdit = () => {
    setEditingItem(null);
    setNewItem({});
    setShowAddForm(false);
  };

  // Render function returns posts tab content with list and form
  return (
    <div className="space-y-4">
      {/* Header section displays title and add button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Posts Management</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Post</span>
        </button>
      </div>

      {/* Posts list displays all posts with edit and delete actions */}
      <div className="space-y-2">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h4 className="text-white font-medium">{post.title}</h4>
              <p className="text-gray-300 text-sm">Booth: {post.booth} | Shift: {post.shift}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => editItem(post)}
                className="p-2 text-blue-400 hover:bg-gray-600 rounded transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteItem(post.id)}
                className="p-2 text-red-400 hover:bg-gray-600 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit form provides post creation and editing functionality */}
      {showAddForm && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">
            {editingItem ? 'Edit Post' : 'Add New Post'}
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Post Title"
              value={newItem.title || ''}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Booth Number"
              value={newItem.booth || ''}
              onChange={(e) => setNewItem({...newItem, booth: e.target.value})}
              className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Shift (e.g., 24/7, 0800-1600)"
              value={newItem.shift || ''}
              onChange={(e) => setNewItem({...newItem, shift: e.target.value})}
              className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-400 focus:outline-none"
            />
            <div className="flex space-x-2">
              <button
                onClick={editingItem ? saveEdit : addItem}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{editingItem ? 'Save Changes' : 'Add Post'}</span>
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

export default PostsTab;
