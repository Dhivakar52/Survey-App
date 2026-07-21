import React from 'react';
import { Download } from 'lucide-react';

const ExportButton = ({ data, onExport }) => {
  const handleExport = () => {
    if (onExport) {
      onExport(data);
    } else {
      console.log('Export data:', data);
    }
  };

  return (
    <button
      className="btn btn-primary btn-sm d-flex align-items-center gap-1"
      style={{ 
        background: '#00084D', 
        borderColor: '#00084D',
        fontSize: 'clamp(0.7rem, 0.9vw, 0.85rem)',
        padding: '4px 10px',
      }}
      onClick={handleExport}
    >
      <Download size={14} />
      <span className="d-none d-sm-inline">Export</span>
    </button>
  );
};

export default ExportButton;