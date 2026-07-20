import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Edit, Trash2, Eye } from 'lucide-react';
import DataTable from '../DataTable';
import CustomPanel from '../CustomPanel';
import ReviewPage from '../../pages/ReviewPage';

// Sample survey data
const surveyData = [
  { 
    id: 1, 
    patientName: 'Rajesh Kumar', 
    age: 45, 
    gender: 'Male',
    surgeon: 'Dr. S. Venkatesh',
    dischargeDate: '2026-07-15',
    surveyDate: '2026-07-16',
    status: 'Completed',
    answers: {
      1: 'no', 2: 'no', 3: 'no', 4: 'no', 5: 'Clear', 
      6: 'no', 7: 'no', 8: 'no', 9: 'no', 10: '', 11: ''
    }
  },
  { 
    id: 2, 
    patientName: 'Priya Sharma', 
    age: 32, 
    gender: 'Female',
    surgeon: 'Dr. M. Lakshmi',
    dischargeDate: '2026-07-14',
    surveyDate: '2026-07-15',
    status: 'Pending',
    answers: {
      1: 'yes', 2: 'yes', 3: 'no', 4: 'yes', 5: 'Pus / Cloudy yellow',
      6: 'no', 7: 'no', 8: 'yes', 9: 'yes', 10: 'Amoxicillin', 11: '5'
    }
  },
  { 
    id: 3, 
    patientName: 'Suresh Babu', 
    age: 55, 
    gender: 'Male',
    surgeon: 'Dr. S. Venkatesh',
    dischargeDate: '2026-07-13',
    surveyDate: '2026-07-14',
    status: 'Completed',
    answers: {
      1: 'no', 2: 'no', 3: 'yes', 4: 'no', 5: '',
      6: 'yes', 7: 'no', 8: 'no', 9: 'no', 10: '', 11: ''
    }
  },
  { 
    id: 4, 
    patientName: 'Anjali Devi', 
    age: 28, 
    gender: 'Female',
    surgeon: 'Dr. R. Kumar',
    dischargeDate: '2026-07-12',
    surveyDate: '2026-07-13',
    status: 'In Progress',
    answers: {
      1: 'yes', 2: 'yes', 3: 'yes', 4: 'yes', 5: 'Pink, red or blood',
      6: 'yes', 7: 'yes', 8: 'yes', 9: 'yes', 10: 'Ciprofloxacin', 11: '3'
    }
  },
  { 
    id: 5, 
    patientName: 'Mohan Raj', 
    age: 60, 
    gender: 'Male',
    surgeon: 'Dr. P. Srinivasan',
    dischargeDate: '2026-07-11',
    surveyDate: '2026-07-12',
    status: 'Completed',
    answers: {
      1: 'no', 2: 'no', 3: 'no', 4: 'no', 5: '',
      6: 'no', 7: 'no', 8: 'no', 9: 'no', 10: '', 11: ''
    }
  }
];

// ActionMenu Component with Fixed Positioning
const ActionMenu = ({ row, onView, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const handleButtonClick = (e) => {
    e.stopPropagation();
    
    if (!isMenuOpen) {
      // Get button position
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 5,
        right: window.innerWidth - rect.right,
      });
    }
    
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="btn btn-sm btn-outline-secondary rounded-circle p-1"
        style={{ width: '32px', height: '32px' }}
      >
        <Menu size={16} />
      </button>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="bg-white rounded-3 shadow-lg border"
          style={{
            position: 'fixed',
            top: menuPosition.top,
            right: menuPosition.right,
            zIndex: 99999,
            minWidth: '160px',
            maxWidth: '200px',
          }}
        >
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onView(row);
            }}
            className="d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 bg-transparent"
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Eye size={16} />
            <span>View</span>
          </button>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onEdit(row);
            }}
            className="d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 bg-transparent"
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <hr className="my-1" />
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onDelete(row);
            }}
            className="d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 bg-transparent text-danger"
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffebee';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

