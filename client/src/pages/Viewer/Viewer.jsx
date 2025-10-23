import React, { useState, useEffect } from 'react';
import './Viewer.css';

const Viewer = () => {
  const [activeSection, setActiveSection] = useState('documents');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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

  // Load pinned state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebarPinned");
    if (saved === "true") {
      setIsPinned(true);
      setIsExpanded(true);
    }
  }, []);

  // Save pinned state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarPinned", isPinned);
  }, [isPinned]);

  const handleMenuClick = (section) => {
    setActiveSection(section);
    // Close mobile sidebar after navigation
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  // Advanced sidebar mouse handlers
  const handleMouseEnter = () => {
    if (!isPinned && window.innerWidth > 768) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned && window.innerWidth > 768) {
      setIsExpanded(false);
    }
  };

  // Toggle pin state or mobile drawer
  const handleSidebarToggle = () => {
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
  };

  // Close mobile sidebar when clicking overlay
  const handleOverlayClick = () => {
    setIsMobileOpen(false);
  };

  // Reusable function for sidebar icon clicks - expands sidebar before performing action
  const handleIconClick = (action) => {
    if (!isExpanded && !isPinned && window.innerWidth > 768) {
      setIsExpanded(true);
    }
    action();
  };

  // Handle keyboard navigation for menu items
  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleIconClick(action);
    }
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
    setActiveSection('documents');
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

  // Close sidebar on mobile when clicking outside
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

  // Handle window resize to manage sidebar state
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

  return (
    <>
      {/* Mobile Overlay */}
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
                <p className="subtext" style={{ color: '#B8B8B8' }}>Viewer</p>
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
            aria-label="Documents"
            aria-pressed={activeSection === 'documents'}
          >
            <i className="bx bxs-file-doc"></i>
            <span>Documents</span>
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
              <strong style={{ fontSize: '1.3em' }}>Documents</strong>
            </h1>
          </div>

          <div className="center-actions">
           
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

        {/* DOCUMENTS SECTION */}
        <section 
          id="documentsSection" 
          className={`section ${activeSection !== 'documents' ? 'hidden' : ''}`}
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            width: '100%'
          }}
        >
          {/* Budget Overview */}
          <div style={{ marginBottom: '32px', marginTop: '20px' }}>
            <h2 style={{ 
              fontWeight: 'bold', 
              fontSize: '1.2em', 
              marginBottom: '20px', 
              color: 'var(--deep)',
              textAlign: 'center'
            }}>Budget Overview</h2>
            <div className="stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              justifyContent: 'center',
              alignItems: 'stretch'
            }}>
              <div className="stat-card" style={{ 
                padding: '24px 20px', 
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '12px' }}>Total Expenses</h3>
                <p style={{ fontSize: '1.4em', fontWeight: '600' }}>₱565,000</p>
              </div>
              <div className="stat-card" style={{ 
                padding: '24px 20px', 
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '12px' }}>Total Budget</h3>
                <p style={{ fontSize: '1.4em', fontWeight: '600' }}>₱800,000</p>
              </div>
              <div className="stat-card" style={{ 
                padding: '24px 20px', 
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '12px' }}>Remaining Budget</h3>
                <p style={{ fontSize: '1.4em', fontWeight: '600' }}>₱235,000</p>
              </div>
            </div>
          </div>
          <div className="section-header" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '20px', 
            marginBottom: '32px',
            padding: '0 16px'
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '20px', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '800px'
            }}>
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="search-bar" 
                style={{ 
                  width: '280px',
                  minWidth: '240px',
                  maxWidth: '100%'
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="doc-filters" style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
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

          <div className="documents-list" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'start'
          }}>
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

          {/* About Member Access Information Card */}
          <div className="w-full max-w-full mx-auto mt-8 mb-12 bg-white border-l-4 border-l-[#122090] rounded-lg shadow-sm border border-gray-200 p-6" style={{ margin: '2rem 0 3rem 0' }}>
            <h3 className="text-lg font-semibold text-[#122090] mb-4">
              About Member Access
            </h3>
            
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              As a member of <strong>Information Systems and Information Technology Education</strong>, you have view-only access to all documents submitted by your organization.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-sm mt-1 flex-shrink-0">✓</span>
                <span className="text-gray-700 text-base leading-relaxed">
                  View all documents submitted by your organization
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-sm mt-1 flex-shrink-0">✓</span>
                <span className="text-gray-700 text-base leading-relaxed">
                  Track approval status and progress
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-sm mt-1 flex-shrink-0">✓</span>
                <span className="text-gray-700 text-base leading-relaxed">
                  Download approved certificates
                </span>
              </div>
            </div>
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
    </>
  );
};

export default Viewer;
