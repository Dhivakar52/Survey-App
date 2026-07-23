// utils/surveyHelpers.js

import { v4 as uuidv4 } from 'uuid';
import { QUESTION_TYPES, getQuestionConfig } from '../constants/questionTypes';

export const generateId = () => {
  return uuidv4();
};

export const createDefaultQuestion = (type) => {
  const config = getQuestionConfig(type);
  return {
    id: generateId(),
    type,
    title: `${config.label} Question`,
    description: '',
    required: false,
    readOnly: false,
    visible: true,
    placeholder: config.defaultSettings?.placeholder || '',
    defaultValue: '',
    helpText: '',
    validators: [],
    cssClass: '',
    name: '',
    ...config.defaultSettings,
  };
};

export const createDefaultPage = () => ({
  id: generateId(),
  title: `Page ${Date.now()}`,
  questions: [],
  conditions: [],
});

export const createDefaultSurvey = () => ({
  id: generateId(),
  title: 'Untitled Survey',
  description: '',
  logo: null,
  theme: 'light',
  settings: {
    showProgressBar: true,
    showQuestionNumbers: true,
    requireLogin: false,
    allowMultipleResponses: true,
    responseLimit: 0,
    redirectUrl: '',
    thankYouMessage: 'Thank you for completing the survey!',
  },
  pages: [createDefaultPage()],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'draft', // draft, published, archived
});

export const generateSurveyJSON = (survey) => {
  return {
    title: survey.title,
    description: survey.description,
    pages: survey.pages.map(page => ({
      name: page.title,
      elements: page.questions.map(q => ({
        type: q.type,
        name: q.id,
        title: q.title,
        description: q.description,
        isRequired: q.required,
        placeholder: q.placeholder,
        defaultValue: q.defaultValue,
        ...q,
      })),
    })),
    ...survey.settings,
  };
};

export const validateSurveyJSON = (json) => {
  const errors = [];
  if (!json.pages || !Array.isArray(json.pages)) {
    errors.push('Survey must have pages');
  }
  json.pages?.forEach((page, index) => {
    if (!page.elements || !Array.isArray(page.elements)) {
      errors.push(`Page ${index + 1} has no elements`);
    }
    page.elements?.forEach((element, elIndex) => {
      if (!element.type) {
        errors.push(`Element ${elIndex + 1} on page ${index + 1} has no type`);
      }
    });
  });
  return errors;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getQuestionSummary = (question) => {
  const config = getQuestionConfig(question.type);
  return {
    typeLabel: config.label,
    icon: config.icon,
    hasOptions: ['dropdown', 'radio', 'checkbox', 'rating', 'ranking'].includes(question.type),
    hasMatrix: ['matrix', 'matrixDropdown', 'matrixDynamic'].includes(question.type),
    isMedia: ['fileUpload', 'imagePicker', 'signature'].includes(question.type),
    isLayout: ['panel', 'dynamicPanel', 'html'].includes(question.type),
    isAdvanced: ['expression', 'richText', 'slider'].includes(question.type),
  };
};

export const validateQuestion = (question, value) => {
  const errors = [];
  
  // Required validation
  if (question.required && (value === undefined || value === null || value === '')) {
    errors.push('This question is required');
  }
  
  // Email validation
  if (question.validation === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.push('Please enter a valid email address');
    }
  }
  
  // Phone validation
  if (question.validation === 'phone' && value) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value)) {
      errors.push('Please enter a valid phone number');
    }
  }
  
  // Min length
  if (question.minLength && value && value.length < question.minLength) {
    errors.push(`Minimum length is ${question.minLength} characters`);
  }
  
  // Max length
  if (question.maxLength && value && value.length > question.maxLength) {
    errors.push(`Maximum length is ${question.maxLength} characters`);
  }
  
  // Min value
  if (question.min !== undefined && value !== undefined && value !== null && value < question.min) {
    errors.push(`Value must be at least ${question.min}`);
  }
  
  // Max value
  if (question.max !== undefined && value !== undefined && value !== null && value > question.max) {
    errors.push(`Value must be at most ${question.max}`);
  }
  
  // Regex validation
  if (question.regex && value) {
    const regex = new RegExp(question.regex);
    if (!regex.test(value)) {
      errors.push('Value does not match required pattern');
    }
  }
  
  return errors;
};

