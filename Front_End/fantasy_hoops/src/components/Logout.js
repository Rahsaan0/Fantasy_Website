
import React from "react";
import { googleLogout } from "@react-oauth/google";

const Logout = ({ setIsLoggedIn }) => {
  const handleLogout = () => {
    googleLogout();
    console.log("Logout Successful");
    setIsLoggedIn(false);
  };

  return (
    <div id="logoutSection">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
