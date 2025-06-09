import React, { useState, useEffect } from 'react';
import { getAllActions } from '../services/actionService';
import { getCurrentUser } from '../utils/auth';
import Header from '../components/common/Header';
import ActionCard from '../components/actions/ActionCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const HomePage = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalActions: 0,
    currentYearActions: 0,
    activeUsers: 0
  });

  const currentUser = getCurrentUser();

  const fetchActions = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch recent actions for overview
      const result = await getAllActions({ limit: 20 });
      
      if (result.success) {
        setActions(result.data.actions || []);
        
        // Calculate basic stats
        const totalActions = result.data.pagination?.totalActions || 0;
        const currentYear = new Date().getFullYear();
        const currentYearActions = (result.data.actions || []).filter(
          action => new Date(action.createdAt).getFullYear() === currentYear
        ).length;
        
        setStats({
          totalActions,
          currentYearActions,
          activeUsers: 1 // This would come from a proper endpoint
        });
      } else {
        setError(result.message || 'Failed to load actions');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to Action Tracker
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Overview of all user actions across the system
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Actions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalActions}</p>
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
                  <p className="text-sm font-medium text-gray-500">This Year</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.currentYearActions}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="card mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {currentUser?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Hello, {currentUser?.username}! 👋
                </h2>
                <p className="text-gray-600">
                  Here's an overview of all actions in the system. You can view your personal actions and create new ones from the "My Actions" page.
                </p>
              </div>
            </div>
          </div>

          <ErrorMessage message={error} onClose={() => setError('')} />

          {/* Recent Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Recent Actions</h2>
              <p className="text-sm text-gray-600">
                Latest actions from all users (read-only view)
              </p>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading recent actions..." />
            ) : actions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {actions.map((action) => (
                  <div key={action.id} className="relative">
                    <ActionCard
                      action={action}
                      showUserInfo={true}
                      onActionUpdated={null} // Read-only
                      onActionDeleted={null} // Read-only
                    />
                    {/* Read-only overlay */}
                    <div className="absolute inset-0 bg-gray-50 bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                        <p className="text-sm text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          Read-only view
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No actions yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No actions have been created in the system yet.
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-4">
              <a
                href="/user"
                className="btn-primary"
              >
                📝 Create New Action
              </a>
              <a
                href="/user"
                className="btn-secondary"
              >
                📋 View My Actions
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
