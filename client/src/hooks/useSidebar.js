import { useState, useEffect, useCallback } from 'react';

export const useSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(() => 
    localStorage.getItem('sidebarPinned') === 'true'
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Load pinned state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebarPinned");
    if (saved === "true") {
      setIsPinned(true);
      setIsExpanded(true);
    }
  }, []);

  // Save pinned state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarPinned", isPinned.toString());
  }, [isPinned]);

  const handleMouseEnter = useCallback(() => {
    if (!isPinned && window.innerWidth > 768) {
      setIsExpanded(true);
    }
  }, [isPinned]);

  const handleMouseLeave = useCallback(() => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  }, [isPinned]);

  const handleSidebarToggle = useCallback(() => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsPinned(!isPinned);
      setIsExpanded(!isPinned);
    }
  }, [isPinned, isMobileOpen]);

  const handleOverlayClick = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const handleIconClick = useCallback((callback) => {
    callback();
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  }, []);

  return {
    isExpanded,
    isPinned,
    isMobileOpen,
    handleMouseEnter,
    handleMouseLeave,
    handleSidebarToggle,
    handleOverlayClick,
    handleIconClick
  };
};