// components/survey/SurveyCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Edit, 
  Eye, 
  Copy, 
  Trash2, 
  Send, 
  Share2, 
  BarChart3,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { formatDate, getStatusBadge, getStatusLabel } from '../../utils/surveyHelpers';

const SurveyCard = ({ 
  survey, 
  onEdit, 
  onPreview, 
  onPublish, 
 onOpen, 
  onDuplicate, 
  onDelete, 
  onShare,
  onResponses,
}) => {
  const navigate = useNavigate();
  const isPublished = survey.status === 'published';
  const isDraft = survey.status === 'draft';

  return (
    <div className="card shadow-sm h-100 border-0">
      <div className="card-body d-flex flex-column">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1">
            <h5 className="card-title fw-semibold mb-1" style={{ color: '#00084D' }}>
              {survey.title}
            </h5>
            <p className="text-muted small mb-2 text-truncate" style={{ maxWidth: '100%' }}>
              {survey.description || 'No description'}
            </p>
          </div>
          <span className={`badge ${getStatusBadge(survey.status)} flex-shrink-0 ms-2`}>
            {getStatusLabel(survey.status)}
          </span>
        </div>

        {/* Stats */}
        <div className="d-flex gap-3 mb-3 small text-muted">
          <span>
            <FileText size={14} className="me-1" />
            {survey.totalQuestions || survey.questions?.length || 0} questions
          </span>
          {isPublished && (
            <span>
              <CheckCircle size={14} className="me-1 text-success" />
              Published
            </span>
          )}
          {isDraft && (
            <span>
              <Clock size={14} className="me-1 text-warning" />
              Draft
            </span>
          )}
        </div>

        {/* Dates */}
        <div className="small text-muted mb-3">
          <div>Created: {formatDate(survey.createdAt)}</div>
          <div>Updated: {formatDate(survey.updatedAt)}</div>
          {survey.publishedAt && <div>Published: {formatDate(survey.publishedAt)}</div>}
        </div>

        {/* Actions */}
        <div className="mt-auto d-flex gap-1 flex-wrap">
          {isDraft && (
            <>
              <button
                onClick={() => onEdit(survey)}
                className="btn btn-outline-primary btn-sm"
                title="Edit"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => onPreview(survey)}
                className="btn btn-outline-secondary btn-sm"
                title="Preview"
              >
                <Eye size={14} />
              </button>
              <button
                onClick={() => onPublish(survey)}
                className="btn btn-success btn-sm"
                title="Publish"
              >
                <Send size={14} />
              </button>
            </>
          )}

          {isPublished && (
            <>
              <button
                onClick={() => onOpen(survey)}
                className="btn btn-primary btn-sm"
                title="Open Survey"
              >
                <Eye size={14} />
              </button>
              <button
                onClick={() => onResponses(survey)}
                className="btn btn-info btn-sm text-white"
                title="Responses"
              >
                <BarChart3 size={14} />
              </button>
              <button
                onClick={() => onShare(survey)}
                className="btn btn-outline-secondary btn-sm"
                title="Share"
              >
                <Share2 size={14} />
              </button>
            </>
          )}

          <button
            onClick={() => onDuplicate(survey)}
            className="btn btn-outline-secondary btn-sm"
            title="Duplicate"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => onDelete(survey)}
            className="btn btn-outline-danger btn-sm"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyCard;