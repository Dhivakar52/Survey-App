import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  Eye, 
  Save, 
  Send, 
  ArrowLeft,
  EyeOff,
  Plus,
  GripVertical,
  Type,
  List,
  CheckSquare,
  Circle,
  Star,
  Grid,
  ArrowUpDown,
  Upload,
  Image,
  PenTool,
  ToggleLeft,
  Layout,
  FileText,
  Calculator,
  AlignJustify
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSurveyContext } from '../../context/SurveyContext';

// Import from builder folder - CORRECT PATHS
import SortableQuestionItem from '../builder/SortableQuestionItem';
import QuestionToolbox from '../builder/QuestionToolbox';
import QuestionProperties from '../builder/QuestionProperties';

// All available question types
const QUESTION_TYPES = [
  { id: 'text', label: 'Text', icon: <Type size={18} /> },
  { id: 'dropdown', label: 'Dropdown', icon: <List size={18} /> },
  { id: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={18} /> },
  { id: 'radio', label: 'Radio', icon: <Circle size={18} /> },
  { id: 'rating', label: 'Rating', icon: <Star size={18} /> },
  { id: 'matrix', label: 'Matrix', icon: <Grid size={18} /> },
  { id: 'ranking', label: 'Ranking', icon: <ArrowUpDown size={18} /> },
  { id: 'fileUpload', label: 'File Upload', icon: <Upload size={18} /> },
  { id: 'imagePicker', label: 'Image Picker', icon: <Image size={18} /> },
  { id: 'signature', label: 'Signature', icon: <PenTool size={18} /> },
  { id: 'boolean', label: 'Boolean', icon: <ToggleLeft size={18} /> },
  { id: 'panel', label: 'Panel', icon: <Layout size={18} /> },
  { id: 'dynamicPanel', label: 'Dynamic Panel', icon: <Layout size={18} /> },
  { id: 'html', label: 'HTML', icon: <FileText size={18} /> },
  { id: 'expression', label: 'Expression', icon: <Calculator size={18} /> },
  { id: 'multipleText', label: 'Multiple Text', icon: <AlignJustify size={18} /> },
];

// Droppable wrapper for the builder canvas
const DroppableCanvas = ({ children, isEmpty }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop-zone' });
  return (
    <div
      ref={setNodeRef}
      className="card-body"
      style={{
        minHeight: '400px',
        background: isOver ? '#eef2ff' : 'transparent',
        border: isOver ? '2px dashed #00084D' : '2px dashed transparent',
        borderRadius: '6px',
        transition: 'background 0.15s, border 0.15s',
      }}
    >
      {children}
    </div>
  );
};

