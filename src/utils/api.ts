// src/utils/api.ts
import axios from 'axios';

const API_KEY = 'd326dd4b0133114de7fc00b3e02a6a37'; // Idéalement dans process.env
const BASE_URL = 'https://v3.football.api-sports.io';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-apisports-key': API_KEY,
  },
});

export async function fetchFromApi(endpoint: string, params: any = {}) {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data.response; // L'API renvoie { errors: [], response: [...] }
  } catch (error) {
    console.error(`Erreur API Foot sur ${endpoint}:`, error);
    return null;
  }
}