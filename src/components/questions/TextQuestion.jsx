import React from 'react';

const TextQuestion = ({ question, onChange, value, error, preview }) => {
  const getInputType = () => {
    switch (question.type) {
      case 'email': return 'email';
      case 'password': return 'password';
      case 'number': return 'number';
      case 'phone': return 'tel';
      case 'date': return 'date';
      case 'time': return 'time';
      case 'datetime': return 'datetime-local';
      default: return 'text';
    }
  };

  const isTextarea = question.type === 'comment';

  if (isTextarea) {
    return (
      <div>
        <textarea
          className={`form-control ${error ? 'is-invalid' : ''}`}
          rows={question.rows || 4}
          placeholder={question.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={!preview}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    );
  }

  return (
    <div>
      <input
        type={getInputType()}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        placeholder={question.placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={!preview}
        min={question.min}
        max={question.max}
        step={question.step}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default TextQuestion;