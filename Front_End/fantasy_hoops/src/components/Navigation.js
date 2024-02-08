import React from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/team">Team Page</Link></li>
        <li><Link to="/testing"> TestingPage</Link></li>
        {/* For future pages*/}
      </ul>
    </nav>
  );
}

export default Navigation;
