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
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'; // Assuming you have some basic styling

function App() {
  return (
    <Router>
      <Menu />
      <div className="container"> {/* Optional: for basic layout styling */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-account" element={<MyAccount />} />
          </Route>
          
          {/* Fallback for unmatched routes (optional) */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
