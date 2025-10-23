import React, { createContext, useContext, useState } from 'react';

const SuperAdminContext = createContext();

export const useSuperAdminData = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdminData must be used within SuperAdminProvider');
  }
  return context;
};

export const SuperAdminProvider = ({ children }) => {
  // Sample data - in real app this would come from API
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

  const addUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      status: 'Active'
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const addOrganization = (orgData) => {
    const newOrg = {
      id: organizations.length + 1,
      ...orgData,
      status: 'Active'
    };
    setOrganizations(prev => [newOrg, ...prev]);
  };

  const value = {
    users,
    documents,
    organizations,
    addUser,
    addOrganization
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
};