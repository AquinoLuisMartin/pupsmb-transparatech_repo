import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentNumber: '',
    accountType: '',
    organization: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Organization options based on account type
  const getOrganizationOptions = () => {
    if (formData.accountType === 'administrator') {
      return [
        { value: 'coa', label: 'Commission on Audit (COA)' },
        { value: 'oss', label: 'Office of Student Services (OSS)' },
        { value: 'cosoa', label: 'Commission on Student Organizations and Accreditation (COSOA)' }
      ];
    } else {
      return [
        { value: 'aces', label: 'Alliance of Computer Engineering Students (ACES)' },
        { value: 'isite', label: 'Integrated Students in Information Technology Education (iSITE)' },
        { value: 'aft', label: 'Association of Future Teachers (AFT)' },
        { value: 'hmsoc', label: 'Hospitality Management Society (HMSOC)' },
        { value: 'cem', label: 'Chamber of Entrepreneurs and Managers (CEM)' },
        { value: 'jpia', label: 'Junior Philippine Institute of Accountancy - Sta Maria (JPIA)' },
        { value: 'domt', label: 'Diploma in Office Management SY-Quest (DOMT)' }
      ];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Reset organization when account type changes
    if (name === 'accountType') {
      setFormData({
        ...formData,
        [name]: value,
        organization: '' // Reset organization selection
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!formData.accountType) {
      alert('Please select an account type!');
      return;
    }
    
    if (!formData.organization) {
      alert('Please select an organization!');
      return;
    }
    
    // Student number validation
    const studentNumberPattern = /^\d{4}-\d{5}-SM-\d$/;
    if (!studentNumberPattern.test(formData.studentNumber)) {
      alert('Please enter a valid student number (format: 2022-00098-SM-0)');
      return;
    }
    
    // Get organization name for display
    const getOrgName = (orgValue) => {
      const allOrgs = [
        { value: 'aces', label: 'Alliance of Computer Engineering Students (ACES)' },
        { value: 'isite', label: 'Integrated Students in Information Technology Education (iSITE)' },
        { value: 'aft', label: 'Association of Future Teachers (AFT)' },
        { value: 'hmsoc', label: 'Hospitality Management Society (HMSOC)' },
        { value: 'cem', label: 'Chamber of Entrepreneurs and Managers (CEM)' },
        { value: 'jpia', label: 'Junior Philippine Institute of Accountancy - Sta Maria (JPIA)' },
        { value: 'domt', label: 'Diploma in Office Management SY-Quest (DOMT)' },
        { value: 'coa', label: 'Commission on Audit (COA)' },
        { value: 'oss', label: 'Office of Student Services (OSS)' },
        { value: 'cosoa', label: 'Commission on Student Organizations and Accreditation (COSOA)' }
      ];
      const org = allOrgs.find(o => o.value === orgValue);
      return org ? org.label : orgValue;
    };
    
    // For demo purposes, automatically create account and redirect to appropriate dashboard
    if (formData.accountType === 'member') {
      // Store user session info for viewer role
      localStorage.setItem('userSession', JSON.stringify({
        name: formData.firstName,
        email: formData.email,
        studentNumber: formData.studentNumber,
        role: 'viewer',
        organization: getOrgName(formData.organization)
      }));
      
      alert('Account created successfully! Redirecting to your dashboard...');
      navigate('/viewer');
    } else if (formData.accountType === 'administrator') {
      // Store admin session info
      localStorage.setItem('userSession', JSON.stringify({
        name: formData.firstName,
        email: formData.email,
        studentNumber: formData.studentNumber,
        role: 'admin',
        organization: getOrgName(formData.organization)
      }));
      
      alert('Admin account created successfully! Redirecting to admin dashboard...');
      navigate('/admin');
    } else {
      // For other roles, show success message (can be extended later)
      alert(`Account created successfully for ${formData.accountType} role! Dashboard for this role is not yet implemented.`);
    }
  };

  const getRoleTitle = () => {
    return 'Create Account';
  };

  const getLoginLink = () => {
    return '/login';
  };

  return (
    <div className="signup">
      <div className="signup__container">
        <form className="signup__form" onSubmit={handleSubmit}>
          <header className="signup__header">
            <div className="signup__logo">
              <div className="logo-circle">PUP</div>
            </div>
            <h2 className="signup__title">{getRoleTitle()}</h2>
            <p className="signup__subtitle">Join the TransparaTech community</p>
          </header>

          <div className="form-field">
            <label htmlFor="firstName" className="form-field__label">
              Full Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              placeholder="Juan Dela Cruz"
              className="form-field__input"
            />
          </div>

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
                placeholder="••••••••"
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

          <div className="form-field">
            <label htmlFor="confirmPassword" className="form-field__label">
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                className="form-field__input password-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <svg 
                  className="password-toggle-icon" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {showConfirmPassword ? (
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

          <div className="form-field">
            <label htmlFor="accountType" className="form-field__label">
              Account Type
            </label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleInputChange}
              required
              className="form-field__select"
            >
              
              <option value="member">Organization Member (Viewer)</option>
              <option value="officer">Officer</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>

          {formData.accountType === 'administrator' ? (
            <div className="form-field">
              <label htmlFor="organization" className="form-field__label">
                Administration Type
              </label>
              <select
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                required
                className="form-field__select"
              >
                <option value="">Select One</option>
                {getOrganizationOptions().map((org) => (
                  <option key={org.value} value={org.value}>
                    {org.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-field">
              <label htmlFor="organization" className="form-field__label">
                Organization
              </label>
              <select
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                required
                className="form-field__select"
                disabled={!formData.accountType || formData.accountType === ''}
              >
                <option value="">Select your organization</option>
                {getOrganizationOptions().map((org) => (
                  <option key={org.value} value={org.value}>
                    {org.label}
                  </option>
                ))}
              </select>
            </div>
          )}

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
                Log in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;