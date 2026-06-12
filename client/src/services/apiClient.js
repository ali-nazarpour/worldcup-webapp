import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
    return Promise.reject({ ...error, message });
  }
);

export default apiClient;
