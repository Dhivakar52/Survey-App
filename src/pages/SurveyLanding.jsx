import { useNavigate } from 'react-router-dom';
import { useSurveyContext, LANGUAGES } from '../context/SurveyContext';
import { useSurvey } from '../hooks/useSurvey';
import SurveyCard from '../components/SurveyCard';
import { Spinner, SkeletonCard, ErrorState } from '../components/LoadingState';

export default function SurveyLanding() {
  const { language, setLanguage, t } = useSurveyContext();
  const { survey, status, reload } = useSurvey();
  const navigate = useNavigate();

  if (status === 'loading') return <SkeletonCard />;
  if (status === 'error') {
    return <ErrorState message={t.errors.loadFailed} onRetry={reload} retryLabel={t.errors.retry} />;
  }

  if (survey?.submitted) {
    navigate('/already-submitted', { replace: true });
    return <Spinner />;
  }

  return (
    <SurveyCard>
      {/* Title */}
      <h1 className="display mt-2 mb-3" style={{ fontSize: '20px', fontWeight: 700 }}>
        {survey.title}
      </h1>

      {/* Description */}
      <p className="mb-4" style={{ color: 'var(--ink)', lineHeight: 1.6 }}>
        {survey.description}
      </p>

      {/* Patient Demographics Section */}
      {survey.patientDemographics && survey.patientData && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '16px 20px', 
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            fontSize: '0.8rem', 
            fontWeight: '600',
            color: '#00084D',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {language === 'ta' 
              ? 'நோயாளியின் விவரங்கள்'
              : language === 'hi'
              ? 'रोगी का विवरण'
              : 'Patient Details'
            }
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div style={{ marginBottom: '8px' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#666',
                  fontWeight: '500'
                }}>
                  {survey.patientDemographics.name}:
                </span>
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: '#00084D',
                  fontWeight: '600',
                  marginLeft: '4px'
                }}>
                  {survey.patientData.name}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div style={{ marginBottom: '8px' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#666',
                  fontWeight: '500'
                }}>
                  {survey.patientDemographics.ageGender}:
                </span>
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: '#00084D',
                  fontWeight: '600',
                  marginLeft: '4px'
                }}>
                  {survey.patientData.ageGender}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div style={{ marginBottom: '8px' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#666',
                  fontWeight: '500'
                }}>
                  {survey.patientDemographics.dischargeDate}:
                </span>
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: '#00084D',
                  fontWeight: '600',
                  marginLeft: '4px'
                }}>
                  {survey.patientData.dischargeDate}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div style={{ marginBottom: '8px' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#666',
                  fontWeight: '500'
                }}>
                  {survey.patientDemographics.surgeonName}:
                </span>
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: '#00084D',
                  fontWeight: '600',
                  marginLeft: '4px'
                }}>
                  {survey.patientData.surgeonName}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Button */}
      <button
        className="btn-survey btn-survey-accent w-100"
        onClick={() => navigate('/survey')}
        style={{
          backgroundColor: '#00084D',
          color: 'white',
          border: 'none',
          padding: '14px',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#1a1f6b'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#00084D'}
      >
        {t.landing.startButton} →
      </button>
    </SurveyCard>
  );
}