// components/survey/QuestionRenderer.jsx

import React from 'react';

const QuestionRenderer = ({ question, value, onChange, error, preview = false }) => {
  const renderQuestion = () => {
    switch (question.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'phone':
      case 'number':
        return (
          <input
            type={question.type === 'email' ? 'email' : 
                  question.type === 'password' ? 'password' :
                  question.type === 'phone' ? 'tel' :
                  question.type === 'number' ? 'number' : 'text'}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            placeholder={question.placeholder || ''}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={preview} // FIX: preview=true disables, preview=false enables
          />
        );

      case 'dropdown':
        return (
          <select
            className={`form-select ${error ? 'is-invalid' : ''}`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={preview} // FIX
          >
            <option value="">Select an option</option>
            {question.options?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div>
            {question.options?.map((opt, i) => (
              <div key={i} className="form-check">
                <input
                  className={`form-check-input ${error ? 'is-invalid' : ''}`}
                  type="radio"
                  name={`radio-${question.id}`}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={preview} // FIX
                />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
            {error && <div className="text-danger small mt-1">{error}</div>}
          </div>
        );

      case 'checkbox':
        const selected = Array.isArray(value) ? value : [];
        return (
          <div>
            {question.options?.map((opt, i) => (
              <div key={i} className="form-check">
                <input
                  className={`form-check-input ${error ? 'is-invalid' : ''}`}
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...selected, opt]);
                    } else {
                      onChange(selected.filter(item => item !== opt));
                    }
                  }}
                  disabled={preview} // FIX
                />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
            {error && <div className="text-danger small mt-1">{error}</div>}
          </div>
        );

      case 'rating':
        const maxRating = question.maxRating || 5;
        return (
          <div>
            <div className="d-flex gap-1">
              {[...Array(maxRating)].map((_, i) => {
                const rating = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => onChange(rating)}
                    disabled={preview} // FIX
                    style={{ textDecoration: 'none' }}
                  >
                    <span style={{ fontSize: '1.5rem', color: rating <= (value || 0) ? '#FBBF24' : '#d1d5db' }}>
                      ★
                    </span>
                  </button>
                );
              })}
            </div>
            {error && <div className="text-danger small mt-1">{error}</div>}
          </div>
        );

      case 'boolean':
        return (
          <div className="form-check form-switch">
            <input
              className={`form-check-input ${error ? 'is-invalid' : ''}`}
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              disabled={preview} // FIX
            />
            <label className="form-check-label">
              {value ? 'Yes' : 'No'}
            </label>
          </div>
        );

      case 'fileUpload':
        return (
          <div>
            <input
              type="file"
              className={`form-control ${error ? 'is-invalid' : ''}`}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange(file);
              }}
              disabled={preview} // FIX
            />
            {value && <div className="mt-1 small text-muted">Selected: {value.name}</div>}
            {error && <div className="text-danger small mt-1">{error}</div>}
          </div>
        );

      case 'matrix':
        const rows = question.rows || ['Row 1', 'Row 2'];
        const cols = question.columns || ['Column 1', 'Column 2'];
        return (
          <div className="table-responsive">
            <table className="table table-bordered table-sm">
              <thead>
                <tr>
                  <th></th>
                  {cols.map((col, i) => <th key={i} className="text-center">{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="fw-semibold">{row}</td>
                    {cols.map((col, colIdx) => (
                      <td key={colIdx} className="text-center">
                        <input
                          type="radio"
                          name={`matrix-${question.id}-${rowIdx}`}
                          value={col}
                          checked={value?.[`${rowIdx}-${colIdx}`] === col}
                          onChange={(e) => {
                            const newValue = { ...(value || {}) };
                            newValue[`${rowIdx}-${colIdx}`] = e.target.value;
                            onChange(newValue);
                          }}
                          disabled={preview}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {error && <div className="text-danger small mt-1">{error}</div>}
          </div>
        );

      default:
        return <div className="text-muted">Question type not supported: {question.type}</div>;
    }
  };

  return (
    <div>
      <div className="fw-medium mb-1">
        {question.title}
        {question.required && <span className="text-danger ms-1">*</span>}
      </div>
      {question.description && (
        <div className="text-muted small mb-2">{question.description}</div>
      )}
      {renderQuestion()}
    </div>
  );
};

export default QuestionRenderer;