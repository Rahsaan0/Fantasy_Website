import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import { UserContext } from "../context/UserContext";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import "../Styles/LoginStyle.css"; // Make sure the path is correct
import LogoutButton from "../components/LogoutButton"; // Adjust path as necessary
import GoogleLoginButton from "../components/LoginButton";
import GoogleLogoutButton from "../components/GoogleLogoutButton";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  

  const handleLogin = async () => {
    try {
      const response = await Axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      if (response.data.user) {
        setUser(response.data.user);
        console.log("Login successful", response.data.user);
      } else {
        console.error("Login failed: ", response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };
  const handleLoginSuccess = async (tokenResponse) => {
    try {
      const { data } = await Axios.post(
        "http://localhost:3001/api/google-login",
        {
          token: tokenResponse.access_token, // Or tokenResponse.id_token based on your backend expectation
        }
      );
      setUser(data.user); // Set user in context
      console.log("Login successful", data.user);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  const handleLoginFailure = (error) => {
    console.error("Google login error:", error);
  };
  const onLogoutSuccess = () => {
  
  // Clear user from context or state
  setUser(null);

  // Optionally, redirect to login page or show a success message
  console.log('Logout successful. Redirecting to login page...');
  // Redirect to login page using your preferred method, e.g., history.push('/login') if you're using React Router
};

const onLogoutFailure = (error) => {
  // Handle the error, possibly by showing an error message to the user
  console.error('Logout failed:', error);
  // Here you can set an error state or show a notification to the user
};

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("accessing data");
        const { data } = await Axios.post(
          "http://localhost:3001/api/google-login",
          {
            token: tokenResponse.id_token,
   
          }
        );
        setUser(data.user);
      } catch (error) {
        console.error(
          "Server Error:",
          error.response?.data || error.message
        );
      }
    },
    onError: (error) => console.log("Google Error:", error),
  });
  
  const responseGoogle = async (response) => {
    try {
      const { tokenId } = response;
      const res = await Axios.post(
        "http://localhost:3001/api/google-login",
        {
          token: tokenId,
        },
        { withCredentials: true }
      ); // Enable credentials for cookies if you're using them

      const { user } = res.data;
      setUser(user); // Save the user in the context or state
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };
  return (
    <GoogleOAuthProvider clientId="7941826412-6vb4et390enh8jugia37rjgrk3b4mfr5.apps.googleusercontent.com">
      <div className="login-form">
        <h2>Login</h2>
        {user ? (
          <LogoutButton />
        ) : (
          <>
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
            {/* <div>
              <button onClick={handleLogin}>Login</button>
            </div> */}
            {/* <div>
              <button onClick={() => googleLogin()}>Login with Google</button>
            </div> */}
            <div>
              <GoogleLoginButton
                onSuccess={handleLoginSuccess}
                onFailure={handleLoginFailure}
              />
              <GoogleLogoutButton
                onLogoutSuccess={onLogoutSuccess}
                onLogoutFailure={onLogoutFailure}
              />
            </div>
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
