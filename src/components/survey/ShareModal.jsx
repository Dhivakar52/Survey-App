// components/survey/ShareModal.jsx

import React, { useState } from 'react';
import { X, Copy, Link, QrCode, Check } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, surveyId, title }) => {
  const [copied, setCopied] = useState(false);
  const surveyUrl = `${window.location.origin}/survey/${surveyId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = surveyUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpen = () => {
    window.open(surveyUrl, '_blank');
  };

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
        style={{ maxWidth: '480px', width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="fw-bold m-0">Share Survey</h5>
            <p className="text-muted small mb-0">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-outline-secondary rounded-circle p-0"
            style={{ width: '28px', height: '28px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Survey URL */}
        <div className="mb-3">
          <label className="form-label small fw-semibold">Survey Link</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-sm bg-light"
              value={surveyUrl}
              readOnly
            />
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleCopy}
            >
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            </button>
          </div>
          {copied && <div className="text-success small mt-1">✓ Copied to clipboard!</div>}
        </div>

        {/* Actions */}
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
            onClick={handleOpen}
            style={{ background: '#00084D', borderColor: '#00084D' }}
          >
            <Link size={16} />
            Open Survey
          </button>
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={handleCopy}
          >
            <QrCode size={16} />
            QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;