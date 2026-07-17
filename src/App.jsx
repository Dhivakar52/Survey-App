import { BrowserRouter } from 'react-router-dom';
import { SurveyProvider } from './context/SurveyContext';
import SurveyRoutes from './routes/SurveyRoutes';
import ToastStack from './components/ToastStack';
import SurveyHeader from "./pages/SurveyHeader";




export default function App() {
  return (
    <SurveyProvider>
      <BrowserRouter>
        <ToastStack />
      
        <div className="app-shell">
          
            <SurveyHeader/>
          <SurveyRoutes />
        </div>
      </BrowserRouter>
    </SurveyProvider>
  );
}
