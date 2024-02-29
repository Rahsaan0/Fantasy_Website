import React from "react";
import { FaTimes } from "react-icons/fa";

const PlayerCard = ({ player, onDelete }) => {
  return (
    <div className="player-card">
      <h3>
        {player.name}{" "}
        <FaTimes
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => onDelete(player.id)}
        />
      </h3>
      <p>Position: {player.position}</p>
      <p>Points: {player.stats.pts}</p>
      <p>Rebounds: {player.stats.reb}</p>
      <p>Assists: {player.stats.ast}</p>
      <p>Steals: {player.stats.stl}</p>
      <p>Blocks: {player.stats.blk}</p>
      <p>Turnovers: {player.stats.turnover}</p>
      {/* Add other player details as needed */}
    </div>
  );
};

export default PlayerCard;
