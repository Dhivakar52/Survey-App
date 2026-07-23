// services/responseService.js

import { 
  getResponses, 
  saveResponses, 
  getResponsesBySurveyId,
  addResponse,
} from '../utils/storage';

export const responseService = {
  // Get all responses
  getAll: () => {
    return getResponses();
  },

  // Get responses by survey ID
  getBySurveyId: (surveyId) => {
    return getResponsesBySurveyId(surveyId);
  },

  // Add a new response
  add: (surveyId, answers) => {
    const response = {
      surveyId: parseInt(surveyId),
      submittedAt: new Date().toISOString(),
      answers: answers,
      id: Date.now(),
    };
    return addResponse(response);
  },

  // Get response by ID
  getById: (id) => {
    const responses = getResponses();
    return responses.find(r => r.id === parseInt(id)) || null;
  },

  // Get response count for a survey
  getCount: (surveyId) => {
    const responses = getResponsesBySurveyId(surveyId);
    return responses.length;
  },

  // Delete a response
  delete: (id) => {
    const responses = getResponses();
    const filtered = responses.filter(r => r.id !== parseInt(id));
    saveResponses(filtered);
    return filtered;
  },
};