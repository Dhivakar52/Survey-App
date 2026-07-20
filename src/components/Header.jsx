import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/srm_logo.png";
import { useSurveyContext, LANGUAGES } from '../context/SurveyContext';
import { LogOut, User, ChevronDown, Settings, UserCircle, Shield, Activity, Home, ClipboardList } from 'lucide-react';

const Header = () => {
  const { language, setLanguage, t } = useSurveyContext();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  // Get user info from localStorage
  const userEmail = localStorage.getItem('userEmail') || 'admin@gmail.com';
  const userName = userEmail.split('@')[0] || 'Admin';
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
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
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo Section */}
      <div className='d-flex justify-content-center' style={{
        flex: '0 0 auto',
      }}>
        {/* <img 
          src={Logo} 
          className='' 
          alt="SRM Medical College Hospital" 
          style={{
            height: '50px',
            width: 'auto',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        /> */}
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
          fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)',
          fontWeight: '600',
          color: '#00084D',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          Surgical site infection SMS Survey
        </span>
      </div>

      {/* Right Side - Language Selector & Profile */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: '0 0 auto',
      }}>
        {/* Language Selector */}
        <select
          className="lang-select"
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

        {/* User Profile Dropdown */}
        <div className="position-relative" ref={dropdownRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px 4px 6px',
              backgroundColor: isUserMenuOpen ? '#f0f4ff' : 'transparent',
              border: '1px solid ' + (isUserMenuOpen ? '#00084D' : '#dde1e6'),
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isUserMenuOpen) {
                e.currentTarget.style.borderColor = '#00084D';
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }
            }}
            onMouseLeave={(e) => {
              if (!isUserMenuOpen) {
                e.currentTarget.style.borderColor = '#dde1e6';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {/* User Avatar */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#00084D',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: '600',
            }}>
              {displayName.charAt(0)}
            </div>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: '500',
              color: '#333',
            }}>
              {displayName}
            </span>
            <ChevronDown 
              size={16} 
              style={{
                color: '#666',
                transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border"
              style={{
                zIndex: 1050,
                width: '240px',
                top: '100%',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              }}
            >
              {/* User Info Header */}
              <div className="px-4 py-3 border-bottom" style={{ background: '#f8f9fa' }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#00084D',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                  }}>
                    {displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ color: '#00084D' }}>
                      {displayName}
                    </div>
                    <div className="small text-muted">{userEmail}</div>
                    <div className="small">
                      <span className="badge bg-success">Admin</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {/* <button
                  className="d-flex align-items-center gap-3 w-100 px-4 py-2 border-0 bg-transparent"
                  style={{
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/profile');
                  }}
                >
                  <UserCircle size={18} color="#666" />
                  <span className="small">My Profile</span>
                </button>

                <button
                  className="d-flex align-items-center gap-3 w-100 px-4 py-2 border-0 bg-transparent"
                  style={{
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/dashboard');
                  }}
                >
                  <Home size={18} color="#666" />
                  <span className="small">Dashboard</span>
                </button>

                <button
                  className="d-flex align-items-center gap-3 w-100 px-4 py-2 border-0 bg-transparent"
                  style={{
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/responses');
                  }}
                >
                  <ClipboardList size={18} color="#666" />
                  <span className="small">Survey Responses</span>
                </button>

                <button
                  className="d-flex align-items-center gap-3 w-100 px-4 py-2 border-0 bg-transparent"
                  style={{
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/settings');
                  }}
                >
                  <Settings size={18} color="#666" />
                  <span className="small">Settings</span>
                </button> */}

                {/* <hr className="my-1" /> */}

                <button
                  className="d-flex align-items-center gap-3 w-100 px-4 py-2 border-0 bg-transparent"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    color: '#dc3545',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ffebee';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#dc3545';
                  }}
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span className="small fw-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
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

        @media (max-width: 380px) {
          .app-header {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          
          .app-header img {
            height: 35px !important;
          }
          
          .brand-mark {
            justify-content: center !important;
            min-width: auto !important;
          }
          
          .brand-mark span:last-child {
            font-size: 0.65rem !important;
            white-space: normal !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Header;