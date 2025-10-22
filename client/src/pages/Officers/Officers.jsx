import React, { useState, useEffect, useCallback } from 'react';
import './Officers.css';

const Officers = () => {
  // Check authentication on component mount
  const [userSession] = useState(() => {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  });

  const [activeTab, setActiveTab] = useState('documents');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Sample data
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

  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'Financial Report',
    file: null
  });

  // All handlers defined before any early returns
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleLogout = useCallback(() => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userSession');
      sessionStorage.removeItem('userSession');
      window.location.href = '/login';
    }
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  }, []);

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

  const handleViewDocument = useCallback((doc) => {
    alert(`Viewing document: ${doc.title}`);
  }, []);

  const handleDownloadDocument = useCallback((doc) => {
    alert(`Downloading document: ${doc.title}`);
  }, []);

  // Authentication check
  useEffect(() => {
    if (!userSession || userSession.role !== 'officer') {
      alert('Access denied. Organization Officer credentials required.');
      window.location.href = '/login';
    }
  }, [userSession]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Show loading if not authenticated
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

  const renderDocuments = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">My Documents</h2>
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

  const renderUpload = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Upload New Document</h2>
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

  const renderActivity = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Recent Activity</h2>
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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-indigo-800 text-white flex flex-col sidebar-transition overflow-hidden ${
          sidebarExpanded ? 'w-64' : 'w-20 hover:w-64'
        }`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        {/* Header */}
        <div className="p-6 text-center">
          <div className="sidebar-content-transition">
            <h2 className={`font-extrabold transition-all duration-300 ${sidebarExpanded ? 'text-xl' : 'text-lg'}`}>
              TT
            </h2>
            <p className={`text-sm opacity-80 transition-all duration-300 ${
              sidebarExpanded ? 'opacity-80 visible' : 'opacity-0 invisible'
            }`}>
              PUP
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-4">
          {[
            { id: 'documents', icon: '📁', label: 'My Documents' },
            { id: 'upload', icon: '⬆️', label: 'Upload' },
            { id: 'activity', icon: '📊', label: 'Activity' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20 ${
                activeTab === item.id 
                  ? 'bg-white text-indigo-800 shadow-lg' 
                  : 'hover:bg-indigo-700 text-white'
              }`}
            >
              <span className="text-xl min-w-[24px] text-center">{item.icon}</span>
              <span className={`font-semibold transition-all duration-300 ${
                sidebarExpanded ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`p-4 text-center text-sm opacity-70 transition-all duration-300 ${
          sidebarExpanded ? 'opacity-70 visible' : 'opacity-0 invisible'
        }`}>
          © TransparaTech
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Organization Officer Dashboard</h1>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileDropdown(!showProfileDropdown);
              }}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="w-9 h-9 rounded-full border-2 border-indigo-700"
              />
              <span className="font-semibold text-gray-700">
                {userSession?.name || 'Juan Dela Cruz'}
              </span>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg p-4 w-56 z-50 dropdown-enter border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="https://via.placeholder.com/45"
                    alt="Profile"
                    className="w-11 h-11 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {userSession?.name || 'Juan Dela Cruz'}
                    </p>
                    <p className="text-sm text-gray-600">Organization Officer</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 content-scroll">
          {activeTab === 'documents' && renderDocuments()}
          {activeTab === 'upload' && renderUpload()}
          {activeTab === 'activity' && renderActivity()}
        </div>
      </main>
    </div>
  );
};

export default Officers;