import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert(`Creating account for ${role || 'user'}...`);
  };

  const getRoleTitle = () => {
    if (!role) return 'User Signup';
    return role.charAt(0).toUpperCase() + role.slice(1) + ' Signup';
  };

  const getLoginLink = () => {
    return role ? `/login?role=${role}` : '/login';
  };

  return (
    <div className="signup">
      <div className="signup__container">
        <form className="signup__form" onSubmit={handleSubmit}>
          <header className="signup__header">
            <h2 className="signup__title">{getRoleTitle()}</h2>
          </header>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="firstName" className="form-field__label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="First name"
                className="form-field__input"
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="lastName" className="form-field__label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Last name"
                className="form-field__input"
              />
            </div>
          </div>

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
              placeholder="Create a password"
              className="form-field__input"
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword" className="form-field__label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm your password"
              className="form-field__input"
            />
          </div>

          <div className="form-field">
            <label className="checkbox-field">
              <input
                type="checkbox"
                required
                className="checkbox-field__input"
              />
              <span className="checkbox-field__label">
                I agree to the Terms and Conditions
              </span>
            </label>
          </div>

          <button type="submit" className="signup__submit-btn">
            Create Account
          </button>

          <div className="signup__footer">
            <p className="signup__footer-text">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate(getLoginLink())}
                className="signup__link-btn"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;