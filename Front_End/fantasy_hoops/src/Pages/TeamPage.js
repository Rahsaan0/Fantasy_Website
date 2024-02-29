import React, { useState } from "react";
import axios from "axios";

const TeamPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState(""); // Single date for simplicity
  const [playerStats, setPlayerStats] = useState([]);
  const [error, setError] = useState("");

  const getPlayerStatsByNameAndDate = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      setError("Please enter a player's full name.");
      return;
    }
    if (!date.trim()) {
      setError("Please select a date.");
      return;
    }

    try {
      // Find player ID using their name
      const playersResponse = await axios.get(
        `http://localhost:3001/api/players?first_name=${firstName}&last_name=${lastName}`
      );

      if (
        playersResponse.data &&
        playersResponse.data.data &&
        playersResponse.data.data.length > 0
      ) {
        // Take playerid of the first player that fits into search
        const playerId = playersResponse.data.data[0].id;

        // Fetch the stats using the player ID and the specified date
        const statsResponse = await axios.get(
          `http://localhost:3001/api/playerStatsById?id=${playerId}&startDate=${date}&endDate=${date}` // Using the same date for start and end for simplicity
        );

        if (statsResponse.data && statsResponse.data.data) {
          setPlayerStats(statsResponse.data.data);
          setError("");
        } else {
          setError("No stats found for this player on the selected date.");
          setPlayerStats([]);
        }
      } else {
        setError("No player found with that name.");
        setPlayerStats([]);
      }
    } catch (error) {
      console.error("There was an error fetching the player stats:", error);
      setError("Failed to fetch player stats.");
      setPlayerStats([]);
    }
  };

  return (
    <div>
      <h2>Search Player Stats by Name and Date</h2>
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
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="Select Date"
      />
      <button onClick={getPlayerStatsByNameAndDate}>Get Stats</button>
      {error && <p className="error">{error}</p>}
      {playerStats.length > 0 && (
        <div>
          <h3>Player Stats:</h3>
          {playerStats.map((stat, index) => (
            <p key={index}>
              Player ID: {stat.player.id}, Points: {stat.pts}, Rebounds: {stat.reb},
              Assists: {stat.ast}, Steals: {stat.stl}, Blocks: {stat.blk},
              Turnovers: {stat.turnover}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamPage;
