import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [userSession, setUserSession] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);

  useEffect(() => {
    // Check if user is logged in and has admin role
    const session = localStorage.getItem('userSession');
    if (session) {
      const userData = JSON.parse(session);
      if (userData.role === 'admin' || userData.role === 'administrator') {
        setUserSession(userData);
      } else {
        // Redirect non-admin users
        navigate('/login');
      }
    } else {
      // No session found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear all stored data
    localStorage.removeItem('userSession');
    sessionStorage.clear();
    
    // Show confirmation message
    alert('You have been logged out successfully!');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };

  const handleSidebarToggle = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
  }, [sidebarCollapsed]);

  const toggleProfileDropdown = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };

  const handleProfileSettings = () => {
    setActiveSection('profile');
    setProfileDropdownVisible(false);
  };

  const handleAccountSettings = () => {
    setActiveSection('settings');
    setProfileDropdownVisible(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    setProfileDropdownVisible(false);
  };

  // Navigation functions can be added later if needed

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownVisible && !event.target.closest('.profile-section')) {
        setProfileDropdownVisible(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && profileDropdownVisible) {
        setProfileDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [profileDropdownVisible]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + B to toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        handleSidebarToggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSidebarToggle]);

  // If no session loaded yet, show loading
  if (!userSession) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <div className="brand-group">
            <div className="logo-icon">
              <span>T</span>
            </div>
            <div className="brand-text">
              <h2 className="brand">TransparaTech</h2>
              <p className="subtext">PUPSMB</p>
            </div>
          </div>

          <button 
            className="collapse-btn" 
            onClick={handleSidebarToggle}
            aria-expanded={!sidebarCollapsed}
            aria-label="Toggle sidebar"
          >
            <i className="bx bx-menu"></i>
          </button>
        </div>

        <div className="sidebar-menu-label">
          <span>Menu</span>
        </div>

        <nav className="sidebar-menu" role="navigation" aria-label="Main">
          <button 
            className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleMenuClick('dashboard')}
            type="button"
            data-tooltip="Dashboard"
          >
            <i className="bx bxs-dashboard"></i>
            <span>Dashboard</span>
          </button>

          <button 
            className={`menu-item ${activeSection === 'review-queue' ? 'active' : ''}`}
            onClick={() => handleMenuClick('review-queue')}
            type="button"
            data-tooltip="Review Queue"
          >
            <i className="bx bx-task"></i>
            <span>Review Queue</span>
          </button>

          <button 
            className={`menu-item ${activeSection === 'all-documents' ? 'active' : ''}`}
            onClick={() => handleMenuClick('all-documents')}
            type="button"
            data-tooltip="All Documents"
          >
            <i className="bx bxs-file-doc"></i>
            <span>All Documents</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="topbar-left">
            {/* Remove duplicate hamburger menu */}
          </div>
          
          <div className="topbar-right">
            <div className="notification-icon">
              <i className="bx bx-bell"></i>
              <span className="notification-badge">3</span>
            </div>
            
            <div className="profile-section" onClick={(e) => {e.stopPropagation(); toggleProfileDropdown();}}>
              <div className="profile-avatar">
                <span>MS</span>
              </div>
              <div className="profile-info">
                <span className="profile-name">{userSession?.name || 'Maria Santos'}</span>
                <span className="profile-role">Admin</span>
              </div>
              <i className={`bx bx-chevron-down ${profileDropdownVisible ? 'rotated' : ''}`}></i>
              
              {profileDropdownVisible && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-info">
                      <span className="profile-dropdown-name">{userSession?.name || 'Maria Santos'}</span>
                      <span className="profile-dropdown-email">{userSession?.email || 'admin@pupsmb.edu.ph'}</span>
                    </div>
                  </div>
                  <div className="profile-dropdown-divider"></div>
                  <button onClick={handleProfileSettings}>
                    <i className="bx bx-user"></i>
                    Profile Settings
                  </button>
                  <button onClick={handleAccountSettings}>
                    <i className="bx bx-cog"></i>
                    Account Settings
                  </button>
                  <div className="profile-dropdown-divider"></div>
                  <button onClick={handleLogoutClick} className="logout-option">
                    <i className="bx bx-log-out"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT SECTIONS */}
        <div className="content-wrapper">
          {activeSection === 'dashboard' && (
            <section className="section dashboard-section">
              <div className="section-header">
                <h1>Admin Dashboard</h1>
                <p>Review and approve documents</p>
              </div>

              {/* STATS CARDS */}
              <div className="stats-grid">
                <div className="stat-card pending">
                  <div className="stat-icon">
                    <i className="bx bx-time"></i>
                  </div>
                  <div className="stat-content">
                    <h3>8</h3>
                    <p>Pending Review</p>
                    <span>Awaiting your review</span>
                  </div>
                </div>

                <div className="stat-card reviewed">
                  <div className="stat-icon">
                    <i className="bx bx-check"></i>
                  </div>
                  <div className="stat-content">
                    <h3>5</h3>
                    <p>Reviewed Today</p>
                    <span>Documents processed</span>
                  </div>
                </div>

                <div className="stat-card urgent">
                  <div className="stat-icon">
                    <i className="bx bx-error"></i>
                  </div>
                  <div className="stat-content">
                    <h3>2</h3>
                    <p>Urgent</p>
                    <span>High priority items</span>
                  </div>
                </div>

                <div className="stat-card total">
                  <div className="stat-icon">
                    <i className="bx bx-file"></i>
                  </div>
                  <div className="stat-content">
                    <h3>34</h3>
                    <p>Total This Month</p>
                    <span>Documents reviewed</span>
                  </div>
                </div>
              </div>

              {/* PENDING REVIEWS */}
              <div className="pending-reviews-section">
                <h2>Pending Reviews</h2>
                <p>Documents awaiting your approval</p>

                <div className="review-item">
                  <div className="review-content">
                    <h3>Budget Allocation Q1 2024</h3>
                    <div className="review-meta">
                      <span className="org-badge">JPIA</span>
                      <span className="doc-type">Financial Report</span>
                      <span className="author">by Juan Dela Cruz</span>
                      <span className="waiting-time">2 days waiting</span>
                    </div>
                  </div>
                  <button className="review-btn">Review</button>
                </div>

                <div className="review-item urgent-item">
                  <div className="review-content">
                    <h3>Tech Summit 2024 Proposal</h3>
                    <div className="review-meta">
                      <span className="org-badge">ISITE</span>
                      <span className="doc-type">Event Proposal</span>
                      <span className="author">by Maria Santos</span>
                      <span class="waiting-time">5 days waiting</span>
                      <span className="urgent-badge">Urgent</span>
                    </div>
                  </div>
                  <button className="review-btn">Review</button>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'review-queue' && (
            <section className="section review-queue-section">
              <div className="section-header">
                <h1>Review Queue</h1>
                <p>All documents pending review</p>
              </div>
              {/* Review queue content would go here */}
            </section>
          )}

          {activeSection === 'all-documents' && (
            <section className="section all-documents-section">
              <div className="section-header">
                <h1>All Documents</h1>
                <p>Complete document archive</p>
              </div>
              {/* All documents content would go here */}
            </section>
          )}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
              <button className="close-modal" onClick={cancelLogout}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to log out of the admin panel?</p>
              <div className="logout-actions">
                <button 
                  className="confirm-logout-btn"
                  onClick={confirmLogout}
                >
                  Yes, Log Out
                </button>
                <button 
                  className="cancel-logout-btn"
                  onClick={cancelLogout}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
