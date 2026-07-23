import React, { useState, useCallback, useEffect } from 'react';
import { useSurveyContext } from '../../context/SurveyContext';
import { useTheme } from '../../context/ThemeContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useAutoSave } from '../../hooks/useAutoSave';
import Header from '../Header';
import Toolbox from './Toolbox';
import PropertyPanel from './PropertyPanel';
import QuestionRenderer from '../questions/QuestionRenderer';
import Preview from './Preview';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Grid,
  List,
  Settings,
  Eye,
  Edit
} from 'lucide-react';

const SurveyBuilder = () => {
  const { 
    survey, 
    togglePreview, 
    isPreviewMode,
    addPage,
    deletePage,
    updatePage,
    pushToast,
    t,
    state,
  } = useSurveyContext();
  
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [propertyPanelOpen, setPropertyPanelOpen] = useState(true);
  const [viewMode, setViewMode] = useState('desktop');

  // Auto-save
  useAutoSave(survey, 3000);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'Ctrl+S': () => handleSave(),
    'Ctrl+P': () => togglePreview(),
    'Escape': () => setSidebarOpen(false),
  });

  const handleSave = useCallback(() => {
    pushToast(t?.survey?.saved || 'Draft saved successfully!', 'success');
    console.log('Saving draft...', survey);
  }, [survey, pushToast, t]);

  const handlePublish = useCallback(() => {
    pushToast(t?.survey?.published || 'Survey published successfully!', 'success');
    console.log('Publishing survey...', survey);
  }, [survey, pushToast, t]);

  const handleExport = useCallback(() => {
    const json = JSON.stringify(survey, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${survey.title || 'survey'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast(t?.survey?.exported || 'Survey exported successfully!', 'success');
  }, [survey, pushToast, t]);

  const handleImport = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.pages) {
          // importSurvey(data);
          pushToast(t?.survey?.imported || 'Survey imported successfully!', 'success');
        }
      } catch (error) {
        pushToast(t?.errors?.invalidJSON || 'Invalid JSON file', 'danger');
        console.error('Invalid JSON:', error);
      }
    };
    reader.readAsText(file);
  }, [pushToast, t]);

  return (
    <div className="survey-builder">
      <Header 
        onSave={handleSave}
        onPublish={handlePublish}
        onExport={handleExport}
        onImport={handleImport}
        onTogglePreview={togglePreview}
        onToggleTheme={toggleTheme}
        title={survey.title}
        isPreview={isPreviewMode}
        t={t}
      />

      <div className="builder-content d-flex">
        {/* Sidebar Toggle */}
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Toolbox */}
        {!isPreviewMode && sidebarOpen && (
          <div className="toolbox-wrapper">
            <Toolbox />
          </div>
        )}

        {/* Main Area */}
        <div className="main-area flex-grow-1">
          {isPreviewMode ? (
            <Preview survey={survey} theme={theme} />
          ) : (
            <div className="question-list">
              {survey.pages.map((page, pageIndex) => (
                <div key={page.id} className="page-container">
                  <div className="page-header">
                    <input
                      type="text"
                      className="page-title-input"
                      value={page.title}
                      onChange={(e) => updatePage(page.id, { title: e.target.value })}
                    />
                    <span className="badge bg-secondary">
                      {page.questions.length} {t?.survey?.questions || 'questions'}
                    </span>
                  </div>
                  {page.questions.length === 0 ? (
                    <div className="empty-state text-center py-5">
                      <p className="text-muted">{t?.survey?.noQuestions || 'No questions yet'}</p>
                      <p className="text-muted small">
                        {t?.survey?.dragToAdd || 'Drag a question type from the toolbox or click to add'}
                      </p>
                    </div>
                  ) : (
                    <QuestionRenderer
                      questions={page.questions}
                      pageId={page.id}
                      viewMode={viewMode}
                    />
                  )}
                </div>
              ))}
              
              {/* Add Page Button */}
              <button
                className="btn btn-outline-primary w-100 py-3"
                onClick={addPage}
              >
                + Add Page
              </button>
            </div>
          )}
        </div>

        {/* Property Panel */}
        {!isPreviewMode && propertyPanelOpen && (
          <div className="property-panel-wrapper">
            <PropertyPanel />
          </div>
        )}
      </div>

      {/* View Controls */}
      <div className="view-controls">
        <button
          className={`btn btn-sm ${viewMode === 'desktop' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setViewMode('desktop')}
          title="Desktop View"
        >
          <Maximize2 size={16} />
        </button>
        <button
          className={`btn btn-sm ${viewMode === 'tablet' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setViewMode('tablet')}
          title="Tablet View"
        >
          <Grid size={16} />
        </button>
        <button
          className={`btn btn-sm ${viewMode === 'mobile' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setViewMode('mobile')}
          title="Mobile View"
        >
          <List size={16} />
        </button>
      </div>

      <style>{`
        .survey-builder {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f5f7fa;
        }

        .builder-content {
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .sidebar-toggle {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 0 4px 4px 0;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sidebar-toggle:hover {
          background: #f8f9fa;
          border-color: #00084D;
        }

        .toolbox-wrapper {
          width: 260px;
          min-width: 260px;
          border-right: 1px solid #dee2e6;
          background: white;
          overflow-y: auto;
          padding: 16px;
        }

        .main-area {
          padding: 20px;
          overflow-y: auto;
          background: #f5f7fa;
        }

        .question-list {
          max-width: 900px;
          margin: 0 auto;
        }

        .page-container {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
        }

        .page-title-input {
          border: none;
          font-size: 1.1rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          background: transparent;
          flex: 1;
        }

        .page-title-input:focus {
          outline: none;
          background: #f8f9fa;
        }

        .property-panel-wrapper {
          width: 340px;
          min-width: 340px;
          border-left: 1px solid #dee2e6;
          background: white;
          overflow-y: auto;
          padding: 16px;
        }

        .empty-state {
          color: #6c757d;
        }

        .view-controls {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          gap: 8px;
          background: white;
          padding: 8px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          z-index: 1000;
        }

        .view-controls .btn {
          padding: 6px 10px;
        }

        @media (max-width: 768px) {
          .toolbox-wrapper {
            width: 200px;
            min-width: 200px;
          }

          .property-panel-wrapper {
            width: 280px;
            min-width: 280px;
          }
        }
      `}</style>
    </div>
  );
};

export default SurveyBuilder;