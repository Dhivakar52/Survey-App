import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurveyContext } from '../context/SurveyContext';
import { useSurvey } from '../hooks/useSurvey';
import ProgressBar from '../components/ProgressBar';
import SurveyCard from '../components/SurveyCard';
import QuestionRenderer from '../components/QuestionRenderer';
import { SkeletonCard, ErrorState } from '../components/LoadingState';

function isEmpty(value) {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  return value === '';
}

export default function SurveyForm() {
  const { t, answers, setAnswer, currentStep, setCurrentStep } = useSurveyContext();
  const { survey, questions, status, reload } = useSurvey();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (status === 'loading') return <SkeletonCard />;
  if (status === 'error') {
    return <ErrorState message={t.errors.loadFailed} onRetry={reload} retryLabel={t.errors.retry} />;
  }
  if (survey?.submitted) {
    navigate('/already-submitted', { replace: true });
    return null;
  }
  if (questions.length === 0) return null;

  const question = questions[currentStep];
  const isLast = currentStep === questions.length - 1;
  const value = answers[question.id];

  const validate = () => {
    if (question.required && isEmpty(value)) {
      setError(t.question.required);
      return false;
    }
    setError('');
    return true;
  };

  const goNext = () => {
    if (!validate()) return;
    if (isLast) {
      navigate('/review');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    setError('');
    if (currentStep === 0) {
      navigate('/');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle progress bar click - navigate to specific question
  const handleProgressClick = (index) => {
    // Optional: validate current question before navigating away
    // if (!validate()) return;
    
    // Clear any errors when navigating
    setError('');
    
    // Navigate to the selected question
    setCurrentStep(index);
  };

  return (
    <>
      <ProgressBar 
        current={currentStep + 1} 
        total={questions.length} 
        ofLabel={t.question.of}
        onStepClick={handleProgressClick}
        questions={questions}
        answers={answers}
      />
      <SurveyCard>
        <QuestionRenderer
          key={question.id}
          question={question}
          value={value}
          error={error}
          onChange={(val) => {
            setAnswer(question.id, val);
            if (error) setError('');
          }}
        />

        <div className="d-flex gap-2  mt-4 justify-content-between">
          <button className="btn-survey btn-survey-ghost" onClick={goPrev}>
            ← {t.question.previous}
          </button>
          <button className="btn-survey btn-survey-primary" onClick={goNext}>
            {isLast ? t.question.submit : `${t.question.next} →`}
          </button>
        </div>
      </SurveyCard>
    </>
  );
}