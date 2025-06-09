import React, { useState } from 'react';
import { updateUser, deleteUser } from '../../services/adminService';
import { formatDate } from '../../utils/checkCurrentYear';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import LoadingSpinner from '../common/LoadingSpinner';

const UserTable = ({ users, onUserUpdated, onUserDeleted }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    password: '',
    role: 'user',
    isActive: true
  });

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditData({
      username: user.username,
      password: '',
      role: user.role,
      isActive: user.isActive
    });
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditData({
      username: '',
      password: '',
      role: 'user',
      isActive: true
    });
    setError('');
    setSuccess('');
  };

  const handleSaveEdit = async (userId) => {
    if (!editData.username.trim()) {
      setError('Username is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        username: editData.username.trim(),
        role: editData.role,
        isActive: editData.isActive
      };

      // Only include password if it's provided
      if (editData.password.trim()) {
        updateData.password = editData.password.trim();
      }

      const result = await updateUser(userId, updateData);
      
      if (result.success) {
        setSuccess('User updated successfully!');
        setEditingUser(null);
        
        if (onUserUpdated) {
          onUserUpdated(result.data.user);
        }
      } else {
        setError(result.message || 'Failed to update user');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, permanent = false) => {
    const action = permanent ? 'permanently delete' : 'deactivate';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await deleteUser(userId, permanent);
      
      if (result.success) {
        setSuccess(result.message);
        
        if (onUserDeleted) {
          onUserDeleted(userId, permanent);
        }
      } else {
        setError(result.message || 'Failed to delete user');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <p className="text-sm text-gray-600">Manage system users and their permissions</p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />
      <SuccessMessage message={success} onClose={() => setSuccess('')} />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      name="username"
                      value={editData.username}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                      disabled={loading}
                    />
                  ) : (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser === user.id ? (
                    <select
                      name="role"
                      value={editData.role}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                      disabled={loading}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser === user.id ? (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={editData.isActive}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={loading}
                      />
                      <span className="text-sm">Active</span>
                    </label>
                  ) : (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.isActive)}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingUser === user.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(user.id)}
                        disabled={loading}
                        className="btn-success text-xs"
                      >
                        {loading ? <LoadingSpinner size="sm" text="" /> : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="btn-secondary text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        disabled={loading}
                        className="btn-primary text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, false)}
                        disabled={loading}
                        className="btn-secondary text-xs"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, true)}
                        disabled={loading}
                        className="btn-danger text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Password field for editing */}
        {editingUser && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password (leave empty to keep current)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={editData.password}
                onChange={handleInputChange}
                className="input-field pr-10"
                placeholder="Enter new password..."
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No users have been created yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
