import React from 'react';
import '../Styles/Navigation.css';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li className='brand'>
          <strong>Fantasy Hoops!!!</strong>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/team">Manage Team</Link>
        </li>
        <li>
          <Link to="/testing"> Draft Players</Link>
        </li>
        <li>
          <Link to="/login"> Login/Signup</Link>
        </li>
        <li>
          <Link to="/search"> Search Players</Link>
        </li>
        <li>
          <Link to= "/games"> Games </Link> 
        </li>
        {/* <li>
          <Link to="/games"> Matchups</Link>
        </li> */}
      </ul>
    </nav>
  );
}

export default Navigation;
