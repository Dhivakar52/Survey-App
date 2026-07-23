// pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, CheckCircle, Clock, Archive } from 'lucide-react';
import { surveyService } from '../services/surveyService';
import SurveyCard from '../components/survey/SurveyCard';
import ConfirmationModal from '../common/ConfirmationModal';
import ShareModal from '../components/survey/ShareModal';
import { getSurveys } from '../utils/storage';

const Dashboard = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = () => {
    const allSurveys = getSurveys();
    console.log('Loaded surveys:', allSurveys); // Debug log
    setSurveys(allSurveys);
    setLoading(false);
  };

  const getFilteredSurveys = () => {
    if (filter === 'all') return surveys;
    return surveys.filter(s => s.status === filter);
  };

  const draftCount = surveys.filter(s => s.status === 'draft').length;
  const publishedCount = surveys.filter(s => s.status === 'published').length;

  // Survey Actions
  const handleEdit = (survey) => {
    navigate(`/edit-survey?id=${survey.id}`);
  };

  const handlePreview = (survey) => {
    navigate(`/preview/${survey.id}`);
  };

  const handleOpen = (survey) => {
    window.open(`/survey/${survey.id}`, '_blank');
  };

  const handlePublish = (survey) => {
    if (window.confirm(`Publish "${survey.title}"?`)) {
      const updated = surveyService.publish(survey.id);
      if (updated) {
        loadSurveys();
      }
    }
  };

  const handleDuplicate = (survey) => {
    const duplicated = surveyService.duplicate(survey.id);
    if (duplicated) {
      loadSurveys();
    }
  };

  const handleDelete = (survey) => {
    console.log('Deleting survey:', survey); // Debug log
    setSelectedSurvey(survey);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedSurvey) {
      console.log('Confirming delete for:', selectedSurvey.id); // Debug log
      const result = surveyService.delete(selectedSurvey.id);
      console.log('Delete result:', result); // Debug log
      setShowDeleteModal(false);
      setSelectedSurvey(null);
      loadSurveys(); // Reload surveys after deletion
    }
  };

  const handleShare = (survey) => {
    setSelectedSurvey(survey);
    setShowShareModal(true);
  };

  const handleResponses = (survey) => {
    navigate(`/responses/${survey.id}`);
  };

  const filteredSurveys = getFilteredSurveys();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold m-0" style={{ color: '#00084D' }}>
            <FileText size={24} className="me-2" />
            My Surveys
          </h4>
          <p className="text-muted small mb-0">Manage and monitor your surveys</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => navigate('/create')}
          style={{ background: '#00084D', borderColor: '#00084D' }}
        >
          <Plus size={18} />
          Create New Survey
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
            <p className="text-muted small mb-1">Total Surveys</p>
            <h3 className="fw-bold m-0" style={{ color: '#00084D' }}>{surveys.length}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
            <p className="text-muted small mb-1">Published</p>
            <h3 className="fw-bold text-success m-0">{publishedCount}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
            <p className="text-muted small mb-1">Drafts</p>
            <h3 className="fw-bold text-warning m-0">{draftCount}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
            <p className="text-muted small mb-1">Responses</p>
            <h3 className="fw-bold text-info m-0">
              {surveys.reduce((acc, s) => acc + (s.responseCount || 0), 0)}
            </h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('all')}
          style={filter === 'all' ? { background: '#00084D', borderColor: '#00084D' } : {}}
        >
          All
        </button>
        <button
          className={`btn btn-sm ${filter === 'published' ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('published')}
        >
          Published
        </button>
        <button
          className={`btn btn-sm ${filter === 'draft' ? 'btn-warning' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('draft')}
        >
          Drafts
        </button>
      </div>

      {/* Survey Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredSurveys.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border border-light">
          <FileText size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No surveys found</h5>
          <p className="text-muted small">
            {filter === 'all' ? 'Create your first survey to get started' : `No ${filter} surveys`}
          </p>
          {filter === 'all' && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/create')}
              style={{ background: '#00084D', borderColor: '#00084D' }}
            >
              <Plus size={18} className="me-1" /> Create Survey
            </button>
          )}
        </div>
      ) : (
        <div className="row g-3">
          {filteredSurveys.map((survey) => (
            <div key={survey.id} className="col-12 col-sm-6 col-xl-4">
              <SurveyCard
                survey={survey}
                onEdit={handleEdit}
                onPreview={handlePreview}
                onPublish={handlePublish}
                onOpen={handleOpen}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onShare={handleShare}
                onResponses={handleResponses}
              />
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Survey"
        message={`Are you sure you want to delete "${selectedSurvey?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Share Modal */}
      {showShareModal && selectedSurvey && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          surveyId={selectedSurvey.id}
          title={selectedSurvey.title}
        />
      )}
    </div>
  );
};

export default Dashboard;