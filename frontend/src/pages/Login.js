import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link, useLocation, Navigate } from 'react-router-dom';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  padding: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '400px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
};

const inputGroupStyle = {
  marginBottom: '15px',
};

const labelStyle = {
  marginBottom: '5px',
  fontWeight: 'bold',
  display: 'block',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  boxSizing: 'border-box',
};

const buttonStyle = {
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
};

const errorStyle = {
  color: 'red',
  marginBottom: '15px',
  textAlign: 'center',
};

const linkStyle = {
  marginTop: '15px',
  textAlign: 'center',
};

const successStyle = {
  color: 'green',
  marginBottom: '15px',
  textAlign: 'center',
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const result = await login(username, password);
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        // Brief delay to show success message
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        let errorMsg = 'Login failed. Please check your credentials.';
        
        if (result.error) {
          if (result.error.detail) {
            errorMsg = result.error.detail;
          } else if (result.error.non_field_errors) {
            errorMsg = result.error.non_field_errors.join(', ');
          } else if (typeof result.error === 'string') {
            errorMsg = result.error;
          } else {
            // Format complex error object for display
            errorMsg = Object.entries(result.error)
              .map(([field, value]) => {
                if (Array.isArray(value)) {
                  return `${field}: ${value.join(', ')}`;
                }
                return `${field}: ${value}`;
              })
              .join('\n');
            
            if (!errorMsg) errorMsg = JSON.stringify(result.error);
          }
        }
        
        setError(errorMsg);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login submission error', err);
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated, redirect to the intended destination
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h1>
        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}
        
        <div style={inputGroupStyle}>
          <label htmlFor="username" style={labelStyle}>Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
            disabled={isLoading}
          />
        </div>
        
        <div style={inputGroupStyle}>
          <label htmlFor="password" style={labelStyle}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          style={{
            ...buttonStyle,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        <p style={linkStyle}>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login; 