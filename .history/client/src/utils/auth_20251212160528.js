import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export function logoutClient () {
  try {
    // Clear any client-side authentication data (e.g., tokens, user info)
    localStorage.removeItem ('authToken');
    localStorage.removeItem ('userInfo');
  } catch (error) {
    //
  }
}
