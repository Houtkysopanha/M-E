/**
 * Time-based validation utilities for frontend CRUD operations
 */

// Get current year
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Check if a date is in the current year
export const isCurrentYear = (date) => {
  const currentYear = getCurrentYear();
  const dateYear = new Date(date).getFullYear();
  return currentYear === dateYear;
};

// Check if an action can be modified (created in current year)
export const canModifyAction = (createdAt) => {
  return isCurrentYear(createdAt);
};

// Get year from date
export const getYearFromDate = (date) => {
  return new Date(date).getFullYear();
};

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format date for display (short version)
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  const now = new Date();
  const actionDate = new Date(date);
  const diffInSeconds = Math.floor((now - actionDate) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDateShort(date);
  }
};

// Check if two dates are in the same year
export const isSameYear = (date1, date2) => {
  return getYearFromDate(date1) === getYearFromDate(date2);
};

// Get time-based status for UI display
export const getActionStatus = (createdAt) => {
  const actionYear = getYearFromDate(createdAt);
  const currentYear = getCurrentYear();
  
  if (actionYear === currentYear) {
    return {
      canModify: true,
      status: 'current',
      label: 'Current Year',
      color: 'green'
    };
  } else if (actionYear < currentYear) {
    return {
      canModify: false,
      status: 'historical',
      label: 'Historical',
      color: 'gray'
    };
  } else {
    return {
      canModify: false,
      status: 'future',
      label: 'Future',
      color: 'orange'
    };
  }
};
