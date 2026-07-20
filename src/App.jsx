import { BrowserRouter } from 'react-router-dom';
import { SurveyProvider } from './context/SurveyContext';
import SurveyRoutes from './routes/SurveyRoutes';
import ToastStack from './components/ToastStack';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {


  return (
    <SurveyProvider>
      <BrowserRouter>
        <ToastStack />
        <div className="app-shell">
         
          <SurveyRoutes />
        </div>
      </BrowserRouter>
    </SurveyProvider>
  );
}