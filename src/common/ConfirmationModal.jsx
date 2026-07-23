// components/common/ConfirmationModal.jsx

import React from 'react';
import { X } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ 
        zIndex: 9999, 
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 p-4"
        style={{ maxWidth: '420px', width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="fw-bold m-0">{title}</h5>
          <button
            onClick={onClose}
            className="btn btn-sm btn-outline-secondary rounded-circle p-0"
            style={{ width: '28px', height: '28px' }}
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-muted">{message}</p>

        <div className="d-flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="btn btn-outline-secondary flex-grow-1"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${variant === 'danger' ? 'btn-danger' : variant === 'warning' ? 'btn-warning' : 'btn-primary'} text-white flex-grow-1`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;