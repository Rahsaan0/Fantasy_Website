import React, { useContext } from "react";
import { googleLogout } from "@react-oauth/google";
import { UserContext } from "../context/UserContext";

const GoogleLogoutButton = ({ onLogoutSuccess, onLogoutFailure }) => {
  const { logout } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await googleLogout();

      logout();

      console.log("Logout successful, local storage cleared");

      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
    } catch (error) {
      console.error("Logout failed:", error);
      if (onLogoutFailure) {
        onLogoutFailure(error);
      }
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default GoogleLogoutButton;
