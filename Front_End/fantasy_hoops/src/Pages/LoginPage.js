import React, { useState, useContext } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Axios from "axios";
import { UserContext } from "../context/UserContext";
import "../Styles/LoginStyle.css";
import GoogleLoginButton from "../components/GoogleLoginButton";
import GoogleLogoutButton from "../components/GoogleLogoutButton";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserContext);
  const { logout } = useContext(UserContext);

  const onLoginSuccess = async (code) => {
    try {
      console.log("accessing data");
      const { data } = await Axios.post(`http://localhost:3001/auth/google`, {
        code,
      });
      login(data);
    } catch (error) {
      console.error("Server Error:", error.response?.data || error.message);
    }
  };

  const onError = (error) => {
    console.log("Login Error:", error);
  };
  // Handle logout success
  const onLogoutSuccess = () => {
    logout(); // Clear user context
    console.log("Logged out successfully");
  };

  // Handle logout failure
  const onLogoutFailure = (error) => {
    console.error("Logout failed: ", error);
  };

  const NormLogin = async () => {
    try {
      console.log("accessing data");
      const { data } = await Axios.post(`http://localhost:3001/login`, {
        email, 
        password, 
      });
      login(data);
    } catch (error) {
      console.error("Server Error:", error.response?.data || error.message);
    }
  };

  // Corrected button onClick event
  return (
    <div className="login-form">
      <h2>Login</h2>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={NormLogin}> 
          Login
        </button>
        <GoogleLoginButton onSuccess={onLoginSuccess} onError={onError} />
        <GoogleLogoutButton
          onSuccess={onLogoutSuccess}
          onError={onLogoutFailure}
        />
      </div>
      <div className="navigation-buttons">
        <p>Don't have a profile? Click here!</p>
        <Link to="/signup" className="navigate-signup-btn">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
