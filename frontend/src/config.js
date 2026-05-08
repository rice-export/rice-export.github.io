/**
 * Environment Configuration
 * 
 * This file handles different API URLs based on environment
 * 
 * DEVELOPMENT: http://localhost:5000/api
 * PRODUCTION: https://your-backend-service.onrender.com/api
 */

const getApiBaseUrl = () => {
  // Check if running on GitHub Pages
  if (window.location.hostname === 'rice-export.github.io') {
    // Production: use deployed backend
    return 'https://oriza-backend.onrender.com/api'; // CHANGE THIS to your backend URL
  }
  
  // Check if explicitly set in localStorage (useful for switching during development)
  const customUrl = localStorage.getItem('API_BASE_URL');
  if (customUrl) {
    return customUrl;
  }
  
  // Development: use local backend
  return 'http://localhost:5000/api';
};

const getEnvironment = () => {
  if (window.location.hostname === 'rice-export.github.io') {
    return 'production';
  }
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'development';
  }
  return 'staging';
};

const config = {
  api: {
    baseUrl: getApiBaseUrl(),
    timeout: 10000,
    retries: 3
  },
  environment: getEnvironment(),
  logging: {
    enabled: getEnvironment() !== 'production',
    verbose: getEnvironment() === 'development'
  }
};

// Export for use in other modules
window.appConfig = config;

console.log(`🚀 Environment: ${config.environment}`);
console.log(`📡 API Base URL: ${config.api.baseUrl}`);
