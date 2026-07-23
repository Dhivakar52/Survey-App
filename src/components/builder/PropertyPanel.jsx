import React, { useState } from 'react';
import { useSurveyContext } from '../../context/SurveyContext';
import { getQuestionConfig } from '../../constants/questionTypes';
import {
  Settings,
  Shield,
  Code,
  Palette,
  Database,
  Edit,
  Copy,
  Trash2,
} from 'lucide-react';

const PropertyPanel = () => {
  const { state, updateQuestion, deleteQuestion, duplicateQuestion } = useSurveyContext();
  const { selectedQuestionId, survey } = state;
  const [activeTab, setActiveTab] = useState('general');

  const question = survey.pages
    .flatMap(p => p.questions)
    .find(q => q.id === selectedQuestionId);

  if (!question) {
    return (
      <div className="property-panel empty">
        <div className="text-center py-5">
          <Settings size={32} className="text-muted mb-3" />
          <p className="text-muted">Select a question to edit properties</p>
          <p className="text-muted small">Click on any question in the builder</p>
        </div>
      </div>
    );
  }

  const config = getQuestionConfig(question.type);

  const tabs = [
    { id: 'general', label: 'General', icon: <Edit size={16} /> },
    { id: 'validation', label: 'Validation', icon: <Shield size={16} /> },
    { id: 'logic', label: 'Logic', icon: <Code size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
    { id: 'data', label: 'Data', icon: <Database size={16} /> },
    { id: 'advanced', label: 'Advanced', icon: <Settings size={16} /> },
  ];

  const handleChange = (field, value) => {
    updateQuestion(question.id, { [field]: value });
  };

  const handleDelete = () => {
    if (window.confirm('Delete this question?')) {
      deleteQuestion(question.id);
    }
  };

  const handleDuplicate = () => {
    duplicateQuestion(question.id);
  };

  return (
    <div className="property-panel">
      <div className="panel-header">
        <h6 className="fw-bold">Properties</h6>
        <div className="panel-actions">
          <button className="btn btn-sm btn-outline-secondary" onClick={handleDuplicate}>
            <Copy size={14} />
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="panel-question-info">
        <div className="question-badge">
          <span className="badge bg-light text-dark">{config.label}</span>
          {question.required && <span className="badge bg-danger ms-1">Required</span>}
        </div>
        <div className="question-id text-muted small">ID: {question.id.substring(0, 8)}</div>
      </div>

      <div className="panel-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span className="d-none d-md-inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="panel-content">
        {activeTab === 'general' && <GeneralTab question={question} onChange={handleChange} />}
        {activeTab === 'validation' && <ValidationTab question={question} onChange={handleChange} />}
        {activeTab === 'logic' && <LogicTab question={question} onChange={handleChange} />}
        {activeTab === 'appearance' && <AppearanceTab question={question} onChange={handleChange} />}
        {activeTab === 'data' && <DataTab question={question} onChange={handleChange} />}
        {activeTab === 'advanced' && <AdvancedTab question={question} onChange={handleChange} />}
      </div>

      <style>{`
        .property-panel {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 16px;
        }

        .property-panel.empty {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #dee2e6;
        }

        .panel-actions {
          display: flex;
          gap: 4px;
        }

        .panel-actions .btn {
          padding: 4px 8px;
          border-radius: 4px;
        }

        .panel-question-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 8px 12px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .panel-tabs {
          display: flex;
          gap: 2px;
          margin-bottom: 16px;
          border-bottom: 1px solid #dee2e6;
          padding-bottom: 4px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border: none;
          background: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          color: #6c757d;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          background: #f8f9fa;
          color: #00084D;
        }

        .tab-btn.active {
          background: #f0f4ff;
          color: #00084D;
        }

        .panel-content {
          flex: 1;
          overflow-y: auto;
        }

        .panel-content .form-group {
          margin-bottom: 12px;
        }

        .panel-content .form-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #495057;
          margin-bottom: 4px;
        }

        .panel-content .form-control {
          font-size: 0.85rem;
        }

        .panel-content .form-control-sm {
          padding: 4px 8px;
        }
      `}</style>
    </div>
  );
};

// Tab Components
const GeneralTab = ({ question, onChange }) => (
  <div>
    <div className="form-group">
      <label className="form-label">Title</label>
      <input
        type="text"
        className="form-control form-control-sm"
        value={question.title || ''}
        onChange={(e) => onChange('title', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Description</label>
      <textarea
        className="form-control form-control-sm"
        rows="2"
        value={question.description || ''}
        onChange={(e) => onChange('description', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Placeholder</label>
      <input
        type="text"
        className="form-control form-control-sm"
        value={question.placeholder || ''}
        onChange={(e) => onChange('placeholder', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Default Value</label>
      <input
        type="text"
        className="form-control form-control-sm"
        value={question.defaultValue || ''}
        onChange={(e) => onChange('defaultValue', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Help Text</label>
      <input
        type="text"
        className="form-control form-control-sm"
        value={question.helpText || ''}
        onChange={(e) => onChange('helpText', e.target.value)}
      />
    </div>
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={question.required || false}
        onChange={(e) => onChange('required', e.target.checked)}
      />
      <label className="form-check-label">Required</label>
    </div>
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={question.readOnly || false}
        onChange={(e) => onChange('readOnly', e.target.checked)}
      />
      <label className="form-check-label">Read Only</label>
    </div>
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={question.visible !== false}
        onChange={(e) => onChange('visible', e.target.checked)}
      />
      <label className="form-check-label">Visible</label>
    </div>
  </div>
);

const ValidationTab = ({ question, onChange }) => (
  <div>
    <div className="form-group">
      <label className="form-label">Validators</label>
      <select className="form-select form-select-sm">
        <option value="">None</option>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
        <option value="url">URL</option>
        <option value="regex">Regex</option>
      </select>
    </div>
    <div className="form-group">
      <label className="form-label">Regex Pattern</label>
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder="Enter regex pattern"
        value={question.regex || ''}
        onChange={(e) => onChange('regex', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Minimum</label>
      <input
        type="number"
        className="form-control form-control-sm"
        value={question.min || ''}
        onChange={(e) => onChange('min', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Maximum</label>
      <input
        type="number"
        className="form-control form-control-sm"
        value={question.max || ''}
        onChange={(e) => onChange('max', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Step</label>
      <input
        type="number"
        className="form-control form-control-sm"
        value={question.step || ''}
        onChange={(e) => onChange('step', e.target.value)}
      />
    </div>
  </div>
);

const LogicTab = ({ question, onChange }) => (
  <div>
    <div className="form-group">
      <label className="form-label">Enable If</label>
      <textarea
        className="form-control form-control-sm"
        rows="2"
        placeholder="Enter condition..."
        value={question.enableIf || ''}
        onChange={(e) => onChange('enableIf', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Visible If</label>
      <textarea
        className="form-control form-control-sm"
        rows="2"
        placeholder="Enter condition..."
        value={question.visibleIf || ''}
        onChange={(e) => onChange('visibleIf', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Required If</label>
      <textarea
        className="form-control form-control-sm"
        rows="2"
        placeholder="Enter condition..."
        value={question.requiredIf || ''}
        onChange={(e) => onChange('requiredIf', e.target.value)}
      />
    </div>
  </div>
);

const AppearanceTab = ({ question, onChange }) => (
  <div>
    <div className="form-group">
      <label className="form-label">CSS Class</label>
      <input
        type="text"
        className="form-control form-control-sm"
        value={question.cssClass || ''}
        onChange={(e) => onChange('cssClass', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Width</label>
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder="100% or 300px"
        value={question.width || ''}
        onChange={(e) => onChange('width', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Height</label>
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder="Auto or 200px"
        value={question.height || ''}
        onChange={(e) => onChange('height', e.target.value)}
      />
    </div>
  </div>
);

const DataTab = ({ question, onChange }) => (
  <div>
    <div className="form-group">
      <label className="form-label">Name</label>
      <input
        type="text"
        className="form-control form-control-sm"
        value={question.name || ''}
        onChange={(e) => onChange('name', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">ID</label>
      <input
        type="text"
        className="form-control form-control-sm"
        value={question.id || ''}
        disabled
      />
    </div>
  </div>
);

const AdvancedTab = ({ question, onChange }) => (
  <div>
    <div className="form-group">
      <label className="form-label">Input Mask</label>
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder="e.g., (999) 999-9999"
        value={question.inputMask || ''}
        onChange={(e) => onChange('inputMask', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Character Limit</label>
      <input
        type="number"
        className="form-control form-control-sm"
        value={question.characterLimit || ''}
        onChange={(e) => onChange('characterLimit', e.target.value)}
      />
    </div>
  </div>
);

export default PropertyPanel;