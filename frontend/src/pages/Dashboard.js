import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const containerStyle = {
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerStyle = {
  borderBottom: '1px solid #e0e0e0',
  paddingBottom: '1rem',
  marginBottom: '2rem',
};

const cardContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem',
  marginBottom: '2rem',
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  padding: '1.5rem',
  transition: 'transform 0.3s, box-shadow 0.3s',
  ':hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
  },
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const cardTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  margin: 0,
};

const valueStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#0d6efd',
  margin: '1rem 0',
};

const statLabelStyle = {
  color: '#666',
  fontSize: '0.9rem',
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Example stats - in a real app, these would come from API calls
  const stats = {
    leads: 24,
    deals: 8,
    revenue: '$12,450',
    tasks: 15
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.username || 'User'}!</p>
      </header>

      <section>
        <h2>Overview</h2>
        <div style={cardContainerStyle}>
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>Leads</h3>
              <span role="img" aria-label="leads icon">👥</span>
            </div>
            <div style={valueStyle}>{stats.leads}</div>
            <p style={statLabelStyle}>Total leads in pipeline</p>
          </div>

          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>Deals</h3>
              <span role="img" aria-label="deals icon">💼</span>
            </div>
            <div style={valueStyle}>{stats.deals}</div>
            <p style={statLabelStyle}>Active deals</p>
          </div>

          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>Revenue</h3>
              <span role="img" aria-label="revenue icon">💰</span>
            </div>
            <div style={valueStyle}>{stats.revenue}</div>
            <p style={statLabelStyle}>Monthly projection</p>
          </div>

          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>Tasks</h3>
              <span role="img" aria-label="tasks icon">✅</span>
            </div>
            <div style={valueStyle}>{stats.tasks}</div>
            <p style={statLabelStyle}>Pending tasks</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Recent Activity</h2>
        <div style={{...cardStyle, padding: '1rem 1.5rem'}}>
          <p>Your recent activity will appear here.</p>
          <ul style={{color: '#666'}}>
            <li>Connect your calendar to see upcoming meetings</li>
            <li>Track customer interactions and follow-ups</li>
            <li>Monitor team performance and engagement</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 