const SurveyTable = () => {
  const navigate = useNavigate();
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  const [surveyDataState, setSurveyDataState] = useState(surveyData);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Define columns for DataTable
  const columns = [
    { 
      id: 'id',
      accessorKey: 'id', 
      header: 'ID',
      cell: ({ row }) => <span className="fw-bold">{row.original.id}</span>
    },
    { 
      id: 'patientName',
      accessorKey: 'patientName', 
      header: 'Patient Name',
      cell: ({ row }) => (
        <div>
          <div className="fw-semibold">{row.original.patientName}</div>
          <div className="text-muted small">{row.original.gender}, {row.original.age} yrs</div>
        </div>
      )
    },
    { 
      id: 'surgeon',
      accessorKey: 'surgeon', 
      header: 'Surgeon',
      cell: ({ row }) => <span>{row.original.surgeon}</span>
    },
    { 
      id: 'dischargeDate',
      accessorKey: 'dischargeDate', 
      header: 'Discharge Date',
      cell: ({ row }) => <span>{formatDate(row.original.dischargeDate)}</span>
    },
    { 
      id: 'surveyDate',
      accessorKey: 'surveyDate', 
      header: 'Survey Date',
      cell: ({ row }) => <span>{formatDate(row.original.surveyDate)}</span>
    },
    { 
      id: 'status',
      accessorKey: 'status', 
      header: 'Status',
      cell: ({ row }) => (
        <span className={`badge ${row.original.status === 'Completed' ? 'bg-success' : row.original.status === 'Pending' ? 'bg-warning' : 'bg-info'}`}>
          {row.original.status}
        </span>
      )
    }
  ];

  // Handle Edit
  const handleEdit = (row) => {
    setSelectedSurvey(row);
    setIsEditPanelOpen(true);
  };

  // Handle View
  const handleView = (row) => {
    setSelectedSurvey(row);
    setIsViewPanelOpen(true);
  };

  // Handle Delete
  const handleDelete = (row) => {
    setSurveyToDelete(row);
    setIsDeleteConfirmOpen(true);
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (surveyToDelete) {
      setSurveyDataState(prev => prev.filter(item => item.id !== surveyToDelete.id));
      setIsDeleteConfirmOpen(false);
      setSurveyToDelete(null);
    }
  };

  // Actions column with ActionMenu
  const actionsColumn = {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <ActionMenu 
        row={row.original}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ),
    enableSorting: false,
  };

  const tableColumns = [...columns, actionsColumn];

  return (
    <div style={{ position: 'relative' }}>
      {/* DataTable */}
      <DataTable
        data={surveyDataState}
        columns={tableColumns}
        title="Patient Survey List"
        itemsPerPage={10}
        showColumnToggle={true}
      />

      {/* Edit Panel */}
      <CustomPanel
        isOpen={isEditPanelOpen}
        title={`Edit Survey - ${selectedSurvey?.patientName || ''}`}
        onClose={() => setIsEditPanelOpen(false)}
        onSave={() => {
          console.log('Saving survey:', selectedSurvey);
          setIsEditPanelOpen(false);
        }}
        saveLabel="Save Changes"
        width="800px"
      >
        {selectedSurvey && (
          <div className="p-3">
            <div className="bg-light p-3 rounded-3 mb-3">
              <div className="row">
                <div className="col-md-6">
                  <small className="text-muted">Patient Name</small>
                  <div className="fw-semibold">{selectedSurvey.patientName}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Surgeon</small>
                  <div className="fw-semibold">{selectedSurvey.surgeon}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Age / Gender</small>
                  <div className="fw-semibold">{selectedSurvey.age} / {selectedSurvey.gender}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Discharge Date</small>
                  <div className="fw-semibold">{formatDate(selectedSurvey.dischargeDate)}</div>
                </div>
              </div>
            </div>
            <ReviewPage 
              isEditMode={true}
              editAnswers={selectedSurvey.answers}
            />
          </div>
        )}
      </CustomPanel>

      {/* View Panel */}
      <CustomPanel
        isOpen={isViewPanelOpen}
        title={`Survey Details - ${selectedSurvey?.patientName || ''}`}
        onClose={() => setIsViewPanelOpen(false)}
        onSave={() => setIsViewPanelOpen(false)}
        saveLabel="Close"
        width="700px"
      >
        {selectedSurvey && (
          <div>
            <div className="bg-light p-3 rounded-3 mb-3">
              <div className="row">
                <div className="col-md-6">
                  <small className="text-muted">Patient Name</small>
                  <div className="fw-semibold">{selectedSurvey.patientName}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Status</small>
                  <div>
                    <span className={`badge ${selectedSurvey.status === 'Completed' ? 'bg-success' : selectedSurvey.status === 'Pending' ? 'bg-warning' : 'bg-info'}`}>
                      {selectedSurvey.status}
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Age / Gender</small>
                  <div className="fw-semibold">{selectedSurvey.age} / {selectedSurvey.gender}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Surgeon</small>
                  <div className="fw-semibold">{selectedSurvey.surgeon}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Discharge Date</small>
                  <div className="fw-semibold">{formatDate(selectedSurvey.dischargeDate)}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Survey Date</small>
                  <div className="fw-semibold">{formatDate(selectedSurvey.surveyDate)}</div>
                </div>
              </div>
            </div>
            <h6 className="fw-semibold mb-2">Survey Answers</h6>
            <div className="bg-white p-3 rounded-3 border">
              {Object.entries(selectedSurvey.answers).map(([key, value]) => (
                <div key={key} className="d-flex justify-content-between py-1 border-bottom border-light">
                  <span className="text-muted">Question {key}:</span>
                  <span className="fw-semibold">{value || 'Not answered'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CustomPanel>

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 99999, background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setIsDeleteConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-3 p-4"
            style={{ maxWidth: '400px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-3">
              <div className="text-danger mb-2">
                <Trash2 size={48} />
              </div>
              <h5 className="fw-bold">Delete Survey</h5>
              <p className="text-muted">
                Are you sure you want to delete the survey for <strong>{surveyToDelete?.patientName}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="btn btn-outline-secondary flex-grow-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-danger flex-grow-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Ensure table cells allow overflow */
        .table-responsive {
          overflow: visible !important;
        }
        
        .table {
          overflow: visible !important;
        }
        
        tbody tr {
          position: relative;
        }
        
        td {
          position: relative;
        }
        
        /* Fix for action column */
        .actions-column {
          overflow: visible !important;
        }
      `}</style>
    </div>
  );
};

export default SurveyTable;