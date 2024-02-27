import React from "react";
import { googleLogout } from "@react-oauth/google";

const GoogleLogoutButton = ({ onLogoutSuccess, onLogoutFailure }) => {
  const logout = async () => {
    try {
      await googleLogout();
      onLogoutSuccess();
    } catch (error) {
      console.error("Logout failed", error);
      if (onLogoutFailure) {
        onLogoutFailure(error);
      }
    }
  };

  return <button onClick={logout}>Logout</button>;
};

export default GoogleLogoutButton;
