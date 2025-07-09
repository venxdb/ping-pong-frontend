// API Configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ping-pong-backend-venxdb.onrender.com'
  : 'http://localhost:5000';

export const API_ENDPOINTS = {
  REGISTER: '/api/utenti/register',
  LOGIN: '/api/utenti/login',
  USER_INFO: '/api/utenti',
  ISCRIVITI: '/api/torneo/iscriviti',
  DIVENTA_ORGANIZZATORE: '/api/torneo/sono-un-organizzatore',
  PARTECIPANTI: '/api/partecipanti',
  INCONTRI: '/api/incontri',
  CLASSIFICA: '/api/classifica'
};

// Helper function per creare URL completi
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function per fetch con configurazione base
export const apiRequest = async (endpoint, options = {}) => {
  const url = createApiUrl(endpoint);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  const config = {
    ...defaultOptions,
    ...options
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};