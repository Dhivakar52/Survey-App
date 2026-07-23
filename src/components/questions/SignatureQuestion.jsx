import React, { useRef, useState } from 'react';
import { PenTool, Trash2, Check } from 'lucide-react';

const SignatureQuestion = ({ question, onChange, value, error, preview }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e) => {
    if (!preview) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY || 0) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !preview) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY || 0) - rect.top;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (hasSignature && preview) {
      const canvas = canvasRef.current;
      onChange(canvas.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onChange(null);
  };

  if (!preview) {
    return (
      <div className="text-muted small">
        <PenTool size={16} className="me-1" /> Signature field
      </div>
    );
  }

  if (value) {
    return (
      <div>
        <img src={value} alt="Signature" className="img-fluid border rounded p-2" style={{ maxHeight: '100px' }} />
        <button className="btn btn-sm btn-outline-danger mt-2" onClick={clearSignature}>
          <Trash2 size={14} className="me-1" /> Clear Signature
        </button>
      </div>
    );
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        className="border rounded w-100"
        style={{ touchAction: 'none', cursor: 'crosshair' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <div className="d-flex gap-2 mt-2">
        <button className="btn btn-sm btn-outline-secondary" onClick={clearSignature}>
          <Trash2 size={14} className="me-1" /> Clear
        </button>
        <span className="text-muted small align-self-center">
          Draw your signature above
        </span>
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
};

export default SignatureQuestion;