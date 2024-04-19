import React, { useState } from "react";
import axios from "axios";
import "../Styles/SignupStyle.css"; 
import { Link } from "react-router-dom"; // Import Link from react-router-dom


const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [teamName, setTeamName] = useState(""); 

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/signup", {
        email,
        password,
        username,
        teamName, 
      });
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          {" "}
          Team Name:
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      <div className="navigation-buttons">
        <p> Need to return to login?</p>
        <Link to="/login" className="navigate-signup-btn">
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
