import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import en from '../locales/en.json';
import ta from '../locales/ta.json';
import hi from '../locales/hi.json';

const LOCALES = { en, ta, hi };
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'தமிழ்' },
  // { code: 'hi', name: 'हिन्दी' },
];

const SurveyContext = createContext(null);

export function SurveyProvider({ children }) {
  const [language, setLanguage] = useState('en');
  // answers: { [questionId]: value }
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [toasts, setToasts] = useState([]);

  const t = useMemo(() => LOCALES[language] || LOCALES.en, [language]);

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

  const value = {
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
