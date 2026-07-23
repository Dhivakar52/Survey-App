import React, { useState } from 'react';
import { useSurveyContext } from '../../context/SurveyContext';
import { getAllQuestionTypes, getQuestionCategories } from '../../constants/questionTypes';
import { Search, Plus, Star, ChevronRight } from 'lucide-react';

const Toolbox = () => {
  const { addQuestion, state } = useSurveyContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);

  const allQuestions = getAllQuestionTypes();
  const categories = ['All', ...getQuestionCategories()];

  const getFilteredQuestions = () => {
    return allQuestions.filter((q) => {
      const matchesSearch = q.label.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || q.category === activeCategory;
      const isFavorite = favorites.includes(q.type);
      return matchesSearch && matchesCategory;
    });
  };

  const handleAddQuestion = (type) => {
    const currentPage = state.survey.pages.find(p => p.id === state.selectedPageId) || state.survey.pages[0];
    addQuestion(currentPage.id, type);
  };

  const toggleFavorite = (type) => {
    setFavorites(prev =>
      prev.includes(type) ? prev.filter(f => f !== type) : [...prev, type]
    );
  };

  const getIcon = (iconName) => {
    // Simple icon mapping - in production use proper icon components
    return <span className="question-icon">{iconName.charAt(0)}</span>;
  };

  return (
    <div className="toolbox">
      <div className="toolbox-header">
        <h6 className="fw-bold">Toolbox</h6>
      </div>

      <div className="toolbox-search">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control form-control-sm"
        />
      </div>

      <div className="toolbox-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="toolbox-items">
        {favorites.length > 0 && (
          <div className="favorites-section">
            <small className="text-muted">⭐ Favorites</small>
            {getFilteredQuestions()
              .filter(item => favorites.includes(item.type))
              .map((item) => (
                <ToolboxItem
                  key={item.type}
                  item={item}
                  onAdd={handleAddQuestion}
                  onFavorite={toggleFavorite}
                  isFavorite={true}
                />
              ))}
          </div>
        )}

        <div className="questions-section">
          {getFilteredQuestions().map((item) => (
            <ToolboxItem
              key={item.type}
              item={item}
              onAdd={handleAddQuestion}
              onFavorite={toggleFavorite}
              isFavorite={favorites.includes(item.type)}
            />
          ))}
        </div>
      </div>

      <style>{`
        .toolbox {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .toolbox-header {
          padding-bottom: 12px;
          border-bottom: 1px solid #dee2e6;
          margin-bottom: 12px;
        }

        .toolbox-search {
          position: relative;
          margin-bottom: 12px;
        }

        .toolbox-search .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }

        .toolbox-search input {
          padding-left: 32px;
        }

        .toolbox-categories {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .category-btn {
          padding: 4px 12px;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          background: white;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-btn:hover {
          background: #f8f9fa;
        }

        .category-btn.active {
          background: #00084D;
          color: white;
          border-color: #00084D;
        }

        .toolbox-items {
          flex: 1;
          overflow-y: auto;
        }

        .toolbox-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 2px;
        }

        .toolbox-item:hover {
          background: #f8f9fa;
        }

        .toolbox-item .item-info {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .toolbox-item .question-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f4ff;
          border-radius: 4px;
          color: #00084D;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .toolbox-item .item-label {
          font-size: 0.85rem;
        }

        .toolbox-item .item-actions {
          display: flex;
          gap: 4px;
        }

        .toolbox-item .item-actions button {
          background: none;
          border: none;
          padding: 2px 4px;
          cursor: pointer;
          color: #6c757d;
          border-radius: 4px;
        }

        .toolbox-item .item-actions button:hover {
          background: #e9ecef;
          color: #00084D;
        }

        .favorites-section {
          margin-bottom: 16px;
        }

        .favorites-section small {
          display: block;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

const ToolboxItem = ({ item, onAdd, onFavorite, isFavorite }) => {
  return (
    <div className="toolbox-item">
      <div className="item-info" onClick={() => onAdd(item.type)}>
        <span className="question-icon">{item.icon.charAt(0)}</span>
        <span className="item-label">{item.label}</span>
      </div>
      <div className="item-actions">
        <button onClick={() => onFavorite(item.type)} title="Toggle favorite">
          <Star size={14} fill={isFavorite ? '#FBBF24' : 'none'} color={isFavorite ? '#FBBF24' : '#6c757d'} />
        </button>
        <button onClick={() => onAdd(item.type)} title="Add question">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toolbox;