// services/surveyService.js

import { 
  getSurveys, 
  saveSurveys, 
  getSurveyById, 
  deleteSurvey, 
  duplicateSurvey,
  publishSurvey,
} from '../utils/storage';

export const surveyService = {
  // Get all surveys
  getAll: () => {
    return getSurveys();
  },

  // Get survey by ID
  getById: (id) => {
    return getSurveyById(id);
  },

  // Save or update survey
  save: (surveyData) => {
    const surveys = getSurveys();
    const index = surveys.findIndex(s => s.id === surveyData.id);
    
    if (index !== -1) {
      surveys[index] = { ...surveys[index], ...surveyData, updatedAt: new Date().toISOString() };
    } else {
      surveys.push({
        ...surveyData,
        id: surveyData.id || Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    saveSurveys(surveys);
    return surveys[index || surveys.length - 1];
  },

  // Delete survey
  delete: (id) => {
    return deleteSurvey(id);
  },

  // Duplicate survey
  duplicate: (id) => {
    return duplicateSurvey(id);
  },

  // Publish survey
  publish: (id) => {
    return publishSurvey(id);
  },

  // Get draft surveys
  getDrafts: () => {
    const surveys = getSurveys();
    return surveys.filter(s => s.status === 'draft');
  },

  // Get published surveys
  getPublished: () => {
    const surveys = getSurveys();
    return surveys.filter(s => s.status === 'published');
  },
};