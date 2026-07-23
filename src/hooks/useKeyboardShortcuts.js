import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = useCallback((event) => {
    const key = event.key;
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;
    const alt = event.altKey;

    let shortcut = '';
    if (ctrl) shortcut += 'Ctrl+';
    if (shift) shortcut += 'Shift+';
    if (alt) shortcut += 'Alt+';
    shortcut += key;

    const handler = shortcuts[shortcut];
    if (handler) {
      event.preventDefault();
      handler();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export const useUndoRedo = (state) => {
  const [history, setHistory] = useState([]);
  const [index, setIndex] = useState(-1);

  const push = useCallback((newState) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, index + 1);
      return [...newHistory, newState];
    });
    setIndex(prev => prev + 1);
  }, [index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
      return history[index - 1];
    }
    return null;
  }, [history, index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex(index + 1);
      return history[index + 1];
    }
    return null;
  }, [history, index]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return { push, undo, redo, canUndo, canRedo };
};