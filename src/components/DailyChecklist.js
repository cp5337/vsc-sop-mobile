/**
 * Daily Checklist Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Comprehensive daily checklist system for security equipment, procedures, and facility inspections
 * Implements localStorage persistence and critical task prioritization
 */
import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, AlertTriangle, Save, RotateCcw, ArrowLeft } from 'lucide-react';

const DailyChecklist = ({ onBack }) => {
  // Checklist state manages equipment, security, and facility inspection tasks
  const [checklist, setChecklist] = useState({
    equipment: [
      { id: 'radio', task: 'Radio communication test', completed: false, critical: true },
      { id: 'dosimeter', task: 'Radiation dosimeter check', completed: false, critical: true },
      { id: 'ppe', task: 'PPE inspection (vest, boots, hard hat)', completed: false, critical: true },
      { id: 'flashlight', task: 'Flashlight and backup battery', completed: false, critical: false },
      { id: 'firstaid', task: 'First aid kit inspection', completed: false, critical: false }
    ],
    security: [
      { id: 'credentials', task: 'Verify all credentials and badges', completed: false, critical: true },
      { id: 'access', task: 'Test access control systems', completed: false, critical: true },
      { id: 'cameras', task: 'Security camera functionality check', completed: false, critical: true },
      { id: 'alarms', task: 'Alarm system test', completed: false, critical: true },
      { id: 'barriers', task: 'Vehicle barriers operation test', completed: false, critical: false }
    ],
    facility: [
      { id: 'lighting', task: 'Area lighting inspection', completed: false, critical: false },
      { id: 'cones', task: 'Safety cone placement verification', completed: false, critical: false },
      { id: 'signage', task: 'Directional signage check', completed: false, critical: false },
      { id: 'cleanliness', task: 'Work area cleanliness', completed: false, critical: false },
      { id: 'weather', task: 'Weather condition assessment', completed: false, critical: false }
    ]
  });

  // Last saved timestamp tracks when checklist was last persisted to localStorage
  const [lastSaved, setLastSaved] = useState(null);

  // Load saved checklist data from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('dailyChecklist');
    if (saved) {
      setChecklist(JSON.parse(saved));
    }
  }, []);

  // Toggle task completion status and update checklist state
  const toggleTask = (category, taskId) => {
    setChecklist(prev => ({
      ...prev,
      [category]: prev[category].map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  // Save current checklist state to localStorage with timestamp
  const saveChecklist = () => {
    localStorage.setItem('dailyChecklist', JSON.stringify(checklist));
    setLastSaved(new Date());
  };

  // Reset all checklist items to incomplete status
  const resetChecklist = () => {
    const resetChecklist = {
      equipment: checklist.equipment.map(task => ({ ...task, completed: false })),
      security: checklist.security.map(task => ({ ...task, completed: false })),
      facility: checklist.facility.map(task => ({ ...task, completed: false }))
    };
    setChecklist(resetChecklist);
    localStorage.removeItem('dailyChecklist');
  };

  const getCompletionStats = () => {
    const allTasks = [...checklist.equipment, ...checklist.security, ...checklist.facility];
    const completed = allTasks.filter(task => task.completed).length;
    const critical = allTasks.filter(task => task.critical).length;
    const criticalCompleted = allTasks.filter(task => task.critical && task.completed).length;
    
    return { completed, total: allTasks.length, critical, criticalCompleted };
  };

  const stats = getCompletionStats();

  const renderCategory = (category, title, icon) => (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
        <span className="ml-auto text-sm text-gray-400">
          {checklist[category].filter(task => task.completed).length}/{checklist[category].length}
        </span>
      </h3>
      <div className="space-y-2">
        {checklist[category].map(task => (
          <div
            key={task.id}
            className={`flex items-center p-3 rounded-lg border transition-colors ${
              task.completed
                ? 'bg-gray-700 border-gray-600'
                : task.critical
                ? 'bg-gray-700 border-red-600'
                : 'bg-gray-900 border-gray-600'
            }`}
          >
            <button
              onClick={() => toggleTask(category, task.id)}
              className="mr-3 flex-shrink-0"
            >
              {task.completed ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400" />
              )}
            </button>
            <div className="flex-1">
              <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                {task.task}
              </span>
              {task.critical && (
                <div className="flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 text-red-400 mr-1" />
                  <span className="text-xs text-red-400">Critical</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-600 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Back to Overview"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-xl font-bold">Daily Checklist</h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.completed}/{stats.total}</div>
            <div className="text-sm text-gray-300">Tasks Complete</div>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(stats.completed / stats.total) * 100}%` }}
          />
        </div>
        {stats.criticalCompleted < stats.critical && (
          <div className="mt-2 flex items-center text-yellow-400">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {stats.critical - stats.criticalCompleted} critical tasks remaining
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={saveChecklist}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Progress
        </button>
        <button
          onClick={resetChecklist}
          className="bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {lastSaved && (
        <div className="text-center text-sm text-gray-400">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}

      {/* Checklist Categories */}
      {renderCategory('equipment', 'Equipment Check', <CheckCircle className="w-5 h-5 text-blue-400" />)}
      {renderCategory('security', 'Security Systems', <AlertTriangle className="w-5 h-5 text-red-400" />)}
      {renderCategory('facility', 'Facility Inspection', <Clock className="w-5 h-5 text-green-400" />)}

      {/* Completion Message */}
      {stats.completed === stats.total && (
        <div className="bg-gray-700 border border-gray-600 rounded-xl p-4 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-white mb-1">All Tasks Complete!</h3>
          <p className="text-sm text-gray-300">Great job! All daily checklist items have been completed.</p>
        </div>
      )}
    </div>
  );
};

export default DailyChecklist;
