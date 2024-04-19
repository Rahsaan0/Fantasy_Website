import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  // Initialize state with localStorage to persist the login state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // When user logs in, set the user in both state and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // When user logs out, clear the user from both state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const setTeamId = (newTeamId) => {
    setUser((currentUser) => {
      const updatedUser = { ...currentUser, teamId: newTeamId };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const contextValue = {
    user,
    login,
    logout,
    setTeamId,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
