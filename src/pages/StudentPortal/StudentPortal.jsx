import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentPortal.css';

const StudentPortal = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="portal">
      <div className="portal__container">
        <header className="portal__header">
          <h1 className="portal__title">PUPSMB Transparency Portal</h1>
          <p className="portal__description">
            Promoting organizational accountability through transparent budget access within the PUPSMB campus community.
          </p>
        </header>

        <main className="portal__main">
          <div className="portal__roles">
            <button
              className="role-button"
              onClick={() => handleRoleSelection('viewer')}
            >
              <span className="role-button__title">Viewer</span>
              <span className="role-button__subtitle">Student / Faculty</span>
            </button>

            <button
              className="role-button"
              onClick={() => handleRoleSelection('officer')}
            >
              <span className="role-button__title">Officer</span>
              <span className="role-button__subtitle">Can Upload Files</span>
            </button>

            <button
              className="role-button"
              onClick={() => handleRoleSelection('auditor')}
            >
              <span className="role-button__title">Auditor</span>
              <span className="role-button__subtitle">Can Approve Files</span>
            </button>

            <button
              className="role-button"
              onClick={() => handleRoleSelection('admin')}
            >
              <span className="role-button__title">Admin</span>
              <span className="role-button__subtitle">Monitor & Supervise</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentPortal;