import React, { useRef, useState } from 'react';
import { Check, Trash2 } from 'lucide-react';

const SignaturePad = ({ questionId, onSave, onClear }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY || 0) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
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
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (hasSignature) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(questionId, dataUrl);
    }
  };

  const clearSignaturePad = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onClear(questionId);
  };

  return (
    <div className="border rounded p-2">
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
        <button 
          className="btn btn-sm btn-success"
          onClick={saveSignature}
          disabled={!hasSignature}
        >
          <Check size={14} className="me-1" /> Save
        </button>
        <button 
          className="btn btn-sm btn-danger"
          onClick={clearSignaturePad}
        >
          <Trash2 size={14} className="me-1" /> Clear
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;