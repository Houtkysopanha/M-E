/**
 * Time-based validation utilities for CRUD operations
 */

// Get current year
const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Check if a date is in the current year
const isCurrentYear = (date) => {
  const currentYear = getCurrentYear();
  const dateYear = new Date(date).getFullYear();
  return currentYear === dateYear;
};

// Check if an action can be modified (created in current year)
const canModifyAction = (createdAt) => {
  return isCurrentYear(createdAt);
};

// Get year from date
const getYearFromDate = (date) => {
  return new Date(date).getFullYear();
};

// Validate that a date is not in the future
const isValidDate = (date) => {
  const now = new Date();
  const inputDate = new Date(date);
  return inputDate <= now;
};

// Get start and end of current year
const getCurrentYearRange = () => {
  const currentYear = getCurrentYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear + 1, 0, 1);
  
  return { startOfYear, endOfYear };
};

// Get start and end of a specific year
const getYearRange = (year) => {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);
  
  return { startOfYear, endOfYear };
};

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Check if two dates are in the same year
const isSameYear = (date1, date2) => {
  return getYearFromDate(date1) === getYearFromDate(date2);
};

// Get time-based error messages
const getTimeErrorMessage = (operation, createdAt) => {
  const actionYear = getYearFromDate(createdAt);
  const currentYear = getCurrentYear();
  
  if (actionYear < currentYear) {
    return `Cannot ${operation} data from ${actionYear}. Only current year (${currentYear}) data can be modified.`;
  }
  
  if (actionYear > currentYear) {
    return `Invalid date detected. Future dates are not allowed.`;
  }
  
  return `Action not allowed for ${operation}.`;
};

module.exports = {
  getCurrentYear,
  isCurrentYear,
  canModifyAction,
  getYearFromDate,
  isValidDate,
  getCurrentYearRange,
  getYearRange,
  formatDate,
  isSameYear,
  getTimeErrorMessage
};
