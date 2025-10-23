import React from 'react';
import UserForm from './UserForm';
import OrganizationForm from './OrganizationForm';

const Modal = ({ showModal, modalType, closeModal, addUser, addOrganization }) => {
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

export default Modal;