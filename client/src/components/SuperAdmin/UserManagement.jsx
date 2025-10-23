import React, { useState } from 'react';
import DataTable from './DataTable';

const UserManagement = ({ users, setUsers, openModal }) => {
  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.organization.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="section users-section">
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
      <DataTable 
        data={filteredUsers} 
        columns={['Name', 'Email', 'Organization', 'Role', 'Status']} 
        type="users" 
      />
    </div>
  );
};

export default UserManagement;