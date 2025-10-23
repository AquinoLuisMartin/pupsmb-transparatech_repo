import React from 'react';
import DataTable from './DataTable';

const OrganizationManagement = ({ organizations, openModal }) => {
  return (
    <div className="section organizations-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Organizations Management</h2>
        <button
          onClick={() => openModal('organization')}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-200 btn-primary-hover focus-ring"
        >
          Add New Organization
        </button>
      </div>
      <DataTable 
        data={organizations} 
        columns={['Name', 'Head', 'Status']} 
        type="organizations" 
      />
    </div>
  );
};

export default OrganizationManagement;