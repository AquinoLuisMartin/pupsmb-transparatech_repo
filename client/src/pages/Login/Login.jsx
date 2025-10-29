import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    studentNumber: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Demo credentials for viewer access
    const demoCredentials = {
      email: 'jayson@pupsmb.edu.ph',
      studentNumber: '2022-00098-SM-0',
      password: 'demo123'
    };
    
    // Demo admin credentials
    const adminCredentials = {
      email: 'admin@pupsmb.edu.ph',
      studentNumber: 'ADM-2025-001',
      password: 'admin123'
    };
    
    // Demo superadmin credentials
    const superAdminCredentials = {
      email: 'superadmin@transparatech.ph',
      studentNumber: 'SADM-2025-001',
      password: 'superadmin123'
    };
    
    // Demo officer credentials
    const officerCredentials = {
      email: 'officer@pupsmb.edu.ph',
      studentNumber: 'OFF-2025-001',
      password: 'officer123'
    };
    
    // Check if credentials match demo viewer account
    if (
      formData.email === demoCredentials.email &&
      formData.studentNumber === demoCredentials.studentNumber &&
      formData.password === demoCredentials.password
    ) {
      // Store user session info (in real app, this would be handled by backend)
      localStorage.setItem('userSession', JSON.stringify({
        name: 'Jayson',
        email: formData.email,
        studentNumber: formData.studentNumber,
        role: 'viewer',
        organization: 'Sample Organization'
      }));
      
      // Redirect to viewer dashboard
      navigate('/viewer');
    } else if (
      formData.email === adminCredentials.email &&
      formData.studentNumber === adminCredentials.studentNumber &&
      formData.password === adminCredentials.password
    ) {
      // Store admin session info
      localStorage.setItem('userSession', JSON.stringify({
        name: 'Administrator',
        email: formData.email,
        studentNumber: formData.studentNumber,
        role: 'admin',
        organization: 'TransparaTech System'
      }));
      
      // Redirect to admin dashboard
      navigate('/admin');
    } else if (
      formData.email === superAdminCredentials.email &&
      formData.studentNumber === superAdminCredentials.studentNumber &&
      formData.password === superAdminCredentials.password
    ) {
      // Store superadmin session info
      localStorage.setItem('userSession', JSON.stringify({
        name: 'Super Administrator',
        email: formData.email,
        studentNumber: formData.studentNumber,
        role: 'superadmin',
        organization: 'TransparaTech System Administration'
      }));
      
      // Redirect to superadmin dashboard
      navigate('/superadmin');
    } else if (
      formData.email === officerCredentials.email &&
      formData.studentNumber === officerCredentials.studentNumber &&
      formData.password === officerCredentials.password
    ) {
      // Store officer session info
      localStorage.setItem('userSession', JSON.stringify({
        name: 'Juan Dela Cruz',
        email: formData.email,
        studentNumber: formData.studentNumber,
        role: 'officer',
        organization: 'Student Council'
      }));
      
      // Redirect to officers dashboard
      navigate('/officers');
    } else {
      alert('Invalid credentials!\n\nDemo Viewer:\nEmail: jayson@pupsmb.edu.ph\nStudent Number: 2022-00098-SM-0\nPassword: demo123\n\nDemo Admin:\nEmail: admin@pupsmb.edu.ph\nStudent Number: ADM-2025-001\nPassword: admin123\n\nDemo SuperAdmin:\nEmail: superadmin@transparatech.ph\nStudent Number: SADM-2025-001\nPassword: superadmin123\n\nDemo Officer:\nEmail: officer@pupsmb.edu.ph\nStudent Number: OFF-2025-001\nPassword: officer123');
    }
  };

  const getRoleTitle = () => {
    return 'User Login';
  };

  const getSignupLink = () => {
    return '/signup';
  };

  return (
    <div className="login">
      <div className="login__container">
        <form className="login__form" onSubmit={handleSubmit} style={{ position: 'relative' }}>
          {/* Close (X) button - absolute positioned in the top-right of the login card */}
          <button
            type="button"
            aria-label="Close login"
            onClick={() => navigate('/')}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            className="login__close-btn"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'transparent',
              border: 'none',
              padding: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
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
                stroke={closeHover ? '#d1d5db' : '#6b7280'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <header className="login__header">
            <h2 className="login__title">{getRoleTitle()}</h2>
          </header>

          <div className="form-field">
            <label htmlFor="email" className="form-field__label">
              Email
            </label>
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
            <label htmlFor="studentNumber" className="form-field__label">
              Student Number
            </label>
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
            <label htmlFor="password" className="form-field__label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
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
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg 
                  className="password-toggle-icon" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {showPassword ? (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  ) : (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" className="login__submit-btn">
            Log In
          </button>

          <div className="login__footer">
            <p className="login__footer-text">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate(getSignupLink())}
                className="login__link-btn"
              >
                Sign up here
              </button>
            </p>

            <p className="login__forgot">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="login__link-btn"
              >
                Forgot password?
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;