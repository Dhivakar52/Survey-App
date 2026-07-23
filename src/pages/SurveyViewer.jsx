// pages/SurveyViewer.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurveyById } from '../utils/storage';
import { responseService } from '../services/responseService';
import QuestionRenderer from '../components/survey/QuestionRenderer';
import { ArrowLeft, Send, CheckCircle, AlertTriangle } from 'lucide-react';

const SurveyViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSurvey = () => {
      try {
        console.log('Loading survey with ID:', id); // Debug
        const surveyData = getSurveyById(id);
        console.log('Survey data:', surveyData); // Debug
        
        if (!surveyData) {
          setError('Survey not found');
          setLoading(false);
          return;
        }
        
        if (surveyData.status !== 'published') {
          setSurvey({ ...surveyData, unavailable: true });
          setLoading(false);
          return;
        }

        setSurvey(surveyData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading survey:', err);
        setError('Failed to load survey');
        setLoading(false);
      }
    };

    loadSurvey();
  }, [id]);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    survey.questions.forEach((question) => {
      if (question.required) {
        const answer = answers[question.id];
        if (answer === undefined || answer === null || answer === '') {
          newErrors[question.id] = 'This question is required';
          isValid = false;
        }
        if (Array.isArray(answer) && answer.length === 0) {
          newErrors[question.id] = 'This question is required';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      const firstError = document.querySelector('.is-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const answerArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId),
      answer: answer,
    }));

    responseService.add(id, answerArray);
    setSubmitted(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="mb-4">
            <AlertTriangle size={64} className="text-danger" />
          </div>
          <h3>Error Loading Survey</h3>
          <p className="text-muted">{error}</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Unavailable survey
  if (survey?.unavailable) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="mb-4">
            <span style={{ fontSize: '4rem' }}>🔒</span>
          </div>
          <h3>This survey is not available</h3>
          <p className="text-muted">The survey you're looking for is either not published or has been removed.</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Submitted state
  if (submitted) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5 bg-white rounded-4 shadow-sm p-5">
          <div className="mb-4">
            <CheckCircle size={64} className="text-success" />
          </div>
          <h3 className="fw-bold">Thank You!</h3>
          <p className="text-muted">Your response has been submitted successfully.</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Main survey render
  return (
    <div className="container mt-4 mb-5">
      <button className="btn btn-outline-secondary btn-sm mb-4" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={16} className="me-1" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
        <div className="mb-4 pb-3 border-bottom">
          <h2 className="fw-bold" style={{ color: '#00084D' }}>{survey.title}</h2>
          {survey.description && (
            <p className="text-muted mt-2">{survey.description}</p>
          )}
          <div className="mt-2">
            <span className="badge bg-success">Published</span>
            <span className="ms-2 text-muted small">{survey.questions?.length || 0} questions</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {survey.questions?.map((question, index) => (
            <div key={question.id} className="mb-4 pb-3 border-bottom">
              <div className="d-flex align-items-start gap-2">
                <span className="fw-semibold text-muted" style={{ minWidth: '28px' }}>
                  {index + 1}.
                </span>
                <div className="flex-grow-1">
                  <QuestionRenderer
                    question={question}
                    value={answers[question.id]}
                    onChange={(value) => handleAnswer(question.id, value)}
                    error={errors[question.id]}
                    preview={false}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <button type="submit" className="btn btn-primary btn-lg px-5">
              <Send size={18} className="me-2" />
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyViewer;