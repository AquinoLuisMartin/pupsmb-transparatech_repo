import React, { useState, useEffect, useCallback } from 'react';
import './SuperAdmin.css';

const SuperAdmin = () => {
  // Check authentication on component mount
  const [userSession] = useState(() => {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('tt_sidebar_collapsed') === 'true';
  });
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Sample data
  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Dela Cruz', email: 'juan@pup.edu.ph', organization: 'Student Council', role: 'President', status: 'Active' },
    { id: 2, name: 'Maria Santos', email: 'maria@pup.edu.ph', organization: 'Finance Department', role: 'Treasurer', status: 'Active' }
  ]);

  const [documents] = useState([
    { id: 1, title: 'Budget Report Q1', uploader: 'Maria Santos', organization: 'Finance', type: 'report', status: 'Approved' },
    { id: 2, title: 'Event Proposal', uploader: 'Juan Dela Cruz', organization: 'Student Council', type: 'proposal', status: 'Pending' }
  ]);

  const [organizations, setOrganizations] = useState([
    { id: 1, name: 'ISITE', head: 'Levie Jean Panesa', status: 'Active' },
    { id: 2, name: 'Student Council', head: 'Roxanne Reyes', status: 'Active' }
  ]);

  const handleSidebarToggle = useCallback(() => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    localStorage.setItem('tt_sidebar_collapsed', newCollapsed ? 'true' : 'false');
  }, [sidebarCollapsed]);

  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    setGlobalSearch('');
  }, []);

  const handleLogout = useCallback(() => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userSession');
      sessionStorage.removeItem('userSession');
      window.location.href = '/login';
    }
  }, []);

  const openModal = useCallback((type) => {
    setModalType(type);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalType('');
  }, []);

  const addUser = useCallback((userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      status: 'Active'
    };
    setUsers(prev => [newUser, ...prev]);
    closeModal();
    setActiveSection('users');
  }, [users.length, closeModal]);

  const addOrganization = useCallback((orgData) => {
    const newOrg = {
      id: organizations.length + 1,
      ...orgData,
      status: 'Active'
    };
    setOrganizations(prev => [newOrg, ...prev]);
    closeModal();
    setActiveSection('organizations');
  }, [organizations.length, closeModal]);

  // Filter functions
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.organization.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(docSearch.toLowerCase()) ||
                         doc.uploader.toLowerCase().includes(docSearch.toLowerCase()) ||
                         doc.organization.toLowerCase().includes(docSearch.toLowerCase());
    const matchesFilter = filterBy === 'all' || doc.type === filterBy;
    return matchesSearch && matchesFilter;
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowProfileDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Redirect if not authenticated or not superadmin
  useEffect(() => {
    if (!userSession || userSession.role !== 'superadmin') {
      alert('Access denied. SuperAdmin credentials required.');
      window.location.href = '/login';
    }
  }, [userSession]);

  // Show loading or redirect message if not authenticated
  if (!userSession || userSession.role !== 'superadmin') {
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

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm text-center stat-card hover-lift transition-all duration-300">
        <h3 className="text-indigo-800 font-semibold text-sm mb-2">Total Users</h3>
        <p className="text-2xl font-bold text-gray-800">1,284</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm text-center stat-card hover-lift transition-all duration-300">
        <h3 className="text-indigo-800 font-semibold text-sm mb-2">Total Documents</h3>
        <p className="text-2xl font-bold text-gray-800">3,847</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm text-center stat-card hover-lift transition-all duration-300">
        <h3 className="text-indigo-800 font-semibold text-sm mb-2">Pending Reviews</h3>
        <p className="text-2xl font-bold text-gray-800">47</p>
      </div>
    </div>
  );

  const renderPosts = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Organization Posts</h2>
      <div className="space-y-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800">Finance Department</h3>
          <p className="text-gray-600 text-sm">Quarterly report has been submitted and approved.</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800">Student Council</h3>
          <p className="text-gray-600 text-sm">Upcoming Intramural Events proposal submitted.</p>
        </div>
      </div>
    </div>
  );

  const renderTable = (data, columns, type) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-indigo-50">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-indigo-100">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
            {data.map((item, index) => (
            <tr key={item.id} className={`table-row-hover transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              {type === 'users' && (
                <>
                  <td className="px-4 py-3 text-sm">{item.name}</td>
                  <td className="px-4 py-3 text-sm">{item.email}</td>
                  <td className="px-4 py-3 text-sm">{item.organization}</td>
                  <td className="px-4 py-3 text-sm">{item.role}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs status-badge">
                      {item.status}
                    </span>
                  </td>
                </>
              )}
              {type === 'documents' && (
                <>
                  <td className="px-4 py-3 text-sm">{item.title}</td>
                  <td className="px-4 py-3 text-sm">{item.uploader}</td>
                  <td className="px-4 py-3 text-sm">{item.organization}</td>
                  <td className="px-4 py-3 text-sm capitalize">{item.type}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs status-badge ${
                      item.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </>
              )}
              {type === 'organizations' && (
                <>
                  <td className="px-4 py-3 text-sm">{item.name}</td>
                  <td className="px-4 py-3 text-sm">{item.head}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs status-badge">
                      {item.status}
                    </span>
                  </td>
                </>
              )})
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop" onClick={closeModal}>
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 modal-content" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4">
            {modalType === 'user' ? 'Add New User' : 'Add Organization'}
          </h3>
          
          {modalType === 'user' ? (
            <UserForm onSubmit={addUser} onCancel={closeModal} />
          ) : (
            <OrganizationForm onSubmit={addOrganization} onCancel={closeModal} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-indigo-800 text-white flex flex-col sidebar-transition overflow-hidden ${
        sidebarCollapsed ? 'w-20' : 'w-60'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className={`sidebar-content-transition ${sidebarCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
            <h2 className="text-lg font-bold">TransparaTech</h2>
            <p className="text-xs opacity-80">PUP Sta. Maria</p>
          </div>
          <button
            onClick={handleSidebarToggle}
            className="p-2 hover:bg-indigo-700 rounded-lg transition-colors duration-200 focus-ring"
          >
            <i className={`bx bx-chevron-${sidebarCollapsed ? 'right' : 'left'} text-xl transition-transform duration-300`}></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', icon: 'bx-line-chart', label: 'Dashboard' },
            { id: 'users', icon: 'bx-group', label: 'Users' },
            { id: 'documents', icon: 'bx-file', label: 'Documents' },
            { id: 'organizations', icon: 'bx-buildings', label: 'Organizations' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-indigo-700 focus-ring ${
                activeSection === item.id ? 'bg-indigo-700 menu-item-active' : ''
              }`}
            >
              <i className={`bx ${item.icon} min-w-[20px] text-center text-lg hover:scale-110 transition-transform duration-200`}></i>
              <span className={`sidebar-content-transition ${sidebarCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`p-4 text-center text-xs opacity-70 sidebar-content-transition ${
          sidebarCollapsed ? 'opacity-0 invisible' : 'opacity-70 visible'
        }`}>
          © TransparaTech
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-800 capitalize">{activeSection}</h1>
          </div>

          <div className="flex-2 px-8">
              <input
              type="text"
              placeholder="Search current section..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 search-input transition-all duration-200"
            />
          </div>

          <div className="flex-1 flex items-center justify-end space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                }}
                className="p-2 text-gray-600 hover:text-gray-800 relative focus-ring rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <i className="bx bx-bell text-xl"></i>
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg p-4 w-64 z-50 dropdown-enter">
                  <h4 className="font-semibold mb-3">Recent Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 border-b border-gray-100 hover:bg-gray-50 rounded">New document submitted - Student Council</div>
                    <div className="p-2 border-b border-gray-100 hover:bg-gray-50 rounded">User account created - Finance</div>
                    <div className="p-2 hover:bg-gray-50 rounded">Document approved - Academic Affairs</div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileDropdown(!showProfileDropdown);
                }}
                className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden"
              >
                <img
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg p-4 w-48 z-50 dropdown-enter">
                  <p className="font-semibold mb-1">{userSession?.name || 'Super Admin'}</p>
                  <p className="text-sm text-gray-600 mb-3">{userSession?.email || 'admin@transparatech.ph'}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-200 btn-primary-hover focus-ring"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 content-scroll">
          {activeSection === 'dashboard' && (
            <div>
              {renderStats()}
              {renderPosts()}
            </div>
          )}

          {activeSection === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Users Management</h2>
                <button
                  onClick={() => openModal('user')}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-200 btn-primary-hover focus-ring"
                >
                  Add New User
                </button>
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="mb-4 px-4 py-2 border border-gray-300 rounded-lg w-96 focus:outline-none focus:ring-2 focus:ring-indigo-500 search-input transition-all duration-200"
              />
              {renderTable(filteredUsers, ['Name', 'Email', 'Organization', 'Role', 'Status'], 'users')}
            </div>
          )}

          {activeSection === 'documents' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Documents Management</h2>
                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="alpha">Sort Alphabetically</option>
                  </select>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Types</option>
                    <option value="report">Reports</option>
                    <option value="proposal">Proposals</option>
                  </select>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search documents..."
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                className="mb-4 px-4 py-2 border border-gray-300 rounded-lg w-96 focus:outline-none focus:ring-2 focus:ring-indigo-500 search-input transition-all duration-200"
              />
              {renderTable(filteredDocuments, ['Title', 'Uploader', 'Organization', 'Type', 'Status'], 'documents')}
            </div>
          )}

          {activeSection === 'organizations' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Organization Management</h2>
                <button
                  onClick={() => openModal('organization')}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-200 btn-primary-hover focus-ring"
                >
                  Add Organization
                </button>
              </div>
              {renderTable(organizations, ['Name', 'Head', 'Status'], 'organizations')}
            </div>
          )}
        </div>
      </main>

      {renderModal()}
    </div>
  );
};

// User Form Component
const UserForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Full name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="text"
        placeholder="Organization"
        value={formData.organization}
        onChange={(e) => setFormData({...formData, organization: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="text"
        placeholder="Role"
        value={formData.role}
        onChange={(e) => setFormData({...formData, role: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 focus-ring"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-200 btn-primary-hover focus-ring"
        >
          Add User
        </button>
      </div>
    </form>
  );
};

// Organization Form Component
const OrganizationForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    members: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Organization name is required');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Organization name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="text"
        placeholder="Head (person)"
        value={formData.head}
        onChange={(e) => setFormData({...formData, head: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="number"
        placeholder="Member count"
        value={formData.members}
        onChange={(e) => setFormData({...formData, members: e.target.value})}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 focus-ring"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-200 btn-primary-hover focus-ring"
        >
          Add Organization
        </button>
      </div>
    </form>
  );
};

export default SuperAdmin;