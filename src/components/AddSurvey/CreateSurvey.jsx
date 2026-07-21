import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  Trash2, 
  Copy, 
  GripVertical,
  Eye, 
  Save,
  X,
  CheckCircle,
  Edit,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Settings,
  Move,
  FileText,
  List,
  CheckSquare,
  Circle,
  Calendar,
  Hash,
  Star,
  ThumbsUp,
  Smile
} from 'lucide-react';

// Sortable Question Item Component
const SortableQuestionItem = ({ question, index, onSelect, onDuplicate, onDelete, onUpdate, selectedQuestion }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: selectedQuestion === question.id ? '2px solid #00084D' : '1px solid #e9ecef',
    boxShadow: selectedQuestion === question.id ? '0 0 0 4px rgba(0,8,77,0.1)' : 'none',
  };

  // Get question type icon
  const getTypeIcon = (type) => {
    const icons = {
      text: <FileText size={14} />,
      textarea: <FileText size={14} />,
      number: <Hash size={14} />,
      date: <Calendar size={14} />,
      radio: <Circle size={14} />,
      checkbox: <CheckSquare size={14} />,
      dropdown: <List size={14} />,
      rating: <Star size={14} />,
      yesno: <ThumbsUp size={14} />,
      emoji: <Smile size={14} />,
    };
    return icons[type] || <FileText size={14} />;
  };

  // Render question preview
  const renderQuestionPreview = (q) => {
    switch(q.type) {
      case 'text':
        return <input type="text" className="form-control form-control-sm" placeholder="Enter text..." disabled style={{ background: '#f8f9fa' }} />;
      case 'textarea':
        return <textarea className="form-control form-control-sm" rows="2" placeholder="Enter text..." disabled style={{ background: '#f8f9fa' }} />;
      case 'number':
        return <input type="number" className="form-control form-control-sm" placeholder="Enter number..." disabled style={{ background: '#f8f9fa' }} />;
      case 'date':
        return <input type="date" className="form-control form-control-sm" disabled style={{ background: '#f8f9fa' }} />;
      case 'radio':
        return (
          <div>
            {q.options?.map((opt, idx) => (
              <div key={idx} className="form-check form-check-sm">
                <input type="radio" className="form-check-input" name={q.id} disabled />
                <label className="form-check-label small">{opt}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div>
            {q.options?.map((opt, idx) => (
              <div key={idx} className="form-check form-check-sm">
                <input type="checkbox" className="form-check-input" disabled />
                <label className="form-check-label small">{opt}</label>
              </div>
            ))}
          </div>
        );
      case 'dropdown':
        return (
          <select className="form-select form-select-sm" disabled style={{ background: '#f8f9fa' }}>
            <option>Select...</option>
            {q.options?.map((opt, idx) => (
              <option key={idx}>{opt}</option>
            ))}
          </select>
        );
      case 'rating':
        return (
          <div className="d-flex gap-1">
            {[1,2,3,4,5].map(star => (
              <span key={star} style={{ fontSize: '1.2rem', color: '#ddd' }}>☆</span>
            ))}
          </div>
        );
      case 'yesno':
        return (
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-success" disabled>Yes</button>
            <button className="btn btn-sm btn-outline-danger" disabled>No</button>
          </div>
        );
      case 'emoji':
        return (
          <div className="d-flex gap-1" style={{ fontSize: '1.5rem' }}>
            {['😞', '😕', '😐', '🙂', '😍'].map((emoji, idx) => (
              <span key={idx} style={{ opacity: 0.3 }}>{emoji}</span>
            ))}
          </div>
        );
      default:
        return <p className="text-muted small">Preview not available</p>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card shadow-sm mb-3"
      onClick={() => onSelect(question.id)}
    >
      <div className="card-body py-2">
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex align-items-start gap-2 flex-grow-1">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="mt-2"
              style={{ cursor: 'grab', padding: '4px' }}
            >
              <GripVertical size={18} className="text-muted" />
            </div>
            
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="badge bg-secondary">{index + 1}</span>
                <span className="badge bg-light text-dark text-capitalize d-flex align-items-center gap-1">
                  {getTypeIcon(question.type)}
                  {question.type}
                </span>
                {question.required && <span className="badge bg-danger">Required</span>}
                <input
                  type="text"
                  className="form-control form-control-sm"
                  style={{ maxWidth: '350px', fontWeight: '600' }}
                  value={question.title}
                  onChange={(e) => onUpdate(question.id, 'title', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Enter question title..."
                />
              </div>
              <div className="mt-2 ps-4">
                {renderQuestionPreview(question)}
              </div>
            </div>
          </div>
          
          <div className="d-flex gap-1 flex-shrink-0">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={(e) => { e.stopPropagation(); onDuplicate(question.id); }}
              title="Duplicate"
            >
              <Copy size={14} />
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={(e) => { e.stopPropagation(); onDelete(question.id); }}
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateSurvey = () => {
  const [surveyTitle, setSurveyTitle] = useState('New Survey');
  const [surveyDescription, setSurveyDescription] = useState('Please provide your feedback');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [savedSurveys, setSavedSurveys] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Question types with icons
  const questionTypes = [
    { id: 'text', label: 'Text Input', icon: '📝', description: 'Short text answer' },
    { id: 'textarea', label: 'Text Area', icon: '📄', description: 'Long text answer' },
    { id: 'number', label: 'Number', icon: '🔢', description: 'Numeric answer' },
    { id: 'date', label: 'Date Picker', icon: '📅', description: 'Date selection' },
    { id: 'radio', label: 'Multiple Choice', icon: '⭕', description: 'Single select' },
    { id: 'checkbox', label: 'Checkboxes', icon: '☑️', description: 'Multiple select' },
    { id: 'dropdown', label: 'Dropdown', icon: '📋', description: 'Select from list' },
    { id: 'rating', label: 'Star Rating', icon: '⭐', description: 'Rate 1-5 stars' },
    { id: 'yesno', label: 'Yes/No', icon: '👍', description: 'Binary choice' },
    { id: 'emoji', label: 'Emoji Rating', icon: '😊', description: 'Emoji selection' },
  ];

  // Create new question
  const createNewQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type: type,
      title: `New ${type} Question`,
      required: false,
      placeholder: '',
      options: ['Option 1', 'Option 2'],
      value: '',
    };

    switch(type) {
      case 'radio':
      case 'checkbox':
      case 'dropdown':
        newQuestion.options = ['Option 1', 'Option 2', 'Option 3'];
        break;
      case 'rating':
        newQuestion.maxRating = 5;
        break;
      case 'yesno':
        newQuestion.options = ['Yes', 'No'];
        break;
      default:
        break;
    }

    return newQuestion;
  };

  // Add question
  const addQuestion = (type) => {
    const newQuestion = createNewQuestion(type);
    setQuestions([...questions, newQuestion]);
    setSelectedQuestion(newQuestion.id);
    setShowQuestionModal(false);
  };

  // Delete question
  const deleteQuestion = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
      if (selectedQuestion === id) {
        setSelectedQuestion(null);
      }
    }
  };

  // Duplicate question
  const duplicateQuestion = (id) => {
    const questionToCopy = questions.find(q => q.id === id);
    if (questionToCopy) {
      const newQuestion = {
        ...questionToCopy,
        id: Date.now().toString(),
        title: `${questionToCopy.title} (Copy)`,
      };
      setQuestions([...questions, newQuestion]);
    }
  };

  // Update question
  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  // Update option
  const updateOption = (qId, index, value) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[index] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  // Add option
  const addOption = (qId) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
      }
      return q;
    }));
  };

  // Remove option
  const removeOption = (qId, index) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = q.options.filter((_, i) => i !== index);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Save survey
  const saveSurvey = () => {
    if (questions.length === 0) {
      alert('Please add at least one question before saving.');
      return;
    }

    const surveyData = {
      id: Date.now().toString(),
      title: surveyTitle || 'Untitled Survey',
      description: surveyDescription,
      questions: questions,
      createdAt: new Date().toISOString(),
      totalQuestions: questions.length,
    };
    
    // Save to localStorage
    const existingSurveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    const updatedSurveys = [...existingSurveys, surveyData];
    localStorage.setItem('surveys', JSON.stringify(updatedSurveys));
    
    setSavedSurveys(updatedSurveys);
    setShowSaveModal(true);
    
    console.log('Survey saved:', surveyData);
  };

  // Toggle preview
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  // Question count
  const questionCount = questions.length;

  // Get selected question data
  const selectedQ = questions.find(q => q.id === selectedQuestion);

  return (
    <div className="create-survey-container" style={{ padding: '20px', background: '#f5f7fa', minHeight: '100vh' }}>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <div>
            <h2 className="fw-bold" style={{ color: '#00084D' }}>
              📝 Survey Builder
            </h2>
            <p className="text-muted">Create your custom survey by adding and arranging questions</p>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={togglePreview}
              className="btn btn-outline-primary"
              style={{ borderColor: '#00084D', color: '#00084D' }}
            >
              <Eye size={16} className="me-1" />
              {previewMode ? 'Edit Mode' : 'Preview'}
            </button>
            <button
              onClick={saveSurvey}
              className="btn btn-primary"
              style={{ background: '#00084D', borderColor: '#00084D' }}
              disabled={questions.length === 0}
            >
              <Save size={16} className="me-1" />
              Save Survey
            </button>
          </div>
        </div>

        {/* Survey Info */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="fw-semibold small text-muted">Survey Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={surveyTitle}
                  onChange={(e) => setSurveyTitle(e.target.value)}
                  placeholder="Enter survey title"
                />
              </div>
              <div className="col-md-6">
                <label className="fw-semibold small text-muted">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={surveyDescription}
                  onChange={(e) => setSurveyDescription(e.target.value)}
                  placeholder="Enter survey description"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add Question Button */}
        <div className="mb-3 d-flex align-items-center gap-3">
          <button
            onClick={() => setShowQuestionModal(true)}
            className="btn btn-primary"
            style={{ background: '#00084D', borderColor: '#00084D' }}
          >
            <Plus size={16} className="me-1" />
            Add Question
          </button>
          <span className="text-muted small">
            {questionCount} {questionCount === 1 ? 'question' : 'questions'} added
          </span>
          {questionCount > 0 && (
            <span className="text-muted small">
              • Drag <GripVertical size={14} className="text-muted" /> to reorder
            </span>
          )}
        </div>

        {/* Question List */}
        {questionCount === 0 ? (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <div style={{ fontSize: '3rem', opacity: 0.3 }}>📋</div>
              <h5 className="text-muted mt-3">No questions added yet</h5>
              <p className="text-muted small">Click "Add Question" to start building your survey</p>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={questions.map(q => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {questions.map((question, index) => (
                    <SortableQuestionItem
                      key={question.id}
                      question={question}
                      index={index}
                      selectedQuestion={selectedQuestion}
                      onSelect={setSelectedQuestion}
                      onDuplicate={duplicateQuestion}
                      onDelete={deleteQuestion}
                      onUpdate={updateQuestion}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            {/* Question Settings Panel */}
            <div className="col-lg-4">
              {selectedQ ? (
                <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                  <div className="card-header bg-primary text-white">
                    <h6 className="mb-0 fw-bold">⚙️ Question Settings</h6>
                  </div>
                  <div className="card-body">
                    {/* Title */}
                    <div className="mb-3">
                      <label className="fw-semibold small text-muted">Question Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={selectedQ.title}
                        onChange={(e) => updateQuestion(selectedQ.id, 'title', e.target.value)}
                      />
                    </div>

                    {/* Type */}
                    <div className="mb-3">
                      <label className="fw-semibold small text-muted">Type</label>
                      <div className="text-capitalize">
                        <span className="badge bg-light text-dark">{selectedQ.type}</span>
                      </div>
                    </div>

                    {/* Required */}
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedQ.required}
                          onChange={(e) => updateQuestion(selectedQ.id, 'required', e.target.checked)}
                        />
                        <label className="form-check-label">Required question</label>
                      </div>
                    </div>

                    {/* Placeholder */}
                    {(selectedQ.type === 'text' || selectedQ.type === 'textarea' || selectedQ.type === 'number') && (
                      <div className="mb-3">
                        <label className="fw-semibold small text-muted">Placeholder</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={selectedQ.placeholder || ''}
                          onChange={(e) => updateQuestion(selectedQ.id, 'placeholder', e.target.value)}
                          placeholder="Enter placeholder text..."
                        />
                      </div>
                    )}

                    {/* Options (for radio, checkbox, dropdown) */}
                    {(selectedQ.type === 'radio' || selectedQ.type === 'checkbox' || selectedQ.type === 'dropdown') && (
                      <div className="mb-3">
                        <label className="fw-semibold small text-muted">Options</label>
                        {selectedQ.options?.map((opt, idx) => (
                          <div key={idx} className="d-flex gap-2 mb-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={opt}
                              onChange={(e) => updateOption(selectedQ.id, idx, e.target.value)}
                            />
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeOption(selectedQ.id, idx)}
                              disabled={selectedQ.options.length <= 2}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          className="btn btn-sm btn-outline-secondary mt-1"
                          onClick={() => addOption(selectedQ.id)}
                        >
                          <Plus size={14} className="me-1" />
                          Add Option
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card shadow-sm">
                  <div className="card-body text-center py-4">
                    <div style={{ fontSize: '2rem' }}>👈</div>
                    <p className="text-muted small mt-2">Select a question to edit its settings</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Question Type Modal */}
        {showQuestionModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              zIndex: 9999,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backdropFilter: 'blur(4px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowQuestionModal(false);
            }}
          >
            <div
              className="bg-white rounded-3 p-4"
              style={{
                maxWidth: '650px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                animation: 'slideUp 0.3s ease',
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold">Choose Question Type</h5>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="btn btn-sm btn-outline-secondary rounded-circle"
                  style={{ width: '32px', height: '32px' }}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="row g-2">
                {questionTypes.map((type) => (
                  <div key={type.id} className="col-md-6">
                    <button
                      onClick={() => addQuestion(type.id)}
                      className="btn btn-outline-secondary w-100 text-start"
                      style={{ padding: '12px 15px', borderRadius: '10px' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '1.5rem' }}>{type.icon}</span>
                        <div>
                          <div className="fw-semibold">{type.label}</div>
                          <div className="text-muted small">{type.description}</div>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Save Success Modal */}
        {showSaveModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              zIndex: 9999,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backdropFilter: 'blur(4px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowSaveModal(false);
            }}
          >
            <div
              className="bg-white rounded-3 p-4 text-center"
              style={{
                maxWidth: '400px',
                width: '100%',
                animation: 'scaleIn 0.3s ease',
              }}
            >
              <CheckCircle size={48} color="#28a745" className="mb-3" />
              <h5 className="fw-bold">Survey Saved!</h5>
              <p className="text-muted">
                Your survey has been saved successfully.
                <br />
                <small>You can find it in your surveys list.</small>
              </p>
              <button
                onClick={() => setShowSaveModal(false)}
                className="btn btn-primary mt-2"
                style={{ background: '#00084D', borderColor: '#00084D' }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Preview Mode Modal */}
        {previewMode && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              zIndex: 9998,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backdropFilter: 'blur(4px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPreviewMode(false);
            }}
          >
            <div
              className="bg-white rounded-3 p-4"
              style={{
                maxWidth: '750px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                animation: 'slideUp 0.3s ease',
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold">📋 Survey Preview</h5>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="btn btn-sm btn-outline-secondary rounded-circle"
                  style={{ width: '32px', height: '32px' }}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="preview-content">
                <h4 className="mb-2">{surveyTitle || 'Untitled Survey'}</h4>
                <p className="text-muted">{surveyDescription}</p>
                <hr />
                {questions.length === 0 ? (
                  <p className="text-muted text-center py-4">No questions to preview</p>
                ) : (
                  questions.map((q, idx) => (
                    <div key={q.id} className="mb-3 p-3 border rounded">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-secondary">{idx + 1}</span>
                        <span className="fw-semibold">{q.title}</span>
                        {q.required && <span className="text-danger">*</span>}
                        <span className="badge bg-light text-dark text-capitalize ms-auto">{q.type}</span>
                      </div>
                      <div className="mt-1">
                        {/* Preview render */}
                        {q.type === 'text' && <input type="text" className="form-control" placeholder={q.placeholder || 'Enter text...'} disabled />}
                        {q.type === 'textarea' && <textarea className="form-control" rows="3" placeholder={q.placeholder || 'Enter text...'} disabled />}
                        {q.type === 'number' && <input type="number" className="form-control" placeholder={q.placeholder || 'Enter number...'} disabled />}
                        {q.type === 'date' && <input type="date" className="form-control" disabled />}
                        {q.type === 'radio' && q.options?.map((opt, i) => (
                          <div key={i} className="form-check">
                            <input type="radio" className="form-check-input" disabled />
                            <label className="form-check-label">{opt}</label>
                          </div>
                        ))}
                        {q.type === 'checkbox' && q.options?.map((opt, i) => (
                          <div key={i} className="form-check">
                            <input type="checkbox" className="form-check-input" disabled />
                            <label className="form-check-label">{opt}</label>
                          </div>
                        ))}
                        {q.type === 'dropdown' && (
                          <select className="form-select" disabled>
                            <option>Select...</option>
                            {q.options?.map((opt, i) => (
                              <option key={i}>{opt}</option>
                            ))}
                          </select>
                        )}
                        {q.type === 'rating' && (
                          <div className="d-flex gap-1">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} style={{ fontSize: '1.8rem', color: '#ddd' }}>☆</span>
                            ))}
                          </div>
                        )}
                        {q.type === 'yesno' && (
                          <div className="d-flex gap-2">
                            <button className="btn btn-outline-success" disabled>Yes</button>
                            <button className="btn btn-outline-danger" disabled>No</button>
                          </div>
                        )}
                        {q.type === 'emoji' && (
                          <div className="d-flex gap-2" style={{ fontSize: '2rem' }}>
                            {['😞', '😕', '😐', '🙂', '😍'].map((emoji, i) => (
                              <span key={i} style={{ opacity: 0.3, cursor: 'default' }}>{emoji}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .create-survey-container .card {
          border-radius: 12px;
        }
        .create-survey-container .form-control:focus {
          border-color: #00084D;
          box-shadow: 0 0 0 3px rgba(0, 8, 77, 0.1);
        }
        .create-survey-container .btn-primary:hover {
          background: #1a1f6b !important;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CreateSurvey;