import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

const RankingQuestion = ({ question, onChange, value, error, preview }) => {
  const [items, setItems] = useState(value || question.items || ['Item 1', 'Item 2', 'Item 3']);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    setItems(newItems);
    onChange(newItems);
  };

  if (!preview) {
    return (
      <div className="text-muted small">
        <GripVertical size={16} className="me-1" /> Ranking field
      </div>
    );
  }

  return (
    <div>
      <div className="list-group">
        {items.map((item, index) => (
          <div
            key={index}
            className="list-group-item d-flex align-items-center gap-3"
            draggable={preview}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            style={{ cursor: preview ? 'grab' : 'default' }}
          >
            <GripVertical size={16} className="text-muted" />
            <span className="badge bg-secondary rounded-circle me-2">{index + 1}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
};

export default RankingQuestion;