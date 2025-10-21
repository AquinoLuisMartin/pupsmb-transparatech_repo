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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Demo credentials for viewer access
    const demoCredentials = {
      email: 'jayson@pupsmb.edu.ph',
      studentNumber: '2022-00098-SM-0',
      password: 'demo123'
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
    } else {
      alert('Invalid credentials! Demo credentials:\nEmail: jayson@pupsmb.edu.ph\nStudent Number: 2022-00098-SM-0\nPassword: demo123');
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
        <form className="login__form" onSubmit={handleSubmit}>
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
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              className="form-field__input"
            />
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