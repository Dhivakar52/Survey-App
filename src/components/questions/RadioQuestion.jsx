import React from 'react';

const RadioQuestion = ({ question, onChange, value, error, preview }) => {
  return (
    <div>
      {question.options?.map((option, index) => (
        <div key={index} className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`radio-${question.id}`}
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            disabled={!preview}
          />
          <label className="form-check-label">{option}</label>
        </div>
      ))}
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
};

export default RadioQuestion;