/**
 * Returns the base URL for API calls, handling different environments
 */
export const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // When running in Docker, use the container name
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
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