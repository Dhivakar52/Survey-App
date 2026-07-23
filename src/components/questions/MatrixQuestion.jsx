import React, { useState } from 'react';

const MatrixQuestion = ({ question, onChange, value, error, preview }) => {
  const [matrixValue, setMatrixValue] = useState(value || {});

  const handleChange = (rowIndex, colIndex, val) => {
    const newValue = { ...matrixValue };
    const key = `${rowIndex}-${colIndex}`;
    newValue[key] = val;
    setMatrixValue(newValue);
    onChange(newValue);
  };

  const rows = question.rows || ['Row 1', 'Row 2'];
  const columns = question.columns || ['Column 1', 'Column 2'];

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th style={{ minWidth: '100px' }}></th>
              {columns.map((col, idx) => (
                <th key={idx} className="text-center">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td className="fw-semibold">{row}</td>
                {columns.map((col, colIdx) => {
                  const key = `${rowIdx}-${colIdx}`;
                  const val = matrixValue[key] || '';
                  return (
                    <td key={colIdx} className="text-center">
                      {question.type === 'matrixDropdown' ? (
                        <select
                          className="form-select form-select-sm"
                          value={val}
                          onChange={(e) => handleChange(rowIdx, colIdx, e.target.value)}
                          disabled={!preview}
                        >
                          <option value="">Select</option>
                          <option value="Option 1">Option 1</option>
                          <option value="Option 2">Option 2</option>
                          <option value="Option 3">Option 3</option>
                        </select>
                      ) : (
                        <div className="d-flex justify-content-center gap-2">
                          <label className="form-check-label me-2">
                            <input
                              type="radio"
                              name={`matrix-${question.id}-${rowIdx}`}
                              value="Yes"
                              checked={val === 'Yes'}
                              onChange={(e) => handleChange(rowIdx, colIdx, e.target.value)}
                              disabled={!preview}
                              className="form-check-input me-1"
                            />
                            Yes
                          </label>
                          <label className="form-check-label">
                            <input
                              type="radio"
                              name={`matrix-${question.id}-${rowIdx}`}
                              value="No"
                              checked={val === 'No'}
                              onChange={(e) => handleChange(rowIdx, colIdx, e.target.value)}
                              disabled={!preview}
                              className="form-check-input me-1"
                            />
                            No
                          </label>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
};

export default MatrixQuestion;