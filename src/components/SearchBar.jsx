import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="d-flex align-items-center bg-light rounded px-2 py-1 border border-light">
      <Search size={14} className="text-muted me-1" />
      <input
        type="text"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="border-0 bg-transparent px-1 px-sm-2 py-1 small"
        style={{ 
          width: 'clamp(80px, 15vw, 150px)', 
          outline: 'none',
          fontSize: 'clamp(0.7rem, 0.9vw, 0.85rem)',
        }}
      />
    </div>
  );
};

export default SearchBar;