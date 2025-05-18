import React, { useState, useContext, useEffect } from 'react';
import LeadsContext from '../context/LeadsContext';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Leads = () => {
  const { leads, currentLead, loading, error, fetchLeads, getLead, createLead, updateLead, deleteLead, clearCurrentLead } = useContext(LeadsContext);
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  
  const [mode, setMode] = useState('list'); // 'list', 'add', 'view', 'edit'
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    contact_person: '',
    email: '',
    phone: '',
    website: '',
    confidence: '',
    estimated_value: '',
    status: 'new',
    priority: 'medium',
    created_by: user?.id || ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (user?.id) {
      setFormData(prev => ({ ...prev, created_by: user.id }));
    }
  }, [user]);

  // Update form data when currentLead changes (for edit mode)
  useEffect(() => {
    if (currentLead && (mode === 'edit' || mode === 'view')) {
      setFormData({
        company: currentLead.company || '',
        contact_person: currentLead.contact_person || '',
        email: currentLead.email || '',
        phone: currentLead.phone || '',
        website: currentLead.website || '',
        confidence: currentLead.confidence !== null ? currentLead.confidence : '',
        estimated_value: currentLead.estimated_value !== null ? currentLead.estimated_value : '',
        status: currentLead.status || 'new',
        priority: currentLead.priority || 'medium',
        created_by: currentLead.created_by || user?.id || ''
      });
    }
  }, [currentLead, mode, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.company) errors.company = 'Company name is required';
    if (!formData.contact_person) errors.contact_person = 'Contact person is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.phone) errors.phone = 'Phone number is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const numericFormData = {
      ...formData,
      confidence: formData.confidence ? parseInt(formData.confidence, 10) : null,
      estimated_value: formData.estimated_value ? parseInt(formData.estimated_value, 10) : null,
    };
    
    let result;
    
    if (mode === 'edit' && selectedLeadId) {
      result = await updateLead(selectedLeadId, numericFormData);
      if (result.success) {
        addToast('Lead updated successfully!', 'success');
        setMode('view');
      } else {
        addToast('Failed to update lead. Please try again.', 'error');
      }
    } else {
      result = await createLead(numericFormData);
      if (result.success) {
        addToast('Lead created successfully!', 'success');
        resetForm();
        setMode('list');
      } else {
        addToast('Failed to create lead. Please try again.', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      const result = await deleteLead(id);
      if (result.success) {
        addToast('Lead deleted successfully!', 'success');
        if (mode !== 'list') {
          setMode('list');
          setSelectedLeadId(null);
        }
      } else {
        addToast('Failed to delete lead. Please try again.', 'error');
      }
    }
  };

  const handleViewLead = async (id) => {
    setSelectedLeadId(id);
    const lead = await getLead(id);
    if (lead) {
      setMode('view');
    } else {
      addToast('Failed to load lead details. Please try again.', 'error');
    }
  };

  const handleEditLead = async (id) => {
    if (mode === 'view' && selectedLeadId === id) {
      // If already in view mode for this lead, just switch to edit
      setMode('edit');
    } else {
      setSelectedLeadId(id);
      const lead = await getLead(id);
      if (lead) {
        setMode('edit');
      } else {
        addToast('Failed to load lead for editing. Please try again.', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      contact_person: '',
      email: '',
      phone: '',
      website: '',
      confidence: '',
      estimated_value: '',
      status: 'new',
      priority: 'medium',
      created_by: user?.id || ''
    });
    setFormErrors({});
    clearCurrentLead();
  };

  const handleCancel = () => {
    if (mode === 'add') {
      resetForm();
      setMode('list');
    } else if (mode === 'edit') {
      // Return to view mode without saving
      setMode('view');
      // Reset form to current lead data
      if (currentLead) {
        setFormData({
          company: currentLead.company || '',
          contact_person: currentLead.contact_person || '',
          email: currentLead.email || '',
          phone: currentLead.phone || '',
          website: currentLead.website || '',
          confidence: currentLead.confidence !== null ? currentLead.confidence : '',
          estimated_value: currentLead.estimated_value !== null ? currentLead.estimated_value : '',
          status: currentLead.status || 'new',
          priority: currentLead.priority || 'medium',
          created_by: currentLead.created_by || user?.id || ''
        });
      }
    } else if (mode === 'view') {
      // Return to list
      setMode('list');
      setSelectedLeadId(null);
      clearCurrentLead();
    }
  };

  // Helper function to get status label
  const getStatusLabel = (status) => {
    const statusMap = {
      new: 'New',
      contacted: 'Contacted',
      inprogress: 'In Progress',
      lost: 'Lost',
      won: 'Won'
    };
    return statusMap[status] || status;
  };

  // Helper function to get priority label
  const getPriorityLabel = (priority) => {
    const priorityMap = {
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    };
    return priorityMap[priority] || priority;
  };

  // Determine priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'won': return '#4caf50';
      case 'lost': return '#f44336';
      case 'inprogress': return '#2196f3';
      case 'contacted': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  // Render header with action buttons
  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>
          {mode === 'list' && 'Leads Management'}
          {mode === 'add' && 'Add New Lead'}
          {mode === 'view' && 'Lead Details'}
          {mode === 'edit' && 'Edit Lead'}
        </h1>
        <div>
          {mode === 'list' && (
            <button 
              onClick={() => {
                resetForm();
                setMode('add');
              }}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Add New Lead
            </button>
          )}
          {mode === 'view' && (
            <div>
              <button 
                onClick={() => handleEditLead(selectedLeadId)}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginRight: '10px'
                }}
              >
                Edit Lead
              </button>
              <button 
                onClick={() => handleDelete(selectedLeadId)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Delete Lead
              </button>
            </div>
          )}
          {(mode === 'add' || mode === 'edit' || mode === 'view') && (
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {mode === 'view' ? 'Back to List' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render form for adding or editing leads
  const renderForm = () => {
    const isReadOnly = mode === 'view';
    
    return (
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
        marginBottom: '20px' 
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Company*
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: formErrors.company ? '1px solid #f44336' : '1px solid #ced4da', 
                  borderRadius: '4px',
                  backgroundColor: isReadOnly ? '#f5f5f5' : 'white'
                }}
              />
              {formErrors.company && !isReadOnly && (
                <div style={{ color: '#f44336', fontSize: '0.8rem' }}>{formErrors.company}</div>
              )}
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Contact Person*
              </label>
              <input
                type="text"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: formErrors.contact_person ? '1px solid #f44336' : '1px solid #ced4da', 
                  borderRadius: '4px',
                  backgroundColor: isReadOnly ? '#f5f5f5' : 'white'
                }}
              />
              {formErrors.contact_person && !isReadOnly && (
                <div style={{ color: '#f44336', fontSize: '0.8rem' }}>{formErrors.contact_person}</div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: formErrors.email ? '1px solid #f44336' : '1px solid #ced4da', 
                  borderRadius: '4px',
                  backgroundColor: isReadOnly ? '#f5f5f5' : 'white'
                }}
              />
              {formErrors.email && !isReadOnly && (
                <div style={{ color: '#f44336', fontSize: '0.8rem' }}>{formErrors.email}</div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Phone*
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: formErrors.phone ? '1px solid #f44336' : '1px solid #ced4da', 
                  borderRadius: '4px',
                  backgroundColor: isReadOnly ? '#f5f5f5' : 'white'
                }}
              />
              {formErrors.phone && !isReadOnly && (
                <div style={{ color: '#f44336', fontSize: '0.8rem' }}>{formErrors.phone}</div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #ced4da', 
                  borderRadius: '4px',
                  backgroundColor: isReadOnly ? '#f5f5f5' : 'white'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Confidence (%)
              </label>
              <input
                type="number"
                name="confidence"
                value={formData.confidence}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                min="0"
                max="100"
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #ced4da', 
                  borderRadius: '4px',
                  backgroundColor: isReadOnly ? '#f5f5f5' : 'white'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Estimated Value
              </label>
              <input
                type="number"
                name="estimated_value"
                value={formData.estimated_value}
                onChange={handleInputChange}
                readOnly={isReadOnly}
                min="0"
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #ced4da', 
                  borderRadius: '4px',
                  backgroundColor: isReadOnly ? '#f5f5f5' : 'white'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Status
              </label>
              {isReadOnly ? (
                <input
                  type="text"
                  value={getStatusLabel(formData.status)}
                  readOnly
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #ced4da', 
                    borderRadius: '4px',
                    backgroundColor: '#f5f5f5'
                  }}
                />
              ) : (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #ced4da', 
                    borderRadius: '4px' 
                  }}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="inprogress">In Progress</option>
                  <option value="lost">Lost</option>
                  <option value="won">Won</option>
                </select>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Priority
              </label>
              {isReadOnly ? (
                <input
                  type="text"
                  value={getPriorityLabel(formData.priority)}
                  readOnly
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #ced4da', 
                    borderRadius: '4px',
                    backgroundColor: '#f5f5f5'
                  }}
                />
              ) : (
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #ced4da', 
                    borderRadius: '4px' 
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              )}
            </div>
          </div>

          {mode !== 'view' && (
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  marginRight: '10px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {mode === 'edit' ? 'Update Lead' : 'Save Lead'}
              </button>
            </div>
          )}
        </form>

        {/* Show created/modified dates if viewing */}
        {mode === 'view' && currentLead && (
          <div style={{ marginTop: '20px', borderTop: '1px solid #dee2e6', paddingTop: '15px' }}>
            <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
              Created: {new Date(currentLead.created_at).toLocaleString()}
              {currentLead.modified_at && currentLead.modified_at !== currentLead.created_at && (
                <span> | Last Modified: {new Date(currentLead.modified_at).toLocaleString()}</span>
              )}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render the list of leads
  const renderLeadsList = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <p>Loading leads...</p>
        </div>
      );
    }
    
    if (leads.length === 0) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
          textAlign: 'center' 
        }}>
          <p>No leads found. Add your first lead to get started!</p>
        </div>
      );
    }
    
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Company</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Contact</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Priority</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Confidence</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Est. Value</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Created</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr 
                key={lead.id} 
                style={{ 
                  borderBottom: '1px solid #dee2e6',
                  cursor: 'pointer',
                }}
                onClick={() => handleViewLead(lead.id)}
              >
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 'bold' }}>{lead.company}</div>
                  {lead.website && (
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                      <a 
                        href={lead.website.startsWith('http') ? lead.website : `http://${lead.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} // Prevent row click event
                      >
                        {lead.website}
                      </a>
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px' }}>
                  <div>{lead.contact_person}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>{lead.email}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>{lead.phone}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '5px 10px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    backgroundColor: getStatusColor(lead.status),
                    color: 'white'
                  }}>
                    {getStatusLabel(lead.status)}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '5px 10px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    backgroundColor: getPriorityColor(lead.priority),
                    color: 'white'
                  }}>
                    {getPriorityLabel(lead.priority)}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  {lead.confidence !== null ? `${lead.confidence}%` : '-'}
                </td>
                <td style={{ padding: '12px' }}>
                  {lead.estimated_value !== null ? `$${lead.estimated_value.toLocaleString()}` : '-'}
                </td>
                <td style={{ padding: '12px' }}>
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleEditLead(lead.id);
                    }}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      marginRight: '5px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleDelete(lead.id);
                    }}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="leads-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {renderHeader()}
      
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          marginBottom: '20px', 
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      )}
      
      {mode === 'list' && renderLeadsList()}
      {(mode === 'add' || mode === 'edit' || mode === 'view') && renderForm()}
    </div>
  );
};

export default Leads; 