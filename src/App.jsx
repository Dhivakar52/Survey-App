import { BrowserRouter } from 'react-router-dom';
import { SurveyProvider } from './context/SurveyContext';
import SurveyRoutes from './routes/SurveyRoutes';
import ToastStack from './components/ToastStack';




export default function App() {
  return (
    <SurveyProvider>
      <BrowserRouter>
        <ToastStack />
        <div className="app-shell">
          <div className="app-header">
            
            <div className="brand-mark">
              <span className="dot" aria-hidden="true" />
              Patient Survey
            </div>
          </div>
          <SurveyRoutes />
        </div>
      </BrowserRouter>
    </SurveyProvider>
  );
}
