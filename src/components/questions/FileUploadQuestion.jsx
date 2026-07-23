import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { formatFileSize } from '../../utils/surveyHelpers';

const FileUploadQuestion = ({ question, onChange, value, error, preview }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onChange(acceptedFiles[0]);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: !preview,
    maxSize: (question.maxSize || 5) * 1024 * 1024,
    accept: question.allowedTypes?.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
  });

  const removeFile = () => {
    onChange(null);
  };

  if (!preview) {
    return (
      <div className="text-muted small">
        <Upload size={16} className="me-1" /> File upload field
      </div>
    );
  }

  if (value) {
    return (
      <div className="d-flex align-items-center justify-content-between border rounded p-3">
        <div className="d-flex align-items-center gap-2">
          <File size={24} className="text-primary" />
          <div>
            <div className="fw-semibold">{value.name}</div>
            <div className="text-muted small">{formatFileSize(value.size)}</div>
          </div>
        </div>
        <button className="btn btn-sm btn-outline-danger" onClick={removeFile}>
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border rounded p-4 text-center ${isDragActive ? 'border-primary bg-light' : ''}`}
        style={{ cursor: 'pointer' }}
      >
        <input {...getInputProps()} />
        <Upload size={32} className="text-muted mb-2" />
        <p className="text-muted">
          {isDragActive ? 'Drop the file here...' : 'Drag & drop a file here, or click to select'}
        </p>
        <p className="text-muted small">
          Max size: {question.maxSize || 5}MB
        </p>
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
};

export default FileUploadQuestion;