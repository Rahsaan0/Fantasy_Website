import React, { useState } from "react";
import axios from "axios";
import '../Styles/SearchStyles.css'

const CombinedPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [playerInfo, setPlayerInfo] = useState([]);
  const [playerStats, setPlayerStats] = useState({});
  const [error, setError] = useState("");

  const getPlayerInfoAndStats = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      setError("Please enter a player's full name.");
      return;
    }

    // Clear previous player info and stats
    setPlayerInfo([]);
    setPlayerStats({});

    try {
      // Fetch player basic information
      const infoResponse = await axios.get(
        `http://localhost:3001/api/players?first_name=${firstName.trim()}&last_name=${lastName.trim()}`
      );
      if (infoResponse.data && infoResponse.data.data.length > 0) {
        const playerData = infoResponse.data.data[0];
        setPlayerInfo([
          {
            id: playerData.id,
            firstName: playerData.first_name,
            lastName: playerData.last_name,
            position: playerData.position,
            teamName: playerData.team.full_name,
          },
        ]);
        console.log("player info loaded")
        // Fetch player stats by ID
        const statsResponse = await axios.get(
          `http://localhost:3001/api/playerStatsById?id=${playerData.id}`
        );
        if (statsResponse.data ) {
          // Assuming you want to use the first object in the array
          const firstStatEntry = statsResponse.data[0];
      
          const filteredStats = {
            pts: firstStatEntry.pts,
            reb: firstStatEntry.reb,
            ast: firstStatEntry.ast,
            stl: firstStatEntry.stl,
            blk: firstStatEntry.blk,
            turnover: firstStatEntry.turnover,
          };
          console.log(filteredStats)
          setPlayerStats(filteredStats);
        } else {
          setError("No stats found for this player recently.");
        }
      } else {
        setError("No player found with that name.");
      }
    } catch (err) {
      console.error(
        "There was an error fetching the player info or stats:",
        err
      );
      setError("Failed to fetch player info or stats.");
    }
  };

  const addPlayerToDatabase = async (player) => {
    try {
      await axios.post("http://localhost:3001/createPlayer", {
        id: player.id,
        name: `${player.firstName} ${player.lastName}`,
        position: player.position,
        team: player.teamName,
      });
      alert("Player added to database successfully");
    } catch (err) {
      console.error("Error adding player to database:", err);
      setError("Failed to add player to database.");
    }
  };

  const savePlayerStats = async (playerId) => {
    // Assumes `playerStats` structure is suitable for your database.
    try {
      await axios.post("http://localhost:3001/databaseStats", {
        playerId,
        stats: playerStats,
      });
      console.log("Stats saved successfully");
    } catch (err) {
      console.error("Failed to save player stats", err);
    }
  };

  return (
    <div className="container">
      <h2>Player Operations</h2>
      <input
        className="input-field"
        type="text"
        placeholder="Enter player's first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        className="input-field"
        type="text"
        placeholder="Enter player's last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <button className="button" onClick={getPlayerInfoAndStats}>
        Search and Fetch Stats
      </button>
      {error && <p className="error">{error}</p>}

      {playerInfo && playerInfo.length > 0 && (
        <div className="player-section">
          <h3>Player Information:</h3>
          <div>
            <p>
              {playerInfo[0].firstName} {playerInfo[0].lastName} -{" "}
              {playerInfo[0].teamName} - {playerInfo[0].position}
            </p>
            <button onClick={() => addPlayerToDatabase(playerInfo[0])}>
              Add to Database
            </button>
            <button onClick={() => savePlayerStats(playerInfo[0].id)}>
              Save Stats to Database
            </button>
          </div>
          <h3>Player Stats:</h3>
          {playerStats && (
            <p>
              Points: {playerStats.pts}, Rebounds: {playerStats.reb}, Assists:{" "}
              {playerStats.ast}, Steals: {playerStats.stl}, Blocks:{" "}
              {playerStats.blk}, Turnovers: {playerStats.turnover}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CombinedPage;
