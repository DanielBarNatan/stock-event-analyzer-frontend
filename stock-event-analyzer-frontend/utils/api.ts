/**
 * Returns the base URL for API calls, handling different environments
 */
export const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // When running in Docker, use the container name for server-to-server communication
    // but use localhost for browser-to-server communication
    if (process.env.NEXT_PUBLIC_API_URL) {
      // For browser requests, replace 'backend' hostname with 'localhost'
      // because the browser can't resolve the Docker container name
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      return apiUrl.replace('http://backend:', 'http://localhost:');
    }
    
    // When running locally in development, use the current hostname
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      return `http://${window.location.hostname}:4000`;
    }
  }
  
  // Default fallback
  return 'http://localhost:4000';
};

/**
 * Returns the base URL for FastAPI services
 */
export const getFastApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // When running in Docker, use the container name for server-to-server communication
    // but use localhost for browser-to-server communication
    if (process.env.NEXT_PUBLIC_FASTAPI_URL) {
      // For browser requests, replace 'fastapi' hostname with 'localhost'
      const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL;
      return apiUrl.replace('http://fastapi:', 'http://localhost:');
    }
    
    // When running locally in development, use the current hostname
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      return `http://${window.location.hostname}:8000`;
    }
  }
  
  // Default fallback
  return 'http://localhost:8000';
}; 