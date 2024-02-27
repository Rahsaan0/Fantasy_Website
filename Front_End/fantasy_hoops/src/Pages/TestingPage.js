import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const TestingPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [playerInfo, setPlayerInfo] = useState([]);
  const [error, setError] = useState("");

  const { user } = useContext(UserContext); // Assuming 'user' has 'teamId'

  const getPlayerInfo = () => {
    if (!firstName.trim() && !lastName.trim()) {
      setError("Please enter a player's full name.");
      return;
    }

    axios
      .get(
        `http://localhost:3001/api/players?first_name=${firstName}&last_name=${lastName}`
      )
      .then((response) => {
        if (response.data && response.data.data) {
          const info = response.data.data.map((player) => ({
            id: player.id,
            firstName: player.first_name,
            lastName: player.last_name,
            teamName: player.team ? player.team.full_name : "No team", // Handle cases where player might not have a team
          }));
          setPlayerInfo(info);
          setError("");
        } else {
          setError("No player found with that name.");
          setPlayerInfo([]);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the player info:", error);
        setError("Failed to fetch player info.");
      });
  };

  const addPlayerToTeam = (playerId) => {
    if (!user || !user.teamId) {
      setError("You must be logged in to add a player to your team.");
      return;
    }

    axios
      .post("http://localhost:3001/addPlayerToTeam", {
        userId: user.id, // Ensure this is the correct user identifier
        teamId: user.teamId,
        playerData: { id: playerId },
      })
      .then(() => {
        alert("Player added to team successfully");
        setError(""); // Clear any previous errors
      })
      .catch((error) => {
        console.error("Error adding player to team:", error);
        setError("Failed to add player to team.");
      });
  };

  return (
    <div>
      <h2>Add Player to Team</h2>
      <input
        type="text"
        placeholder="Enter player's first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter player's last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <button onClick={getPlayerInfo}>Search Player</button>
      {error && <p className="error">{error}</p>}

      {playerInfo.length > 0 && (
        <div>
          <h3>Player Information:</h3>
          {playerInfo.map((player) => (
            <div key={player.id}>
              <p>
                {player.firstName} {player.lastName} - {player.teamName}
              </p>
              <button onClick={() => addPlayerToTeam(player.id)}>
                Add to My Team
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestingPage;
