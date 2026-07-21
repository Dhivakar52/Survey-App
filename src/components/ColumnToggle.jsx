import React, { useState, useRef, useEffect } from 'react';
import { Settings, ChevronRight, Check } from 'lucide-react';

const ColumnToggle = ({ table }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleCount = table.getAllLeafColumns().filter(col => col.getIsVisible()).length;

  const formatColumnName = (name) => {
    if (name === 'id') return 'ID';
    if (name === 'actions') return '';
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-light btn-sm d-flex align-items-center gap-1"
        style={{
          borderColor: isOpen ? '#00084D' : '#dee2e6',
          background: isOpen ? '#f0f4ff' : '#ffffff',
          fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
          padding: '4px 8px',
        }}
      >
        <Settings size={14} />
        <span className="d-none d-sm-inline">Columns</span>
        <span 
          className="badge ms-1" 
          style={{ 
            background: '#00084D', 
            fontSize: '0.55rem',
            padding: '2px 5px'
          }}
        >
          {visibleCount}
        </span>
        <ChevronRight 
          size={14} 
          style={{
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        />
      </button>

      {isOpen && (
        <div
          className="position-absolute end-0 mt-1 bg-white rounded-3 shadow-lg border"
          style={{ 
            zIndex: 1050, 
            width: '200px',
            top: '100%',
            maxHeight: '280px',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          }}
        >
          <div className="px-3 py-2 border-bottom bg-light rounded-top-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="small fw-semibold text-muted">Toggle Columns</span>
              <button
                onClick={() => {
                  const allVisible = {};
                  table.getAllLeafColumns().forEach(col => {
                    if (col.id !== 'actions') {
                      allVisible[col.id] = true;
                    }
                  });
                  table.setColumnVisibility(allVisible);
                }}
                className="btn btn-sm btn-link text-primary p-0 text-decoration-none"
              >
                Show All
              </button>
            </div>
          </div>
          
          <div className="p-2">
            {table.getAllLeafColumns().map((column) => {
              if (column.id === 'actions') return null;
              const isVisible = column.getIsVisible();
              const displayName = formatColumnName(column.id);
              
              return (
                <label
                  key={column.id}
                  className="d-flex align-items-center gap-2 rounded cursor-pointer"
                  style={{
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    padding: '5px 4px',
                    fontSize: '0.8rem',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded"
                    style={{
                      width: '16px',
                      height: '16px',
                      border: isVisible ? '2px solid #00084D' : '2px solid #d1d5db',
                      background: isVisible ? '#00084D' : '#ffffff',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    {isVisible && <Check size={10} color="#ffffff" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => column.toggleVisibility(!isVisible)}
                    style={{ display: 'none' }}
                  />
                  <span className="small" style={{ color: isVisible ? '#00084D' : '#6c757d' }}>
                    {displayName}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnToggle;