import React, { useState } from 'react';

const SliderQuestion = ({ question, onChange, value, error, preview }) => {
  const min = question.min || 0;
  const max = question.max || 100;
  const step = question.step || 1;
  const [sliderValue, setSliderValue] = useState(value || min);

  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    onChange(val);
  };

  if (!preview) {
    return (
      <div className="text-muted small">
        <span>Slider field</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3">
        <input
          type="range"
          className="form-range flex-grow-1"
          min={min}
          max={max}
          step={step}
          value={sliderValue}
          onChange={handleChange}
          disabled={!preview}
        />
        {question.showValue !== false && (
          <span className="badge bg-primary" style={{ minWidth: '40px' }}>
            {sliderValue}
          </span>
        )}
      </div>
      <div className="d-flex justify-content-between text-muted small">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
};

export default SliderQuestion;