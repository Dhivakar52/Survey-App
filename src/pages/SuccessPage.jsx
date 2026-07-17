import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSurveyContext } from '../context/SurveyContext';
import SurveyCard from '../components/SurveyCard';

export default function SuccessPage() {
  const { t, clearAnswers } = useSurveyContext();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state) return null;

  const date = new Date(state.submissionDate).toLocaleString();

  return (
    <SurveyCard
      stub={
        <>
          <div>
            <div className="stub-label">{t.success.submissionDate}</div>
            <div className="stub-value">{date}</div>
          </div>
          <div className="text-end">
            <div className="stub-label">{t.success.submissionId}</div>
            <div className="stub-value">{state.submissionId}</div>
          </div>
        </>
      }
    >
      <div className="text-center">
        <div className="stamp-seal success">
          <span style={{ fontSize: '2.6rem' }} aria-hidden="true">✓</span>
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{t.success.title}</h1>
        <p style={{ color: 'var(--ink-soft)' }}>{t.success.message}</p>

        <button
          className="btn-survey btn-survey-primary mt-3"
          onClick={() => {
            clearAnswers();
            navigate('/');
          }}
        >
          {t.success.close}
        </button>
      </div>
    </SurveyCard>
  );
}
