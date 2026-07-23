// pages/Responses.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  BarChart3,
  Eye,
  Trash2,
  Download,
  X,
  Calendar,
  User,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { getSurveyById } from '../utils/storage';
import { responseService } from '../services/responseService';
import { formatDate } from '../utils/surveyHelpers';
import DataTable from '../components/DataTable';
import { useSurveyContext } from '../context/SurveyContext';

// Response Detail Modal Component
const ResponseDetailModal = ({ isOpen, onClose, response, survey, language = 'en' }) => {
  if (!isOpen || !response || !survey) return null;

  const getAnswerDisplay = (questionId, answer) => {
    const question = survey.questions?.find(q => q.id === questionId);
    if (!question) return String(answer);

    if (answer === undefined || answer === null || answer === '') {
      return <span className="text-muted fst-italic">Not answered</span>;
    }

    if (Array.isArray(answer)) {
      return answer.join(', ');
    }

    if (question.type === 'boolean') {
      return answer ? 'Yes' : 'No';
    }

    if (question.type === 'rating') {
      return '⭐'.repeat(Math.min(parseInt(answer) || 0, 5));
    }

    // For yes/no questions (custom)
    if (question.type === 'yesno') {
      if (language === 'ta') {
        return answer === 'yes' ? 'ஆம்' : answer === 'no' ? 'இல்லை' : answer;
      }
      if (language === 'hi') {
        return answer === 'yes' ? 'हाँ' : answer === 'no' ? 'नहीं' : answer;
      }
      return answer === 'yes' ? 'Yes' : answer === 'no' ? 'No' : answer;
    }

    return String(answer);
  };

  // Get question type badge color
  const getQuestionTypeBadge = (type) => {
    const types = {
      text: 'bg-secondary',
      dropdown: 'bg-info',
      radio: 'bg-primary',
      checkbox: 'bg-success',
      rating: 'bg-warning',
      yesno: 'bg-danger',
      boolean: 'bg-dark',
      fileUpload: 'bg-info',
      matrix: 'bg-secondary',
      ranking: 'bg-primary',
      signature: 'bg-danger',
      multipleText: 'bg-secondary',
    };
    return types[type] || 'bg-secondary';
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ 
        zIndex: 9999, 
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4"
        style={{ 
          maxWidth: '700px', 
          width: '95%', 
          maxHeight: '90vh', 
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom flex-shrink-0">
          <div>
            <h5 className="fw-bold m-0" style={{ color: '#00084D' }}>
              Response Details
            </h5>
            <div className="d-flex gap-3 mt-1">
              <span className="text-muted small">
                <User size={14} className="me-1" />
                Response #{response.id}
              </span>
              <span className="text-muted small">
                <Calendar size={14} className="me-1" />
                {formatDate(response.submittedAt)}
              </span>
              <span className="badge bg-success">
                <CheckCircle size={12} className="me-1" />
                Completed
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-outline-secondary rounded-circle p-0"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-4 overflow-auto" style={{ flex: 1 }}>
          <div className="mb-3 pb-2 border-bottom">
            <h6 className="fw-semibold text-muted">Survey: {survey.title}</h6>
            {survey.description && (
              <p className="text-muted small mb-0">{survey.description}</p>
            )}
          </div>

          {/* Answers */}
          <div>
            {survey.questions?.map((question, index) => {
              const answer = response.answers?.find(a => a.questionId === question.id);
              const displayAnswer = getAnswerDisplay(question.id, answer?.answer);
              
              return (
                <div key={question.id} className="mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-start gap-2">
                    <span className="fw-semibold text-muted" style={{ minWidth: '28px', fontSize: '0.85rem' }}>
                      {index + 1}.
                    </span>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="fw-semibold" style={{ fontSize: '0.95rem' }}>
                          {question.title}
                          {question.required && <span className="text-danger ms-1">*</span>}
                        </span>
                        <span className={`badge ${getQuestionTypeBadge(question.type)}`} style={{ fontSize: '0.6rem' }}>
                          {question.type}
                        </span>
                      </div>
                      {question.description && (
                        <div className="text-muted small mb-1">{question.description}</div>
                      )}
                      <div className="mt-1 p-2 bg-light rounded-2" style={{ 
                        borderLeft: '3px solid #00084D',
                        fontSize: '0.95rem',
                      }}>
                        {displayAnswer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-top d-flex justify-content-end gap-2 flex-shrink-0">
          <button
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              // Export single response as JSON
              const data = JSON.stringify({
                response: response,
                survey: survey,
              }, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `response_${response.id}.json`;
              link.click();
              URL.revokeObjectURL(link.href);
            }}
            style={{ background: '#00084D', borderColor: '#00084D' }}
          >
            <Download size={16} className="me-1" /> Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};

const Responses = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { language } = useSurveyContext?.() || { language: 'en' };
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const surveyData = getSurveyById(surveyId);
    if (!surveyData) {
      navigate('/dashboard');
      return;
    }
    setSurvey(surveyData);

    const surveyResponses = responseService.getBySurveyId(surveyId);
    setResponses(surveyResponses);
    setLoading(false);
  }, [surveyId, navigate]);

  // Format response data for table
  const tableData = useMemo(() => {
    return responses.map((response, index) => {
      const answerMap = {};
      response.answers?.forEach(ans => {
        const question = survey?.questions?.find(q => q.id === ans.questionId);
        if (question) {
          let displayAnswer = ans.answer;
          if (Array.isArray(ans.answer)) {
            displayAnswer = ans.answer.join(', ');
          } else if (question.type === 'boolean') {
            displayAnswer = ans.answer ? 'Yes' : 'No';
          } else if (question.type === 'rating') {
            displayAnswer = '⭐'.repeat(Math.min(parseInt(ans.answer) || 0, 5));
          } else if (question.type === 'yesno') {
            if (language === 'ta') {
              displayAnswer = ans.answer === 'yes' ? 'ஆம்' : ans.answer === 'no' ? 'இல்லை' : ans.answer;
            } else if (language === 'hi') {
              displayAnswer = ans.answer === 'yes' ? 'हाँ' : ans.answer === 'no' ? 'नहीं' : ans.answer;
            } else {
              displayAnswer = ans.answer === 'yes' ? 'Yes' : ans.answer === 'no' ? 'No' : ans.answer;
            }
          }
          answerMap[question.id] = displayAnswer;
        }
      });

      return {
        id: response.id,
        index: index + 1,
        submittedAt: response.submittedAt,
        answerCount: response.answers?.length || 0,
        ...answerMap,
        submittedDate: formatDate(response.submittedAt),
        // Store full response for detail view
        _response: response,
      };
    });
  }, [responses, survey, language]);

  // Define columns dynamically based on survey questions
  const columns = useMemo(() => {
    const baseColumns = [
      {
        id: 'index',
        accessorKey: 'index',
        header: '#',
        cell: ({ row }) => <span className="fw-semibold">{row.original.index}</span>,
        size: 50,
      },
      {
        id: 'submittedDate',
        accessorKey: 'submittedDate',
        header: 'Submitted Date',
        cell: ({ row }) => <span>{row.original.submittedDate}</span>,
        size: 150,
      },
      {
        id: 'answerCount',
        accessorKey: 'answerCount',
        header: 'Answers',
        cell: ({ row }) => <span className="badge bg-primary">{row.original.answerCount}</span>,
        size: 80,
      },
    ];

    // Add question columns
    const questionColumns = survey?.questions?.map((q) => ({
      id: `q_${q.id}`,
      accessorKey: String(q.id),
      header: q.title.length > 25 ? q.title.substring(0, 25) + '...' : q.title,
      cell: ({ row }) => {
        const value = row.original[String(q.id)];
        return value || <span className="text-muted">—</span>;
      },
      size: 120,
    })) || [];

    return [...baseColumns, ...questionColumns];
  }, [survey]);

  // Handle View Response - Open Detail Modal
  const handleView = (row) => {
    const response = responses.find(r => r.id === row.id);
    if (response) {
      setSelectedResponse(response);
      setShowDetailModal(true);
    }
  };

  // Handle Delete Response
  const handleDelete = (row) => {
    if (window.confirm(`Delete Response #${row.id}?`)) {
      const updated = responseService.delete(row.id);
      if (updated) {
        setResponses(prev => prev.filter(r => r.id !== row.id));
        if (selectedResponse?.id === row.id) {
          setSelectedResponse(null);
          setShowDetailModal(false);
        }
      }
    }
  };

  // Export Responses to CSV
  const exportCSV = () => {
    if (responses.length === 0) return;

    const headers = ['Response ID', 'Submitted Date', 'Answers Count'];
    survey?.questions?.forEach(q => {
      headers.push(q.title);
    });

    const rows = responses.map(response => {
      const row = [response.id, formatDate(response.submittedAt), response.answers?.length || 0];
      survey?.questions?.forEach(q => {
        const answer = response.answers?.find(a => a.questionId === q.id);
        if (answer) {
          let displayAnswer = answer.answer;
          if (Array.isArray(answer.answer)) {
            displayAnswer = answer.answer.join(', ');
          } else if (q.type === 'boolean') {
            displayAnswer = answer.answer ? 'Yes' : 'No';
          } else if (q.type === 'yesno') {
            displayAnswer = answer.answer === 'yes' ? 'Yes' : answer.answer === 'no' ? 'No' : answer.answer;
          }
          row.push(displayAnswer || '');
        } else {
          row.push('');
        }
      });
      return row;
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${survey?.title || 'responses'}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} className="me-1" /> Back
          </button>
          <h4 className="d-inline-block fw-bold m-0" style={{ color: '#00084D' }}>
            <FileText size={24} className="me-2" />
            Responses - {survey?.title}
          </h4>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate(`/analytics/${surveyId}`)}
          >
            <BarChart3 size={16} className="me-1" /> Analytics
          </button>
          <button 
            className="btn btn-success btn-sm"
            onClick={exportCSV}
            disabled={responses.length === 0}
          >
            <Download size={16} className="me-1" /> Export CSV
          </button>
          <span className="badge bg-primary align-self-center">{responses.length} responses</span>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <FileText size={48} className="text-muted mb-3" />
          <h5>No responses yet</h5>
          <p className="text-muted">Share your survey to start collecting responses</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/share/${surveyId}`)}
          >
            Share Survey
          </button>
        </div>
      ) : (
        <>
          <DataTable
            data={tableData}
            columns={columns}
            title="Survey Responses"
            itemsPerPage={10}
            showColumnToggle={true}
            showSearch={true}
            showExport={false}
            showFilter={true}
            onView={handleView}
            onDelete={handleDelete}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
          />

          {/* Response Detail Modal */}
          <ResponseDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedResponse(null);
            }}
            response={selectedResponse}
            survey={survey}
            language={language}
          />
        </>
      )}
    </div>
  );
};

export default Responses;