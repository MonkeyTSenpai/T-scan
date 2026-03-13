// API Configuration
// Change this to your computer's IP address when using from mobile device

// Get the current hostname
const hostname = window.location.hostname;

// If accessing from localhost, use localhost
// If accessing from IP address, use that IP for API calls
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

export const API_BASE_URL = isLocalhost
  ? 'http://localhost:8000'
  : `http://${hostname}:8000`;

// For manual override, uncomment and set your IP:
// export const API_BASE_URL = 'http://192.168.1.7:8000';

console.log('🔗 API Base URL:', API_BASE_URL);
