import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role');
  
  const [formData, setFormData] = useState({
    email: '',
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
    alert(`Logging in as ${role || 'user'}...`);
  };

  const getRoleTitle = () => {
    if (!role) return 'User Login';
    return role.charAt(0).toUpperCase() + role.slice(1) + ' Login';
  };

  const getSignupLink = () => {
    return role ? `/signup?role=${role}` : '/signup';
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
              University Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="example@pup.edu.ph"
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
                I forgot my password
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;