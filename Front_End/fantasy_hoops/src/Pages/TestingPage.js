import React, { useState, useEffect } from "react";

const TestingPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({});

  useEffect(() => {
    if (inputValue.trim() === "") {
      setPlayers([]); // Clear suggestions if input is empty
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
    setInputValue(value); // Update the input value to the selected name
    const selectedPlayer = players.find((player) => player.name === value);
    if (selectedPlayer) {
      setPlayerInfo(selectedPlayer); // Update playerInfo with the selected player object
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
      {playerInfo && (
        <div>
          <h3>Player Information:</h3>
          <p>Name: {playerInfo.name}</p>
          <p>Position: {playerInfo.position}</p>
          <p>Team: {playerInfo.nbaTeam}</p>
        </div>
      )}
    </div>
  );
};

export default TestingPage;












// const addPlayerToTeam = (player) => {
//   if (!user || !user.teamId) {
//     console.log(user.teamId);
//     setError("You must be logged in to add a player to your team.");
//     return;
//   }

//   axios
//     .post(
//       "http://localhost:3001/addPlayerToTeam",
//       {
//         userId: user.id, // Ensure this is the correct user identifier
//         teamId: user.teamId,
//         playerData: player, // Send the whole player object
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your token key
//         },
//       }
//     )
//     .then(() => {
//       alert("Player added to team successfully");
//       setError(""); // Clear any previous errors
//     })
//     .catch((error) => {
//       console.error("Error adding player to team:", error);
//       setError("Failed to add player to team.");
//     });
// };