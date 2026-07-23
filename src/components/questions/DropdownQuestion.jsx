import React from 'react';

const DropdownQuestion = ({ question, onChange, value, error, preview }) => {
  return (
    <div>
      <select
        className={`form-select ${error ? 'is-invalid' : ''}`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={!preview}
      >
        <option value="">Select an option</option>
        {question.options?.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default DropdownQuestion;