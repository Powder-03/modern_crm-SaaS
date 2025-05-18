import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

const containerStyle = {
  padding: '2rem',
  maxWidth: '800px',
  margin: '0 auto',
};

const headerStyle = {
  borderBottom: '1px solid #e0e0e0',
  paddingBottom: '1rem',
  marginBottom: '2rem',
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  padding: '1.5rem',
  marginBottom: '2rem',
};

const formGroupStyle = {
  marginBottom: '1.5rem',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '1rem',
};

const buttonStyle = {
  backgroundColor: '#0d6efd',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '500',
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
  marginLeft: '10px',
};

const avatarContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1.5rem',
};

const avatarStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: '#0d6efd',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  marginRight: '1.5rem',
};

const profileInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const MyAccount = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would make an API call to update the user profile
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>My Account</h1>
      </header>

      <section style={cardStyle}>
        <div style={avatarContainerStyle}>
          <div style={avatarStyle}>
            {formData.username ? formData.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={profileInfoStyle}>
            <h2>{`${formData.firstName || ''} ${formData.lastName || ''}`}</h2>
            <p style={{ margin: '5px 0', color: '#666' }}>{formData.email}</p>
            <p style={{ margin: '5px 0', color: '#666' }}>Username: {formData.username}</p>
          </div>
        </div>
                
        <h3>Profile Information</h3>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="username" style={labelStyle}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={inputStyle}
              disabled={!isEditing}
            />
          </div>
          
          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              disabled={!isEditing}
            />
          </div>
          
          <div style={formGroupStyle}>
            <label htmlFor="firstName" style={labelStyle}>First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={inputStyle}
              disabled={!isEditing}
            />
          </div>
          
          <div style={formGroupStyle}>
            <label htmlFor="lastName" style={labelStyle}>Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={inputStyle}
              disabled={!isEditing}
            />
          </div>
          
          {isEditing ? (
            <div>
              <button type="submit" style={buttonStyle}>
                Save Changes
              </button>
              <button 
                type="button" 
                style={secondaryButtonStyle}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              style={buttonStyle}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </form>
      </section>
      
      <section style={cardStyle}>
        <h3>Security Settings</h3>
        <div style={formGroupStyle}>
          <button style={buttonStyle}>Change Password</button>
        </div>
      </section>
    </div>
  );
};

export default MyAccount; 