import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8000/api/v1/auth';

  // Debug logs to help track authentication state changes
  useEffect(() => {
    console.log('Token state changed:', accessToken ? 'Token exists' : 'No token');
  }, [accessToken]);

  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        console.log('Attempting to fetch user with token:', accessToken);
        
        // Set the authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        try {
          const response = await axios.get(`${API_BASE_URL}/profile/`);
          console.log('User data received:', response.data);
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user details:', error.response?.data || error.message);
          
          if (error.response && error.response.status === 401 && refreshToken) {
            // Try to refresh the token
            try {
              const refreshResponse = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                refresh: refreshToken
              });
              
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem('accessToken', newAccessToken);
              setAccessToken(newAccessToken);
              axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              
              // Try fetching the user again with the new token
              const retryResponse = await axios.get(`${API_BASE_URL}/profile/`);
              setUser(retryResponse.data);
            } catch (refreshError) {
              // If refresh fails, clear everything
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              setAccessToken(null);
              setRefreshToken(null);
              setUser(null);
              delete axios.defaults.headers.common['Authorization'];
            }
          } else {
            // For other errors, clear auth state
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
            delete axios.defaults.headers.common['Authorization'];
          }
        }
      } else {
        console.log('No token found, user not authenticated');
      }
      setLoading(false);
    };
    
    fetchUser();
  }, [accessToken, refreshToken]);

  const login = async (username, password) => {
    try {
      console.log('Login attempt with username:', username);
      
      const response = await axios.post(`${API_BASE_URL}/token/`, {
        username,
        password
      });
      
      console.log('Login response:', response.data);
      
      // Get tokens from response
      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh;
      
      if (!newAccessToken || !newRefreshToken) {
        console.error('Missing tokens in response:', response.data);
        return { success: false, error: 'Invalid server response - no tokens received' };
      }
      
      // Store tokens and update state
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      
      // Fetch user details
      try {
        const userResponse = await axios.get(`${API_BASE_URL}/profile/`);
        console.log('User data after login:', userResponse.data);
        setUser(userResponse.data);
      } catch (userError) {
        console.error('Failed to fetch user after login:', userError);
        // Even if we can't fetch the user, login is still successful if we have the token
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data || { detail: 'Connection error or server unavailable' }
      };
    }
  };

  const signup = async (userData) => {
    try {
      console.log('Signup attempt with data:', {...userData, password: '[REDACTED]', password2: '[REDACTED]'});
      
      const response = await axios.post(`${API_BASE_URL}/register/`, userData);
      console.log('Signup response:', response.data);
      
      // If registration returns tokens, store them
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        setAccessToken(response.data.access);
        setRefreshToken(response.data.refresh);
        
        // Set the user from the response
        if (response.data.user) {
          setUser(response.data.user);
        }
        
        // Set auth header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Signup failed:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data || { detail: 'Connection error or server unavailable' }
      };
    }
  };

  const logout = async () => {
    // Simple JWT doesn't have a server-side logout endpoint, so we just clear client state
    console.log('Logging out - clearing client-side auth state');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    console.log('Client-side auth state cleared');
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ 
      token: accessToken, 
      user, 
      login, 
      signup, 
      logout, 
      isAuthenticated: !!accessToken, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 