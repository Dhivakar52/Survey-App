import React from 'react';

const CustomPanel = ({
  isOpen,
  title,
  onClose,
  onSave,
  children,
  saveLabel = 'Save',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ zIndex: 9999, background: 'rgba(0,0,0,0.3)' }}
      onClick={onClose}
    >
      <div
        className="bg-white h-100 d-flex flex-column position-absolute end-0"
        style={{ width: '560px', maxWidth: '90vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center py-3 px-4 border-bottom">
          <h5 className="fw-semibold m-0">{title}</h5>
          <button
            onClick={onClose}
            className="btn btn-sm btn-outline-secondary rounded-circle p-0"
            style={{ width: '32px', height: '32px' }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow-1 overflow-auto p-4">{children}</div>

        {/* Footer */}
        <div className="p-3 border-top d-flex justify-content-end gap-2">
          <button onClick={onClose} className="btn btn-outline-secondary">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="btn btn-primary"
            style={{ background: '#00084D', borderColor: '#00084D' }}
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPanel;