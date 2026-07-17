import { useSurveyContext } from '../context/SurveyContext';

export default function ToastStack() {
  const { toasts } = useSurveyContext();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.variant}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
