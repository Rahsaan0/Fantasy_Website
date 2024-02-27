import React, { useState } from "react";
import axios from "axios";

const TeamPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [playerIdInput, setPlayerIdInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [playerInfo, setPlayerInfo] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [error, setError] = useState("");

  const getPlayerId = () => {
    if (!firstName.trim() && !lastName.trim()) {
      setError("Please enter a player's name.");
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
          }));
          setPlayerInfo(info);
          setError("");
        } else {
          setError("No player found with that name.");
          setPlayerInfo([]);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the player stats:", error);
        setError("Failed to fetch player stats.");
        setPlayerInfo([]);
      });
  };

  const getPlayerStatsById = async () => {
    if (!playerIdInput.trim()) {
      setError("Please enter a player's ID.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/api/playerStatsById?id=${playerIdInput}&startDate=${startDate}&endDate=${endDate}`
      );
      console.log(response.data);
      setPlayerStats(response.data.data);
      setError("");
    } catch (error) {
      console.error("Error fetching player stats:", error);
      setError("Failed to fetch player stats.");
      setPlayerStats([]);
    }
  };

  return (
    <div>
      <div>
        <h2>Find Player ID</h2>
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
        <button onClick={getPlayerId}>Find ID</button>
        {error && <p className="error">{error}</p>}
        {playerInfo.length > 0 && (
          <div>
            <h3>Player Information:</h3>
            {playerInfo.map((player, index) => (
              <p key={index}>
                ID: {player.id}, Name: {player.firstName} {player.lastName}
              </p>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2>Get Player Stats by ID</h2>
        <input
          type="text"
          placeholder="Enter player's ID"
          value={playerIdInput}
          onChange={(e) => setPlayerIdInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Start Date (YYYY-MM-DD)"
          value={startDate}
          onChange={(e) =>
            setStartDate(e.target.value) & setEndDate(e.target.value)
          }
        />
        <button onClick={getPlayerStatsById}>Get Stats</button>
        {error && <p className="error">{error}</p>}
        {playerStats.length > 0 && (
          <div>
            <h3>Player Stats:</h3>
            {playerStats.map((stat, index) => (
              <p key={index}>
                Game ID: {stat.game.id}, Points: {stat.pts}, Rebounds:{" "}
                {stat.reb}, Assists: {stat.ast}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
