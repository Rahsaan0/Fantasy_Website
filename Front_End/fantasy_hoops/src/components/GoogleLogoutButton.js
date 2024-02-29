import React from "react";
import { googleLogout } from "@react-oauth/google";

const GoogleLogoutButton = ({ onLogoutSuccess, onLogoutFailure }) => {
  const logout = async () => {
    try {
      // Correct keys are used here
      localStorage.removeItem("user");

      // If you have other keys for tokens or data, remove them as well
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Logout from Google
      await googleLogout();

      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
      console.log("Logout successful, local storage cleared");
    } catch (error) {
      if (onLogoutFailure) {
        onLogoutFailure(error);
      }
      console.error("Logout failed:", error);
    }
  };

  return <button onClick={logout}>Logout from Google</button>;
};

export default GoogleLogoutButton;
