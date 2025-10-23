import React from 'react';

const Sidebar = ({ 
  activeSection, 
  handleMenuClick, 
  sidebarProps, 
  handleKeyDown, 
  handleLogout 
}) => {
  const {
    isExpanded,
    isPinned,
    isMobileOpen,
    handleMouseEnter,
    handleMouseLeave,
    handleSidebarToggle,
    handleIconClick
  } = sidebarProps;

  return (
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
            <p className="subtext" style={{ color: '#B8B8B8' }}>Super Admin</p>
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
          className={`menu-item ${activeSection === 'users' ? 'active' : ''}`}
          onClick={() => handleIconClick(() => handleMenuClick('users'))}
          onKeyDown={(e) => handleKeyDown(e, () => handleMenuClick('users'))}
          type="button"
          aria-label="Users"
          aria-pressed={activeSection === 'users'}
        >
          <i className="bx bx-group"></i>
          <span>Users</span>
        </button>

        <button 
          className={`menu-item ${activeSection === 'documents' ? 'active' : ''}`}
          onClick={() => handleIconClick(() => handleMenuClick('documents'))}
          onKeyDown={(e) => handleKeyDown(e, () => handleMenuClick('documents'))}
          type="button"
          aria-label="Documents"
          aria-pressed={activeSection === 'documents'}
        >
          <i className="bx bx-file"></i>
          <span>Documents</span>
        </button>

        <button 
          className={`menu-item ${activeSection === 'organizations' ? 'active' : ''}`}
          onClick={() => handleIconClick(() => handleMenuClick('organizations'))}
          onKeyDown={(e) => handleKeyDown(e, () => handleMenuClick('organizations'))}
          type="button"
          aria-label="Organizations"
          aria-pressed={activeSection === 'organizations'}
        >
          <i className="bx bx-buildings"></i>
          <span>Organizations</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button 
          className="footer-item" 
          onClick={() => handleIconClick(handleLogout)}
          aria-label="Sign Out"
        >
          <i className="bx bx-log-out"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;