import React from 'react';

const QuestionProperties = ({ selectedQuestion, questions, updateQuestion }) => {
  const question = questions.find(q => q.id === selectedQuestion);

  if (!question) {
    return (
      <div className="text-center py-4">
        <p className="text-muted small">Select a question to edit properties</p>
      </div>
    );
  }

  const isChoiceType = ['text', 'dropdown', 'checkbox', 'radio'].includes(question.type);
  const isMediaType = ['fileUpload', 'imagePicker'].includes(question.type);

  return (
    <div>
      <h6 className="fw-bold">Question Settings</h6>
      <hr />
      <div className="mb-3">
        <label className="form-label small fw-semibold">Question ID</label>
        <input 
          type="text" 
          className="form-control form-control-sm"
          value={question.id || ''}
          disabled
        />
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Type</label>
        <input 
          type="text" 
          className="form-control form-control-sm"
          value={question.type || ''}
          disabled
        />
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Title</label>
        <input 
          type="text" 
          className="form-control form-control-sm"
          value={question.title || ''}
          onChange={(e) => updateQuestion(selectedQuestion, 'title', e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Description</label>
        <textarea 
          className="form-control form-control-sm"
          rows="2"
          value={question.description || ''}
          onChange={(e) => updateQuestion(selectedQuestion, 'description', e.target.value)}
          placeholder="Add description..."
        />
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={question.required || false}
          onChange={(e) => updateQuestion(selectedQuestion, 'required', e.target.checked)}
        />
        <label className="form-check-label small">Required</label>
      </div>
      {isChoiceType && (
        <div className="mb-3">
          <label className="form-label small fw-semibold">Placeholder</label>
          <input 
            type="text" 
            className="form-control form-control-sm"
            value={question.placeholder || ''}
            onChange={(e) => updateQuestion(selectedQuestion, 'placeholder', e.target.value)}
          />
        </div>
      )}
      {isMediaType && (
        <div className="mb-3">
          <label className="form-label small fw-semibold">Accepted File Types</label>
          <input 
            type="text" 
            className="form-control form-control-sm"
            placeholder=".pdf, .doc, .jpg, .png"
            value={question.acceptedTypes || ''}
            onChange={(e) => updateQuestion(selectedQuestion, 'acceptedTypes', e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default QuestionProperties;