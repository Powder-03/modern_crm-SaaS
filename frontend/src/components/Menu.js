import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const navStyle = {
  backgroundColor: '#343a40',
  padding: '1rem 2rem',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
};

const logoStyle = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  textDecoration: 'none',
  margin: 0,
};

const navListStyle = {
  display: 'flex',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  alignItems: 'center',
};

const navItemStyle = {
  margin: '0 15px',
};

const linkStyle = {
  color: 'rgba(255, 255, 255, 0.85)',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: '500',
  transition: 'color 0.3s',
  ':hover': {
    color: 'white',
  }
};

const activeStyle = {
  color: 'white',
  borderBottom: '2px solid #0d6efd',
  paddingBottom: '3px',
};

const buttonStyle = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: '500',
  transition: 'background-color 0.3s',
};

const userInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  color: '#28a745',
  fontSize: '0.9rem',
  marginRight: '15px',
};

const avatarStyle = {
  backgroundColor: '#343a40',
  color: 'white',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '8px',
  fontSize: '1rem',
  fontWeight: 'bold',
  border: '2px solid #28a745',
};

const Menu = () => {
  const { isAuthenticated, user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    // Add a toast/notification that logout was successful
    alert('Logged out successfully');
  };

  // Check if the current path matches a particular route to apply active styling
  const isActive = (path) => {
    return window.location.pathname === path;
  };

  if (loading) {
    return (
      <nav style={navStyle}>
        <div style={logoStyle}>CRM SaaS</div>
        <div style={{ color: 'white' }}>Loading...</div>
      </nav>
    );
  }

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>CRM SaaS</Link>
      <ul style={navListStyle}>
        <li style={navItemStyle}>
          <Link 
            to="/" 
            style={{...linkStyle, ...(isActive('/') ? activeStyle : {})}}
          >
            Dashboard
          </Link>
        </li>
        
        {isAuthenticated ? (
          <>
            <li style={navItemStyle}>
              <Link 
                to="/my-account" 
                style={{...linkStyle, ...(isActive('/my-account') ? activeStyle : {})}}
              >
                My Account
              </Link>
            </li>
            <li style={navItemStyle}>
              {user && (
                <div style={userInfoStyle}>
                  <div style={avatarStyle}>
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>{user?.username}</span>
                </div>
              )}
            </li>
            <li style={navItemStyle}>
              <button 
                onClick={handleLogout} 
                style={buttonStyle}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li style={navItemStyle}>
              <Link 
                to="/login" 
                style={{...linkStyle, ...(isActive('/login') ? activeStyle : {})}}
              >
                Login
              </Link>
            </li>
            <li style={navItemStyle}>
              <Link 
                to="/signup" 
                style={{...linkStyle, ...(isActive('/signup') ? activeStyle : {})}}
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Menu; 