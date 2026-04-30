// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  CONFLICTS: `${API_BASE_URL}/api/v1/conflicts`,
  COUNTRIES: `${API_BASE_URL}/api/v1/countries`,
  EVENTS: `${API_BASE_URL}/api/v1/events`,
  FACTIONS: `${API_BASE_URL}/api/v1/factions`
}

export default {
  apiUrl: API_BASE_URL
}
