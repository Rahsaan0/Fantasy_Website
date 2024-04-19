import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const GamesPage = () => {
  const [gameId, setGameId] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [gameDate, setGameDate] = useState("");
  const { user } = useContext(UserContext);

  // Fetch all teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/teams`);
        if (user && user.teamId) {
          // Filter out the user's own team
          const filteredTeams = response.data.filter(
            (team) => team.teamID !== user.teamId
          );
          setTeams(filteredTeams);
        } else {
          setTeams(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };
    fetchTeams();
  }, [user]);

const handleGameCreation = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.teamId && selectedTeam) {
    try {
      const response = await axios.post("http://localhost:3001/createGame", {
        teamId: user.teamId,
        opponentId: selectedTeam, // This should be the opponent's team ID
        gameDate: gameDate,
      });
      setGameId(response.data.gameId); // Assuming the backend returns the gameId
      alert("Game created successfully!");
    } catch (error) {
      console.error("Error creating game:", error);
    }
  } else {
    alert("Please make sure you have selected a team and set a game date.");
  }
};

  return (
    <div>
      <h1>Schedule a Game</h1>
      <select
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
      >
        {teams.map((team) => (
          <option key={team.teamID} value={team.teamID}>
            {team.teamName}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={gameDate}
        onChange={(e) => setGameDate(e.target.value)}
      />
      <button onClick={handleGameCreation}>Create Game</button>
    </div>
  );
};

export default GamesPage;
