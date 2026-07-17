import React from "react";
import Logo from "../assets/srm_logo.png";
import { useSurveyContext, LANGUAGES } from '../context/SurveyContext';

const SurveyHeader = () => {
  const { language, setLanguage, t } = useSurveyContext();

  return (
    <>
      <div className="app-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '12px 20px',
        background: '#ffffff',
        borderBottom: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        // position: 'sticky',
        top: 0,
        zIndex: 100,
        borderRadius: '9px', 
      }}>
        {/* Logo Section */}
        <div className='d-flex justify-content-center' style={{
          flex: '0 0 auto',
        }}>
          <img 
            src={Logo} 
            className='' 
            alt="SRM Medical College Hospital" 
            style={{
              height: '50px',
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Brand Section */}
        <div className="brand-mark" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: '1 1 auto',
          minWidth: '150px',
        }}>
          <span className="dot" aria-hidden="true" style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00084D',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#00084D',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            Surgical site infection SMS Survey
          </span>
        </div>

        {/* Language Selector */}
        <div style={{
          flex: '0 0 auto',
        }}>
          <select
            className="lang-select mt-1"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label={t.landing?.languageLabel || 'Select language'}
            style={{
              padding: '6px 12px',
              fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
              fontWeight: '500',
              color: '#00084D',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dde1e6',
              borderRadius: '6px',
              cursor: 'pointer',
              minWidth: '80px',
              transition: 'all 0.2s ease',
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        /* Tablet and Mobile Responsive */
        @media (max-width: 768px) {
          .app-header {
            padding: 10px 15px !important;
            gap: 8px !important;
          }
          
          .app-header img {
            height: 40px !important;
          }
          
          .brand-mark span:last-child {
            font-size: 0.7rem !important;
            white-space: normal !important;
            word-break: break-word;
          }
          
          .brand-mark {
            min-width: 100px !important;
            flex: 1 1 auto !important;
          }
          
          .lang-select {
            padding: 4px 10px !important;
            font-size: 0.7rem !important;
            min-width: 70px !important;
          }
        }

        @media (max-width: 480px) {
          .app-header {
            padding: 8px 10px !important;
            gap: 6px !important;
          }
          
          .app-header img {
            height: 32px !important;
          }
          
          .brand-mark span:last-child {
            font-size: 0.6rem !important;
          }
          
          .brand-mark .dot {
            width: 6px !important;
            height: 6px !important;
          }
          
          .lang-select {
            padding: 3px 8px !important;
            font-size: 0.6rem !important;
            min-width: 60px !important;
          }
        }

        /* Small Mobile */
       
      `}</style>
    </>
  );
};

export default SurveyHeader;