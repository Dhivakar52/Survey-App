import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurveyContext } from '../context/SurveyContext';
import { useSurvey } from '../hooks/useSurvey';
import SurveyCard from '../components/SurveyCard';
import { SkeletonCard, ErrorState } from '../components/LoadingState';
import { submitSurvey } from '../services/surveyApi';

function formatAnswer(value, t) {
  if (value === undefined || value === null || value === '') return t.review.notAnswered;
  if (Array.isArray(value)) return value.length ? value.join(', ') : t.review.notAnswered;
  if (value === 'yes' || value === 'no') return value.charAt(0).toUpperCase() + value.slice(1);
  return String(value);
}

export default function ReviewPage() {
  const { t, answers, language, setCurrentStep, pushToast } = useSurveyContext();
  const { survey, questions, status, reload } = useSurvey();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (status === 'loading') return <SkeletonCard />;
  if (status === 'error') {
    return <ErrorState message={t.errors.loadFailed} onRetry={reload} retryLabel={t.errors.retry} />;
  }
  if (survey?.submitted) {
    navigate('/already-submitted', { replace: true });
    return null;
  }

  const handleEdit = (index) => {
    setCurrentStep(index);
    navigate('/survey');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        surveyId: survey.surveyId,
        language,
        answers: questions.map((q) => ({ questionId: q.id, answer: answers[q.id] ?? null })),
      };
      const result = await submitSurvey(payload);
      navigate('/success', { state: result });
    } catch (err) {
      pushToast(t.errors.submitFailed, 'danger');
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SurveyCard>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{t.review.title}</h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>{t.review.subtitle}</p>

      <div className="mt-3">
        {questions.map((q, i) => (
          <div key={q.id} className="review-row">
            <div className="q-text">{q.question}</div>
            <div className="a-text">{formatAnswer(answers[q.id], t)}</div>
            <button
              className="btn-survey btn-survey-ghost mt-2"
              style={{ padding: '5px 14px', fontSize: '0.78rem' }}
              onClick={() => handleEdit(i)}
            >
              {t.review.edit}
            </button>
          </div>
        ))}
      </div>

      <button
        className="btn-survey btn-survey-accent w-100 mt-4"
        onClick={() => setConfirmOpen(true)}
      >
        {t.review.submit}
      </button>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(23,26,43,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 16,
          }}
        >
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 28, maxWidth: 380, width: '100%', boxShadow: 'var(--shadow-pop)' }}>
            <h3 id="confirm-title" style={{ fontSize: '1.15rem', fontWeight: 700 }}>{t.review.confirmTitle}</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>{t.review.confirmBody}</p>
            <div className="d-flex gap-2 mt-3">
              <button className="btn-survey btn-survey-ghost flex-grow-1" onClick={() => setConfirmOpen(false)} disabled={submitting}>
                {t.review.confirmNo}
              </button>
              <button className="btn-survey btn-survey-primary flex-grow-1" onClick={handleSubmit} disabled={submitting}>
                {submitting ? '…' : t.review.confirmYes}
              </button>
            </div>
          </div>
        </div>
      )}
    </SurveyCard>
  );
}
