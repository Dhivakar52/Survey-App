import { Routes, Route } from 'react-router-dom';
import SurveyLanding from '../pages/SurveyLanding';
import SurveyForm from '../pages/SurveyForm';
import ReviewPage from '../pages/ReviewPage';
import SuccessPage from '../pages/SuccessPage';
import AlreadySubmitted from '../pages/AlreadySubmitted';

export default function SurveyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SurveyLanding />} />
      <Route path="/survey" element={<SurveyForm />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/already-submitted" element={<AlreadySubmitted />} />
    </Routes>
  );
}
