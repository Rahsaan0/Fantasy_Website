import React, { useState } from 'react';
import PlayerCards from '../components/PlayerCards';

const TeamPage = () => {
  const [players, setPlayers] = useState([
    // ... SampleData ...
  ]);

  // Function to delete a player
  const deletePlayer = (id) => {
    setPlayers(players.filter((player) => player.id !== id));
  };



  return (
    <div className="team-container">
      <PlayerCards players={players} onDelete={deletePlayer} />
      
    </div>
  );
};

export default TeamPage;

