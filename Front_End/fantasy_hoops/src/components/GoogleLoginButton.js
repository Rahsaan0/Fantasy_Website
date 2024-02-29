import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = ({ onSuccess, onFailure }) => {
  const googleLogin = useGoogleLogin({
    flow: "auth-code", // Make sure to specify the flow type
    onSuccess: (codeResponse) => onSuccess(codeResponse.code), // Pass the code to the onSuccess handler
    onError: onFailure,
  });

  return <button onClick={() => googleLogin()}>Login with Google</button>;
};

export default GoogleLoginButton;
