import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { googleLogout } from "@react-oauth/google";

const LogoutButton = () => {
  const { signOut } = useContext(UserContext);
  const [message, setMessage] = useState("");

  const handleSignOut = () => {
    signOut(); // Clears the application session
    googleLogout(); // Clears the Google session
    setMessage("You have been signed out.");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LogoutButton; // If this is in a separate file
