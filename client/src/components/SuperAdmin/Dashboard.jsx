import React from 'react';

const Dashboard = () => {
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

  return (
    <div className="section dashboard-section space-y-6">
      {renderStats()}
      {renderPosts()}
    </div>
  );
};

export default Dashboard;