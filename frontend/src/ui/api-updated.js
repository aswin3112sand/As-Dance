const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://asdancz.in';

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

export function apiFetch(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const opts = { credentials: 'include', ...options };
  const method = (opts.method || 'GET').toUpperCase();
  
  if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
    const token = getCookie('XSRF-TOKEN');
    if (token) {
      opts.headers = { ...(opts.headers || {}), 'X-XSRF-TOKEN': token };
    }
  }
  
  return fetch(fullUrl, opts);
}

export async function apiCall(url, options = {}) {
  try {
    const response = await apiFetch(url, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
