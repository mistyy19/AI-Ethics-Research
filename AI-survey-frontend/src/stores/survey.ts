import { defineStore } from 'pinia';
import type { Survey, EthicsComparison, SurveyResult } from '../types/survey';
import { surveyApi } from '../api/survey';

export const useSurveyStore = defineStore('survey', {
  state: () => ({
    surveys: [] as Survey[],
    currentSurvey: null as Survey | null,
    currentComparison: null as EthicsComparison | null,
    surveyResults: null as SurveyResult[] | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchSurveys() {
      this.loading = true;
      try {
        this.surveys = await surveyApi.getSurveys();
      } catch (error) {
        this.error = 'Failed to fetch surveys';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async getUserSurveys(userId: string) { // 接收 userId 参数
      this.loading = true;
      try {
        return await surveyApi.getUserSurveys(userId); // 传递 userId 给 API 调用
      } catch (error) {
        this.error = 'Failed to fetch user surveys';
        console.error(error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchSurvey(id: string) {
      this.loading = true;
      try {
        this.currentSurvey = await surveyApi.getSurvey(id);
      } catch (error) {
        this.error = 'Failed to fetch survey';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async getNextComparison() {
      try {
        this.currentComparison = await surveyApi.getComparison();
      } catch (error) {
        this.error = 'Failed to get comparison';
        console.error(error);
      }
    },

    async submitChoice(payload: { surveyId: string; choice: 'A' | 'B' }) {
      try {
        this.currentComparison = await surveyApi.submitChoice(payload.surveyId, payload.choice);
      } catch (error) {
        this.error = 'Failed to submit choice';
        console.error(error);
      }
    }
  }
});
