import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurveyContext } from '../context/SurveyContext';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Logo from "../assets/srm_logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t, language } = useSurveyContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Admin credentials
  const ADMIN_EMAIL = 'admin@gmail.com';
  const ADMIN_PASSWORD = '123';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Store login state
      localStorage.setItem('isAuthenticated', 'true');
      if (rememberMe) {
        localStorage.setItem('userEmail', email);
      }
      navigate('/dashboard');
    } else {
      setError(
        language === 'ta' 
          ? 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல். மீண்டும் முயற்சிக்கவும்.'
          : language === 'hi'
          ? 'गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।'
          : 'Invalid email or password. Please try again.'
      );
    }
    setLoading(false);
  };

  // Get localized text
  const getLocalizedText = () => {
    const texts = {
      en: {
        title: 'Welcome Back',
        subtitle: 'Sign in to access the survey dashboard',
        emailLabel: 'Email Address',
        emailPlaceholder: 'Enter your email',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot Password?',
        signIn: 'Sign In',
        signingIn: 'Signing in...',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
        error: 'Invalid email or password',
      },
      ta: {
        title: 'மீண்டும் வரவேற்கிறோம்',
        subtitle: 'கணக்கெடுப்பு டாஷ்போர்டை அணுக உள்நுழையவும்',
        emailLabel: 'மின்னஞ்சல் முகவரி',
        emailPlaceholder: 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
        passwordLabel: 'கடவுச்சொல்',
        passwordPlaceholder: 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்',
        rememberMe: 'என்னை நினைவில் கொள்ளுங்கள்',
        forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
        signIn: 'உள்நுழைக',
        signingIn: 'உள்நுழைகிறது...',
        noAccount: 'கணக்கு இல்லையா?',
        signUp: 'பதிவு செய்க',
        error: 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்',
      },
      hi: {
        title: 'वापसी पर स्वागत है',
        subtitle: 'सर्वेक्षण डैशबोर्ड तक पहुंचने के लिए साइन इन करें',
        emailLabel: 'ईमेल पता',
        emailPlaceholder: 'अपना ईमेल दर्ज करें',
        passwordLabel: 'पासवर्ड',
        passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
        rememberMe: 'मुझे याद रखें',
        forgotPassword: 'पासवर्ड भूल गए?',
        signIn: 'साइन इन करें',
        signingIn: 'साइन इन हो रहा है...',
        noAccount: 'खाता नहीं है?',
        signUp: 'साइन अप करें',
        error: 'गलत ईमेल या पासवर्ड',
      }
    };
    return texts[language] || texts.en;
  };

  const localized = getLocalizedText();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e9edf5 100%)',
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        background: '#ffffff',
      }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <img 
            src={Logo} 
            alt="SRM Medical College Hospital" 
            style={{
              height: '60px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#00084D',
            marginBottom: '4px',
          }}>
            {localized.title}
          </h1>
          <p style={{
            fontSize: '0.9rem',
            color: '#666',
          }}>
            {localized.subtitle}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '500',
              color: '#333',
              marginBottom: '4px',
            }}>
              {localized.emailLabel}
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              padding: '0 12px',
              transition: 'all 0.3s ease',
              background: '#fafafa',
            }}>
              <Mail size={18} color="#888" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={localized.emailPlaceholder}
                required
                style={{
                  width: '100%',
                  padding: '12px 10px',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.95rem',
                  color: '#333',
                }}
                onFocus={(e) => {
                  e.target.closest('div').style.borderColor = '#00084D';
                  e.target.closest('div').style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.closest('div').style.borderColor = '#e0e0e0';
                  e.target.closest('div').style.background = '#fafafa';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '500',
              color: '#333',
              marginBottom: '4px',
            }}>
              {localized.passwordLabel}
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              padding: '0 12px',
              transition: 'all 0.3s ease',
              background: '#fafafa',
            }}>
              <Lock size={18} color="#888" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={localized.passwordPlaceholder}
                required
                style={{
                  width: '100%',
                  padding: '12px 10px',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.95rem',
                  color: '#333',
                }}
                onFocus={(e) => {
                  e.target.closest('div').style.borderColor = '#00084D';
                  e.target.closest('div').style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.closest('div').style.borderColor = '#e0e0e0';
                  e.target.closest('div').style.background = '#fafafa';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#888',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: '#666',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#00084D',
                  cursor: 'pointer',
                }}
              />
              {localized.rememberMe}
            </label>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#00084D',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={() => alert('Contact admin to reset password')}
            >
              {localized.forgotPassword}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* Demo Credentials Hint */}
          <div style={{
            background: '#f0f4ff',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.8rem',
            color: '#555',
            textAlign: 'center',
            border: '1px dashed #00084D',
          }}>
            <strong>Demo Credentials:</strong> admin@gmail.com / 123
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#00084D',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#1a1f6b';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#00084D';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  border: '2px solid #ffffff',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                {localized.signingIn}
              </>
            ) : (
              <>
                <LogIn size={18} />
                {localized.signIn}
              </>
            )}
          </button>

          {/* Sign Up Link */}
          <p style={{
            textAlign: 'center',
            marginTop: '16px',
            fontSize: '0.85rem',
            color: '#666',
          }}>
            {localized.noAccount}{' '}
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#00084D',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={() => alert('Contact admin to create an account')}
            >
              {localized.signUp}
            </button>
          </p>
        </form>

        {/* Loading Animation Styles */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}