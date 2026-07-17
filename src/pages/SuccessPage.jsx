import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSurveyContext } from '../context/SurveyContext';
import SurveyCard from '../components/SurveyCard';
import { Star } from 'lucide-react';

export default function SuccessPage() {
  const { t, clearAnswers } = useSurveyContext();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state) return null;

  const date = new Date(state.submissionDate).toLocaleString();

  const handleRatingSubmit = () => {
    // Here you can send the rating to your backend
    console.log('Rating submitted:', rating);
    // Show thank you message or close
  };

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

        {/* 5-Star Rating Section */}
        <div style={{
          margin: '24px auto',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e9ecef',
          maxWidth: '400px',
        }}>
          <p style={{
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#333',
            marginBottom: '12px',
          }}>
            {t.success.ratingLabel || 'Rate your experience:'}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
          }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'transform 0.2s ease',
                  transform: (hoveredRating || rating) >= star ? 'scale(1.1)' : 'scale(1)',
                }}
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  size={32}
                  fill={(hoveredRating || rating) >= star ? '#FBBF24' : 'none'}
                  color={(hoveredRating || rating) >= star ? '#FBBF24' : '#d1d5db'}
                  style={{
                    transition: 'all 0.2s ease',
                  }}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p style={{
              fontSize: '0.85rem',
              color: '#666',
              marginTop: '12px',
            }}>
              {t.success.ratingText || `You rated ${rating} out of 5 stars`}
            </p>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <button
            className="btn-survey btn-survey-primary"
            onClick={() => {
              clearAnswers();
              navigate('/');
            }}
          >
            {t.success.close}
          </button>
        </div>
      </div>
    </SurveyCard>
  );
}