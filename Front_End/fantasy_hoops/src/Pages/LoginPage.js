// LoginPage.js
import React, { useState, useContext } from "react";
import Axios from "axios";
import { UserContext } from "../context/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
    console.log("Google Error:", error);
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
        />{" "}
      </div>

      <div>
        <GoogleLoginButton onSuccess={onLoginSuccess} onError={onError} />
        <GoogleLogoutButton onSuccess={onLogoutSuccess} onError={onLogoutFailure} />
      </div>
    </div>
  );
};

export default LoginPage;
