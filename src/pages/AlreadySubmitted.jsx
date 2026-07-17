import { useEffect, useState } from 'react';
import { useSurveyContext } from '../context/SurveyContext';
import { fetchSubmissionStatus } from '../services/surveyApi';
import SurveyCard from '../components/SurveyCard';
import { Spinner } from '../components/LoadingState';

export default function AlreadySubmitted() {
  const { t } = useSurveyContext();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchSubmissionStatus().then((res) => {
      if (active) {
        setRecord(res);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Spinner />;

  const date = record?.submissionDate ? new Date(record.submissionDate).toLocaleString() : '—';

  return (
    <SurveyCard
      stub={
        <>
          <div>
            <div className="stub-label">{t.already.submissionDate}</div>
            <div className="stub-value">{date}</div>
          </div>
          <div className="text-end">
            <div className="stub-label">{t.already.submissionId}</div>
            <div className="stub-value">{record?.submissionId || '—'}</div>
          </div>
        </>
      }
    >
      <div className="text-center">
        <div className="stamp-seal neutral">
          <span style={{ fontSize: '2.2rem' }} aria-hidden="true">✓</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t.already.title}</h1>
        <p style={{ color: 'var(--ink-soft)' }}>{t.already.message}</p>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--primary)' }}>
          {t.already.thankYou}
        </p>
      </div>
    </SurveyCard>
  );
}
