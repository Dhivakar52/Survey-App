import React, { useState } from 'react';
import QuestionFactory from '../questions/QuestionFactory';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Preview = ({ survey, theme }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const totalPages = survey.pages.length;

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allQuestions = survey.pages.flatMap(p => p.questions);
    const missingRequired = allQuestions
      .filter(q => q.required && !answers[q.id])
      .map(q => q.title);

    if (missingRequired.length > 0) {
      alert(`Please answer all required questions: ${missingRequired.join(', ')}`);
      return;
    }

    setSubmitted(true);
    console.log('Survey submitted:', answers);
  };

  const goToPage = (index) => {
    if (index >= 0 && index < totalPages) {
      setCurrentPage(index);
    }
  };

  if (submitted) {
    return (
      <div className="preview-submitted text-center py-5">
        <div className="submitted-icon">✓</div>
        <h3>Thank You!</h3>
        <p className="text-muted">Your response has been submitted successfully.</p>
      </div>
    );
  }

  const currentPageData = survey.pages[currentPage] || { questions: [] };

  return (
    <div className={`preview-container theme-${theme}`}>
      <div className="preview-header">
        <h2 className="preview-title">{survey.title}</h2>
        {survey.description && (
          <p className="preview-description">{survey.description}</p>
        )}
        {survey.settings?.showProgressBar && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            />
            <span className="progress-text">
              Page {currentPage + 1} of {totalPages}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="preview-questions">
          {currentPageData.questions.map((question) => (
            <div key={question.id} className="preview-question">
              <QuestionFactory
                question={question}
                value={answers[question.id]}
                onChange={(value) => handleAnswer(question.id, value)}
                preview={true}
              />
            </div>
          ))}
        </div>

        <div className="preview-navigation">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {currentPage === totalPages - 1 ? (
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => goToPage(currentPage + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </form>

      <style>{`
        .preview-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .preview-header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        .preview-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #00084D;
          margin-bottom: 8px;
        }

        .preview-description {
          color: #6c757d;
          font-size: 1rem;
        }

        .progress-bar {
          position: relative;
          height: 6px;
          background: #e9ecef;
          border-radius: 3px;
          margin-top: 16px;
          overflow: visible;
        }

        .progress-fill {
          height: 100%;
          background: #00084D;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-text {
          position: absolute;
          right: 0;
          top: 12px;
          font-size: 0.75rem;
          color: #6c757d;
        }

        .preview-question {
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .preview-question:last-child {
          border-bottom: none;
        }

        .preview-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #f0f0f0;
        }

        .preview-navigation .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
        }

        .preview-submitted {
          max-width: 500px;
          margin: 60px auto;
        }

        .submitted-icon {
          font-size: 4rem;
          color: #4CAF50;
          margin-bottom: 20px;
        }

        .theme-dark .preview-container {
          background: #1a1a2e;
          color: #f0f0f0;
        }

        .theme-dark .preview-title {
          color: #f0f0f0;
        }

        .theme-dark .preview-description {
          color: #a0a0a0;
        }

        .theme-dark .preview-question {
          border-bottom-color: #2a2a3e;
        }

        .theme-dark .preview-navigation {
          border-top-color: #2a2a3e;
        }

        @media (max-width: 768px) {
          .preview-container {
            padding: 16px;
          }

          .preview-title {
            font-size: 1.4rem;
          }

          .preview-navigation {
            flex-direction: column;
            gap: 12px;
          }

          .preview-navigation .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Preview;