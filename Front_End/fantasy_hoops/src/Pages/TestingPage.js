import React, { useState, useEffect, useContext } from "react";
import PlayerCard from "../components/PlayerCard";
import { UserContext } from "../context/UserContext";
import axios from 'axios';


const TestingPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({});
  const [playerStats, setPlayerStats] = useState({});
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setPlayers([]); 
      return;
    }

    const fetchPlayers = async () => {
      try {
        const response = await fetch(
          `/databasePlayers?name=${encodeURIComponent(inputValue)}`
        );
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchPlayers();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  const handleSelection = (value) => {
    setInputValue(value);
    const selectedPlayer = players.find((player) => player.name === value);
    if (selectedPlayer) {
      setPlayerInfo(selectedPlayer);
      setPlayerStats(JSON.parse(selectedPlayer.stats))
    }
  };

  const addPlayerToTeam = async (playerId) => {
    if (!user || !user.teamId) {
      alert('You must have a team to add players.');
      return;
    }
    try {
      await axios.post("/addPlayerToTeam", {
        teamId: user.teamId,
        playerId: playerId,
      });
      alert('Player added to the team successfully');
    } catch (error) {
      console.error('Failed to add player to team:', error);
      alert('Failed to add player to team');
    }
  };
  
  
  return (
    <div>
      <h2>Search for a Player</h2>
      <input
        type="text"
        list="playersDataList"
        value={inputValue}
        onInput={(e) => handleSelection(e.target.value)}
        placeholder="Search for player"
      />
      <datalist id="playersDataList">
        {players.map((player, index) => (
          <option key={index} value={player.name} />
        ))}
      </datalist>
      {playerInfo && playerStats && (
        <>
          <PlayerCard player={{ ...playerInfo, stats: playerStats }} />
          <button onClick={() => addPlayerToTeam(playerInfo.idPlayers)}>
            Add Player to Team
          </button>
        </>
      )}
    </div>
  );

};

export default TestingPage;

