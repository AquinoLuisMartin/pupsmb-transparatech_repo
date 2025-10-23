import { useState, useCallback } from 'react';

export const useModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const openModal = useCallback((type) => {
    setModalType(type);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalType('');
  }, []);

  return {
    showModal,
    modalType,
    openModal,
    closeModal
  };
};