import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gắn token vào request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi token hết hạn (nếu có)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Redirect to login...');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
