import React, { useState, useEffect } from 'react';
import { getAllActionPlans, deleteActionPlan } from '../../services/adminService';
import { formatDate, getRelativeTime } from '../../utils/checkCurrentYear';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';

const ActionPlanList = ({ refreshTrigger }) => {
  const [actionPlans, setActionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchActionPlans();
  }, [refreshTrigger]);

  const fetchActionPlans = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getAllActionPlans();
      if (result.success) {
        setActionPlans(result.data.actionPlans || []);
      } else {
        setError(result.message || 'Failed to load action plans');
      }
    } catch (error) {
      setError('Failed to load action plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the action plan "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    setError('');
    setSuccess('');

    try {
      const result = await deleteActionPlan(id);
      if (result.success) {
        setSuccess('Action plan deleted successfully');
        setActionPlans(prev => prev.filter(plan => plan._id !== id));
      } else {
        setError(result.message || 'Failed to delete action plan');
      }
    } catch (error) {
      setError('Failed to delete action plan');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return <LoadingSpinner text="Loading action plans..." />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Action Plans ({actionPlans.length})
        </h3>
      </div>

      <div className="p-6">
        <ErrorMessage message={error} onClose={() => setError('')} />
        <SuccessMessage message={success} onClose={() => setSuccess('')} />

        {actionPlans.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No action plans</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new action plan.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {actionPlans.map((plan) => (
              <div
                key={plan._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {plan.title}
                      </h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {plan.userIds?.length || 0} users assigned
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>Created by: {plan.createdBy?.username || 'Unknown'}</span>
                      <span>•</span>
                      <span>{getRelativeTime(plan.createdAt)}</span>
                      <span>•</span>
                      <span>{formatDate(plan.createdAt)}</span>
                    </div>

                    {/* Description Preview */}
                    <div className="mb-3">
                      {typeof plan.description === 'string' ? (
                        <p className="text-gray-700 line-clamp-2">
                          {plan.description}
                        </p>
                      ) : (
                        <div className="text-gray-700">
                          <pre className="whitespace-pre-wrap text-sm">
                            {JSON.stringify(plan.description, null, 2).substring(0, 200)}
                            {JSON.stringify(plan.description, null, 2).length > 200 && '...'}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Assigned Users */}
                    {plan.userIds && plan.userIds.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700">Assigned to: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {plan.userIds.slice(0, 3).map((user) => (
                            <span
                              key={user._id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {user.username}
                            </span>
                          ))}
                          {plan.userIds.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{plan.userIds.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleExpanded(plan._id)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title={expandedId === plan._id ? "Collapse" : "Expand"}
                    >
                      <svg
                        className={`h-5 w-5 transform transition-transform duration-200 ${
                          expandedId === plan._id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(plan._id, plan.title)}
                      disabled={deletingId === plan._id}
                      className="text-red-400 hover:text-red-600 p-1 disabled:opacity-50"
                      title="Delete action plan"
                    >
                      {deletingId === plan._id ? (
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === plan._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Full Description:</h5>
                    {typeof plan.description === 'string' ? (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {plan.description}
                      </p>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(plan.description, null, 2)}
                        </pre>
                      </div>
                    )}

                    {plan.userIds && plan.userIds.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">
                          All Assigned Users ({plan.userIds.length}):
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {plan.userIds.map((user) => (
                            <div
                              key={user._id}
                              className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                            >
                              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {user.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                                <p className="text-xs text-gray-500">{user.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionPlanList;
