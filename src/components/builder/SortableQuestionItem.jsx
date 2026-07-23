// SortableQuestionItem.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';

const SortableQuestionItem = ({
  question,
  index,
  totalQuestions,
  selectedQuestion,
  setSelectedQuestion,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  moveQuestion,
  renderQuestionPreview,
  previewMode,
  onFileUpload,
  onImageUpload,
  onSignatureSave,
}) => {
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
    zIndex: isDragging ? 999 : 'auto',
  };

  const isSelected = selectedQuestion === question.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card mb-2 ${isSelected ? 'border-primary' : ''}`}
      onClick={() => setSelectedQuestion(question.id)}
    >
      <div className="card-body d-flex align-items-start gap-2">
        {/* Drag handle — listeners MUST go only here, not on the whole card */}
        {!previewMode && (
          <div
            {...attributes}
            {...listeners}
            style={{ cursor: 'grab', touchAction: 'none' }}
            className="pt-1 text-muted"
          >
            <GripVertical size={18} />
          </div>
        )}

        <div className="flex-grow-1">
          <input
            type="text"
            className="form-control form-control-sm fw-semibold mb-2"
            value={question.title}
            onChange={(e) => updateQuestion(question.id, 'title', e.target.value)}
            disabled={previewMode}
          />
          {renderQuestionPreview(question, onFileUpload, onImageUpload, onSignatureSave)}
        </div>

        {!previewMode && (
          <div className="d-flex flex-column gap-1">
            <button className="btn btn-sm btn-light" onClick={(e) => { e.stopPropagation(); duplicateQuestion(question.id); }}>
              <Copy size={14} />
            </button>
            <button className="btn btn-sm btn-light text-danger" onClick={(e) => { e.stopPropagation(); deleteQuestion(question.id); }}>
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortableQuestionItem;