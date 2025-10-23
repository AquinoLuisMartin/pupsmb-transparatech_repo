import React, { useState } from 'react';
import DataTable from './DataTable';

const DocumentManagement = ({ documents, sortBy, setSortBy, filterBy, setFilterBy }) => {
  const [docSearch, setDocSearch] = useState('');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(docSearch.toLowerCase()) ||
                         doc.uploader.toLowerCase().includes(docSearch.toLowerCase()) ||
                         doc.organization.toLowerCase().includes(docSearch.toLowerCase());
    const matchesFilter = filterBy === 'all' || doc.type === filterBy;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="section documents-section">
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
            <option value="all">All Organizations</option>
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
      <DataTable 
        data={filteredDocuments} 
        columns={['Title', 'Uploader', 'Organization', 'Type', 'Status']} 
        type="documents" 
      />
    </div>
  );
};

export default DocumentManagement;