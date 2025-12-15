import axiosInstance from '../api/axiosInstance';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function logoutClient() {
  try {
    // премахваме локално съхранените данни
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // премахваме Authorization header
    if (axiosInstance?.defaults?.headers?.common) {
      delete axiosInstance.defaults.headers.common.Authorization;
      delete axiosInstance.defaults.headers.common.authorization;
    }
  } catch (err) {
    console.warn('logoutClient warning', err);
  }
}

export function useLogout(redirectTo = '/') {
  const navigate = useNavigate();

  return useCallback(() => {
    logoutClient();
    navigate(redirectTo);
  }, [navigate, redirectTo]);
}
