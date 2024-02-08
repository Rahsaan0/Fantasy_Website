import React, { useState, useEffect } from "react";
import PlayerCards from "../components/PlayerCards";
import axios from "axios";

const TeamPage = () => {
  const [players, setPlayers] = useState([
    // ... SampleData ...
  ]);

  // Function to delete a player
  const deletePlayer = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/users/${id}`);
      setPlayers(players.filter((player) => player.id !== id));
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };
  //Adds a player using backEnd
  const addPlayer = async (newPlayer) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/users",
        newPlayer
      );
      setPlayers([...players, response.data]); // Assuming response.data is the new player
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };
  //Fetches players from backend
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users");
        setPlayers(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="team-container">
      {players.map((player) => (
        <div key={player.id}>
          <PlayerCards players={players} onDelete={deletePlayer} />
        </div>
      ))}
    </div>
  );
};

export default TeamPage;
