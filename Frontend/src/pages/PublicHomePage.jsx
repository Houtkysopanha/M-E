import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicActionsOverview, getPublicStats } from '../services/publicService';
import { formatDate, getRelativeTime } from '../utils/checkCurrentYear';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const PublicHomePage = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalActions: 0,
    currentYearActions: 0,
    totalUsers: 0
  });

  const fetchActions = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch public actions overview and stats
      const [actionsResult, statsResult] = await Promise.all([
        getPublicActionsOverview({ limit: 20 }),
        getPublicStats()
      ]);

      if (actionsResult.success) {
        setActions(actionsResult.data.actions || []);
      }

      if (statsResult.success) {
        setStats({
          totalActions: statsResult.data.totalActions || 0,
          currentYearActions: statsResult.data.currentYearActions || 0,
          totalUsers: statsResult.data.activeUsers || 0
        });
      }

      if (!actionsResult.success && !statsResult.success) {
        setError('Failed to load data');
      }
    } catch (error) {
      // Show demo data if backend is not available
      setActions([]);
      setStats({
        totalActions: 0,
        currentYearActions: 0,
        totalUsers: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const ActionOverviewCard = ({ action }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {action.data?.title || 'Untitled Action'}
        </h3>
        <span className="text-xs text-gray-500 ml-2">
          {getRelativeTime(action.createdAt)}
        </span>
      </div>
      
      {action.data?.category && (
        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mb-2">
          {action.data.category}
        </span>
      )}
      
      {action.data?.description && (
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
          {action.data.description.length > 100 
            ? `${action.data.description.substring(0, 100)}...` 
            : action.data.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(action.createdAt)}</span>
        {action.data?.priority && (
          <span className={`px-2 py-1 rounded-full ${
            action.data.priority === 'high' ? 'bg-red-100 text-red-800' :
            action.data.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {action.data.priority}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Login Button */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and App Name */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                Action Tracker
              </span>
            </div>

            {/* Login Button */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="btn-primary"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              User Action Tracking System
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive platform for tracking and managing user actions with time-based CRUD restrictions, 
              role-based access control, and real-time analytics.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/login" className="btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <a 
                href="#features" 
                className="btn-secondary text-lg px-8 py-3"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalActions}</h3>
              <p className="text-gray-600">Total Actions Tracked</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">📅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.currentYearActions}</h3>
              <p className="text-gray-600">Actions This Year</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalUsers}</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
          </div>

          {/* Features Section */}
          <div id="features" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">⏰</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Time-Based CRUD</h3>
                <p className="text-gray-600">
                  Users can only modify data from the current year, ensuring data integrity and historical preservation.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">🔐</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Authentication</h3>
                <p className="text-gray-600">
                  JWT-based authentication with role-based access control for admins and regular users.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">👑</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Management</h3>
                <p className="text-gray-600">
                  Comprehensive user management with the ability to create, edit, and manage up to 30 users.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">📱</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsive Design</h3>
                <p className="text-gray-600">
                  Modern, mobile-first design that works seamlessly across all devices and screen sizes.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
                <p className="text-gray-600">
                  Comprehensive statistics and analytics to track user actions and system performance.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">🔄</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Data Structure</h3>
                <p className="text-gray-600">
                  Support for flexible JSON data structures to accommodate various types of user actions.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Actions Overview */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Actions Overview
              </h2>
              <Link to="/login" className="btn-primary">
                Login to View Details
              </Link>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {loading ? (
              <LoadingSpinner text="Loading recent actions..." />
            ) : actions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {actions.slice(0, 12).map((action) => (
                  <ActionOverviewCard key={action.id} action={action} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No actions available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Login to start creating and viewing actions.
                </p>
                <div className="mt-6">
                  <Link to="/login" className="btn-primary">
                    Login to Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Tracking?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join our platform and start managing your actions with powerful time-based controls.
            </p>
            <Link to="/login" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Get Started Now
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 User Action Tracking System. Built with React.js and Node.js.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHomePage;
