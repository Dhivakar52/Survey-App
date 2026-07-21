import React, { useState } from 'react';
import { Filter, Calendar } from 'lucide-react';
import CustomPanel from './CustomPanel';

const FilterPanel = ({ table, data, onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [ageRange, setAgeRange] = useState({ from: '', to: '' });

  // Get unique values for each column
  const getUniqueValues = (columnId) => {
    const uniqueValues = new Set();
    data.forEach(item => {
      const value = item[columnId];
      if (value !== undefined && value !== null && value !== '') {
        uniqueValues.add(String(value));
      }
    });
    return Array.from(uniqueValues);
  };

  const handleFilterChange = (columnId, value) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const handleDateRangeChange = (type, value) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleAgeRangeChange = (type, value) => {
    setAgeRange(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({});
    setDateRange({ from: '', to: '' });
    setAgeRange({ from: '', to: '' });
  };

  const applyFilters = () => {
    // Apply text filters to table with case-insensitive comparison
    Object.entries(filters).forEach(([columnId, value]) => {
      const column = table.getColumn(columnId);
      if (column) {
        if (value && value !== '' && value !== 'all') {
          // For gender column, use case-insensitive filter
          if (columnId === 'gender') {
            column.setFilterValue((row) => {
              const rowValue = row.original[columnId];
              return rowValue && rowValue.toLowerCase() === value.toLowerCase();
            });
          } else {
            column.setFilterValue(value);
          }
        } else {
          column.setFilterValue(undefined);
        }
      }
    });

    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      const column = table.getColumn('dischargeDate');
      if (column) {
        column.setFilterValue((row) => {
          const date = row.original.dischargeDate;
          if (!date) return false;
          if (dateRange.from && date < dateRange.from) return false;
          if (dateRange.to && date > dateRange.to) return false;
          return true;
        });
      }
    } else {
      const column = table.getColumn('dischargeDate');
      if (column) {
        column.setFilterValue(undefined);
      }
    }

    // Apply age range filter
    if (ageRange.from || ageRange.to) {
      const column = table.getColumn('age');
      if (column) {
        column.setFilterValue((row) => {
          const age = row.original.age;
          if (!age) return false;
          if (ageRange.from && Number(age) < Number(ageRange.from)) return false;
          if (ageRange.to && Number(age) > Number(ageRange.to)) return false;
          return true;
        });
      }
    } else {
      const column = table.getColumn('age');
      if (column) {
        column.setFilterValue(undefined);
      }
    }

    if (onFilter) {
      onFilter({ ...filters, dateRange, ageRange });
    }

    setIsOpen(false);
  };

  const resetFilters = () => {
    clearAllFilters();
    table.getAllColumns().forEach(col => {
      col.setFilterValue(undefined);
    });
    if (onFilter) {
      onFilter({});
    }
    setIsOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = Object.keys(filters).filter(key => filters[key] && filters[key] !== '' && filters[key] !== 'all').length;
    if (dateRange.from || dateRange.to) count++;
    if (ageRange.from || ageRange.to) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Get options for each filter
  const idOptions = getUniqueValues('id');
  const patientNameOptions = getUniqueValues('patientName');
  const surgeonOptions = getUniqueValues('surgeon');
  const genderOptions = getUniqueValues('gender');

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-light btn-sm d-flex align-items-center gap-1 position-relative"
        style={{
          borderColor: activeFilterCount > 0 ? '#00084D' : '#dee2e6',
          background: activeFilterCount > 0 ? '#f0f4ff' : '#ffffff',
          fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
          padding: '4px 10px',
        }}
      >
        <Filter size={14} />
        <span>Filter</span>
        {activeFilterCount > 0 && (
          <span 
            className="badge ms-1" 
            style={{ 
              background: '#00084D', 
              fontSize: '0.55rem',
              padding: '2px 6px',
              borderRadius: '10px',
            }}
          >
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <CustomPanel
        isOpen={isOpen}
        title="Filter Data"
        onClose={() => setIsOpen(false)}
        onSave={applyFilters}
        saveLabel="Apply Filters"
        width="550px"
      >
        <div className="p-3">
          {/* Header with Clear All */}
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div>
              <span className="fw-semibold" style={{ fontSize: '0.95rem', color: '#333' }}>
                Filter Data
              </span>
              {activeFilterCount > 0 && (
                <span className="ms-2 text-muted small">
                  ({activeFilterCount} active)
                </span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Filter List */}
          <div className="filter-list" style={{ maxHeight: '450px', overflowY: 'auto' }}>
            {/* ID Filter */}
            <div className="filter-section mb-3">
              <label className="fw-semibold small text-muted mb-2 d-block">ID</label>
              <select
                value={filters.id || ''}
                onChange={(e) => handleFilterChange('id', e.target.value)}
                className="form-select form-select-sm"
                style={{ fontSize: '0.85rem' }}
              >
                <option value="">All IDs</option>
                {idOptions.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>

            {/* Patient Name Filter */}
            <div className="filter-section mb-3">
              <label className="fw-semibold small text-muted mb-2 d-block">Patient Name</label>
              <select
                value={filters.patientName || ''}
                onChange={(e) => handleFilterChange('patientName', e.target.value)}
                className="form-select form-select-sm"
                style={{ fontSize: '0.85rem' }}
              >
                <option value="">All Patients</option>
                {patientNameOptions.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Age Range Filter */}
            <div className="filter-section mb-3">
              <label className="fw-semibold small text-muted mb-2 d-block">Age Range</label>
              <div className="row g-2">
                <div className="col-6">
                  <label className="small text-muted">From</label>
                  <input
                    type="number"
                    placeholder="Min Age"
                    value={ageRange.from}
                    onChange={(e) => handleAgeRangeChange('from', e.target.value)}
                    className="form-control form-control-sm"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div className="col-6">
                  <label className="small text-muted">To</label>
                  <input
                    type="number"
                    placeholder="Max Age"
                    value={ageRange.to}
                    onChange={(e) => handleAgeRangeChange('to', e.target.value)}
                    className="form-control form-control-sm"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </div>
              {(ageRange.from || ageRange.to) && (
                <div className="mt-2">
                  <button
                    onClick={() => setAgeRange({ from: '', to: '' })}
                    className="btn btn-sm btn-link text-danger p-0"
                    style={{ fontSize: '0.7rem' }}
                  >
                    Clear Age Range
                  </button>
                </div>
              )}
            </div>

            {/* Gender Filter */}
            <div className="filter-section mb-3">
              <label className="fw-semibold small text-muted mb-2 d-block">Gender</label>
              <select
                value={filters.gender || ''}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="form-select form-select-sm"
                style={{ fontSize: '0.85rem' }}
              >
                <option value="">All Genders</option>
                {genderOptions.map((gender) => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>

            {/* Surgeon Name Filter */}
            <div className="filter-section mb-3">
              <label className="fw-semibold small text-muted mb-2 d-block">Surgeon Name</label>
              <select
                value={filters.surgeon || ''}
                onChange={(e) => handleFilterChange('surgeon', e.target.value)}
                className="form-select form-select-sm"
                style={{ fontSize: '0.85rem' }}
              >
                <option value="">All Surgeons</option>
                {surgeonOptions.map((surgeon) => (
                  <option key={surgeon} value={surgeon}>{surgeon}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="filter-section mb-3">
              <label className="fw-semibold small text-muted mb-2 d-block">
                <Calendar size={14} className="me-1" />
                Discharge Date Range
              </label>
              <div className="row g-2">
                <div className="col-6">
                  <label className="small text-muted">From</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => handleDateRangeChange('from', e.target.value)}
                    className="form-control form-control-sm"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div className="col-6">
                  <label className="small text-muted">To</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => handleDateRangeChange('to', e.target.value)}
                    className="form-control form-control-sm"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </div>
              {(dateRange.from || dateRange.to) && (
                <div className="mt-2">
                  <button
                    onClick={() => setDateRange({ from: '', to: '' })}
                    className="btn btn-sm btn-link text-danger p-0"
                    style={{ fontSize: '0.7rem' }}
                  >
                    Clear Date Range
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-3 pt-2 border-top">
            <div className="d-flex justify-content-between text-muted small">
              <span>Total Records: <b>{data.length}</b></span>
              <span>Active Filters: <b>{activeFilterCount}</b></span>
            </div>
          </div>
        </div>
      </CustomPanel>

      {/* CSS Styles */}
      <style>{`
        .filter-list::-webkit-scrollbar {
          width: 4px;
        }
        .filter-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }
        .filter-list::-webkit-scrollbar-thumb {
          background: #00084D;
          border-radius: 2px;
        }
        .filter-list::-webkit-scrollbar-thumb:hover {
          background: #1a1f6b;
        }
        .filter-section {
          padding: 12px 14px;
          background: #fafafa;
          border-radius: 8px;
          border: 1px solid #f0f0f0;
          transition: all 0.2s ease;
        }
        .filter-section:hover {
          border-color: #00084D;
          background: #f8f9fa;
        }
        .filter-section label {
          font-weight: 600;
          color: #555;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .form-select:focus, .form-control:focus {
          border-color: #00084D;
          box-shadow: 0 0 0 3px rgba(0, 8, 77, 0.1);
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
};

export default FilterPanel;