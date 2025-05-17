import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home (Dashboard)</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        <li><Link to="/my-account">My Account</Link></li>
      </ul>
    </nav>
  );
};

export default Menu; 