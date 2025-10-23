// React core imports and component styles
import React, { useState } from 'react';
import './Auditors.css';

const Auditors = () => {
  // Search and navigation state
  const [searchQuery, setSearchQuery] = useState(''); // Global search query
  const [activeSection, setActiveSection] = useState('main-dashboard'); // Current active section
  
  // Document management state
  const [selectedDocument, setSelectedDocument] = useState(null); // Currently selected document
  const [documentNotes, setDocumentNotes] = useState({}); // Notes for each document
  
  // Modal visibility state
  const [showPreviewModal, setShowPreviewModal] = useState(false); // Document preview modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false); // Action feedback modal
  const [showUserModal, setShowUserModal] = useState(false); // User profile modal
  const [feedbackResult, setFeedbackResult] = useState(''); // Result of document action

  // Dashboard statistics data - overview of document statuses
  const dashboardStats = [
    { title: 'Total Submitted', value: '124', icon: '📂', type: 'total' },
    { title: 'Pending Review', value: '18', icon: '⏱', type: 'pending' },
    { title: 'Approved', value: '89', icon: '✅', type: 'approved' },
    { title: 'Rejected', value: '17', icon: '❌', type: 'rejected' }
  ];

  // Sample pending documents awaiting review
  const pendingDocuments = [
    {
      id: 1,
      title: 'Annual Activity Report 2024',
      organization: 'Engineering Council',
      description: 'Comprehensive annual report detailing all activities, events, and accomplishments for the year 2024.',
      author: 'Maria Santos',
      date: '2025-10-12',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Project Proposal: Tech Summit 2025',
      organization: 'IT Student Council',
      description: 'Detailed proposal for the upcoming Tech Summit including budget breakdown, timeline, and expected outcomes.',
      author: 'Pedro Garcia',
      date: '2025-10-13',
      status: 'pending'
    }
  ];

  // Recent activity history - shows latest document actions
  const recentActivities = [
    { action: 'Approved', document: 'Budget Plan 2025', time: '2 hours ago', type: 'approved' },
    { action: 'Rejected', document: 'Event Proposal', time: '5 hours ago', type: 'rejected' },
    { action: 'Approved', document: 'Financial Report Q4', time: '1 day ago', type: 'approved' },
    { action: 'Approved', document: 'Annual Report 2024', time: '1 day ago', type: 'approved' },
    { action: 'Rejected', document: 'Funding Request', time: '2 days ago', type: 'rejected' }
  ];

  // Review performance statistics - metrics and progress indicators
  const reviewStats = [
    { label: 'Approval Rate', value: '84%', icon: '📈', hasBar: true, percentage: 84, color: 'bg-green-100' },
    { label: 'Documents This Week', value: '23 / 30', icon: '📅', hasBar: true, percentage: 77, color: 'bg-blue-100' },
    { label: 'Avg. Review Time', value: '2.5 days', icon: '⏰', hasBar: false },
    { label: 'Pending Review', value: '18', icon: '⏱', hasBar: false },
    { label: 'Reviewed Today', value: '7', icon: '✅', hasBar: false }
  ];

  // Document filtering - searches across title, organization, and description
  const filteredDocuments = pendingDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Section navigation handler - switches between dashboard views
  const handleShowSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Document preview handler - opens preview modal with selected document
  const handlePreviewDocument = (document) => {
    setSelectedDocument(document);
    setShowPreviewModal(true);
  };

  // Document action handler - processes approve/reject actions
  const handleDocumentAction = (action) => {
    setFeedbackResult(action);
    setShowFeedbackModal(true);
    setShowPreviewModal(false);
  };

  // Modal close handler - manages different modal types and resets state
  const handleCloseModal = (modalType) => {
    switch (modalType) {
      case 'preview':
        setShowPreviewModal(false);
        setSelectedDocument(null);
        break;
      case 'feedback':
        setShowFeedbackModal(false);
        setFeedbackResult('');
        break;
      case 'user':
        setShowUserModal(false);
        break;
      default:
        break;
    }
  };

  // Note change handler - updates document-specific notes
  const handleNoteChange = (docId, note) => {
    setDocumentNotes(prev => ({
      ...prev,
      [docId]: note
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top navigation header */}
      <header className="bg-blue-600 text-white">
        <div className="flex items-center justify-between px-10 py-4">
          {/* Brand logo and portal information */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleShowSection('main-dashboard')}
          >
            <div className="bg-blue-700 text-white rounded-lg font-bold text-lg px-4 py-2">
              T
            </div>
            <div>
              <h1 className="text-lg font-bold mb-1">TransparaTech</h1>
              <p className="text-sm opacity-90">PUP Sta. Maria Campus Transparency Portal</p>
            </div>
          </div>

          {/* Global search input */}
          <div className="flex-1 mx-16">
            <input
              type="text"
              placeholder="Search documents, organizations, or reports..."
              className="w-full px-6 py-3 rounded-xl border-none text-lg bg-slate-50 text-gray-900 shadow-sm outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* User profile section */}
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-semibold text-base">Auditor</span>
            <div 
              className="bg-blue-700 text-white rounded-full w-9 h-9 flex items-center justify-center font-semibold text-lg cursor-pointer"
              onClick={() => handleShowSection('user-profile-section')}
            >
              AU
            </div>
            <span className="text-sm text-gray-200">Admin</span>
          </div>
        </div>
      </header>

      {/* Main dashboard view - overview and document queue */}
      {activeSection === 'main-dashboard' && (
        <section className="section">
          {/* Statistics overview cards */}
          <div className="flex justify-center items-center gap-5 w-full my-10 px-10">
            {dashboardStats.map((stat, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-lg min-w-[170px] text-center transition-transform hover:transform hover:translate-y-[-2px] hover:scale-105 ${
                  stat.type === 'pending' ? 'text-yellow-600' :
                  stat.type === 'approved' ? 'text-green-600' :
                  stat.type === 'rejected' ? 'text-red-600' : 'text-blue-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3 text-2xl ${
                  stat.type === 'pending' ? 'bg-yellow-100' :
                  stat.type === 'approved' ? 'bg-green-100' :
                  stat.type === 'rejected' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {stat.icon}
                </div>
                <h2 className="text-4xl font-extrabold mb-2 tracking-tight">{stat.value}</h2>
                <p className="text-lg font-semibold">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Main content grid layout */}
          <div className="flex gap-8 px-10 pb-8">
            {/* Document review queue - main content area */}
            <div className="flex-[2]">
              <h2 className="text-xl font-bold mb-5">
                Document Review Queue 
                <span className="bg-blue-100 text-blue-600 rounded-2xl px-4 py-1 text-base font-semibold ml-3">
                  2 Pending
                </span>
              </h2>

              {/* Document cards with review actions */}
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-white rounded-2xl mb-5 shadow-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-xl text-blue-600 font-semibold mb-1">{doc.title}</h3>
                    <span className="text-blue-700 font-semibold text-base underline mr-2">
                      {doc.organization}
                    </span>
                    <p className="text-slate-600 my-2">{doc.description}</p>
                    <div className="flex gap-3 text-sm text-gray-600 mt-2">
                      <span className="flex items-center gap-1">
                        👤 {doc.author}
                      </span>
                      <span className="flex items-center gap-1">
                        📅 {doc.date}
                      </span>
                    </div>
                  </div>
                  
                  {/* Document notes textarea */}
                  <textarea
                    className="w-full p-3 mb-3 rounded-lg border-none bg-slate-100 text-base resize-y block"
                    placeholder="Add notes or feedback about this document..."
                    value={documentNotes[doc.id] || ''}
                    onChange={(e) => handleNoteChange(doc.id, e.target.value)}
                    rows={3}
                  />
                  
                  {/* Document action buttons */}
                  <div className="flex gap-3 mt-3">
                    <button 
                      className="bg-blue-100 text-blue-600 font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-colors"
                      onClick={() => handlePreviewDocument(doc)}
                    >
                      Preview
                    </button>
                    <button 
                      className="bg-green-400 text-green-800 font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-green-600 hover:text-white transition-colors"
                      onClick={() => handleDocumentAction('Approved')}
                    >
                      Approve
                    </button>
                    <button 
                      className="bg-red-400 text-red-800 font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-red-600 hover:text-white transition-colors"
                      onClick={() => handleDocumentAction('Rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right sidebar - statistics and activity */}
            <div className="flex-1 mt-3">
              {/* Recent activity feed */}
              <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
                <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                <ul className="space-y-2">
                  {recentActivities.map((activity, index) => (
                    <li key={index} className="flex items-center gap-3 py-2">
                      <span className={`text-xl ${
                        activity.type === 'approved' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {activity.type === 'approved' ? '✅' : '❌'}
                      </span>
                      <span className="flex-1">{activity.action} {activity.document}</span>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Performance metrics and statistics */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="text-lg font-semibold mb-4">Review Statistics</h3>
                <div className="space-y-6">
                  {reviewStats.map((stat, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-2 text-lg font-semibold mb-1">
                        <span className="text-lg">{stat.icon}</span>
                        {stat.label}
                      </div>
                      <div className="text-xl font-bold text-blue-700 mt-1">
                        {stat.value}
                      </div>
                      {stat.hasBar && (
                        <div className={`h-2 rounded-md mt-2 ${stat.color}`}>
                          <div 
                            className="bg-blue-700 h-full rounded-md transition-all duration-300"
                            style={{ width: `${stat.percentage}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* User profile display section */}
      {activeSection === 'user-profile-section' && (
        <section className="section">
          <div className="bg-white rounded-3xl shadow-xl mx-auto mt-12 p-10 flex flex-col items-center max-w-md">
            <div className="bg-blue-700 text-white rounded-full w-20 h-20 text-4xl font-bold flex items-center justify-center mb-5">
              AU
            </div>
            <h2 className="text-2xl text-slate-800 font-extrabold mb-2">Auditor Admin</h2>
            <p className="text-blue-600 text-lg mb-2">auditor.admin@pup.edu.ph</p>
            <p className="text-green-600 text-lg mb-1">Status: Online</p>
            <p className="text-blue-700 text-lg font-semibold">Role: Auditor</p>
          </div>
        </section>
      )}

      {/* Document preview modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl min-w-[340px] max-w-md relative text-center">
            <button 
              className="absolute top-3 right-4 text-3xl text-blue-600 hover:text-blue-800"
              onClick={() => handleCloseModal('preview')}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Document Preview</h2>
            <p className="text-lg mb-4">{selectedDocument?.title}</p>
            <p className="text-gray-600 mb-6">This is a sample document preview. Embed actual document here.</p>
            <div className="flex gap-3 justify-center">
              <button 
                className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600"
                onClick={() => handleDocumentAction('Approved')}
              >
                Approve
              </button>
              <button 
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600"
                onClick={() => handleDocumentAction('Rejected')}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action feedback confirmation modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl min-w-[340px] max-w-md relative text-center">
            <button 
              className="absolute top-3 right-4 text-3xl text-blue-600 hover:text-blue-800"
              onClick={() => handleCloseModal('feedback')}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{feedbackResult}</h2>
            <p className="text-gray-600">Your action ({feedbackResult}) has been recorded.</p>
          </div>
        </div>
      )}

      {/* User information display modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl min-w-[340px] max-w-md relative text-center">
            <button 
              className="absolute top-3 right-4 text-3xl text-blue-600 hover:text-blue-800"
              onClick={() => handleCloseModal('user')}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-6">User Information</h2>
            <div className="flex gap-4 items-center justify-center">
              <div className="bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center font-semibold text-2xl">
                AU
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Auditor Admin</h3>
                <p className="text-gray-600">Email: auditor.admin@pup.edu.ph</p>
                <p className="text-green-600">Status: Online</p>
                <p className="text-blue-600">Role: Auditor</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auditors;
