import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = ({ onSuccess, onFailure }) => {
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => onSuccess(tokenResponse),
    onError: (error) => onFailure(error),
    flow: "auth-code", // Use 'implicit' for client-side only applications
  });

  return <button onClick={() => googleLogin()}>Login with Google</button>;
};
 export default GoogleLoginButton