const CreateSurvey = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pushToast, t } = useSurveyContext();
  
  const params = new URLSearchParams(location.search);
  const editId = params.get('id');
  const isEditing = !!editId;
  
  const [surveyTitle, setSurveyTitle] = useState('Untitled Survey');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadedImages, setUploadedImages] = useState({});
  const [signatures, setSignatures] = useState({});
  const [saving, setSaving] = useState(false);
  const [surveyStatus, setSurveyStatus] = useState('draft');
  const [surveyId, setSurveyId] = useState(null);
  const [activeDragItem, setActiveDragItem] = useState(null); // for DragOverlay preview
  
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 }, // avoids accidental drags on click
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isEditing && editId) {
      try {
        const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
        const survey = surveys.find(s => s.id === parseInt(editId));
        if (survey) {
          setSurveyId(survey.id);
          setSurveyTitle(survey.title || 'Untitled Survey');
          setSurveyDescription(survey.description || '');
          setQuestions(survey.questions || []);
          setSurveyStatus(survey.status || 'draft');
          if (survey.uploadedFiles) setUploadedFiles(survey.uploadedFiles);
          if (survey.uploadedImages) setUploadedImages(survey.uploadedImages);
          if (survey.signatures) setSignatures(survey.signatures);
        }
      } catch (error) {
        console.error('Failed to load survey:', error);
      }
    }
  }, [isEditing, editId]);

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type: type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Question ${questions.length + 1}`,
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3'],
      placeholder: '',
      description: '',
      uploadedFile: null,
      uploadedImage: null,
      signature: null,
    };
    setQuestions(prev => [...prev, newQuestion]);
    setSelectedQuestion(newQuestion.id);
    return newQuestion;
  };

  const deleteQuestion = (id) => {
    if (window.confirm('Delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
      if (selectedQuestion === id) setSelectedQuestion(null);
    }
  };

  const duplicateQuestion = (id) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      const newQuestion = {
        ...question,
        id: Date.now(),
        title: `${question.title} (Copy)`,
      };
      setQuestions([...questions, newQuestion]);
      setSelectedQuestion(newQuestion.id);
    }
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const moveQuestion = (id, direction) => {
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= questions.length) return;
    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setQuestions(newQuestions);
  };

  // Fires when a drag starts — lets us show a preview via DragOverlay
  const handleDragStart = (event) => {
    const { active } = event;
    if (active.data?.current?.fromToolbox) {
      setActiveDragItem({
        fromToolbox: true,
        type: active.data.current.questionType,
        label: active.data.current.label,
        icon: active.data.current.icon,
      });
    } else {
      const question = questions.find(q => q.id === active.id);
      setActiveDragItem(question ? { fromToolbox: false, question } : null);
    }
  };

  // Single handler for BOTH toolbox->canvas drops AND reordering existing questions
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return;

    // Case 1: dragged from the toolbox → add a new question
    if (active.data?.current?.fromToolbox) {
      const type = active.data.current.questionType;

      // Dropped directly on the empty canvas / drop-zone
      if (over.id === 'canvas-drop-zone') {
        addQuestion(type);
        return;
      }

      // Dropped on top of an existing question → insert at that position
      const overIndex = questions.findIndex(q => q.id === over.id);
      if (overIndex !== -1) {
        const newQuestion = {
          id: Date.now(),
          type: type,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Question ${questions.length + 1}`,
          required: false,
          options: ['Option 1', 'Option 2', 'Option 3'],
          placeholder: '',
          description: '',
          uploadedFile: null,
          uploadedImage: null,
          signature: null,
        };
        const newQuestions = [...questions];
        newQuestions.splice(overIndex, 0, newQuestion);
        setQuestions(newQuestions);
        setSelectedQuestion(newQuestion.id);
      } else {
        addQuestion(type);
      }
      return;
    }

    // Case 2: reordering existing questions
    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleFileUpload = (questionId, file) => {
    if (file) {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      };
      updateQuestion(questionId, 'uploadedFile', fileData);
      setUploadedFiles(prev => ({ ...prev, [questionId]: fileData }));
    }
  };

  const handleImageUpload = (questionId, file) => {
    if (file) {
      const imageData = {
        name: file.name,
        url: URL.createObjectURL(file)
      };
      updateQuestion(questionId, 'uploadedImage', imageData);
      setUploadedImages(prev => ({ ...prev, [questionId]: imageData }));
    }
  };

  const handleSignatureSave = (questionId, signatureData) => {
    if (signatureData) {
      updateQuestion(questionId, 'signature', signatureData);
      setSignatures(prev => ({ ...prev, [questionId]: signatureData }));
    }
  };

  const removeFile = (questionId) => {
    updateQuestion(questionId, 'uploadedFile', null);
    setUploadedFiles(prev => {
      const newState = { ...prev };
      delete newState[questionId];
      return newState;
    });
  };

  const removeImage = (questionId) => {
    updateQuestion(questionId, 'uploadedImage', null);
    setUploadedImages(prev => {
      const newState = { ...prev };
      delete newState[questionId];
      return newState;
    });
  };

  const clearSignature = (questionId) => {
    updateQuestion(questionId, 'signature', null);
    setSignatures(prev => {
      const newState = { ...prev };
      delete newState[questionId];
      return newState;
    });
  };

  const handleSaveDraft = () => {
    if (questions.length === 0) {
      pushToast('Please add at least one question before saving.', 'warning');
      return;
    }

    setSaving(true);
    
    const surveyData = {
      id: surveyId || Date.now(),
      title: surveyTitle || 'Untitled Survey',
      description: surveyDescription,
      questions: questions,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalQuestions: questions.length,
      uploadedFiles: uploadedFiles,
      uploadedImages: uploadedImages,
      signatures: signatures,
    };
    
    try {
      const existingSurveys = JSON.parse(localStorage.getItem('surveys') || '[]');
      const index = existingSurveys.findIndex(s => s.id === surveyData.id);
      
      if (index !== -1) {
        existingSurveys[index] = surveyData;
      } else {
        existingSurveys.push(surveyData);
      }
      
      localStorage.setItem('surveys', JSON.stringify(existingSurveys));
      setSurveyId(surveyData.id);
      setSurveyStatus('draft');
      pushToast('✅ Survey draft saved successfully!', 'success');
      
      if (!isEditing) {
        navigate(`/edit-survey?id=${surveyData.id}`, { replace: true });
      }
    } catch (error) {
      pushToast('❌ Failed to save survey draft', 'danger');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = () => {
    if (questions.length === 0) {
      pushToast('Please add at least one question before publishing.', 'warning');
      return;
    }

    const emptyTitleQuestions = questions.filter(q => !q.title || q.title.trim() === '');
    if (emptyTitleQuestions.length > 0) {
      pushToast(`Please add titles to all questions (${emptyTitleQuestions.length} missing).`, 'warning');
      return;
    }

    setSaving(true);
    
    const surveyData = {
      id: surveyId || Date.now(),
      title: surveyTitle || 'Untitled Survey',
      description: surveyDescription,
      questions: questions,
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      totalQuestions: questions.length,
      uploadedFiles: uploadedFiles,
      uploadedImages: uploadedImages,
      signatures: signatures,
    };
    
    try {
      const existingSurveys = JSON.parse(localStorage.getItem('surveys') || '[]');
      const index = existingSurveys.findIndex(s => s.id === surveyData.id);
      
      if (index !== -1) {
        existingSurveys[index] = surveyData;
      } else {
        existingSurveys.push(surveyData);
      }
      
      localStorage.setItem('surveys', JSON.stringify(existingSurveys));
      setSurveyId(surveyData.id);
      setSurveyStatus('published');
      pushToast('🎉 Survey published successfully!', 'success');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      pushToast('❌ Failed to publish survey', 'danger');
      console.error('Publish error:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderQuestionPreview = (question, onFileUpload, onImageUpload, onSignatureSave) => {
    switch (question.type) {
      case 'text':
        return (
          <input 
            type="text" 
            className="form-control" 
            placeholder={question.placeholder || 'Enter text...'}
            disabled={!previewMode}
          />
        );
      case 'dropdown':
        return (
          <select className="form-select" disabled={!previewMode}>
            <option>Select an option</option>
            {question.options?.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div>
            {question.options?.map((opt, i) => (
              <div key={i} className="form-check">
                <input className="form-check-input" type="checkbox" disabled={!previewMode} />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div>
            {question.options?.map((opt, i) => (
              <div key={i} className="form-check">
                <input className="form-check-input" type="radio" disabled={!previewMode} />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
          </div>
        );
      case 'rating':
        return (
          <div className="d-flex gap-2">
            {[1,2,3,4,5].map(i => (
              <span key={i} className="fs-4" style={{ cursor: 'pointer' }}>☆</span>
            ))}
          </div>
        );
      default:
        return <p className="text-muted">Preview not available for {question.type}</p>;
    }
  };

  const questionIds = questions.map(q => q.id);

  return (
    <div className="create-survey-container" style={{ padding: '20px', background: '#f5f7fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={16} className="me-1" /> Back
          </button>
          <h4 className="fw-bold m-0" style={{ color: '#00084D' }}>
            {isEditing ? 'Edit Survey' : 'Create Survey'}
          </h4>
          {isEditing && (
            <span className={`badge ${surveyStatus === 'published' ? 'bg-success' : 'bg-warning'}`}>
              {surveyStatus === 'published' ? 'Published' : 'Draft'}
            </span>
          )}
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? <EyeOff size={16} className="me-1" /> : <Eye size={16} className="me-1" />}
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button 
            className="btn btn-outline-primary"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            <Save size={16} className="me-1" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={handlePublish}
            disabled={saving}
            style={{ background: '#00084D', borderColor: '#00084D' }}
          >
            <Send size={16} className="me-1" />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label fw-semibold">Survey Title</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                placeholder="Enter survey title..."
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Status</label>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className={`badge ${surveyStatus === 'published' ? 'bg-success' : 'bg-warning'}`}>
                  {surveyStatus === 'published' ? 'Published' : 'Draft'}
                </span>
                <span className="text-muted small">{questions.length} questions</span>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                rows="2"
                value={surveyDescription}
                onChange={(e) => setSurveyDescription(e.target.value)}
                placeholder="Enter survey description..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Single top-level DndContext wraps BOTH toolbox and canvas */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="row g-3">
          <div className="col-12 col-md-3 col-lg-2">
            <QuestionToolbox 
              questionTypes={QUESTION_TYPES} 
              onAddQuestion={addQuestion} 
            />
          </div>

          <div className="col-12 col-md-6 col-lg-7">
            <div className="card shadow-sm">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-semibold m-0">
                    {previewMode ? 'Preview Mode' : 'Survey Builder'}
                  </h6>
                  <span className="badge bg-secondary">{questions.length} questions</span>
                </div>
              </div>

              <DroppableCanvas isEmpty={questions.length === 0}>
                {questions.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <Plus size={48} className="text-muted" />
                    </div>
                    <h5 className="text-muted">No questions yet</h5>
                    <p className="text-muted small">Drag a question type from the left, or click to add</p>
                  </div>
                ) : (
                  <SortableContext
                    items={questionIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="d-flex flex-column">
                      {questions.map((question, index) => (
                        <SortableQuestionItem
                          key={question.id}
                          question={question}
                          index={index}
                          totalQuestions={questions.length}
                          selectedQuestion={selectedQuestion}
                          setSelectedQuestion={setSelectedQuestion}
                          updateQuestion={updateQuestion}
                          deleteQuestion={deleteQuestion}
                          duplicateQuestion={duplicateQuestion}
                          moveQuestion={moveQuestion}
                          renderQuestionPreview={renderQuestionPreview}
                          previewMode={previewMode}
                          onFileUpload={handleFileUpload}
                          onImageUpload={handleImageUpload}
                          onSignatureSave={handleSignatureSave}
                        />
                      ))}
                    </div>
                  </SortableContext>
                )}
              </DroppableCanvas>
            </div>
          </div>

          <div className="col-12 col-md-3 col-lg-3">
            <div className="card shadow-sm">
              <div className="card-header" style={{ background: '#00084D', color: 'white' }}>
                <h6 className="mb-0">Properties</h6>
              </div>
              <div className="card-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <QuestionProperties 
                  selectedQuestion={selectedQuestion}
                  questions={questions}
                  updateQuestion={updateQuestion}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ghost preview that follows the cursor while dragging */}
        <DragOverlay>
          {activeDragItem?.fromToolbox ? (
            <div className="d-flex align-items-center gap-2 border rounded px-3 py-2 bg-white shadow-sm" style={{ opacity: 0.9 }}>
              {activeDragItem.icon}
              <span>{activeDragItem.label}</span>
            </div>
          ) : activeDragItem?.question ? (
            <div className="card shadow" style={{ opacity: 0.9, width: '300px' }}>
              <div className="card-body py-2 px-3">
                <strong>{activeDragItem.question.title}</strong>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default CreateSurvey;