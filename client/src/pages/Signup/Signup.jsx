import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleInitial: '',
    email: '',
    studentNumber: '',
    schoolNumber: '',
    accountType: 'member',
    organization: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [closeHover, setCloseHover] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  // Organization options based on account type
  const getOrganizationOptions = () => {
    // We'll not use this helper for rendering; keep for compatibility if needed
    return [];
  };

  const studentOrgs = [
    { value: 'isite', label: 'ISITE' },
    { value: 'aces', label: 'ACES' },
    { value: 'jpia', label: 'JPIA' },
    { value: 'aft', label: 'AFT' },
    { value: 'hmsoc', label: 'HMSOC' },
    { value: 'cem', label: 'CEM' },
    { value: 'domt', label: 'DOMT' }
  ];

  const adminTypes = [
    { value: 'coa', label: 'Commission on Audit (COA)' },
    { value: 'oss', label: 'Office of Student Services (OSS)' },
    { value: 'cosoa', label: 'Commission on Student Organizations and Accreditation (COSOA)' }
  ];

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

    // Special-case: studentNumber gets real-time validation while typing (only for member/officer)
    if (name === 'studentNumber') {
      // mark as interacted
      setTouched(prev => ({ ...prev, studentNumber: true }));
      validateField('studentNumber', value);
      return;
    }

    // Real-time validation only if the user already touched the field
    if (touched[name]) validateField(name, value);
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setFocusedField(name);
    // mark touched when user focuses (they interacted)
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFocusedField(null);
    // validate on blur and mark touched
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // Validation helpers
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // strict student number format for members/officers: 20XX-XXXXX-SM-X
  const studentNumberPattern = /^20\d{2}-\d{5}-SM-\d{1}$/;
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const validateField = (name, value) => {
    let message = '';

    if (['lastName', 'firstName', 'studentNumber', 'schoolNumber', 'email', 'organization', 'password', 'confirmPassword', 'accountType'].includes(name)) {
      if (!value || value.toString().trim() === '') {
        message = 'This field is required.';
      }
    }

    if (!message && name === 'email') {
      if (value && !emailPattern.test(value)) {
        message = 'Please enter a valid email address.';
      }
    }

    if (!message && name === 'studentNumber') {
      // Only enforce the strict pattern for Organization Member and Officer
      if ((formData.accountType === 'member' || formData.accountType === 'officer')) {
        if (value && !studentNumberPattern.test(value)) {
          message = 'Please enter a valid student number (20XX-XXXXX-SM-X).';
        }
      }
    }

    // schoolNumber currently only required for administrators; no specific format enforced yet
    if (!message && name === 'schoolNumber') {
      // required handled above; no extra format rule for now
    }

    if (!message && name === 'password') {
      if (value && !passwordPattern.test(value)) {
        message = 'Password must be at least 8 characters, include an uppercase letter, a number, and a special character.';
      }
    }

    if (!message && name === 'confirmPassword') {
      if (value && value !== formData.password) {
        message = 'Passwords do not match.';
      }
    }

    // If password changed, re-validate confirmPassword
    if (name === 'password' && formData.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword);
    }

    setErrors(prev => ({ ...prev, [name]: message }));
    return message === '';
  };

  const validateAll = () => {
    const toValidate = ['accountType','lastName','firstName', (formData.accountType === 'administrator' ? 'schoolNumber' : 'studentNumber'),'email','organization','password','confirmPassword'];
    let ok = true;
    toValidate.forEach(field => {
      const value = formData[field] || '';
      const valid = validateField(field, value);
      if (!valid) ok = false;
    });
    return ok;
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 'empty', score: 0 };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 'weak', score: 1 };
    if (score === 2 || score === 3) return { level: 'medium', score: 2 };
    return { level: 'strong', score: 3 };
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Real-time validation before submit
    const ok = validateAll();
    if (!ok) {
      // focus first error field optionally
      alert('Please fix the errors in the form before submitting.');
      return;
    }
    // At this point form is valid — proceed and redirect to login page
    // (you can integrate server-side creation here; currently demo only)
    alert('Account created successfully! Redirecting to login...');
    navigate('/login');
  };

  // Pure client-side quick validity check (doesn't mutate errors state)
  const isFormValid = () => {
    // required fields (use schoolNumber for admin, studentNumber for others)
    const required = ['accountType','lastName','firstName', (formData.accountType === 'administrator' ? 'schoolNumber' : 'studentNumber'),'email','organization','password','confirmPassword'];
    for (let f of required) {
      const v = formData[f] || '';
      if (v.toString().trim() === '') return false;
    }
    if (!emailPattern.test(formData.email)) return false;
    // enforce strict student number format only for member/officer
    if (formData.accountType === 'member' || formData.accountType === 'officer') {
      if (!studentNumberPattern.test(formData.studentNumber)) return false;
    }
    if (!passwordPattern.test(formData.password)) return false;
    if (formData.password !== formData.confirmPassword) return false;
    return true;
  };

  const getRoleTitle = () => {
    return 'Create Your Account';
  };

  const getLoginLink = () => {
    return '/login';
  };

  return (
    <div className="signup">
      <div className="signup__container">
        <form className="signup__form" onSubmit={handleSubmit} style={{ position: 'relative' }}>
          {/* Close (X) button - absolute positioned in the top-right of the signup card */}
          <button
            type="button"
            aria-label="Close signup"
            onClick={() => navigate('/')}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            className="signup__close-btn"
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
          <header className="signup__header">
            <div className="signup__logo">
              <div className="logo-circle">PUP</div>
            </div>
            <h2 className="signup__title" style={{ color: '#1565c0' }}>{getRoleTitle()}</h2>
            <p className="signup__subtitle">Fill in the details below to get started.</p>
          </header>
          {/* Account Type first */}
          <div className="form-field" style={{ marginBottom: 12 }}>
            <label htmlFor="accountType" className="form-field__label">
              Account Type<span className="required-asterisk"> *</span>
            </label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              className={`form-field__select ${(errors.accountType && touched.accountType) ? 'input-error' : ''}`}
            >
              <option value="member">Organization Member (Viewer)</option>
              <option value="officer">Officer</option>
              <option value="administrator">Administrator</option>
            </select>
            <div className="error-row">
              <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.accountType && errors.accountType) ? 1 : 0 }}>
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="error-text" aria-live="polite">{touched.accountType && errors.accountType ? errors.accountType : '\u00A0'}</p>
            </div>
          </div>

          {/* Grid layout: two columns with specified rows */}
          <div className="signup__grid">
            <div className="form-field">
              <label htmlFor="lastName" className="form-field__label">
                Last Name<span className="required-asterisk"> *</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  placeholder="Dela Cruz"
                  className={`form-field__input ${(errors.lastName && touched.lastName) ? 'input-error' : ''}`}
              />
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.lastName && errors.lastName) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.lastName && errors.lastName ? errors.lastName : '\u00A0'}</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="firstName" className="form-field__label">
                First Name<span className="required-asterisk"> *</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  placeholder="Juan"
                  className={`form-field__input ${(errors.firstName && touched.firstName) ? 'input-error' : ''}`}
              />
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.firstName && errors.firstName) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.firstName && errors.firstName ? errors.firstName : '\u00A0'}</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="middleInitial" className="form-field__label">
                Middle Initial
              </label>
              <input
                type="text"
                id="middleInitial"
                name="middleInitial"
                value={formData.middleInitial}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="M"
                  maxLength={1}
                  className={`form-field__input ${(errors.middleInitial && touched.middleInitial) ? 'input-error' : ''}`}
              />
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.middleInitial && errors.middleInitial) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.middleInitial && errors.middleInitial ? errors.middleInitial : '\u00A0'}</p>
              </div>
            </div>

            <div className="form-field">
              {formData.accountType === 'administrator' ? (
                <>
                  <label htmlFor="schoolNumber" className="form-field__label">
                    School Number<span className="required-asterisk"> *</span>
                  </label>
                  <input
                    type="text"
                    id="schoolNumber"
                    name="schoolNumber"
                    value={formData.schoolNumber}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    placeholder="School Number"
                    className={`form-field__input ${(errors.schoolNumber && touched.schoolNumber) ? 'input-error' : ''}`}
                  />
                  <div className="error-row">
                    <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.schoolNumber && errors.schoolNumber) ? 1 : 0 }}>
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="error-text" aria-live="polite">{touched.schoolNumber && errors.schoolNumber ? errors.schoolNumber : '\u00A0'}</p>
                  </div>
                </>
              ) : (
                <>
                  <label htmlFor="studentNumber" className="form-field__label">
                    Student Number<span className="required-asterisk"> *</span>
                  </label>
                  <input
                    type="text"
                    id="studentNumber"
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    placeholder="2022-00098-SM-0"
                    className={`form-field__input ${(errors.studentNumber && touched.studentNumber) ? 'input-error' : ''}`}
                  />
                  <div className="error-row">
                    <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.studentNumber && errors.studentNumber) ? 1 : 0 }}>
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="error-text" aria-live="polite">{touched.studentNumber && errors.studentNumber ? errors.studentNumber : '\u00A0'}</p>
                  </div>
                </>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="email" className="form-field__label">
                Email<span className="required-asterisk"> *</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  placeholder="your.email@pupsmb.edu.ph"
                  className={`form-field__input ${(errors.email && touched.email) ? 'input-error' : ''}`}
              />
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.email && errors.email) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.email && errors.email ? errors.email : '\u00A0'}</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="organization" className="form-field__label">
                {formData.accountType === 'administrator' ? 'Administration Type' : 'Organization'}
                <span className="required-asterisk"> *</span>
              </label>
              <select
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={`form-field__select ${(errors.organization && touched.organization) ? 'input-error' : ''}`}
                  disabled={!formData.accountType}
              >
                <option value="">{formData.accountType === 'administrator' ? 'Select One' : 'Select your organization'}</option>
                {formData.accountType === 'administrator'
                  ? adminTypes.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))
                  : studentOrgs.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
              </select>
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.organization && errors.organization) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.organization && errors.organization ? errors.organization : '\u00A0'}</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="password" className="form-field__label">
                Password<span className="required-asterisk"> *</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  placeholder="••••••••"
                  className={`form-field__input password-input ${(errors.password && touched.password) ? 'input-error' : ''}`}
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
              {/* Password rules list shown only when password field is focused (fade-in) */}
              <ul className={`password-rules ${focusedField === 'password' ? 'show' : ''}`}>
                <li>At least 8 characters</li>
                <li>Include uppercase letters</li>
                <li>Include numbers</li>
                <li>Include special characters</li>
              </ul>
              {/* Password strength bar */}
              <div className="password-strength" aria-live="polite">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: formData.password ? `${(getPasswordStrength(formData.password).score / 3) * 100}%` : '0%',
                      background: getPasswordStrength(formData.password).level === 'weak' ? '#d32f2f' : getPasswordStrength(formData.password).level === 'medium' ? '#f9a825' : '#43a047'
                    }}
                  />
                </div>
                <div className="strength-label">{formData.password ? (getPasswordStrength(formData.password).level === 'weak' ? 'Weak' : getPasswordStrength(formData.password).level === 'medium' ? 'Medium' : 'Strong') : '\u00A0'}</div>
              </div>
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.password && errors.password) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.password && errors.password ? errors.password : '\u00A0'}</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword" className="form-field__label">
                Confirm Password<span className="required-asterisk"> *</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  placeholder="••••••••"
                  className={`form-field__input password-input ${(errors.confirmPassword && touched.confirmPassword) ? 'input-error' : ''}`}
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
              <div className="error-row">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ opacity: (touched.confirmPassword && errors.confirmPassword) ? 1 : 0 }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="error-text" aria-live="polite">{touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : '\u00A0'}</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="signup__submit-btn"
            disabled={!isFormValid()}
          >
            Create Account
          </button>

          <div className="signup__footer">
            <p className="signup__footer-text">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate(getLoginLink())}
                className="signup__link-btn"
                style={{ color: '#1565c0', background: 'transparent', border: 'none', padding: 0 }}
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