import React, { useState, useEffect } from 'react';
import { getActions } from '../../services/actionService';
import { getCurrentYear } from '../../utils/checkCurrentYear';
import ActionCard from './ActionCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ActionList = ({ refreshTrigger, showUserInfo = false }) => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalActions: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const currentYear = getCurrentYear();

  const fetchActions = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (filters.year) params.year = filters.year;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;

      const result = await getActions(params);
      
      if (result.success) {
        setActions(result.data.actions || []);
        setPagination(result.data.pagination || {});
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
  }, [filters, refreshTrigger]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleActionUpdated = (updatedAction) => {
    setActions(prev => 
      prev.map(action => 
        action.id === updatedAction.action.id ? updatedAction.action : action
      )
    );
  };

  const handleActionDeleted = (actionId) => {
    setActions(prev => prev.filter(action => action.id !== actionId));
  };

  const getYearOptions = () => {
    const years = [];
    const startYear = currentYear - 5; // Show last 5 years
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  };

  if (loading && actions.length === 0) {
    return <LoadingSpinner text="Loading actions..." />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Year
              </label>
              <select
                id="year"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="input-field w-auto"
              >
                <option value="">All Years</option>
                {getYearOptions().map(year => (
                  <option key={year} value={year}>
                    {year} {year === currentYear ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
                Items per Page
              </label>
              <select
                id="limit"
                name="limit"
                value={filters.limit}
                onChange={handleFilterChange}
                className="input-field w-auto"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {pagination.totalActions > 0 ? (
              <span>
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * filters.limit, pagination.totalActions)} of{' '}
                {pagination.totalActions} actions
              </span>
            ) : (
              <span>No actions found</span>
            )}
          </div>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Actions Grid */}
      {actions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onActionUpdated={handleActionUpdated}
              onActionDeleted={handleActionDeleted}
              showUserInfo={showUserInfo}
            />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No actions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.year ? `No actions found for ${filters.year}` : 'Get started by creating your first action.'}
            </p>
          </div>
        )
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage || loading}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage || loading}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                <span className="font-medium">{pagination.totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage || loading}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                  if (pageNum > pagination.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        pageNum === pagination.currentPage
                          ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {loading && actions.length > 0 && (
        <div className="flex justify-center">
          <LoadingSpinner text="Loading..." />
        </div>
      )}
    </div>
  );
};

export default ActionList;
