import React, { useState, useEffect } from 'react';
import { createActionPlan } from '../../services/adminService';
import { getAllUsers } from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';

const ActionPlanForm = ({ onActionPlanCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    userIds: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const result = await getAllUsers();
      if (result.success) {
        // Filter out admin users and only show active users
        const regularUsers = result.data.users.filter(user => 
          user.role === 'user' && user.isActive
        );
        setUsers(regularUsers);
      } else {
        setError('Failed to load users');
      }
    } catch (error) {
      setError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleUserSelection = (userId) => {
    setFormData(prev => ({
      ...prev,
      userIds: prev.userIds.includes(userId)
        ? prev.userIds.filter(id => id !== userId)
        : [...prev.userIds, userId]
    }));
  };

  const handleSelectAll = () => {
    const allUserIds = users.map(user => user._id);
    setFormData(prev => ({
      ...prev,
      userIds: prev.userIds.length === allUserIds.length ? [] : allUserIds
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await createActionPlan(formData);
      
      if (result.success) {
        setSuccess('Action plan created successfully!');
        setFormData({
          title: '',
          description: '',
          userIds: []
        });
        
        // Notify parent component
        if (onActionPlanCreated) {
          onActionPlanCreated(result.data.actionPlan);
        }
      } else {
        setError(result.message || 'Failed to create action plan');
      }
    } catch (error) {
      setError('Failed to create action plan');
    } finally {
      setLoading(false);
    }
  };

  if (loadingUsers) {
    return <LoadingSpinner text="Loading users..." />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Create New Action Plan
      </h3>

      <ErrorMessage message={error} onClose={() => setError('')} />
      <SuccessMessage message={success} onClose={() => setSuccess('')} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter action plan title..."
            disabled={loading}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input-field resize-none"
            placeholder="Enter detailed description of the action plan..."
            disabled={loading}
            required
          />
        </div>

        {/* User Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Assign to Users (Optional)
          </label>
          
          {users.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">
                  {formData.userIds.length} of {users.length} users selected
                </span>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  disabled={loading}
                >
                  {formData.userIds.length === users.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                {users.map((user) => (
                  <label
                    key={user._id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.userIds.includes(user._id)}
                      onChange={() => handleUserSelection(user._id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      disabled={loading}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        {user.username}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({user.role})
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No active users available for assignment</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                userIds: []
              });
              setError('');
              setSuccess('');
            }}
            className="btn-secondary"
            disabled={loading}
          >
            Clear
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !formData.title.trim() || !formData.description.trim()}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Action Plan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActionPlanForm;
