// auth.js - Authentication utility functions

/**
 * Check if the user is logged in
 * @returns {boolean} Whether the user is logged in
 */
export const isLoggedIn = () => {
  const userId = localStorage.getItem('userId');
  return !!userId;
};

/**
 * Check if the user is an admin
 * @returns {boolean} Whether the user is an admin
 */
export const isAdmin = () => {
  const userType = localStorage.getItem('userType');
  return userType === 'Admin';
};

/**
 * Get the current user's information
 * @returns {Object} User information from localStorage
 */
export const getCurrentUser = () => {
  return {
    id: localStorage.getItem('userId'),
    name: localStorage.getItem('userName'),
    userType: localStorage.getItem('userType')
  };
};

/**
 * Log out the current user
 * @param {function} callback - Optional callback after logout
 */
export const logout = (callback) => {
  // Clear all authentication data from localStorage
  localStorage.removeItem('userId');
  localStorage.removeItem('userType');
  localStorage.removeItem('userName');
  localStorage.removeItem('authToken');
  
  // Execute callback if provided
  if (callback && typeof callback === 'function') {
    callback();
  }
};