import React, { useState, useEffect, useCallback } from 'react';
import './SuperAdmin.css';

// Custom hooks
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../hooks/useSidebar';
import { useModal } from '../../hooks/useModal';

// Components
import Sidebar from '../../components/SuperAdmin/Sidebar';
import Dashboard from '../../components/SuperAdmin/Dashboard';
import UserManagement from '../../components/SuperAdmin/UserManagement';
import DocumentManagement from '../../components/SuperAdmin/DocumentManagement';
import OrganizationManagement from '../../components/SuperAdmin/OrganizationManagement';
import Modal from '../../components/SuperAdmin/Modal';

// Context
import { SuperAdminProvider, useSuperAdminData } from '../../contexts/SuperAdminContext';

const SuperAdminContent = () => {
  const { userSession, isAuthorized, logout } = useAuth();
  const sidebarProps = useSidebar();
  const { showModal, modalType, openModal, closeModal } = useModal();
  const { users, documents, organizations, addUser, addOrganization } = useSuperAdminData();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');

  const handleMenuClick = useCallback((section) => {
    setActiveSection(section);
    setGlobalSearch('');
  }, []);

  const handleKeyDown = useCallback((event, callback) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  }, []);

  const handleAddUser = useCallback((userData) => {
    addUser(userData);
    closeModal();
    setActiveSection('users');
  }, [addUser, closeModal]);

  const handleAddOrganization = useCallback((orgData) => {
    addOrganization(orgData);
    closeModal();
    setActiveSection('organizations');
  }, [addOrganization, closeModal]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Show loading or redirect message if not authenticated
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">SuperAdmin credentials required.</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement users={users} openModal={openModal} />;
      case 'documents':
        return <DocumentManagement 
          documents={documents} 
          sortBy={sortBy} 
          setSortBy={setSortBy} 
          filterBy={filterBy} 
          setFilterBy={setFilterBy} 
        />;
      case 'organizations':
        return <OrganizationManagement organizations={organizations} openModal={openModal} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarProps.isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={sidebarProps.handleOverlayClick}
        ></div>
      )}

      <div className={`dashboard-container ${
        sidebarProps.isMobileOpen
          ? 'mobile-sidebar-open'
          : sidebarProps.isExpanded || sidebarProps.isPinned
          ? 'sidebar-expanded'
          : 'sidebar-collapsed'
      }`}>
        <Sidebar 
          activeSection={activeSection}
          handleMenuClick={handleMenuClick}
          sidebarProps={sidebarProps}
          handleKeyDown={handleKeyDown}
          handleLogout={logout}
        />

        {/* MAIN */}
        <main className="main-content flex flex-col min-h-screen">
          {/* TOPBAR */}
          <header className="topbar flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="left-actions flex-shrink-0">
              <h1 className="page-title">
                <strong style={{ fontSize: '1.3em' }}>
                  {activeSection === 'users' ? 'User Management' : 
                   activeSection === 'documents' ? 'Document Management' : 
                   activeSection === 'organizations' ? 'Organization Management' :
                   'Super Admin Dashboard'}
                </strong>
              </h1>
            </div>

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

            {/* Mobile search button */}
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

            <div className="right-actions flex-shrink-0">
              {/* PROFILE SECTION */}
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
                {showProfileDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <strong>{userSession?.name || 'Super Admin'}</strong>
                      <span>{userSession?.email || 'superadmin@transparatech.com'}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button onClick={logout}>Log Out</button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* CONTENT SECTIONS */}
          <section className="content-wrapper flex-1 p-6 bg-gray-50 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {renderContent()}
            </div>
          </section>
        </main>
      </div>

      <Modal 
        showModal={showModal}
        modalType={modalType}
        closeModal={closeModal}
        addUser={handleAddUser}
        addOrganization={handleAddOrganization}
      />
    </>
  );
};

// Main SuperAdmin component with context provider
const SuperAdmin = () => {
  return (
    <SuperAdminProvider>
      <SuperAdminContent />
    </SuperAdminProvider>
  );
};

export default SuperAdmin;