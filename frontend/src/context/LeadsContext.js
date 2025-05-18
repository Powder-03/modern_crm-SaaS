import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const LeadsContext = createContext();

export const LeadsProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [currentLead, setCurrentLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  const API_URL = 'http://localhost:8000/api/v1/leads/leads/';

  // Set up axios headers whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  // Fetch all leads
  const fetchLeads = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(API_URL);
      setLeads(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch leads');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Get a single lead
  const getLead = async (id) => {
    if (!token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      setCurrentLead(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || `Failed to fetch lead with ID ${id}`);
      console.error('Error fetching lead:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new lead
  const createLead = async (leadData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(API_URL, leadData);
      setLeads(prevLeads => [...prevLeads, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data || 'Failed to create lead');
      console.error('Error creating lead:', err);
      return { success: false, error: err.response?.data || 'Failed to create lead' };
    } finally {
      setLoading(false);
    }
  };

  // Update a lead
  const updateLead = async (id, leadData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`${API_URL}${id}/`, leadData);
      setLeads(prevLeads => 
        prevLeads.map(lead => lead.id === id ? response.data : lead)
      );
      if (currentLead && currentLead.id === id) {
        setCurrentLead(response.data);
      }
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data || 'Failed to update lead');
      console.error('Error updating lead:', err);
      return { success: false, error: err.response?.data || 'Failed to update lead' };
    } finally {
      setLoading(false);
    }
  };

  // Delete a lead
  const deleteLead = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`${API_URL}${id}/`);
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
      if (currentLead && currentLead.id === id) {
        setCurrentLead(null);
      }
      return { success: true };
    } catch (err) {
      setError(err.response?.data || 'Failed to delete lead');
      console.error('Error deleting lead:', err);
      return { success: false, error: err.response?.data || 'Failed to delete lead' };
    } finally {
      setLoading(false);
    }
  };

  // Clear current lead
  const clearCurrentLead = () => {
    setCurrentLead(null);
  };

  // Load leads on initial render if token exists
  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token, fetchLeads]);

  return (
    <LeadsContext.Provider value={{
      leads,
      currentLead,
      loading,
      error,
      fetchLeads,
      getLead,
      createLead,
      updateLead,
      deleteLead,
      clearCurrentLead
    }}>
      {children}
    </LeadsContext.Provider>
  );
};

export default LeadsContext; 