import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Re-using similar styles from Login page for consistency
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
  backgroundColor: '#28a745', // Green for signup
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
  whiteSpace: 'pre-wrap', // To better display multi-line JSON errors
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

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    console.log('Form submitted with values:', {
      username,
      email,
      password: '[REDACTED]',
      password2: '[REDACTED]',
      firstName,
      lastName
    });

    if (password !== password2) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        username,
        email,
        password,
        password2,
        first_name: firstName,
        last_name: lastName
      };

      console.log('Sending userData to backend:', {...userData, password: '[REDACTED]', password2: '[REDACTED]'});
      
      const result = await signup(userData);
      
      console.log('Signup result:', result);
      
      if (result.success) {
        setSuccess('Signup successful! Redirecting to dashboard...');
        // Allow success message to display briefly before redirect
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        let errorMsg = 'Signup failed. Please try again.';
        if (result.error) {
          console.error('Detailed error:', result.error);
          
          if (typeof result.error === 'string') {
            errorMsg = result.error;
          } else {
            // Format error object for display
            errorMsg = Object.entries(result.error)
              .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(', ')}`;
                } else if (typeof messages === 'string') {
                  return `${field}: ${messages}`;
                } else {
                  return `${field}: ${JSON.stringify(messages)}`;
                }
              })
              .join('\n');
            
            if (!errorMsg) errorMsg = JSON.stringify(result.error);
          }
        }
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Signup submission error:', err);
      setError('An unexpected error occurred. Please try again. ' + (err.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h1>
        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}
        
        <div style={inputGroupStyle}>
          <label htmlFor="username" style={labelStyle}>Username*</label>
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
          <label htmlFor="email" style={labelStyle}>Email*</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            disabled={isLoading}
          />
        </div>
        
        <div style={inputGroupStyle}>
          <label htmlFor="firstName" style={labelStyle}>First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
          />
        </div>
        
        <div style={inputGroupStyle}>
          <label htmlFor="lastName" style={labelStyle}>Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
          />
        </div>
        
        <div style={inputGroupStyle}>
          <label htmlFor="password" style={labelStyle}>Password*</label>
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
        
        <div style={inputGroupStyle}>
          <label htmlFor="password2" style={labelStyle}>Confirm Password*</label>
          <input
            type="password"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
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
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
        
        <p style={linkStyle}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
