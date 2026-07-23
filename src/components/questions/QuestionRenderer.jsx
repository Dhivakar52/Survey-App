import React from 'react';
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
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Copy, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useSurveyContext } from '../../context/SurveyContext';
import QuestionFactory from './QuestionFactory';

const SortableQuestionItem = ({ question, index, total, onEdit, onDelete, onDuplicate, onMove }) => {
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
  };

  const { selectQuestion, selectedQuestionId } = useSurveyContext();
  const isSelected = selectedQuestionId === question.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`question-item ${isSelected ? 'selected' : ''}`}
      onClick={() => selectQuestion(question.id)}
    >
      <div className="question-item-header">
        <div className="question-item-left">
          <div {...listeners} className="drag-handle">
            <GripVertical size={16} />
          </div>
          <span className="question-number">{index + 1}.</span>
          <span className="question-title">{question.title}</span>
          <span className="badge bg-light text-dark">{question.type}</span>
          {question.required && <span className="badge bg-danger">Required</span>}
        </div>
        <div className="question-item-actions">
          <button onClick={() => onMove(question.id, -1)} disabled={index === 0}>
            <ChevronUp size={14} />
          </button>
          <button onClick={() => onMove(question.id, 1)} disabled={index === total - 1}>
            <ChevronDown size={14} />
          </button>
          <button onClick={() => onDuplicate(question.id)}>
            <Copy size={14} />
          </button>
          <button onClick={() => onDelete(question.id)} className="text-danger">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="question-item-preview">
        <QuestionFactory question={question} preview={true} />
      </div>

      <style>{`
        .question-item {
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 12px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .question-item:hover {
          border-color: #00084D;
          box-shadow: 0 2px 8px rgba(0,8,77,0.08);
        }

        .question-item.selected {
          border-color: #00084D;
          background: #f8f9fa;
          box-shadow: 0 0 0 3px rgba(0,8,77,0.1);
        }

        .question-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .question-item-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .drag-handle {
          cursor: grab;
          color: #6c757d;
        }

        .drag-handle:hover {
          color: #00084D;
        }

        .question-number {
          font-weight: 600;
          color: #00084D;
        }

        .question-title {
          font-weight: 500;
        }

        .question-item-actions {
          display: flex;
          gap: 4px;
        }

        .question-item-actions button {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: #6c757d;
          border-radius: 4px;
        }

        .question-item-actions button:hover {
          background: #f8f9fa;
          color: #00084D;
        }

        .question-item-preview {
          padding-left: 32px;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

const QuestionRenderer = ({ questions, pageId, viewMode }) => {
  const { reorderQuestions, moveQuestion, deleteQuestion, duplicateQuestion } = useSurveyContext();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex((item) => item.id === active.id);
      const newIndex = questions.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(questions, oldIndex, newIndex);
      reorderQuestions(pageId, newOrder.map(q => q.id));
    }
  };

  const questionIds = questions.map(q => q.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={questionIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="question-list">
          {questions.map((question, index) => (
            <SortableQuestionItem
              key={question.id}
              question={question}
              index={index}
              total={questions.length}
              onEdit={() => {}}
              onDelete={deleteQuestion}
              onDuplicate={duplicateQuestion}
              onMove={moveQuestion}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default QuestionRenderer;