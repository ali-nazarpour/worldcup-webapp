import apiClient from './apiClient';

export const adminApi = {
  login: (data) => apiClient.post('/admin/auth/login', data),
  logout: () => apiClient.post('/admin/auth/logout'),
  me: () => apiClient.get('/admin/auth/me'),
  getDashboard: () => apiClient.get('/admin/dashboard'),
  sync: () => apiClient.post('/admin/sync'),
  getMatches: (params) => apiClient.get('/admin/matches', { params }),
  updateMatch: (id, data) => apiClient.put(`/admin/matches/${id}`, data),
  getPredictions: (params) => apiClient.get('/admin/predictions', { params }),
  getCorrectPredictions: (params) => apiClient.get('/admin/predictions/correct', { params }),
  exportCorrectPredictions: (params) =>
    apiClient.get('/admin/predictions/export/correct', { params, responseType: 'blob' }),
  getTournaments: () => apiClient.get('/admin/tournaments'),
  createTournament: (data) => apiClient.post('/admin/tournaments', data),
  updateTournament: (id, data) => apiClient.put(`/admin/tournaments/${id}`, data),
  setActiveTournament: (id) => apiClient.post(`/admin/tournaments/${id}/set-active`),
  getUsers: () => apiClient.get('/admin/users'),
  createUser: (data) => apiClient.post('/admin/users', data),
  updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
};

export default adminApi;
