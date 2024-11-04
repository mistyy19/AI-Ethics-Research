import axios from 'axios';
import type { Survey, EthicsComparison, SurveyResult } from '../types/survey';

const api = axios.create({
  baseURL: '/api'
});

export const surveyApi = {
  createSurvey: async (data: FormData) => {
    const response = await api.post<Survey>('/surveys', data);
    return response.data;
  },

  getSurveys: async () => {
    const response = await api.get<Survey[]>('/surveys');
    return response.data;
  },

  getSurvey: async (id: string) => {
    const response = await api.get<Survey>(`/surveys/${id}`);
    return response.data;
  },

  getComparison: async () => {
    const response = await api.get<EthicsComparison>('/comparison');
    return response.data;
  },

  submitChoice: async (surveyId: string, choice: 'A' | 'B') => {
    const response = await api.post<EthicsComparison>(`/surveys/${surveyId}/choice`, { choice });
    return response.data;
  },

  getResults: async (surveyId: string) => {
    const response = await api.get<SurveyResult[]>(`/surveys/${surveyId}/results`);
    return response.data;
  },
  getUserSurveys: async () => {
    const response = await api.get<Survey[]>('/surveys/user');
    return response.data;
  }
};