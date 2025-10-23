// React core imports and component styles
import React, { useState, useEffect, useCallback } from 'react';
import './Officers.css';

const Officers = () => {
  // User authentication state - retrieved from localStorage
  const [userSession] = useState(() => {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  });

  // UI state management
  const [activeSection, setActiveSection] = useState('documents'); // Current active section
  const [isExpanded, setIsExpanded] = useState(false); // Sidebar expansion state
  const [isPinned, setIsPinned] = useState(false); // Sidebar pin state
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile sidebar state
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false); // Profile dropdown visibility

  // Sample document data - officer's submitted documents
  const [documents] = useState([
    {
      id: 1,
      title: 'Organization Report Q1',
      submitted: 'Jan 12, 2025',
      type: 'Financial Report',
      status: 'Approved'
    },
    {
      id: 2,
      title: 'Financial Statement',
      submitted: 'Feb 4, 2025',
      type: 'Financial Report',
      status: 'Under Review'
    },
    {
      id: 3,
      title: 'Activity Proposal - Intramurals',
      submitted: 'Feb 15, 2025',
      type: 'Activity Proposal',
      status: 'Pending'
    }
  ]);

  // Activity history data - recent document actions
  const [activities] = useState([
    {
      id: 1,
      action: 'Uploaded',
      document: 'Organization Report Q1',
      date: 'Jan 12, 2025',
      icon: '✅'
    },
    {
      id: 2,
      action: 'Downloaded',
      document: 'Financial Statement',
      date: 'Feb 10, 2025',
      icon: '📥'
    },
    {
      id: 3,
      action: 'Submitted',
      document: 'Activity Proposal - Intramurals',
      date: 'Feb 15, 2025',
      icon: '📤'
    }
  ]);

  // Upload form state - manages document upload data
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'Financial Report',
    file: null
  });

  // Load sidebar pin state from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebarPinned");
    if (saved === "true") {
      setIsPinned(true);
      setIsExpanded(true);
    }
  }, []);

  // Save sidebar pin state to localStorage when changed
  useEffect(() => {
    localStorage.setItem("sidebarPinned", isPinned);
  }, [isPinned]);

  // Navigation handler - switches active section and closes mobile sidebar
  const handleMenuClick = useCallback((section) => {
    setActiveSection(section);
    // Close mobile sidebar after navigation
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  }, []);

  // Sidebar mouse handlers - expand on hover for desktop
  const handleMouseEnter = useCallback(() => {
    if (!isPinned && window.innerWidth > 768) {
      setIsExpanded(true);
    }
  }, [isPinned]);

  const handleMouseLeave = useCallback(() => {
    if (!isPinned && window.innerWidth > 768) {
      setIsExpanded(false);
    }
  }, [isPinned]);

  // Sidebar toggle handler - manages mobile drawer and desktop pin state
  const handleSidebarToggle = useCallback(() => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsPinned(!isPinned);
      if (!isPinned) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    }
  }, [isPinned, isMobileOpen]);

  // Overlay click handler - closes mobile sidebar
  const handleOverlayClick = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Icon click wrapper - expands sidebar before performing action
  const handleIconClick = useCallback((action) => {
    if (!isExpanded && !isPinned && window.innerWidth > 768) {
      setIsExpanded(true);
    }
    action();
  }, [isExpanded, isPinned]);

  // Keyboard navigation handler - enables Enter and Space key interactions
  const handleKeyDown = useCallback((event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleIconClick(action);
    }
  }, [handleIconClick]);

  // Logout handler - confirms and clears user session
  const handleLogout = useCallback(() => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userSession');
      sessionStorage.removeItem('userSession');
      window.location.href = '/login';
    }
  }, []);

  // Form input handler - updates upload form state
  const handleFormChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  }, []);

  // Upload submission handler - validates and processes document upload
  const handleUploadSubmit = useCallback((e) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.file) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Simulate upload
    alert(`Document "${uploadForm.title}" uploaded successfully!`);
    setUploadForm({
      title: '',
      type: 'Financial Report',
      file: null
    });
    // Reset file input
    const fileInput = document.getElementById('fileUpload');
    if (fileInput) fileInput.value = '';
  }, [uploadForm]);

  // Document view handler - opens document for viewing
  const handleViewDocument = useCallback((doc) => {
    alert(`Viewing document: ${doc.title}`);
  }, []);

  // Document download handler - initiates document download
  const handleDownloadDocument = useCallback((doc) => {
    alert(`Downloading document: ${doc.title}`);
  }, []);

  // Authentication effect - validates officer access
  useEffect(() => {
    if (!userSession || userSession.role !== 'officer') {
      alert('Access denied. Organization Officer credentials required.');
      window.location.href = '/login';
    }
  }, [userSession]);

  // Profile dropdown effect - handles outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownVisible && !event.target.closest('.account')) {
        setProfileDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownVisible]);

  // Mobile sidebar effect - closes on outside clicks
  useEffect(() => {
    const handleSidebarClickOutside = (event) => {
      if (window.innerWidth <= 768 && 
          isMobileOpen && 
          !event.target.closest('.sidebar') && 
          !event.target.closest('.collapse-btn')) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleSidebarClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleSidebarClickOutside);
    };
  }, [isMobileOpen]);

  // Window resize effect - manages sidebar state across screen sizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobileOpen(false);
        setIsExpanded(false);
      } else {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Authentication guard - renders access denied screen for unauthorized users
  if (!userSession || userSession.role !== 'officer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Organization Officer credentials required.</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Document grid renderer - displays documents in card layout
  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">{doc.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Submitted:</span> {doc.submitted}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Type:</span> {doc.type}
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                doc.status === 'Approved' ? 'bg-green-100 text-green-800' :
                doc.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {doc.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewDocument(doc)}
                className="flex-1 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                View
              </button>
              <button
                onClick={() => handleDownloadDocument(doc)}
                className="flex-1 bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Upload form renderer - displays document upload interface
  const renderUpload = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl">
        <form onSubmit={handleUploadSubmit} className="space-y-6">
          <div>
            <label htmlFor="docTitle" className="block text-sm font-semibold text-gray-700 mb-2">
              Document Title *
            </label>
            <input
              type="text"
              id="docTitle"
              name="title"
              value={uploadForm.title}
              onChange={handleFormChange}
              placeholder="Enter document title"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label htmlFor="docType" className="block text-sm font-semibold text-gray-700 mb-2">
              Document Type
            </label>
            <select
              id="docType"
              name="type"
              value={uploadForm.type}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            >
              <option value="Financial Report">Financial Report</option>
              <option value="Activity Proposal">Activity Proposal</option>
              <option value="Minutes of Meeting">Minutes of Meeting</option>
              <option value="Budget Request">Budget Request</option>
              <option value="Event Documentation">Event Documentation</option>
            </select>
          </div>

          <div>
            <label htmlFor="fileUpload" className="block text-sm font-semibold text-gray-700 mb-2">
              Upload File *
            </label>
            <input
              type="file"
              id="fileUpload"
              name="file"
              onChange={handleFormChange}
              accept=".pdf,.docx,.xlsx,.pptx"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="mt-2 text-sm text-gray-500">
              Supported formats: PDF, DOCX, XLSX, PPTX (Max size: 10MB)
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transform hover:scale-105"
          >
            Upload Document
          </button>
        </form>
      </div>
    </div>
  );

  // Activity timeline renderer - displays recent activity history
  const renderActivity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-gray-800">
                    <span className="font-semibold">{activity.action}</span> <span className="font-medium text-indigo-700">{activity.document}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{activity.date}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );

  // Main component render - officer dashboard with sidebar and content areas
  return (
    <>
      {/* Mobile overlay for sidebar */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={handleOverlayClick}
        ></div>
      )}

      <div className={`dashboard-container ${
        isMobileOpen
          ? 'mobile-sidebar-open'
          : isExpanded || isPinned
          ? 'sidebar-expanded'
          : 'sidebar-collapsed'
      }`}>
        {/* ADVANCED COLLAPSIBLE SIDEBAR */}
        <aside 
          className={`sidebar ${
            isMobileOpen
              ? 'mobile-open'
              : isExpanded || isPinned
              ? 'expanded'
              : 'collapsed'
          }`} 
          id="sidebar"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="sidebar-header">
            <div className="brand-group">
              <h2 className="brand" style={{ color: 'white' }}>TransparaTech</h2>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <p className="subtext" style={{ color: '#B8B8B8' }}>Officer</p>
                <button 
                  className={`collapse-btn ${isPinned ? 'pinned' : ''}`}
                  onClick={handleSidebarToggle}
                  aria-expanded={isExpanded || isPinned}
                  aria-label={window.innerWidth <= 768 ? "Toggle mobile menu" : (isPinned ? "Unpin sidebar" : "Pin sidebar")}
                  title={window.innerWidth <= 768 ? "Toggle menu" : (isPinned ? "Unpin sidebar" : "Pin sidebar")}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '24px',
                    height: '24px'
                  }}
                >
                  <i className={`bx ${window.innerWidth <= 768 ? 'bx-menu' : (isPinned ? 'bx-pin' : 'bx-chevrons-right')}`}></i>
                </button>
              </div>
            </div>
          </div>

          <nav className="sidebar-menu" role="navigation" aria-label="Main">
            <button 
              className={`menu-item ${activeSection === 'documents' ? 'active' : ''}`}
              onClick={() => handleIconClick(() => handleMenuClick('documents'))}
              onKeyDown={(e) => handleKeyDown(e, () => handleMenuClick('documents'))}
              type="button"
              aria-label="My Documents"
              aria-pressed={activeSection === 'documents'}
            >
              <i className="bx bxs-file-doc"></i>
              <span>My Documents</span>
            </button>

            <button 
              className={`menu-item ${activeSection === 'upload' ? 'active' : ''}`}
              onClick={() => handleIconClick(() => handleMenuClick('upload'))}
              onKeyDown={(e) => handleKeyDown(e, () => handleMenuClick('upload'))}
              type="button"
              aria-label="Upload"
              aria-pressed={activeSection === 'upload'}
            >
              <i className="bx bx-upload"></i>
              <span>Upload</span>
            </button>

            <button 
              className={`menu-item ${activeSection === 'activity' ? 'active' : ''}`}
              onClick={() => handleIconClick(() => handleMenuClick('activity'))}
              onKeyDown={(e) => handleKeyDown(e, () => handleMenuClick('activity'))}
              type="button"
              aria-label="Activity"
              aria-pressed={activeSection === 'activity'}
            >
              <i className="bx bx-history"></i>
              <span>Activity</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <p className="watermark">© TransparaTech</p>
            <button 
              className="signout-btn small" 
              onClick={() => handleIconClick(handleLogout)}
              type="button"
              aria-label="Sign out"
            >
              <i className="bx bx-log-out"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          {/* TOPBAR */}
          <header className="topbar">
            <div className="left-actions">
              <h1 className="page-title">
                <strong style={{ fontSize: '1.3em' }}>
                  {activeSection === 'documents' ? 'My Documents' : 
                   activeSection === 'upload' ? 'Upload Document' : 
                   activeSection === 'activity' ? 'Recent Activity' :
                   'Organization Officer Dashboard'}
                </strong>
              </h1>
            </div>

            <div className="center-actions">
              {/* Keep empty for consistency with Viewer layout */}
            </div>

            <div className="right-actions">
              {/* PROFILE SECTION */}
              <div className="account">
                <img 
                  src="/api/placeholder/40/40" 
                  alt="User" 
                  className="profile-img" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDropdownVisible(!profileDropdownVisible);
                  }}
                />
                <div className={`account-dropdown ${profileDropdownVisible ? 'visible' : ''}`}>
                  <div className="account-info">
                    <img src="/api/placeholder/42/42" alt="User" />
                    <div className="details">
                      <span className="name">{userSession?.name || 'Juan Dela Cruz'}</span>
                      <span className="email">{userSession?.email || 'juan@pup.edu.ph'}</span>
                      <span className="role">Organization Officer</span>
                    </div>
                  </div>
                  <div className="divider"></div>
                  <button onClick={handleLogout}>Log Out</button>
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT SECTIONS */}
          <section 
            className={`section ${activeSection !== 'documents' ? 'hidden' : ''}`}
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 24px',
              width: '100%'
            }}
          >
            {renderDocuments()}
          </section>

          <section 
            className={`section ${activeSection !== 'upload' ? 'hidden' : ''}`}
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 24px',
              width: '100%'
            }}
          >
            {renderUpload()}
          </section>

          <section 
            className={`section ${activeSection !== 'activity' ? 'hidden' : ''}`}
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 24px',
              width: '100%'
            }}
          >
            {renderActivity()}
          </section>
        </main>
      </div>
    </>
  );
};

export default Officers;