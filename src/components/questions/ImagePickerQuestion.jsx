import React, { useState } from 'react';
import { Image, X, Check } from 'lucide-react';

const ImagePickerQuestion = ({ question, onChange, value, error, preview }) => {
  const [selectedImage, setSelectedImage] = useState(value || null);

  const images = [
    { id: 1, url: 'https://via.placeholder.com/150/00084D/FFFFFF?text=Image+1', label: 'Image 1' },
    { id: 2, url: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Image+2', label: 'Image 2' },
    { id: 3, url: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=Image+3', label: 'Image 3' },
    { id: 4, url: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=Image+4', label: 'Image 4' },
  ];

  const handleSelect = (image) => {
    const newSelection = selectedImage?.id === image.id ? null : image;
    setSelectedImage(newSelection);
    onChange(newSelection);
  };

  if (!preview) {
    return (
      <div className="text-muted small">
        <Image size={16} className="me-1" /> Image Picker field
      </div>
    );
  }

  return (
    <div>
      <div className="row g-2">
        {images.map((image) => {
          const isSelected = selectedImage?.id === image.id;
          return (
            <div key={image.id} className="col-4 col-md-3">
              <div
                className={`border rounded p-1 ${isSelected ? 'border-primary shadow' : ''}`}
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={() => handleSelect(image)}
              >
                <img
                  src={image.url}
                  alt={image.label}
                  className="img-fluid rounded"
                  style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                />
                <div className="text-center small mt-1">{image.label}</div>
                {isSelected && (
                  <div
                    className="position-absolute top-0 end-0 bg-primary text-white rounded-circle p-1"
                    style={{ transform: 'translate(25%, -25%)' }}
                  >
                    <Check size={12} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
};

export default ImagePickerQuestion;