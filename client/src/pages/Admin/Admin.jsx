// React core and routing imports
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  // Navigation hook for routing
  const navigate = useNavigate();
  
  // User authentication state - retrieved from localStorage
  const [userSession] = useState(() => {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  });
  
  // UI state management
  const [activeSection, setActiveSection] = useState('dashboard'); // Current active section
  const [isExpanded, setIsExpanded] = useState(false); // Sidebar expansion state
  const [isPinned, setIsPinned] = useState(false); // Sidebar pin state
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile sidebar state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // Profile dropdown visibility
  const [globalSearch, setGlobalSearch] = useState(''); // Search query state
  const [showReviewModal, setShowReviewModal] = useState(false); // Review modal visibility
  const [selectedDocument, setSelectedDocument] = useState(null); // Selected document for review


  // Sample data - pending documents awaiting review
  const [pendingDocuments] = useState([
    {
      id: 1,
      title: 'Budget Allocation Q1 2024',
      organization: 'JPIA',
      type: 'Financial Report',
      author: 'Juan Dela Cruz',
      waitingDays: 2,
      urgent: false,
      status: 'pending'
    },
    {
      id: 2,
      title: 'Tech Summit 2024 Proposal',
      organization: 'ISITE',
      type: 'Event Proposal',
      author: 'Maria Santos',
      waitingDays: 5,
      urgent: true,
      status: 'pending'
    },
    {
      id: 3,
      title: 'Annual Security Audit Report',
      organization: 'JPIA',
      type: 'Security Report',
      author: 'Pedro Martinez',
      waitingDays: 1,
      urgent: false,
      status: 'pending'
    },
    {
      id: 4,
      title: 'Infrastructure Upgrade Proposal',
      organization: 'ISITE',
      type: 'Technical Proposal',
      author: 'Ana Garcia',
      waitingDays: 3,
      urgent: true,
      status: 'pending'
    }
  ]);

  // Complete document archive - includes pending and completed documents
  const [allDocuments] = useState([
    ...pendingDocuments,
    {
      id: 5,
      title: 'Q4 Performance Review',
      organization: 'JPIA',
      type: 'Performance Report',
      author: 'Carlos Rodriguez',
      waitingDays: 0,
      urgent: false,
      status: 'completed'
    },
    {
      id: 6,
      title: 'Network Maintenance Schedule',
      organization: 'ISITE',
      type: 'Maintenance Plan',
      author: 'Luis Fernandez',
      waitingDays: 0,
      urgent: false,
      status: 'completed'
    }
  ]);

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

  // Navigation handler - switches active section and closes mobile sidebar
  const handleMenuClick = (section) => {
    setActiveSection(section);
    // Close mobile sidebar after navigation
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  // Sidebar mouse handlers - expand on hover for desktop
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

  // Sidebar toggle handler - manages pin state and mobile drawer
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

  // Overlay click handler - closes mobile sidebar
  const handleOverlayClick = () => {
    setIsMobileOpen(false);
  };

  // Icon click handler - expands sidebar before executing action
  const handleIconClick = (action) => {
    if (!isExpanded && !isPinned && window.innerWidth > 768) {
      setIsExpanded(true);
    }
    action();
  };

  // Keyboard navigation handler - enables Enter/Space key navigation
  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleIconClick(action);
    }
  };

  // Document filtering functions - search across multiple fields
  const filteredPendingDocuments = useCallback(() => {
    if (!globalSearch.trim()) return pendingDocuments;
    
    const searchTerm = globalSearch.toLowerCase();
    return pendingDocuments.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm) ||
      doc.organization.toLowerCase().includes(searchTerm) ||
      doc.type.toLowerCase().includes(searchTerm) ||
      doc.author.toLowerCase().includes(searchTerm)
    );
  }, [globalSearch, pendingDocuments]);

  const filteredAllDocuments = useCallback(() => {
    if (!globalSearch.trim()) return allDocuments;
    
    const searchTerm = globalSearch.toLowerCase();
    return allDocuments.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm) ||
      doc.organization.toLowerCase().includes(searchTerm) ||
      doc.type.toLowerCase().includes(searchTerm) ||
      doc.author.toLowerCase().includes(searchTerm)
    );
  }, [globalSearch, allDocuments]);

  // Review modal handlers
  const handleReview = useCallback((document, isUrgent = false) => {
    setSelectedDocument(document);
    setShowReviewModal(true);
  }, []);

  // Modal close handler - resets selected document
  const handleCloseModal = useCallback(() => {
    setShowReviewModal(false);
    setSelectedDocument(null);
  }, []);

  // Review confirmation handler - simulates review start
  const handleConfirmReview = useCallback(() => {
    if (selectedDocument) {
      // In real app, this would navigate to review interface
      alert(`Review Started!\n\nYou are now reviewing: ${selectedDocument.title}\n\nThis would redirect to the review interface in a full implementation.`);
      handleCloseModal();
    }
  }, [selectedDocument, handleCloseModal]);

  // Logout handler - clears session and redirects
  const handleLogout = useCallback(() => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userSession');
      sessionStorage.removeItem('userSession');
      window.location.href = '/login';
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.account')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

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

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!userSession || (userSession.role !== 'admin' && userSession.role !== 'administrator')) {
      alert('Access denied. Admin credentials required.');
      navigate('/login');
    }
  }, [userSession, navigate]);

  // Authentication guard - show loading screen if not authenticated
  if (!userSession || (userSession.role !== 'admin' && userSession.role !== 'administrator')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Admin credentials required.</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Dashboard statistics renderer - calculates and displays key metrics
  const renderStats = () => {
    const urgentCount = pendingDocuments.filter(doc => doc.urgent).length;
    const totalPending = pendingDocuments.length;
    const completedToday = allDocuments.filter(doc => doc.status === 'completed').length;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-indigo-800 font-semibold text-sm">Pending Review</h3>
            <div className="text-yellow-500 text-2xl">📋</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{totalPending}</div>
          <span className="text-xs text-gray-500">Awaiting your review</span>
          {totalPending > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((totalPending / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-indigo-800 font-semibold text-sm">Completed</h3>
            <div className="text-blue-500 text-2xl">✅</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{completedToday}</div>
          <span className="text-xs text-gray-500">Documents reviewed</span>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-indigo-800 font-semibold text-sm">Total Documents</h3>
            <div className="text-green-500 text-2xl">📊</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{allDocuments.length}</div>
          <span className="text-xs text-gray-500">In system</span>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-indigo-800 font-semibold text-sm">Urgent</h3>
            <div className="text-red-500 text-2xl">🚨</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{urgentCount}</div>
          <span className="text-xs text-gray-500">Need immediate attention</span>
          {urgentCount > 0 && (
            <div className="mt-3">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold animate-pulse">
                Action Required
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Pending reviews renderer - displays documents awaiting review
  const renderPendingReviews = () => {
    const documentsToShow = filteredPendingDocuments();
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Pending Reviews</h2>
          {globalSearch && (
            <span className="text-sm text-gray-500">
              {documentsToShow.length} result{documentsToShow.length !== 1 ? 's' : ''} found
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-6">Documents awaiting your approval</p>
        
        {documentsToShow.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {globalSearch ? 'No documents match your search.' : 'No pending reviews at the moment.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {documentsToShow.map(doc => (
              <div 
                key={doc.id}
                className={`p-4 rounded-lg flex justify-between items-center transition-all duration-200 hover:shadow-md ${
                  doc.urgent 
                    ? 'bg-red-50 border-l-4 border-red-400' 
                    : 'bg-indigo-50 hover:bg-indigo-100'
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">{doc.title}</h3>
                  <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      doc.organization === 'JPIA' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {doc.organization}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      doc.type.includes('Report') 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {doc.type}
                    </span>
                    <span>by {doc.author}</span>
                    <span className={`${doc.urgent ? 'text-red-600' : 'text-orange-600'}`}>
                      • {doc.waitingDays} day{doc.waitingDays !== 1 ? 's' : ''} waiting
                    </span>
                    {doc.urgent && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <button 
                    onClick={() => handleReview(doc, doc.urgent)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      doc.urgent
                        ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md hover:shadow-lg'
                        : 'bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-yellow-500 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {doc.urgent ? 'Review Now' : 'Review'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile sidebar overlay - darkens background when sidebar is open */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* Review confirmation modal - displays document details */}
      {showReviewModal && selectedDocument && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-200 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header - shows urgency status */}
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedDocument.urgent ? 'Urgent Review Required' : 'Review Document'}
              </h2>
            </div>

            {/* Document information display */}
            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Document:</p>
                <p className="font-semibold text-gray-800">{selectedDocument.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Author:</p>
                  <p className="font-medium text-gray-800">{selectedDocument.author}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Organization:</p>
                  <p className="font-medium text-gray-800">{selectedDocument.organization}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Type:</p>
                  <p className="font-medium text-gray-800">{selectedDocument.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Waiting:</p>
                  <p className={`font-medium ${selectedDocument.urgent ? 'text-red-600' : 'text-orange-600'}`}>
                    {selectedDocument.waitingDays} day{selectedDocument.waitingDays !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {selectedDocument.urgent && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">
                    ⚠️ This document requires immediate attention!
                  </p>
                </div>
              )}
            </div>

            {/* User instruction message */}
            <p className="text-gray-600 text-center mb-6">
              Click OK to proceed with the review process.
            </p>

            {/* Modal action buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmReview}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  selectedDocument.urgent
                    ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-lg'
                    : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 shadow-md'
                }`}
              >
                {selectedDocument.urgent ? 'Start Urgent Review' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`dashboard-container ${
        isMobileOpen
          ? 'mobile-sidebar-open'
          : isExpanded || isPinned
          ? 'sidebar-expanded'
          : 'sidebar-collapsed'
      }`}>
        {/* Collapsible navigation sidebar */}
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
          {/* Sidebar header with brand and toggle button */}
          <div className="sidebar-header">
            <div className="brand-group">
              <h2 className="brand" style={{ color: 'white' }}>TransparaTech</h2>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <p className="subtext" style={{ color: '#B8B8B8' }}>Admin</p>
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

          {/* Main navigation menu */}
          <nav className="sidebar-menu" role="navigation" aria-label="Main">
            <button 
              className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleIconClick(() => handleMenuClick('dashboard'))}
              onKeyDown={(e) => handleKeyDown(e, () => handleMenuClick('dashboard'))}
              type="button"
              aria-label="Dashboard"
              aria-pressed={activeSection === 'dashboard'}
            >
              <i className="bx bxs-dashboard"></i>
              <span>Dashboard</span>
            </button>

            <button 
              className={`menu-item ${activeSection === 'review-queue' ? 'active' : ''}`}
              onClick={() => handleIconClick(() => handleMenuClick('review-queue'))}
              onKeyDown={(e) => handleKeyDown(e, () => handleMenuClick('review-queue'))}
              type="button"
              aria-label="Review Queue"
              aria-pressed={activeSection === 'review-queue'}
            >
              <i className="bx bx-task"></i>
              <span>Review Queue</span>
            </button>

            <button 
              className={`menu-item ${activeSection === 'all-documents' ? 'active' : ''}`}
              onClick={() => handleIconClick(() => handleMenuClick('all-documents'))}
              onKeyDown={(e) => handleKeyDown(e, () => handleMenuClick('all-documents'))}
              type="button"
              aria-label="All Documents"
              aria-pressed={activeSection === 'all-documents'}
            >
              <i className="bx bxs-file-doc"></i>
              <span>All Documents</span>
            </button>
          </nav>

          {/* Sidebar footer with copyright and sign out */}
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

        {/* Main content area */}
        <main className="main-content flex flex-col min-h-screen">
          {/* Top navigation bar */}
          <header className="topbar flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            {/* Page title - dynamically changes based on active section */}
            <div className="left-actions flex-shrink-0">
              <h1 className="page-title">
                <strong style={{ fontSize: '1.3em' }}>
                  {activeSection === 'review-queue' ? 'Review Queue' : 
                   activeSection === 'all-documents' ? 'All Documents' : 
                   'Admin Dashboard'}
                </strong>
              </h1>
            </div>

            {/* Global search input - desktop only */}
            <div className="center-actions flex-1 max-w-md mx-4 hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search current section..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="w-full h-10 px-4 pr-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Mobile search button - shows on small screens */}
            <div className="center-actions-mobile sm:hidden">
              <button 
                onClick={() => setGlobalSearch('')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* User profile section with dropdown */}
            <div className="right-actions flex-shrink-0">
              <div className="account">
                <img 
                  src="/api/placeholder/40/40" 
                  alt="User" 
                  className="profile-img" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileDropdown(!showProfileDropdown);
                  }}
                />
                {/* Profile dropdown menu */}
                <div className={`account-dropdown ${showProfileDropdown ? 'visible' : ''}`}>
                  <div className="account-info">
                    <img src="/api/placeholder/42/42" alt="User" />
                    <div className="details">
                      <span className="name">{userSession?.name || 'Maria Santos'}</span>
                      <span className="email">{userSession?.email || 'admin@pupsmb.edu.ph'}</span>
                      <span className="role">Admin</span>
                    </div>
                  </div>
                  <div className="divider"></div>
                  <button onClick={handleLogout}>Log Out</button>
                </div>
              </div>
            </div>
          </header>

          {/* Main content area - switches based on active section */}
          <section className="content-wrapper flex-1 p-6 bg-gray-50 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Dashboard section - shows stats and pending reviews */}
              {activeSection === 'dashboard' && (
                <div className="section dashboard-section space-y-6">
                  {renderStats()}
                  {renderPendingReviews()}
                </div>
              )}

            {/* Review queue section - detailed pending reviews */}
            {activeSection === 'review-queue' && (
              <div className="section review-queue-section">
                <div className="section-header mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Review Queue</h1>
                  <p className="text-gray-600 mt-2">All documents pending review</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Queue Overview</h2>
                    {globalSearch && (
                      <span className="text-sm text-gray-500">
                        {filteredPendingDocuments().length} result{filteredPendingDocuments().length !== 1 ? 's' : ''} found
                      </span>
                    )}
                  </div>
                  
                  {filteredPendingDocuments().length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">
                        {globalSearch ? 'No documents match your search.' : 'No documents in review queue.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredPendingDocuments().map(doc => (
                        <div 
                          key={doc.id}
                          className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-lg ${
                            doc.urgent 
                              ? 'border-red-200 bg-red-50 hover:bg-red-100' 
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="font-bold text-lg text-gray-900">{doc.title}</h3>
                                {doc.urgent && (
                                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                                    URGENT
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center flex-wrap gap-3 text-sm">
                                <span className={`px-3 py-1 rounded-full font-medium ${
                                  doc.organization === 'JPIA' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {doc.organization}
                                </span>
                                <span className={`px-3 py-1 rounded-full ${
                                  doc.type.includes('Report') 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-orange-100 text-orange-800'
                                }`}>
                                  {doc.type}
                                </span>
                                <span className="text-gray-600">{doc.author}</span>
                                <span className={`font-medium ${doc.urgent ? 'text-red-600' : 'text-orange-600'}`}>
                                  {doc.waitingDays} day{doc.waitingDays !== 1 ? 's' : ''} waiting
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleReview(doc, doc.urgent)}
                              className={`ml-6 px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                doc.urgent
                                  ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg hover:shadow-xl'
                                  : 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500 shadow-md hover:shadow-lg'
                              }`}
                            >
                              {doc.urgent ? 'Review Now' : 'Review'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* All documents section - complete archive */}
            {activeSection === 'all-documents' && (
              <div className="section all-documents-section">
                <div className="section-header mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">All Documents</h1>
                  <p className="text-gray-600 mt-2">Complete document archive</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Document Archive</h2>
                    {globalSearch && (
                      <span className="text-sm text-gray-500">
                        {filteredAllDocuments().length} result{filteredAllDocuments().length !== 1 ? 's' : ''} found
                      </span>
                    )}
                  </div>
                  
                  {filteredAllDocuments().length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">
                        {globalSearch ? 'No documents match your search.' : 'No documents in archive.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredAllDocuments().map(doc => (
                        <div 
                          key={doc.id}
                          className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-md ${
                            doc.status === 'completed' 
                              ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                              : doc.urgent 
                                ? 'border-red-200 bg-red-50 hover:bg-red-100' 
                                : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg text-gray-900">{doc.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  doc.status === 'completed' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-yellow-500 text-black'
                                }`}>
                                  {doc.status === 'completed' ? 'Completed' : 'Pending'}
                                </span>
                                {doc.urgent && doc.status === 'pending' && (
                                  <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                                    Urgent
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center flex-wrap gap-3 text-sm">
                                <span className={`px-3 py-1 rounded-full font-medium ${
                                  doc.organization === 'JPIA' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {doc.organization}
                                </span>
                                <span className={`px-3 py-1 rounded-full ${
                                  doc.type.includes('Report') 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-orange-100 text-orange-800'
                                }`}>
                                  {doc.type}
                                </span>
                                <span className="text-gray-600">{doc.author}</span>
                                {doc.status === 'pending' && (
                                  <span className={`font-medium ${doc.urgent ? 'text-red-600' : 'text-orange-600'}`}>
                                    {doc.waitingDays} day{doc.waitingDays !== 1 ? 's' : ''} waiting
                                  </span>
                                )}
                              </div>
                            </div>
                            {doc.status === 'pending' && (
                              <button 
                                onClick={() => handleReview(doc, doc.urgent)}
                                className={`ml-4 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                  doc.urgent
                                    ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
                                    : 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500'
                                }`}
                              >
                                {doc.urgent ? 'Review Now' : 'Review'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Admin;
