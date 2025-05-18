import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Menu from './components/Menu';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyAccount from './pages/MyAccount';
import Leads from './pages/Leads';
import ProtectedRoute from './components/ProtectedRoute';
import { LeadsProvider } from './context/LeadsContext';
import { ToastProvider } from './context/ToastContext';
import './App.css';

// Global styles for the app
const appStyle = {
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
};

const contentStyle = {
  padding: '20px',
  marginTop: '0',
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <div style={appStyle}>
          <Menu />
          <div style={contentStyle}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/leads" element={
                  <LeadsProvider>
                    <Leads />
                  </LeadsProvider>
                } />
              </Route>
              
              {/* Fallback for unmatched routes (optional) */}
              <Route path="*" element={
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;
