import PlayerCard from './PlayerCard';

const PlayerCards = ({ players, onDelete }) => {
  return (
    <>
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} onDelete={onDelete} />
      ))}
    </>
  )
}

export default PlayerCards;
