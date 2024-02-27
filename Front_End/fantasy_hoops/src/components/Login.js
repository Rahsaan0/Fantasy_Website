
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

const Login = ({ setIsLoggedIn }) => {
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login Successful:", tokenResponse);
      setIsLoggedIn(true); // Update the parent state to reflect login
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <div>
      <button onClick={() => googleLogin()}>Sign in with Google</button>
    </div>
  );
};

export default Login;
