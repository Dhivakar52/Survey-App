import React from 'react';
import { QUESTION_TYPES } from '../../constants/questionTypes';
import TextQuestion from '../builder/TextQuestion';
import DropdownQuestion from './DropdownQuestion';
import RadioQuestion from './RadioQuestion';
import CheckboxQuestion from './CheckboxQuestion';
import RatingQuestion from './RatingQuestion';
import MatrixQuestion from './MatrixQuestion';
import FileUploadQuestion from './FileUploadQuestion';
import ImagePickerQuestion from './ImagePickerQuestion';
import SignatureQuestion from './SignatureQuestion';
import SliderQuestion from './SliderQuestion';
import RankingQuestion from './RankingQuestion';

const QuestionFactory = ({ question, onChange, value, error, preview = false }) => {
  const commonProps = {
    question,
    onChange,
    value,
    error,
    preview,
  };

  switch (question.type) {
    case QUESTION_TYPES.TEXT:
    case QUESTION_TYPES.EMAIL:
    case QUESTION_TYPES.PASSWORD:
    case QUESTION_TYPES.PHONE:
    case QUESTION_TYPES.NUMBER:
    case QUESTION_TYPES.COMMENT:
    case QUESTION_TYPES.DATE:
    case QUESTION_TYPES.TIME:
    case QUESTION_TYPES.DATETIME:
      return <TextQuestion {...commonProps} />;
    
    case QUESTION_TYPES.DROPDOWN:
      return <DropdownQuestion {...commonProps} />;
    
    case QUESTION_TYPES.RADIO:
      return <RadioQuestion {...commonProps} />;
    
    case QUESTION_TYPES.CHECKBOX:
      return <CheckboxQuestion {...commonProps} />;
    
    case QUESTION_TYPES.RATING:
      return <RatingQuestion {...commonProps} />;
    
    case QUESTION_TYPES.RANKING:
      return <RankingQuestion {...commonProps} />;
    
    case QUESTION_TYPES.MATRIX:
    case QUESTION_TYPES.MATRIX_DROPDOWN:
    case QUESTION_TYPES.MATRIX_DYNAMIC:
      return <MatrixQuestion {...commonProps} />;
    
    case QUESTION_TYPES.FILE_UPLOAD:
      return <FileUploadQuestion {...commonProps} />;
    
    case QUESTION_TYPES.IMAGE_PICKER:
      return <ImagePickerQuestion {...commonProps} />;
    
    case QUESTION_TYPES.SIGNATURE:
      return <SignatureQuestion {...commonProps} />;
    
    case QUESTION_TYPES.SLIDER:
      return <SliderQuestion {...commonProps} />;
    
    case QUESTION_TYPES.BOOLEAN:
      return (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            disabled={!preview}
          />
          <label className="form-check-label">
            {value ? 'Yes' : 'No'}
          </label>
        </div>
      );
    
    case QUESTION_TYPES.PANEL:
      return (
        <div className="border rounded p-3 bg-light">
          <h6>{question.title}</h6>
          <p className="text-muted">{question.description || 'Panel content goes here'}</p>
        </div>
      );
    
    case QUESTION_TYPES.DYNAMIC_PANEL:
      return (
        <div className="border rounded p-3">
          <div className="d-flex justify-content-between align-items-center">
            <span>Dynamic Panel</span>
            <button className="btn btn-sm btn-outline-primary">+ Add Item</button>
          </div>
        </div>
      );
    
    case QUESTION_TYPES.HTML:
      return (
        <div className="border rounded p-3">
          <div dangerouslySetInnerHTML={{ __html: question.html || '<p>Enter your HTML content here</p>' }} />
        </div>
      );
    
    case QUESTION_TYPES.EXPRESSION:
      return (
        <div className="border rounded p-3">
          <p className="text-muted">Expression: <code>{question.expression || 'sum(answers) / count(answers)'}</code></p>
          <p className="text-muted small">Calculated value: 42</p>
        </div>
      );
    
    case QUESTION_TYPES.IMAGE:
      return (
        <div className="text-center">
          <img 
            src={question.url || 'https://via.placeholder.com/300x200'} 
            alt={question.alt || 'Image'}
            className="img-fluid rounded"
            style={{ maxHeight: '200px' }}
          />
        </div>
      );
    
    case QUESTION_TYPES.RICH_TEXT:
      return (
        <div className="border rounded p-3">
          <div dangerouslySetInnerHTML={{ __html: question.content || '<p>Rich text content</p>' }} />
        </div>
      );
    
    case QUESTION_TYPES.MULTIPLE_TEXT:
      return (
        <div>
          {(question.fields || ['Field 1', 'Field 2']).map((field, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder={field}
                value={value?.[index] || ''}
                onChange={(e) => {
                  const newValues = [...(value || [])];
                  newValues[index] = e.target.value;
                  onChange(newValues);
                }}
                disabled={!preview}
              />
            </div>
          ))}
        </div>
      );
    
    default:
      return <div className="text-muted">Unsupported question type: {question.type}</div>;
  }
};

export default QuestionFactory;