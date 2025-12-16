import { Alert } from 'react-native';

const addUrlParams = (url, params) => {
  // Check if any params to be added 
  if (!params || Object.keys(params).length === 0) return url;

  const urlObj = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlObj.searchParams.append(key, value);
    }
  });

  // Regex to replace the extra slash as empty string before query parameters
  return urlObj.toString().replace(/\/(?=\?api_key)/, '');
};

const handleResponse = async (response) => {
  const { status } = response;

  // Only HTTP status codes in the range of 200-299 will be accepted
  if (status >= 200 && status < 300) {
    try {
      const data = await response.json();
      return data;
    } catch (err) {
      // If JSON parsing fails, return text
      return await response.text();
    }
  }

  // Handling error responses
  let errorMessage = 'An error occurred';
  let errorData = null;

  try {
    errorData = await response.json();
    errorMessage = errorData.status_message || errorData.message || errorMessage;
  } catch {
    errorMessage = await response.text();
  }

  // Create error object with status and message
  const apiError = new Error(errorMessage);
  apiError.status = status;
  apiError.data = errorData;

  throw apiError;
};

const handleError = (error) => {
  let title = 'Error';
  let message = 'Something went wrong. Please try again.';

  if (error.status) {
    // HTTP status code errors
    switch (error.status) {
      case 400:
        title = 'Bad Request';
        message = error.message || 'Invalid request. Please check your input.';
        break;
      case 401:
        title = 'Unauthorized';
        message = error.message || 'Invalid API key or authentication failed.';
        break;
      case 403:
        title = 'Forbidden';
        message = error.message || 'You do not have permission to access this resource.';
        break;
      case 404:
        title = 'Not Found';
        message = error.message || 'The requested resource was not found.';
        break;
      case 429:
        title = 'Too Many Requests';
        message = error.message || 'Rate limit exceeded. Please try again later.';
        break;
      case 500:
        title = 'Server Error';
        message = error.message || 'Server error. Please try again later.';
        break;
      case 503:
        title = 'Service Unavailable';
        message = error.message || 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        title = `Error ${error.status}`;
        message = error.message || 'An unexpected error occurred.';
    }
  } else if (error.message) {
    // Network or other errors
    if (error.message.includes('Network request failed')) {
      title = 'Network Error';
      message = 'Unable to connect. Please check your internet connection.';
    } else {
      message = error.message;
    }
  }

  // Show error alert to user
  showError(title, message);
};


export const get = async (url, params = {}) => {
  try {
    // Add URL parameters including API key
    const urlWithParams = addUrlParams(url, {
      api_key: process.env.TMDB_API_KEY,
      ...params,
    });

    // Configure request options
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Make the request
    const response = await fetch(urlWithParams, requestOptions);

    // Handle response based on status
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// I'm aware this POST is 99% similar to GET, but kept separate for clarity and future modifications
export const post = async (url, body = {}, params = {}) => {
  try {
    // Add URL parameters including API key
    const urlWithParams = addUrlParams(url, {
      api_key: process.env.TMDB_API_KEY,
      ...params,
    });

    // Configure request options
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    // Make the request
    const response = await fetch(urlWithParams, requestOptions);

    // Handle response based on status
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const showError = (title, message) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export default {
  get,
  post,
  showError
};
