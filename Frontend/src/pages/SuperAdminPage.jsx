import React, { useState, useEffect } from 'react';
import { getAllUsers, getSystemStats } from '../services/adminService';
import { getCurrentUser } from '../utils/auth';
import Header from '../components/common/Header';
import CreateUserForm from '../components/admin/CreateUserForm';
import UserTable from '../components/admin/UserTable';
import ActionPlanForm from '../components/admin/ActionPlanForm';
import ActionPlanList from '../components/admin/ActionPlanList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const SuperAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [actionPlanRefresh, setActionPlanRefresh] = useState(0);

  const currentUser = getCurrentUser();

  const fetchUsers = async () => {
    try {
      const result = await getAllUsers();
      
      if (result.success) {
        setUsers(result.data.users || []);
      } else {
        setError(result.message || 'Failed to load users');
      }
    } catch (error) {
      setError('An unexpected error occurred while loading users');
    }
  };

  const fetchStats = async () => {
    try {
      const result = await getSystemStats();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.message || 'Failed to load statistics');
      }
    } catch (error) {
      setError('An unexpected error occurred while loading statistics');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      await Promise.all([fetchUsers(), fetchStats()]);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleUserCreated = (newUser) => {
    setUsers(prev => [...prev, newUser]);
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('users'); // Switch to users tab after creating
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUserDeleted = (userId, permanent) => {
    if (permanent) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    } else {
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, isActive: false } : user
        )
      );
    }
    setRefreshTrigger(prev => prev + 1);
  };

  const handleActionPlanCreated = (newActionPlan) => {
    setActionPlanRefresh(prev => prev + 1);
    setActiveTab('action-plans'); // Switch to action plans tab after creating
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Manage Users', icon: '👥' },
    { id: 'create', label: 'Create User', icon: '➕' },
    { id: 'action-plans', label: 'Action Plans', icon: '📋' },
    { id: 'create-plan', label: 'Create Action Plan', icon: '📝' },
    { id: 'actions', label: 'All Actions', icon: '🔍' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading admin dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Super Admin Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage users, monitor system activity, and oversee all actions
            </p>
          </div>

          {/* Admin Welcome */}
          <div className="card mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">👑</span>
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome, Admin {currentUser?.username}!
                </h2>
                <p className="text-gray-600">
                  You have full administrative access to manage users and monitor all system activities.
                </p>
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* System Stats */}
                {stats && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="card">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold">👥</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.users?.total || 0}</p>
                          </div>
                        </div>
                      </div>

                      <div className="card">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold">✅</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Active Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.users?.active || 0}</p>
                          </div>
                        </div>
                      </div>

                      <div className="card">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold">📊</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Actions</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.actions?.total || 0}</p>
                          </div>
                        </div>
                      </div>

                      <div className="card">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold">📅</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Current Year</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.actions?.currentYear || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="text-lg font-semibold text-gray-900">User Statistics</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Users</span>
                            <span className="font-semibold">{stats.users?.total || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Active Users</span>
                            <span className="font-semibold text-green-600">{stats.users?.active || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Inactive Users</span>
                            <span className="font-semibold text-red-600">{stats.users?.inactive || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Admin Users</span>
                            <span className="font-semibold text-purple-600">{stats.users?.admins || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Regular Users</span>
                            <span className="font-semibold text-blue-600">{stats.users?.regular || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-header">
                          <h3 className="text-lg font-semibold text-gray-900">Action Statistics</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Actions</span>
                            <span className="font-semibold">{stats.actions?.total || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Current Year</span>
                            <span className="font-semibold text-green-600">{stats.actions?.currentYear || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Previous Years</span>
                            <span className="font-semibold text-gray-600">{stats.actions?.previousYears || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* System Limits */}
                    {stats.limits && (
                      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                        <div className="card-header">
                          <h3 className="text-lg font-semibold text-gray-900">System Limits</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Maximum Users</span>
                            <span className="font-semibold">{stats.limits.maxUsers}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Remaining Slots</span>
                            <span className={`font-semibold ${stats.limits.remainingSlots > 5 ? 'text-green-600' : 'text-red-600'}`}>
                              {stats.limits.remainingSlots}
                            </span>
                          </div>
                        </div>
                        {stats.limits.remainingSlots <= 5 && (
                          <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              ⚠️ Warning: Only {stats.limits.remainingSlots} user slots remaining!
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <UserTable
                users={users}
                onUserUpdated={handleUserUpdated}
                onUserDeleted={handleUserDeleted}
              />
            )}

            {activeTab === 'create' && (
              <CreateUserForm onUserCreated={handleUserCreated} />
            )}

            {activeTab === 'action-plans' && (
              <ActionPlanList refreshTrigger={actionPlanRefresh} />
            )}

            {activeTab === 'create-plan' && (
              <ActionPlanForm onActionPlanCreated={handleActionPlanCreated} />
            )}

            {activeTab === 'actions' && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">All User Actions</h3>
                  <p className="text-sm text-gray-600">
                    View all actions from all users (coming soon)
                  </p>
                </div>
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Feature Coming Soon</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    The ability to view all user actions will be available in a future update.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminPage;
