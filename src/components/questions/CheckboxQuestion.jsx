import React from 'react';

const CheckboxQuestion = ({ question, onChange, value, error, preview }) => {
  const selected = Array.isArray(value) ? value : [];

  const handleChange = (option, checked) => {
    if (checked) {
      onChange([...selected, option]);
    } else {
      onChange(selected.filter(item => item !== option));
    }
  };

  return (
    <div>
      {question.options?.map((option, index) => (
        <div key={index} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={selected.includes(option)}
            onChange={(e) => handleChange(option, e.target.checked)}
            disabled={!preview}
          />
          <label className="form-check-label">{option}</label>
        </div>
      ))}
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
};

export default CheckboxQuestion;