import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import PlayerCard from "../components/PlayerCard"; // Assuming this is your player card component
import { UserContext } from "../context/UserContext";
import "../Styles/TeamPageStyles.css";

const TeamPage = () => {
  const [players, setPlayers] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user && user.teamId) {
      fetchPlayers();
    }
  }, [user]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getTeamPlayers?teamId=${user.teamId}`
      );
      const playersData = response.data.map((player) => ({
        ...player,
        stats: JSON.parse(player.stats),
        position: player.position || "Bench",
      }));
      setPlayers(playersData);
    } catch (error) {
      console.error("There was an error fetching the players:", error);
    }
  };
  const handleDeletePlayer = async (playerId) => {
  try {
    await axios.delete('/deletePlayerFromTeam', { data: { teamId: user.teamId, playerId } });
    console.log('Player removed from the team successfully');

    // Update the players list to reflect the deletion
    setPlayers(prevPlayers => prevPlayers.filter(player => player.idPlayers !== playerId));
  } catch (error) {
    console.error('Failed to remove player from team:', error);
  }
};


  const handlePositionChange = async (playerId, newPosition) => {
    try {
      await axios.post("/setPlayerPosition", {
        teamId: user.teamId,
        playerId,
        newPosition,
      });
      // Update the local state to reflect the change
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.idPlayers === playerId
            ? { ...player, position: newPosition }
            : player
        )
      );
      console.log("Player position updated successfully");
    } catch (error) {
      console.error("Failed to update player position:", error);
    }
  };

  return (
    <div>
      <h2>Team Roster</h2>
      <div className="team-page">
        {players.map((player) => (
          <div
            key={player.idPlayers}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <PlayerCard player={player} onDelete={handleDeletePlayer} />
            <select
              className="player-position-select"
              value={player.position}
              onChange={(e) =>
                handlePositionChange(player.idPlayers, e.target.value)
              }
              style={{ marginLeft: "10px" }}
            >
              <option value="PG">PG</option>
              <option value="SG">SG</option>
              <option value="SF">SF</option>
              <option value="PF">PF</option>
              <option value="C">C</option>
              <option value="Bench1">Bench 1</option>
              <option value="Bench2">Bench 2</option>
              <option value="Bench3">Bench 3</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
