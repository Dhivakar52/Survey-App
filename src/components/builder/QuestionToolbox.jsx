import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const DraggableToolItem = ({ type, onAddQuestion }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbox-${type.id}`,
    data: {
      fromToolbox: true,
      questionType: type.id,
      label: type.label,
      icon: type.icon,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="d-flex align-items-center justify-content-between border rounded px-2 py-2 mb-2 bg-white"
      style={{
        cursor: 'grab',
        touchAction: 'none',
        opacity: isDragging ? 0.4 : 1,
      }}
      onClick={() => onAddQuestion(type.id)} // click still works for quick-add
    >
      <span className="d-flex align-items-center gap-2">
        {type.icon} {type.label}
      </span>
      <span>+</span>
    </div>
  );
};

const QuestionToolbox = ({ questionTypes, onAddQuestion }) => (
  <div className="card shadow-sm">
    <div className="card-header" style={{ background: '#00084D', color: 'white' }}>
      <h6 className="mb-0">Builder Features</h6>
      <small className="d-flex align-items-center gap-1">
        <GripVerticalIcon /> Drag &amp; Drop
      </small>
    </div>
    <div className="card-body">
      {questionTypes.map((type) => (
        <DraggableToolItem key={type.id} type={type} onAddQuestion={onAddQuestion} />
      ))}
    </div>
  </div>
);

// small inline helper (or import GripVertical from lucide-react in the real file)
const GripVerticalIcon = () => null;

export default QuestionToolbox;