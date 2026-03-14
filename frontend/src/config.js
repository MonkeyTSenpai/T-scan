// API Configuration
const hostname = window.location.hostname;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

export const API_BASE_URL = isLocalhost
  ? 'http://localhost:8000'
  : 'https://t-scan.onrender.com';

console.log('🌐 API Base URL:', API_BASE_URL);