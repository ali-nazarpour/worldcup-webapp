import env, { hasFootballApiKey } from '../../config/env.js';
import { normalizeMatch, normalizeTeam } from './normalizeFootballData.js';

class FootballDataProvider {
  constructor() {
    this.baseUrl = env.football.baseUrl;
    this.apiKey = env.football.apiKey;
  }

  isConfigured() {
    return hasFootballApiKey();
  }

  async request(endpoint, params = {}) {
    if (!this.isConfigured()) {
      const error = new Error('کلید API فوتبال تنظیم نشده است.');
      error.statusCode = 503;
      error.code = 'FOOTBALL_API_NOT_CONFIGURED';
      throw error;
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: { 'X-Auth-Token': this.apiKey },
    });

    if (!response.ok) {
      const body = await response.text();
      const error = new Error(`خطا در دریافت داده از football-data.org: ${response.status}`);
      error.statusCode = response.status;
      error.details = body;
      throw error;
    }

    return response.json();
  }

  async getCompetitionMatches(competitionCode, options = {}) {
    const data = await this.request(`/competitions/${competitionCode}/matches`, options);
    return (data.matches || []).map(normalizeMatch);
  }

  async getMatches(options = {}) {
    const data = await this.request('/matches', options);
    return (data.matches || []).map(normalizeMatch);
  }

  async getCompetitionTeams(competitionCode) {
    const data = await this.request(`/competitions/${competitionCode}/teams`);
    return (data.teams || []).map(normalizeTeam);
  }

  async getCompetitionStandings(competitionCode) {
    return this.request(`/competitions/${competitionCode}/standings`);
  }
}

export default new FootballDataProvider();
