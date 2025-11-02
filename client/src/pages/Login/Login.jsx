import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import KeyImg from '../../images/key.png';
import EmailImg from '../../images/Email.png';
import LoginImg from '../../images/Login.png';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', studentNumber: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'checkEmail'

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotTouched, setForgotTouched] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLastSubmit, setForgotLastSubmit] = useState(() => {
    try { const v = localStorage.getItem('forgotLastSubmit'); return v ? parseInt(v, 10) : null; } catch { return null; }
  });
  const [forgotRateRemaining, setForgotRateRemaining] = useState(0);
  const forgotCountdownRef = useRef(null);
  const forgotEmailRef = useRef(null);
  const [loginError, setLoginError] = useState('');
  const [loginVisible, setLoginVisible] = useState(false);
  const loginAutoHideRef = useRef(null);
  const loginClearRef = useRef(null);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (e) => {
    // If an error is currently visible, start fade-out instead of removing immediately
    if (loginAutoHideRef.current) { clearTimeout(loginAutoHideRef.current); loginAutoHideRef.current = null; }
    if (loginClearRef.current) { clearTimeout(loginClearRef.current); loginClearRef.current = null; }
    if (loginError) {
      // start fade-out
      setLoginVisible(false);
      // clear the error text after the CSS transition completes (~300ms + small buffer)
      loginClearRef.current = setTimeout(() => {
        setLoginError('');
        loginClearRef.current = null;
      }, 335);
    }
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const togglePasswordVisibility = () => setShowPassword(v => !v);

  const handleSubmit = (e) => {
    e.preventDefault();
    // demo credential checks (kept as-is)
    const demoAccounts = [
      { role: 'viewer', email: 'jayson@pupsmb.edu.ph', studentNumber: '2022-00098-SM-0', password: 'demo123', name: 'Jayson', organization: 'Sample Organization', path: '/viewer' },
      { role: 'admin', email: 'admin@pupsmb.edu.ph', studentNumber: 'ADM-2025-001', password: 'admin123', name: 'Administrator', organization: 'TransparaTech System', path: '/admin' },
      { role: 'superadmin', email: 'superadmin@transparatech.ph', studentNumber: 'SADM-2025-001', password: 'superadmin123', name: 'Super Administrator', organization: 'TransparaTech System Administration', path: '/superadmin' },
      { role: 'officer', email: 'officer@pupsmb.edu.ph', studentNumber: 'OFF-2025-001', password: 'officer123', name: 'Juan Dela Cruz', organization: 'Student Council', path: '/officers' }
    ];

    const match = demoAccounts.find(acc => acc.email === formData.email && acc.studentNumber === formData.studentNumber && acc.password === formData.password);
    if (match) {
      localStorage.setItem('userSession', JSON.stringify({ name: match.name, email: match.email, studentNumber: match.studentNumber, role: match.role, organization: match.organization }));
      navigate(match.path);
      return;
    }
    // Show inline error notification instead of browser alert
    setLoginError('Incorrect Student Number or Password.');
    setLoginVisible(true);
    // auto-hide after 3s, then clear the message shortly after to allow fade-out
    if (loginAutoHideRef.current) clearTimeout(loginAutoHideRef.current);
    if (loginClearRef.current) clearTimeout(loginClearRef.current);
    loginAutoHideRef.current = setTimeout(() => {
      setLoginVisible(false);
      loginAutoHideRef.current = null;
    }, 3000);
    // remove the text after fade completes (300ms) following hide
    loginClearRef.current = setTimeout(() => {
      setLoginError('');
      loginClearRef.current = null;
    }, 3350);
    // Keep demo credentials available in console for debugging
    console.info('Demo credentials:', demoAccounts);
  };

  useEffect(() => {
    return () => {
      if (loginAutoHideRef.current) clearTimeout(loginAutoHideRef.current);
      if (loginClearRef.current) clearTimeout(loginClearRef.current);
      if (forgotCountdownRef.current) clearInterval(forgotCountdownRef.current);
    };
  }, []);

  const handleForgotChange = (e) => {
    setForgotEmail(e.target.value);
    if (forgotTouched) setForgotError(emailPattern.test(e.target.value) ? '' : 'Please enter a valid email address.');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotTouched(true);
    if (!forgotEmail || !emailPattern.test(forgotEmail)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    const now = Date.now();
    const last = forgotLastSubmit || 0;
    const diff = Math.max(0, Math.floor((now - last) / 1000));
    if (last && diff < 60) {
      // rate limited
      const remaining = 60 - diff;
      setForgotRateRemaining(remaining);
      setForgotError(`Please wait ${remaining}s before requesting another reset link.`);
      // start countdown timer
      if (forgotCountdownRef.current) clearInterval(forgotCountdownRef.current);
      forgotCountdownRef.current = setInterval(() => {
        setForgotRateRemaining(r => {
          if (r <= 1) {
            clearInterval(forgotCountdownRef.current);
            forgotCountdownRef.current = null;
            setForgotError('');
            return 0;
          }
          setForgotError(`Please wait ${r - 1}s before requesting another reset link.`);
          return r - 1;
        });
      }, 1000);
      return;
    }

    // allowed: simulate send, show masked email + expiration + spam reminder
    setForgotError('');
    const maskEmail = (email) => {
      const [local, domain] = email.split('@');
      const shown = local.slice(0, 2) || local[0] || '';
      return `${shown}****@${domain}`;
    };
  const masked = maskEmail(forgotEmail);
  setForgotSuccess(masked);

    // store last submit and start 60s rate limit
    try { localStorage.setItem('forgotLastSubmit', String(now)); } catch {}
    setForgotLastSubmit(now);
    setForgotRateRemaining(60);
    if (forgotCountdownRef.current) clearInterval(forgotCountdownRef.current);
    forgotCountdownRef.current = setInterval(() => {
      setForgotRateRemaining(r => {
        if (r <= 1) {
          clearInterval(forgotCountdownRef.current);
          forgotCountdownRef.current = null;
          return 0;
        }
        return r - 1;
      });
    }, 1000);

  // blur the input to remove focus and then show the confirmation screen
  try { if (forgotEmailRef.current && typeof forgotEmailRef.current.blur === 'function') forgotEmailRef.current.blur(); else if (document && document.activeElement) document.activeElement.blur(); } catch {}
  // show the confirmation screen (hide the forgot-password form)
  setView('checkEmail');

    // note: reset link expiration is 15 minutes (display only)
  };

  const getRoleTitle = () => 'User Login';
  const getSignupLink = () => '/signup';

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__card">
        { /* Close button positioned inside the shared card (top-right) */ }
        {view === 'login' && (
          <button
            type="button"
            aria-label="Close login"
            onClick={() => navigate('/')}
            className="login__close-btn"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        {view === 'forgot' ? (
          <form className="login__form" onSubmit={handleForgotSubmit} style={{ position: 'relative' }}>
            <header className="login__header">
              <img src={KeyImg} alt="Forgot Password" className="login__top-image" aria-hidden="true" />
              <h2 className="login__title">Forgot Password?</h2>
              <p className="login__subtitle">Enter your email address and we'll send you a link to reset your password.</p>
            </header>

            <div className="form-field">
              <label htmlFor="forgotEmail" className="form-field__label">Email Address <span style={{ color: '#d32f2f' }}>*</span></label>
              <input
                type="email"
                id="forgotEmail"
                name="forgotEmail"
                value={forgotEmail}
                onChange={handleForgotChange}
                ref={forgotEmailRef}
                onBlur={() => { setForgotTouched(true); if (!emailPattern.test(forgotEmail)) setForgotError('Please enter a valid email address.'); }}
                required
                placeholder="your.email@pupsmb.edu.ph"
                className={`form-field__input ${forgotError ? 'input-error' : ''}`}
              />
              <div className="error-row">
                <p className="error-text" aria-live="polite">{forgotTouched && forgotError ? forgotError : '\u00A0'}</p>
              </div>
            </div>

            <div className="login__security-note">
              <div className="login__security-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1a4 4 0 00-4 4v2H7a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2v-9a2 2 0 00-2-2h-1V5a4 4 0 00-4-4z" stroke="#1565c0" strokeWidth="1.2" fill="none" />
                  <path d="M8 12h8" stroke="#1565c0" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="login__security-text">For your security, we'll send a one-time password reset link to your email. The link expires in 15 minutes.</div>
            </div>

            <button type="submit" className="forgot__submit-btn" disabled={!forgotEmail || !!forgotError || !emailPattern.test(forgotEmail) || forgotRateRemaining > 0}>
              {forgotRateRemaining > 0 ? `Send Reset Link (${forgotRateRemaining}s)` : 'Send Reset Link'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button type="button" onClick={() => { setView('login'); setForgotSuccess(''); }} className="login__link-btn" style={{ marginTop: 8 }}>← Back to Login</button>
            </div>
          </form>
  ) : view === 'checkEmail' ? (
          <div className="forgot__confirm-container fade-in" role="status" aria-live="polite">
            <div className="forgot__confirm-card">
              <img src={EmailImg} alt="Email sent" className="forgot__confirm-image" aria-hidden="true" />

              <h2 className="forgot__title">Check Your Email</h2>
              <p className="forgot__subtitle">We’ve sent a password reset link to {forgotSuccess}</p>

              <div className="forgot__info forgot__info--blue" role="note" aria-label="Link expiry">
                <div className="forgot__info-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" fill="#bfdbfe" />
                    <path d="M12 8v5" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 16h.01" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div className="forgot__info-title">Link expires in 15 minutes</div>
                  <div className="forgot__info-desc">Please use the reset link within 15 minutes for security reasons.</div>
                </div>
              </div>

              <div className="forgot__info forgot__info--yellow" role="note" aria-label="Spam folder tip">
                <div className="forgot__info-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h17.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="#fde68a" />
                    <path d="M12 9v4" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 17h.01" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div className="forgot__info-title forgot__info-title--yellow">Can’t find the email?</div>
                  <div className="forgot__info-desc">Please check your Spam or Junk folder. Sometimes our emails end up there by mistake.</div>
                </div>
              </div>

              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <button type="button" className="login__link-btn" onClick={() => { setView('login'); setForgotSuccess(''); setForgotEmail(''); setForgotError(''); }}>
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form className="login__form" onSubmit={handleSubmit} style={{ position: 'relative' }}>

            <header className="login__header">
              <img src={LoginImg} alt="Login" className="login__top-image" aria-hidden="true" />
                <h2 className="login__title">{getRoleTitle()}</h2>
                <p className="login__subtitle">Enter your credentials to access your account.</p>
            </header>

            <div className="form-field">
              <label htmlFor="email" className="form-field__label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your.email@pupsmb.edu.ph"
                className="form-field__input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="studentNumber" className="form-field__label">Student Number</label>
              <input
                type="text"
                id="studentNumber"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleInputChange}
                required
                placeholder="2022-00098-SM-0"
                className="form-field__input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="password" className="form-field__label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  className="form-field__input password-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg className="password-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {loginError && (
              <div className={`login__error ${loginVisible ? 'show' : ''}`} role="alert" aria-live="assertive">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="login__error-icon" aria-hidden="true">
                  <path d="M11.001 10h2v5h-2z" fill="#d32f2f" />
                  <path d="M11 16h2v2h-2z" fill="#d32f2f" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" fill="#d32f2f" />
                </svg>
                <span>Incorrect Student Number or Password.</span>
              </div>
            )}

            <button type="submit" className="login__submit-btn">Log In</button>

            <div className="login__footer">
              <p className="login__footer-text">Don't have an account?{' '}
                <button type="button" onClick={() => navigate(getSignupLink())} className="login__link-btn">Sign up here</button>
              </p>

              <p className="login__forgot">
                <button type="button" onClick={() => { setView('forgot'); setForgotSuccess(''); setForgotEmail(''); setForgotError(''); setForgotTouched(false); }} className="login__link-btn">Forgot password?</button>
              </p>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default Login;