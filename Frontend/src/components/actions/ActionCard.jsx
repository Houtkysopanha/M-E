import React, { useState } from 'react';
import { updateAction, deleteAction } from '../../services/actionService';
import { canModifyAction, formatDate, getRelativeTime, getActionStatus } from '../../utils/checkCurrentYear';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import LoadingSpinner from '../common/LoadingSpinner';

const ActionCard = ({ action, onActionUpdated, onActionDeleted, showUserInfo = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editData, setEditData] = useState({
    title: action.data?.title || '',
    description: action.data?.description || '',
    category: action.data?.category || '',
    priority: action.data?.priority || 'medium',
    tags: action.data?.tags ? action.data.tags.join(', ') : ''
  });

  const actionStatus = getActionStatus(action.createdAt);
  const canModify = canModifyAction(action.createdAt);

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: action.data?.title || '',
      description: action.data?.description || '',
      category: action.data?.category || '',
      priority: action.data?.priority || 'medium',
      tags: action.data?.tags ? action.data.tags.join(', ') : ''
    });
    setError('');
    setSuccess('');
  };

  const handleSaveEdit = async () => {
    if (!editData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedActionData = {
        title: editData.title.trim(),
        description: editData.description.trim(),
        category: editData.category.trim(),
        priority: editData.priority,
        tags: editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        timestamp: new Date().toISOString()
      };

      const result = await updateAction(action.id, updatedActionData);
      
      if (result.success) {
        setSuccess('Action updated successfully!');
        setIsEditing(false);
        
        if (onActionUpdated) {
          onActionUpdated(result.data);
        }
      } else {
        setError(result.message || 'Failed to update action');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this action?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await deleteAction(action.id);
      
      if (result.success) {
        if (onActionDeleted) {
          onActionDeleted(action.id);
        }
      } else {
        setError(result.message || 'Failed to delete action');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'historical': return 'bg-gray-100 text-gray-800';
      case 'future': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <ErrorMessage message={error} onClose={() => setError('')} />
      <SuccessMessage message={success} onClose={() => setSuccess('')} />

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleInputChange}
              className="input-field text-lg font-semibold"
              placeholder="Action title..."
              disabled={loading}
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {action.data?.title || 'Untitled Action'}
            </h3>
          )}
          
          {/* Status and Priority Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(actionStatus.status)}`}>
              {actionStatus.label}
            </span>
            {action.data?.priority && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(action.data.priority)}`}>
                {action.data.priority}
              </span>
            )}
            {action.data?.category && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {action.data.category}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {canModify && (
          <div className="flex space-x-2 ml-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="btn-success text-sm"
                >
                  {loading ? <LoadingSpinner size="sm" text="" /> : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className="btn-primary text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="btn-danger text-sm"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {isEditing ? (
        <textarea
          name="description"
          value={editData.description}
          onChange={handleInputChange}
          className="input-field resize-none mb-4"
          rows={3}
          placeholder="Action description..."
          disabled={loading}
        />
      ) : (
        action.data?.description && (
          <p className="text-gray-700 mb-4">{action.data.description}</p>
        )
      )}

      {/* Edit Form Fields */}
      {isEditing && (
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={editData.category}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Category..."
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={editData.priority}
                onChange={handleInputChange}
                className="input-field"
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={editData.tags}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Tags (comma separated)..."
              disabled={loading}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {!isEditing && action.data?.tags && action.data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {action.data.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-200 pt-4">
        <div>
          <p>Created: {getRelativeTime(action.createdAt)}</p>
          {action.updatedAt !== action.createdAt && (
            <p>Updated: {getRelativeTime(action.updatedAt)}</p>
          )}
        </div>
        <div className="text-right">
          <p>{formatDate(action.createdAt)}</p>
          {showUserInfo && action.userId && (
            <p className="text-xs">User: {action.userId}</p>
          )}
        </div>
      </div>

      {/* Read-only indicator */}
      {!canModify && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Read-only: Historical data cannot be modified
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionCard;
