// routes/SurveyRoutes.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SurveyLanding from '../pages/SurveyLanding';
import SurveyForm from '../pages/SurveyForm';
import ReviewPage from '../pages/ReviewPage';
import SuccessPage from '../pages/SuccessPage';
import AlreadySubmitted from '../pages/AlreadySubmitted';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import SurveyTable from '../components/SurveyTable/SurveyTable';
import CreateSurvey from '../components/AddSurvey/CreateSurvey';
import Dashboard from '../pages/Dashboard';
import SurveyViewer from '../pages/SurveyViewer';
import Responses from '../pages/Responses';
import Analytics from '../pages/Analytics';

export default function SurveyRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        {/* Dashboard */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Survey Builder */}
        <Route path="/create" element={<CreateSurvey />} />
        <Route path="/create-survey" element={<CreateSurvey />} />
        <Route path="/edit-survey" element={<CreateSurvey />} />
        <Route path="/edit-survey/:id" element={<CreateSurvey />} />
        
        {/* Survey Viewer (Public) */}
        <Route path="survey/:id" element={<SurveyViewer />} />
        
        {/* Preview (Internal) */}
        <Route path="preview/:id" element={<SurveyViewer />} />
        
        {/* Responses */}
        <Route path="responses/:surveyId" element={<Responses />} />
        
        {/* Analytics */}
        <Route path="analytics/:surveyId" element={<Analytics />} />
        
        {/* Legacy Routes */}
        <Route path="survey" element={<SurveyForm />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="already-submitted" element={<AlreadySubmitted />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}