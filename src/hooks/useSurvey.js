import { useCallback, useEffect, useState } from 'react';
import { fetchSurvey, fetchQuestions } from '../services/surveyApi';
import { useSurveyContext } from '../context/SurveyContext';

/**
 * Loads survey metadata + questions for the current language.
 * Refetches automatically when the language changes so labels stay in sync
 * without touching already-entered answers.
 */
export function useSurvey() {
  const { language } = useSurveyContext();
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [surveyData, questionData] = await Promise.all([
        fetchSurvey(language),
        fetchQuestions(language),
      ]);
      setSurvey(surveyData);
      setQuestions(questionData);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  }, [language]);

  useEffect(() => {
    load();
  }, [load]);

  return { survey, questions, status, reload: load };
}
