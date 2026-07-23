// utils/storage.js

const STORAGE_KEYS = {
  SURVEYS: 'surveys',
  RESPONSES: 'surveyResponses',
};

// Get all surveys from localStorage
export const getSurveys = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SURVEYS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading surveys:', error);
    return [];
  }
};

// Save surveys to localStorage
export const saveSurveys = (surveys) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
  } catch (error) {
    console.error('Error saving surveys:', error);
  }
};

// Get a single survey by ID
export const getSurveyById = (id) => {
  const surveys = getSurveys();
  return surveys.find(s => s.id === parseInt(id)) || null;
};

// Get all responses
export const getResponses = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading responses:', error);
    return [];
  }
};

// Save responses
export const saveResponses = (responses) => {
  try {
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
  } catch (error) {
    console.error('Error saving responses:', error);
  }
};

// Get responses for a specific survey
export const getResponsesBySurveyId = (surveyId) => {
  const responses = getResponses();
  return responses.filter(r => r.surveyId === parseInt(surveyId));
};

// Add a new response
export const addResponse = (response) => {
  const responses = getResponses();
  responses.push(response);
  saveResponses(responses);
  return response;
};

// Delete a survey
export const deleteSurvey = (id) => {
  const surveys = getSurveys();
  const filtered = surveys.filter(s => s.id !== parseInt(id));
  saveSurveys(filtered);
  return filtered;
};

// Duplicate a survey
export const duplicateSurvey = (id) => {
  const surveys = getSurveys();
  const survey = surveys.find(s => s.id === parseInt(id));
  if (!survey) return null;

  const newSurvey = {
    ...survey,
    id: Date.now(),
    title: `${survey.title} (Copy)`,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: null,
  };
  
  surveys.push(newSurvey);
  saveSurveys(surveys);
  return newSurvey;
};

// Publish a survey
export const publishSurvey = (id) => {
  const surveys = getSurveys();
  const index = surveys.findIndex(s => s.id === parseInt(id));
  if (index === -1) return null;
  
  surveys[index].status = 'published';
  surveys[index].publishedAt = new Date().toISOString();
  surveys[index].updatedAt = new Date().toISOString();
  saveSurveys(surveys);
  return surveys[index];
};