import React, { useState } from 'react';
import { createAction } from '../../services/actionService';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import LoadingSpinner from '../common/LoadingSpinner';

const ActionForm = ({ onActionCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare action data
      const actionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        priority: formData.priority,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        timestamp: new Date().toISOString()
      };

      const result = await createAction(actionData);
      
      if (result.success) {
        setSuccess('Action created successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          priority: 'medium',
          tags: ''
        });
        
        // Notify parent component
        if (onActionCreated) {
          onActionCreated(result.data);
        }
      } else {
        setError(result.message || 'Failed to create action');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Create New Action</h3>
        <p className="text-sm text-gray-600">Add a new action to track your activities</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorMessage message={error} onClose={() => setError('')} />
        <SuccessMessage message={success} onClose={() => setSuccess('')} />

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
            placeholder="Enter action title..."
            disabled={loading}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="input-field resize-none"
            placeholder="Enter action description..."
            disabled={loading}
          />
        </div>

        {/* Category and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., work, personal, meeting"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
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

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter tags separated by commas..."
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple tags with commas (e.g., important, urgent, review)
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" text="" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              'Create Action'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActionForm;
