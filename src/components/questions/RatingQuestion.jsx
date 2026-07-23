import React from 'react';
import { Star } from 'lucide-react';

const RatingQuestion = ({ question, onChange, value, error, preview }) => {
  const maxRating = question.maxRating || 5;

  return (
    <div>
      <div className="d-flex gap-1">
        {[...Array(maxRating)].map((_, index) => {
          const rating = index + 1;
          return (
            <button
              key={index}
              type="button"
              className="btn btn-link p-0"
              onClick={() => onChange(rating)}
              disabled={!preview}
              style={{ textDecoration: 'none' }}
            >
              <Star
                size={32}
                fill={rating <= (value || 0) ? '#FBBF24' : 'none'}
                color={rating <= (value || 0) ? '#FBBF24' : '#d1d5db'}
                style={{ transition: 'all 0.2s' }}
              />
            </button>
          );
        })}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
};

export default RatingQuestion;