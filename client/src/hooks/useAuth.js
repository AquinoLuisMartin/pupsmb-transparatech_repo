import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [userSession, setUserSession] = useState(() => {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (userSession && userSession.role === 'superadmin') {
      setIsAuthenticated(true);
      setIsAuthorized(true);
    } else {
      setIsAuthenticated(false);
      setIsAuthorized(false);
      if (userSession) {
        alert('Access denied. SuperAdmin credentials required.');
        window.location.href = '/login';
      }
    }
  }, [userSession]);

  const logout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userSession');
      sessionStorage.removeItem('userSession');
      setUserSession(null);
      window.location.href = '/login';
    }
  };

  return {
    userSession,
    isAuthenticated,
    isAuthorized,
    logout
  };
};