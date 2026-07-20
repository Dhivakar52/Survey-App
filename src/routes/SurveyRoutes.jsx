import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SurveyLanding from '../pages/SurveyLanding';
import SurveyForm from '../pages/SurveyForm';
import ReviewPage from '../pages/ReviewPage';
import SuccessPage from '../pages/SuccessPage';
import AlreadySubmitted from '../pages/AlreadySubmitted';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import SurveyTable from '../components/Survey/SurveyTable';

export default function SurveyRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<SurveyTable/>} />
        <Route index element={<SurveyLanding />} />
        <Route path="survey" element={<SurveyForm />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="already-submitted" element={<AlreadySubmitted />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}