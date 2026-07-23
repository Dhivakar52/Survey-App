import { useEffect, useRef, useCallback } from 'react';

export const useAutoSave = (data, delay = 3000) => {
  const timeoutRef = useRef(null);
  const lastSavedRef = useRef(null);

  const save = useCallback(() => {
    try {
      const savedData = {
        ...data,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('survey_draft', JSON.stringify(savedData));
      lastSavedRef.current = new Date().toISOString();
      console.log('Auto-saved at:', lastSavedRef.current);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [data]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, save]);

  // Load saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('survey_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only load if it's the same survey or if there's no current data
        if (parsed.id === data.id || !data.id) {
          console.log('Loaded draft from:', parsed.savedAt);
          // Return the saved data
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }, []);

  return { lastSaved: lastSavedRef.current, save };
};