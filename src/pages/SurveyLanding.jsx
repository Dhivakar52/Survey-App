import { useNavigate } from 'react-router-dom';
import { useSurveyContext, LANGUAGES } from '../context/SurveyContext';
import { useSurvey } from '../hooks/useSurvey';
import SurveyCard from '../components/SurveyCard';
import { Spinner, SkeletonCard, ErrorState } from '../components/LoadingState';
import Logo from "../assets/srm_logo.png";
import SurveyHeader from './SurveyHeader';

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

  // Get localized text for welcome page
  const getLocalizedText = () => {
    const texts = {
      en: {
        welcome: 'Welcome',
        to: 'to',
        patientInfo: 'Patient Information',
        startButton: 'Start Survey',
      },
      ta: {
        welcome: 'வரவேற்கிறோம்',
        to: '',
        patientInfo: 'நோயாளியின் தகவல்கள்',
        startButton: 'கணக்கெடுப்பைத் தொடங்கு',
      },
      hi: {
        welcome: 'स्वागत है',
        to: '',
        patientInfo: 'रोगी की जानकारी',
        startButton: 'सर्वेक्षण शुरू करें',
      }
    };
    return texts[language] || texts.en;
  };

  const localized = getLocalizedText();

  return (
    <div>
         {/* <SurveyHeader /> */}
    
    <div style={{
      // minHeight: '100vh',
      // display: 'flex',
      // alignItems: 'center',
      // justifyContent: 'center',
      // padding: '20px',
      // background: 'linear-gradient(135deg, #f5f7fa 0%, #e9edf5 100%)',
    }}>

   
      <SurveyCard style={{
        maxWidth: '100%',
        width: '100%',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        background: '#ffffff',
      }}>
        {/* Logo */}
        <div className="text-center mb-3">
          <img 
            src={Logo} 
            alt="SRM Medical College Hospital" 
            style={{
              height: '70px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Welcome Title */}
        <div className="text-center mb-3">
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '700',
            color: '#00084D',
            marginBottom: '2px',
          }}>
            {localized.welcome} {localized.to}
          </h1>
          <h2 style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
            fontWeight: '600',
            color: '#1a1f6b',
            marginBottom: '6px',
          }}>
            {survey.title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-center mb-4" style={{
          fontSize: 'clamp(0.85rem, 1vw, 1rem)',
          color: '#666',
          lineHeight: 1.6,
          padding: '0 10px',
        }}>
          {survey.description}
        </p>

        {/* Patient Demographics Section */}
        {survey.patientDemographics && survey.patientData && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '16px 20px', 
            borderRadius: '12px',
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
              {localized.patientInfo}
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
              {/* Only show IPD Number if it exists */}
              {survey.patientDemographics.ipdNumber && survey.patientData.ipdNumber && (
                <div className="col-md-6">
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      {survey.patientDemographics.ipdNumber}:
                    </span>
                    <span style={{ 
                      fontSize: '0.9rem', 
                      color: '#00084D',
                      fontWeight: '600',
                      marginLeft: '4px'
                    }}>
                      {survey.patientData.ipdNumber}
                    </span>
                  </div>
                </div>
              )}
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
            padding: '16px',
            borderRadius: '10px',
            fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,8,77,0.3)',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#1a1f6b';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,8,77,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#00084D';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,8,77,0.3)';
          }}
        >
          {localized.startButton} →
        </button>
      </SurveyCard>
    </div>

    </div>
  );
}