// ============================================
// NEW EXPORTS FOR DASHBOARD & SURVEY HELPERS
// ============================================

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
};

/**
 * Get status badge class for Bootstrap
 * @param {string} status - 'draft' | 'published' | 'archived'
 * @returns {string} Bootstrap badge class
 */
export const getStatusBadge = (status) => {
  const classes = {
    draft: 'bg-warning text-dark',
    published: 'bg-success text-white',
    archived: 'bg-secondary text-white',
  };
  return classes[status] || 'bg-secondary text-white';
};

/**
 * Get human-readable status label
 * @param {string} status - 'draft' | 'published' | 'archived'
 * @returns {string} Status label
 */
export const getStatusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
  };
  return labels[status] || status;
};

/**
 * Get display label for question type
 * @param {string} type - Question type
 * @returns {string} Human-readable label
 */
export const getQuestionTypeLabel = (type) => {
  const labels = {
    text: 'Text',
    dropdown: 'Dropdown',
    checkbox: 'Checkbox',
    radio: 'Radio',
    rating: 'Rating',
    matrix: 'Matrix',
    ranking: 'Ranking',
    fileUpload: 'File Upload',
    imagePicker: 'Image Picker',
    signature: 'Signature',
    boolean: 'Boolean',
    panel: 'Panel',
    dynamicPanel: 'Dynamic Panel',
    html: 'HTML',
    expression: 'Expression',
    multipleText: 'Multiple Text',
  };
  return labels[type] || type;
};

/**
 * Get icon for question type
 * @param {string} type - Question type
 * @returns {string} Emoji icon
 */
export const getQuestionIcon = (type) => {
  const icons = {
    text: '📝',
    dropdown: '📋',
    checkbox: '☑️',
    radio: '🔘',
    rating: '⭐',
    matrix: '📊',
    ranking: '🔢',
    fileUpload: '📁',
    imagePicker: '🖼️',
    signature: '✍️',
    boolean: '🔛',
    panel: '📦',
    dynamicPanel: '📚',
    html: '🌐',
    expression: '🧮',
    multipleText: '📝',
  };
  return icons[type] || '📄';
};

/**
 * Calculate survey statistics
 * @param {number} surveyId - Survey ID
 * @param {Array} surveys - Array of surveys
 * @param {Array} responses - Array of responses
 * @returns {Object} Survey statistics
 */
export const getSurveyStats = (surveyId, surveys, responses) => {
  const survey = surveys?.find(s => s.id === parseInt(surveyId));
  if (!survey) return null;

  const surveyResponses = responses?.filter(r => r.surveyId === parseInt(surveyId)) || [];
  const totalResponses = surveyResponses.length;
  
  // Calculate average rating (if survey has rating questions)
  let totalRating = 0;
  let ratingCount = 0;
  
  surveyResponses.forEach(response => {
    response.answers?.forEach(answer => {
      const question = survey.questions?.find(q => q.id === answer.questionId);
      if (question?.type === 'rating') {
        totalRating += parseInt(answer.answer) || 0;
        ratingCount++;
      }
    });
  });
  
  const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;

  return {
    totalResponses,
    completionRate: totalResponses > 0 ? 100 : 0,
    averageRating: parseFloat(averageRating),
    responses: surveyResponses,
  };
};

/**
 * Get response count for a survey
 * @param {number} surveyId - Survey ID
 * @param {Array} responses - Array of responses
 * @returns {number} Number of responses
 */
export const getResponseCount = (surveyId, responses) => {
  return responses?.filter(r => r.surveyId === parseInt(surveyId))?.length || 0;
};