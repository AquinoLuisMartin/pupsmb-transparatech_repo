import React, { useState, useEffect } from 'react';
import './Viewer.css';

const Viewer = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const documents = [
    {
      id: 1,
      title: 'Annual Expense Statement',
      description: 'Summary for university programs and events',
      date: '01/15/2024',
      size: '2.3 MB',
      type: 'Financial Report',
      tag: 'financial',
      file: 'sample1.pdf'
    },
    {
      id: 2,
      title: 'Fund & Asset Turnover - Semester 1',
      description: 'Detailed turnover report for departments',
      date: '01/10/2024',
      size: '1.1 MB',
      type: 'Turnover of Funds & Assets',
      tag: 'turnover',
      file: 'sample2.pdf'
    },
    {
      id: 3,
      title: 'Q3 Official Receipt File',
      description: 'All official receipts for third quarter budget',
      date: '12/20/2023',
      size: '1.8 MB',
      type: 'Official Receipt',
      tag: 'receipt',
      file: 'sample3.pdf'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = activeFilter === 'all' || doc.tag === activeFilter;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleProfileClick = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setDocumentModalVisible(true);
  };

  const handleCloseModal = () => {
    setDocumentModalVisible(false);
    setSelectedDocument({});
  };

  const handleDownload = (file) => {
    // Implement download logic here
    console.log('Downloading:', file);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    sessionStorage.clear();
    
    // Clear any cached data
    setActiveSection('dashboard');
    setProfileDropdownVisible(false);
    setDocumentModalVisible(false);
    setSelectedDocument({});
    setSearchQuery('');
    setActiveFilter('all');
    
    // Show logout message
    alert('You have been successfully logged out.');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
    setProfileDropdownVisible(false);
  };

  // Close dropdown when clicking outside
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

  return (
    <div className={`dashboard-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <div className="brand-group">
            <h2 className="brand">TransparaTech</h2>
            <p className="subtext">Viewer</p>
          </div>

          <button 
            className="collapse-btn" 
            onClick={handleSidebarToggle}
            aria-expanded={!sidebarCollapsed}
            aria-label="Toggle sidebar"
          >
            <i className="bx bx-chevrons-right"></i>
          </button>
        </div>

        <nav className="sidebar-menu" role="navigation" aria-label="Main">
          <button 
            className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleMenuClick('dashboard')}
            type="button"
          >
            <i className="bx bxs-dashboard"></i>
            <span>Dashboard</span>
          </button>

          <button 
            className={`menu-item ${activeSection === 'documents' ? 'active' : ''}`}
            onClick={() => handleMenuClick('documents')}
            type="button"
          >
            <i className="bx bxs-file-doc"></i>
            <span>Documents</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <p className="watermark">© TransparaTech</p>
          <button className="signout-btn small" onClick={handleLogout}>
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
              {activeSection === 'dashboard' ? 'Dashboard' : 'Documents'}
            </h1>
          </div>

          <div className="center-actions">
            <input 
              type="text" 
              placeholder="Search current section..." 
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="right-actions">
            {/* PROFILE SECTION */}
            <div className="account">
              <img 
                src="/api/placeholder/40/40" 
                alt="User" 
                className="profile-img" 
                onClick={handleProfileClick}
              />
              <div className={`account-dropdown ${profileDropdownVisible ? 'visible' : ''}`}>
                <div className="account-info">
                  <img src="/api/placeholder/42/42" alt="User" />
                  <div className="details">
                    <span className="name">John Doe</span>
                    <span className="email">john.doe@example.com</span>
                    <span className="role">Viewer</span>
                  </div>
                </div>
                <div className="divider"></div>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD SECTION */}
        <section 
          id="dashboardSection" 
          className={`section ${activeSection !== 'dashboard' ? 'hidden' : ''}`}
        >
          <div className="section-header">
            <h2 className="section-title">Dashboard Overview</h2>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Expenses</h3>
              <p>₱565,000</p>
            </div>
            <div className="stat-card">
              <h3>Total Budget</h3>
              <p>₱800,000</p>
            </div>
            <div className="stat-card">
              <h3>Remaining Budget</h3>
              <p>₱235,000</p>
            </div>
          </div>

          <div className="posts-container">
            <h3 style={{ marginBottom: '8px' }}>Recent Documents</h3>
            <div className="post-card">
              <strong>Annual Expense Statement</strong>
              <p>Summary for university programs and events</p>
            </div>
            <div className="post-card" style={{ marginTop: '10px' }}>
              <strong>Fund & Asset Turnover - Semester 1</strong>
              <p>Detailed turnover report for departments</p>
            </div>
          </div>
        </section>

        {/* DOCUMENTS SECTION */}
        <section 
          id="documentsSection" 
          className={`section ${activeSection !== 'documents' ? 'hidden' : ''}`}
        >
          <div className="section-header" style={{ alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <h2 className="section-title">Documents</h2>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="search-bar" 
                style={{ width: '240px', marginLeft: '8px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="doc-filters" style={{ marginLeft: '8px' }}>
                <button 
                  className={`filter ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`filter ${activeFilter === 'financial' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('financial')}
                >
                  Financial Report
                </button>
                <button 
                  className={`filter ${activeFilter === 'turnover' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('turnover')}
                >
                  Turnover
                </button>
                <button 
                  className={`filter ${activeFilter === 'receipt' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('receipt')}
                >
                  Official Receipt
                </button>
              </div>
            </div>
          </div>

          <div className="documents-list">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="doc-card" data-tag={doc.tag}>
                <i className="bx bxs-file-pdf doc-icon"></i>
                <div className="doc-content">
                  <span className="doc-title">{doc.title}</span>
                  <span className="doc-desc">
                    <br />
                    {doc.description}
                  </span>
                  <span className="doc-meta">
                    <br />
                    {doc.date} · {doc.size} · PDF<br />
                  </span>
                  <span className="doc-type">{doc.type}</span>
                </div>
                <div className="doc-actions">
                  <button 
                    className="view-btn"
                    onClick={() => handleViewDocument(doc)}
                  >
                    View
                  </button>
                  <button 
                    className="download-btn" 
                    onClick={() => handleDownload(doc.file)}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* VIEW MODAL */}
      {documentModalVisible && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedDocument.title}</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>{selectedDocument.description}</p>
              <div className="file-preview">📄 File Preview (Coming Soon)</div>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
              <button className="close-modal" onClick={cancelLogout}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to log out? Any unsaved changes will be lost.</p>
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

export default Viewer;
