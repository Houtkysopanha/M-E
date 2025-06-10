import React, { useState, useEffect } from 'react';
import { getActionStats, getUserActionPlans } from '../services/actionService';
import { getCurrentUser } from '../utils/auth';
import { getCurrentYear } from '../utils/checkCurrentYear';
import Header from '../components/common/Header';
import ActionForm from '../components/actions/ActionForm';
import ActionList from '../components/actions/ActionList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const UserPage = () => {
  const [stats, setStats] = useState(null);
  const [actionPlans, setActionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('action-plans');

  const currentUser = getCurrentUser();
  const currentYear = getCurrentYear();

  const fetchStats = async () => {
    try {
      const result = await getActionStats();

      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.message || 'Failed to load statistics');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  const fetchActionPlans = async () => {
    try {
      const result = await getUserActionPlans();

      if (result.success) {
        setActionPlans(result.data.actionPlans || []);
      } else {
        setError(result.message || 'Failed to load action plans');
      }
    } catch (error) {
      setError('An unexpected error occurred while loading action plans');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      await Promise.all([fetchStats(), fetchActionPlans()]);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleActionCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('list'); // Switch to list tab after creating
  };

  const tabs = [
    { id: 'action-plans', label: 'Action Plans', icon: '📋' },
    { id: 'create', label: 'Create Action', icon: '➕' },
    { id: 'list', label: 'My Actions', icon: '📝' },
    { id: 'stats', label: 'Statistics', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              My Action Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your personal actions and track your progress
            </p>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">📊</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Actions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">📅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">This Year ({currentYear})</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.currentYear}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">📚</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Previous Years</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.previousYears}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">✏️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Editable</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.currentYear}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Time-based Info */}
          <div className="card mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">⏰</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Time-Based Action Rules
                </h3>
                <div className="mt-2 text-sm text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>✅ You can create new actions anytime</li>
                    <li>✅ You can view all your actions from any year</li>
                    <li>✅ You can edit and delete actions from {currentYear} (current year)</li>
                    <li>🔒 Actions from previous years are read-only for data integrity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <ErrorMessage message={error} onClose={() => setError('')} />

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'action-plans' && (
              <div className="space-y-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Assigned Action Plans ({actionPlans.length})
                    </h3>
                    <p className="text-sm text-gray-600">
                      Action plans assigned to you by administrators
                    </p>
                  </div>

                  {actionPlans.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No action plans assigned</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        You don't have any action plans assigned to you yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {actionPlans.map((plan) => (
                        <div
                          key={plan._id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-lg font-medium text-gray-900">
                              {plan.title}
                            </h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Action Plan
                            </span>
                          </div>

                          <div className="mb-3">
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
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>
                              Created by: {plan.createdBy?.username || 'Unknown'}
                            </span>
                            <span>
                              {new Date(plan.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'create' && (
              <ActionForm onActionCreated={handleActionCreated} />
            )}

            {activeTab === 'list' && (
              <ActionList
                refreshTrigger={refreshTrigger}
                showUserInfo={false}
              />
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                {loading ? (
                  <LoadingSpinner text="Loading statistics..." />
                ) : stats ? (
                  <>
                    {/* Detailed Stats */}
                    <div className="card">
                      <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900">Action Statistics</h3>
                        <p className="text-sm text-gray-600">Detailed breakdown of your actions</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-md font-medium text-gray-900 mb-4">Actions by Year</h4>
                          <div className="space-y-3">
                            {stats.byYear && stats.byYear.length > 0 ? (
                              stats.byYear.map((yearData) => (
                                <div key={yearData.year} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center">
                                    <span className="text-lg font-medium text-gray-900">
                                      {yearData.year}
                                    </span>
                                    {yearData.year === currentYear && (
                                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                        Current
                                      </span>
                                    )}
                                    {yearData.canModify && (
                                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                        Editable
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xl font-bold text-primary-600">
                                    {yearData.count}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">No actions found</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-md font-medium text-gray-900 mb-4">Summary</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                              <span className="text-gray-700">Total Actions</span>
                              <span className="text-xl font-bold text-blue-600">{stats.total}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                              <span className="text-gray-700">Current Year ({currentYear})</span>
                              <span className="text-xl font-bold text-green-600">{stats.currentYear}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                              <span className="text-gray-700">Historical</span>
                              <span className="text-xl font-bold text-purple-600">{stats.previousYears}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Year Info */}
                    {stats.currentYearInfo && (
                      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Current Year ({stats.currentYearInfo.year}) Permissions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-3 ${stats.currentYearInfo.canCreate ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-gray-700">Can Create Actions</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-3 ${stats.currentYearInfo.canModify ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-gray-700">Can Modify Actions</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full mr-3 bg-green-500"></div>
                            <span className="text-gray-700">Can View All Actions</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No statistics available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPage;
