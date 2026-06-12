import apiClient from './apiClient';

export const publicApi = {
  getActiveTournament: () => apiClient.get('/public/tournament/active'),
  getMatches: (params) => apiClient.get('/public/matches', { params }),
  getMatch: (id) => apiClient.get(`/public/matches/${id}`),
  submitPrediction: (data) => apiClient.post('/public/predictions', data),
  trackPrediction: (data) => apiClient.post('/public/predictions/track', data),
};

export default publicApi;
