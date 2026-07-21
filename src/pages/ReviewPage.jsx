import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurveyContext } from '../context/SurveyContext';
import { useSurvey } from '../hooks/useSurvey';
import ProgressBar from '../components/ProgressBar';
import SurveyCard from '../components/SurveyCard';
import { SkeletonCard, ErrorState } from '../components/LoadingState';
import { submitSurvey } from '../services/surveyApi';
import { Pencil } from "lucide-react";

function formatAnswer(value, t, language) {
  if (value === undefined || value === null || value === '') return t.review.notAnswered;
  if (Array.isArray(value)) return value.length ? value.join(', ') : t.review.notAnswered;

  if (value === 'yes') {
    if (language === 'ta') return 'ஆம்';
    if (language === 'hi') return 'हाँ';
    return 'Yes';
  }
  if (value === 'no') {
    if (language === 'ta') return 'இல்லை';
    if (language === 'hi') return 'नहीं';
    return 'No';
  }
  
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

  const handleProgressClick = (index) => {
    setCurrentStep(index);
    navigate('/survey');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Build answers object with questionId as key
      const answersObject = {};
      questions.forEach((q) => {
        const answer = answers[q.id];
        // Include all answers, even if null/empty
        answersObject[q.id] = answer !== undefined ? answer : null;
      });

      console.log('📝 Submitting answers:', answersObject); // Debug log

      const payload = {
        surveyId: survey.surveyId,
        language,
        answers: answersObject,
      };
      const result = await submitSurvey(payload);
      navigate('/success', { state: result });
    } catch (err) {
      console.error('❌ Submit error:', err);
      pushToast(err.message || t.errors.submitFailed || 'Failed to submit survey', 'danger');
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ProgressBar 
        current={questions.length} 
        total={questions.length} 
        ofLabel={t.question.of}
        onStepClick={handleProgressClick}
        questions={questions}
        answers={answers}
        isReviewMode={true}
      />
      <SurveyCard>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{t.review.title}</h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>{t.review.subtitle}</p>

        <div className="mt-3">
          {questions.map((q, i) => {
            const answer = answers[q.id];
            const isAnswered = answer !== undefined && answer !== null && answer !== '';
            
            return (
              <div key={q.id} className="review-row" style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                backgroundColor: isAnswered ? 'transparent' : '#fafafa',
                borderRadius: '4px',
              }}>
                <div className="q-text" style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '500',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ 
                    color: '#999', 
                    fontSize: '0.7rem', 
                    fontWeight: '600',
                    minWidth: '24px'
                  }}>
                    {i + 1}.
                  </span>
                  <span>{q.question}</span>
                  {q.required && <span style={{ color: '#dc3545', marginLeft: '2px' }}>*</span>}
                  {/* {!isAnswered && (
                    <span style={{ 
                      fontSize: '0.65rem', 
                      color: '#ff6b6b', 
                      background: '#fff0f0',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      marginLeft: '8px'
                    }}>
                      Not answered
                    </span>
                  )} */}
                </div>
                <div className="a-text" style={{ 
                  fontSize: '0.9rem', 
                  color: isAnswered ? '#00084D' : '#999',
                  fontWeight: isAnswered ? '500' : '400',
                  paddingLeft: '32px'
                }}>
                  {formatAnswer(answers[q.id], t, language)}
                </div>
                {/* <button
                  className="btn-survey btn-survey-ghost"
                  style={{ 
                    padding: '4px 12px', 
                    fontSize: '0.75rem',
                    alignSelf: 'flex-start',
                    marginTop: '4px',
                    marginLeft: '32px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#00084D',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f0f4ff';
                    e.target.style.borderColor = '#00084D';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = '#ddd';
                  }}
                  onClick={() => handleEdit(i)}
                >
                  <Pencil size={14} /> {t.review.edit}
                </button> */}
              </div>
            );
          })}
        </div>

        <button
          className="btn-survey btn-survey-accent w-100 mt-4"
          onClick={() => setConfirmOpen(true)}
          style={{
            backgroundColor: '#00084D',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1a1f6b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#00084D'}
        >
          {t.review.submit}
        </button>

        {confirmOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            style={{
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(23,26,43,0.45)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 999, 
              padding: 16,
            }}
          >
            <div style={{ 
              background: '#fff', 
              borderRadius: '12px', 
              padding: '28px', 
              maxWidth: '580px', 
              width: '100%', 
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            }}>
              <h3 id="confirm-title" style={{ 
                fontSize: '1.15rem', 
                fontWeight: 700,
                color: '#00084D'
              }}>
                {t.review.confirmTitle}
              </h3>
              <p style={{ 
                color: 'var(--ink-soft)', 
                fontSize: '0.9rem',
                marginTop: '8px'
              }}>
                {t.review.confirmBody}
              </p>
              <div className="d-flex gap-2 mt-3">
                <button 
                  className="btn-survey btn-survey-ghost flex-grow-1" 
                  onClick={() => setConfirmOpen(false)} 
                  disabled={submitting}
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {t.review.confirmNo}
                </button>
                <button 
                  className="btn-survey btn-survey-primary flex-grow-1" 
                  onClick={handleSubmit} 
                  disabled={submitting}
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#00084D',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) e.target.style.backgroundColor = '#1a1f6b';
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) e.target.style.backgroundColor = '#00084D';
                  }}
                >
                  {submitting ? '⏳ Submitting...' : t.review.confirmYes}
                </button>
              </div>
            </div>
          </div>
        )}
      </SurveyCard>
    </>
  );
}