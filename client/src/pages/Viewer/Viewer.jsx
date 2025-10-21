import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Viewer.css';

const Viewer = () => {
  const navigate = useNavigate();
  
  const [user] = useState(() => {
    // Get user data from localStorage or use default
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
      const userData = JSON.parse(sessionData);
      return {
        name: userData.name,
        organization: userData.organization,
        role: 'Organization Member'
      };
    }
    return {
      name: 'Jayson',
      organization: 'Sample Organization',
      role: 'Organization Member'
    };
  });

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/');
  };

  const [documents] = useState([
    {
      id: 1,
      title: 'Q3 Accomplishment Report',
      type: 'Accomplishment Report',
      description: 'Third quarter accomplishment report detailing all activities and events',
      status: 'approved',
      submittedDate: '10/10/2024',
      submittedBy: 'Jose Rizal'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');

  // Calculate statistics
  const totalDocuments = documents.length;
  const approvedDocuments = documents.filter(doc => doc.status === 'approved').length;
  const inProgressDocuments = documents.filter(doc => doc.status === 'in-progress').length;

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All Types' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="viewer">
      {/* Navigation Bar */}
      <nav className="viewer__nav">
        <div className="viewer__nav-content">
          <div className="viewer__logo">
            <div className="logo-circle">PUP</div>
            <div className="logo-text">
              <h2>PUPSMB TransparaTech</h2>
              <span>Transparency & Governance System</span>
            </div>
          </div>
          
          <div className="viewer__user-profile">
            <div className="user-icon">👤</div>
            <span className="user-name">{user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="viewer__main">
        {/* Header Section */}
        <div className="viewer__header">
          <div className="viewer__header-content">
            <div className="dashboard-title">
              <div className="title-icon">👤</div>
              <div>
                <h1>Member Dashboard</h1>
                <p>Welcome back, {user.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Info Card */}
        <div className="viewer__content">
          <div className="organization-card">
            <h3>{user.organization}</h3>
            <p>{user.role}</p>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">📄</div>
              <div className="stat-content">
                <h3>{totalDocuments}</h3>
                <p>Total Documents</p>
                <span>Organization documents</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">✅</div>
              <div className="stat-content">
                <h3>{approvedDocuments}</h3>
                <p>Approved</p>
                <span>Successfully approved</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">⏳</div>
              <div className="stat-content">
                <h3>{inProgressDocuments}</h3>
                <p>In Progress</p>
                <span>Under review</span>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="documents-section">
            <div className="documents-header">
              <h2>Organization Documents</h2>
              <p>View all documents submitted by {user.organization}</p>
            </div>

            {/* Search and Filter */}
            <div className="documents-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="All Types">All Types</option>
                <option value="Accomplishment Report">Accomplishment Report</option>
                <option value="Financial Report">Financial Report</option>
                <option value="Activity Report">Activity Report</option>
              </select>
            </div>

            {/* Documents List */}
            <div className="documents-list">
              {filteredDocuments.map(document => (
                <div key={document.id} className="document-card">
                  <div className="document-info">
                    <div className="document-header">
                      <h3>{document.title}</h3>
                      <span className={`status-badge ${document.status}`}>
                        {document.status === 'approved' ? 'approved' : 'in progress'}
                      </span>
                      <span className="document-type">{document.type}</span>
                    </div>
                    <p className="document-description">{document.description}</p>
                    <div className="document-meta">
                      <span>Submitted: {document.submittedDate}</span>
                      <span>By: {document.submittedBy}</span>
                    </div>
                  </div>
                  <div className="document-actions">
                    <button className="action-btn view">
                      <span className="btn-icon">👁</span>
                      View
                    </button>
                    <button className="action-btn download">
                      <span className="btn-icon">⬇</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About Member Access */}
          <div className="access-info">
            <h3>About Member Access</h3>
            <p>
              As a member of <strong>{user.organization}</strong>, you have view-only access to all documents submitted by your organization.
            </p>
            <ul className="access-features">
              <li>
                <span className="feature-icon">✅</span>
                View all documents submitted by your organization
              </li>
              <li>
                <span className="feature-icon">✅</span>
                Track approval status and progress
              </li>
              <li>
                <span className="feature-icon">✅</span>
                Download approved certificates
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Viewer;
