export const parseJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

export const stringifyJSON = (data, pretty = true) => {
  return JSON.stringify(data, null, pretty ? 2 : 0);
};

export const validateJSONSchema = (data) => {
  const requiredKeys = ['pages', 'title'];
  const errors = [];
  
  for (const key of requiredKeys) {
    if (!(key in data)) {
      errors.push(`Missing required key: ${key}`);
    }
  }
  
  if (data.pages && !Array.isArray(data.pages)) {
    errors.push('Pages must be an array');
  }
  
  data.pages?.forEach((page, index) => {
    if (!page.title) {
      errors.push(`Page ${index + 1} missing title`);
    }
    if (!page.elements || !Array.isArray(page.elements)) {
      errors.push(`Page ${index + 1} missing elements`);
    }
  });
  
  return errors;
};

export const mergeSurveyData = (existing, updates) => {
  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
};

export const cloneSurvey = (survey) => {
  return {
    ...JSON.parse(JSON.stringify(survey)),
    id: undefined,
    title: `${survey.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};