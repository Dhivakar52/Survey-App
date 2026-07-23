import { createContext, useContext, useMemo, useState, useCallback, useReducer } from 'react';
import en from '../locales/en.json';
import ta from '../locales/ta.json';
import hi from '../locales/hi.json';
import { generateId, createDefaultQuestion } from '../utils/surveyHelpers';

const LOCALES = { en, ta, hi };
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'hi', name: 'हिन्दी' },
];

// Survey Reducer
const surveyReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_QUESTION': {
      const { pageId, questionType, position } = action.payload;
      const newQuestion = createDefaultQuestion(questionType);
      const updatedPages = state.survey.pages.map((page) => {
        if (page.id === pageId) {
          const questions = [...page.questions];
          const insertIndex = position !== undefined ? position : questions.length;
          questions.splice(insertIndex, 0, newQuestion);
          return { ...page, questions };
        }
        return page;
      });
      return {
        ...state,
        survey: { ...state.survey, pages: updatedPages },
        selectedQuestionId: newQuestion.id,
        isDirty: true,
      };
    }

    case 'UPDATE_QUESTION': {
      const { questionId, updates } = action.payload;
      const updatedPages = state.survey.pages.map((page) => ({
        ...page,
        questions: page.questions.map((q) =>
          q.id === questionId ? { ...q, ...updates } : q
        ),
      }));
      return {
        ...state,
        survey: { ...state.survey, pages: updatedPages },
        isDirty: true,
      };
    }

    case 'DELETE_QUESTION': {
      const { questionId } = action.payload;
      const updatedPages = state.survey.pages.map((page) => ({
        ...page,
        questions: page.questions.filter((q) => q.id !== questionId),
      }));
      return {
        ...state,
        survey: { ...state.survey, pages: updatedPages },
        selectedQuestionId: null,
        isDirty: true,
      };
    }

    case 'SELECT_QUESTION':
      return { ...state, selectedQuestionId: action.payload };

    case 'TOGGLE_PREVIEW':
      return { ...state, isPreviewMode: !state.isPreviewMode };

    case 'SET_SURVEY':
      return { ...state, survey: action.payload, isDirty: true };

    default:
      return state;
  }
};

const initialState = {
  survey: {
    id: generateId(),
    title: 'Untitled Survey',
    description: '',
    pages: [{ id: generateId(), title: 'Page 1', questions: [] }],
  },
  selectedQuestionId: null,
  isDirty: false,
  isPreviewMode: false,
};

const SurveyContext = createContext(null);

export function SurveyProvider({ children }) {
  // Language state
  const [language, setLanguage] = useState('en');
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Builder state
  const [builderState, dispatch] = useReducer(surveyReducer, initialState);

  const t = useMemo(() => LOCALES[language] || LOCALES.en, [language]);

  // Language functions
  const setAnswer = useCallback((questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const clearAnswers = useCallback(() => {
    setAnswers({});
    setCurrentStep(0);
  }, []);

  const pushToast = useCallback((message, variant = 'default') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  // Builder functions
  const addQuestion = useCallback((pageId, questionType, position) => {
    dispatch({ type: 'ADD_QUESTION', payload: { pageId, questionType, position } });
  }, []);

  const updateQuestion = useCallback((questionId, updates) => {
    dispatch({ type: 'UPDATE_QUESTION', payload: { questionId, updates } });
  }, []);

  const deleteQuestion = useCallback((questionId) => {
    dispatch({ type: 'DELETE_QUESTION', payload: { questionId } });
  }, []);

  const selectQuestion = useCallback((questionId) => {
    dispatch({ type: 'SELECT_QUESTION', payload: questionId });
  }, []);

  const togglePreview = useCallback(() => {
    dispatch({ type: 'TOGGLE_PREVIEW' });
  }, []);

  const setSurvey = useCallback((survey) => {
    dispatch({ type: 'SET_SURVEY', payload: survey });
  }, []);

  const value = {
    // Language
    language,
    setLanguage,
    t,
    answers,
    setAnswer,
    clearAnswers,
    currentStep,
    setCurrentStep,
    toasts,
    pushToast,
    LANGUAGES,

    // Builder
    builderState,
    survey: builderState.survey,
    selectedQuestionId: builderState.selectedQuestionId,
    isDirty: builderState.isDirty,
    isPreviewMode: builderState.isPreviewMode,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    selectQuestion,
    togglePreview,
    setSurvey,
  };

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
}

export function useSurveyContext() {
  const ctx = useContext(SurveyContext);
  if (!ctx) {
    throw new Error('useSurveyContext must be used within a SurveyProvider');
  }
  return ctx;
}