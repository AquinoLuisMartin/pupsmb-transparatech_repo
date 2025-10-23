import React, { useState } from 'react';

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

export default OrganizationForm;