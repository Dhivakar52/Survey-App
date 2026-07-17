import { useNavigate } from 'react-router-dom';
import { useSurveyContext, LANGUAGES } from '../context/SurveyContext';
import { useSurvey } from '../hooks/useSurvey';
import SurveyCard from '../components/SurveyCard';
import { Spinner, SkeletonCard, ErrorState } from '../components/LoadingState';
import Logo  from "../assets/srm_logo.jpg";

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
            <div className='d-flex justify-content-center'>
               <img src={Logo} className='' alt="" />
            </div>
            
            {/* <div>
              <h5
      className="fw-bold mb-2"
      style={{ color: "#00084D", lineHeight: "1.5" }}
    >
      Greetings from
      <br />
      SRM Medical College Hospital & Research Centre
    </h5>

  
         </div> */}
           


      {/* <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
        {t.landing.surveyTitleLabel}
      </div> */}
      <h1 className="display mt-2 mb-3" style={{ fontSize: '20px', fontWeight: 700 }}>
        {survey.title}
      </h1>

      {/* <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
        {t.landing.descriptionLabel}
      </div> */}
      <p className="mb-4" style={{ color: 'var(--ink)', lineHeight: 1.6 }}>
        {survey.description}
      </p>

      <div className="d-flex flex-wrap gap-4 mb-4">
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            {t.landing.timeLabel}
          </div>
          <div className="mono" style={{ fontWeight: 600, color: 'var(--primary-deep)' }}>
            {t.landing.timeValue}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            {t.landing.languageLabel}
          </div>
          <select
            className="lang-select mt-1"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label={t.landing.languageLabel}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="btn-survey btn-survey-accent w-100"
        onClick={() => navigate('/survey')}
      >
        {t.landing.startButton} →
      </button>
    </SurveyCard>
  );
}
