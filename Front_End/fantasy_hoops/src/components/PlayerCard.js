import { FaTimes } from 'react-icons/fa';

const PlayerCard = ({ player, onDelete }) => {
  return (
    <div className="player-card">
      <h3>
        {player.name} {' '}
        <FaTimes 
          style={{ color: 'red', cursor: 'pointer' }}
          onClick={() => onDelete(player.id)}
        />
      </h3>
      <p>{player.position}</p>
      {/* Add other player details as needed */}
    </div>
  )
}

export default PlayerCard;
