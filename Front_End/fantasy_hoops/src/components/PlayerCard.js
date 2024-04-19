import React from "react";
import PropTypes from "prop-types";
import "../Styles/PlayerCard.css";

const PlayerCard = ({ player, onDelete }) => {
  return (
    <div className="player-card">
      <h3 className="player-name">{player.name}</h3>
      <p className="player-team">{player.nbaTeam}</p>
      <p className="player-position">{player.position}</p>
      <div className="player-stats">
        <p>Points: {player.stats.pts}</p>
        <p>Rebounds: {player.stats.reb}</p>
        <p>Assists: {player.stats.ast}</p>
        <p>Steals: {player.stats.stl}</p>
        <p>Blocks: {player.stats.blk}</p>
        <p>Turnovers: {player.stats.turnover}</p>
      </div>
      <button
        className="delete-button"
        onClick={() => onDelete(player.idPlayers)}
        aria-label="Delete player"
      >
        ✕
      </button>
    </div>
  );
};

// PropTypes for type checking
PlayerCard.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    nbaTeam: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    stats: PropTypes.shape({
      pts: PropTypes.number,
      reb: PropTypes.number,
      ast: PropTypes.number,
      stl: PropTypes.number,
      blk: PropTypes.number,
      turnover: PropTypes.number,
    }).isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PlayerCard;
