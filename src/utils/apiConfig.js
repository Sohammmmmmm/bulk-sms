/**
 * API Configuration
 * Environment-based configuration for backend connectivity
 */

// Get API base URL from environment variables or use defaults
const API_BASE_URL = 
  import.meta.env.VITE_API_URL ||
  'http://localhost:8080/api';

const API_TIMEOUT = 30000; // 30 seconds

/**
 * API Endpoints Configuration
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    VERIFY: `${API_BASE_URL}/auth/verify`,
  },

  // File Upload endpoints
  FILES: {
    UPLOAD: `${API_BASE_URL}/files/upload`,
    VALIDATE: `${API_BASE_URL}/files/validate`,
    SCAN: `${API_BASE_URL}/files/scan`,
    PARSE: `${API_BASE_URL}/files/parse`,
    DELETE: `${API_BASE_URL}/files/:id`,
  },

  // Submission endpoints
  SUBMISSIONS: {
    CREATE: `${API_BASE_URL}/submissions/create`,
    LIST: `${API_BASE_URL}/submissions`,
    GET: (id) => `${API_BASE_URL}/submissions/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/submissions/${id}`,
    APPROVE: (id) => `${API_BASE_URL}/submissions/${id}/approve`,
    REJECT: (id) => `${API_BASE_URL}/submissions/${id}/reject`,
    STATUS: (id) => `${API_BASE_URL}/submissions/${id}/status`,
  },

  // Contact endpoints
  CONTACTS: {
    IMPORT: `${API_BASE_URL}/contacts/import`,
    VALIDATE: `${API_BASE_URL}/contacts/validate`,
    LIST: `${API_BASE_URL}/contacts`,
    DELETE: `${API_BASE_URL}/contacts/:id`,
  },

  // Message endpoints
  MESSAGES: {
    TEST: `${API_BASE_URL}/messages/test`,
    SEND_TEST: `${API_BASE_URL}/messages/test`,
    SEND_BULK: `${API_BASE_URL}/messages/send`,
    STATUS: `${API_BASE_URL}/messages/:id/status`,
    KAFKA_VERIFY: `${API_BASE_URL}/messages/kafka/verify`,
  },

  // Analytics endpoints
  ANALYTICS: {
    STATS: `${API_BASE_URL}/analytics/stats`,
    ACTIVITY: `${API_BASE_URL}/analytics/activity`,
  },
};

/**
 * Helper function to get endpoint with path parameters
 * @param {string} endpoint - The endpoint template
 * @param {object} params - Path parameters to replace
 * @returns {string} - The formatted endpoint
 */
export const getEndpoint = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};

/**
 * API Request Handler
 */
export class APIClient {
  constructor(baseURL = API_BASE_URL, timeout = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.token = localStorage.getItem('authToken');
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Get default headers with auth token
   */
  getHeaders(contentType = 'application/json') {
    const headers = {
      'Content-Type': contentType,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Make a GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * Make a POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Make a PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Make a DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * Upload a file with FormData
   */
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);

    // Add additional data to form
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, browser will set it with boundary
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      },
    });
  }

  /**
   * Make a generic request
   */
  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const response = await fetch(url, {
        headers: this.getHeaders(),
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle response
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));

        // Handle unauthorized
        if (response.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }

        throw new Error(error.message || 'API request failed');
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw error;
    }
  }
}

// Create singleton instance
export const apiClient = new APIClient();

export default API_ENDPOINTS;
