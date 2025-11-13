import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CardJuego.css';

const CardJuego = ({ game, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/juegos/${game._id}`);
  };

  const renderStars = (score) => {
    return '⭐'.repeat(score || 0) + '☆'.repeat(5 - (score || 0));
  };

  // Determina la clase CSS según el estado del juego
  const statusClass = `status-${game.status.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <div className="card-juego">
      <div className="card-juego-header" onClick={handleViewDetail}>
        <img
          src={game.coverImage || 'https://via.placeholder.com/300x400/007bff/ffffff?text=No+Cover'}
          alt={game.title}
          className="card-juego-imagen"
        />
      </div>
      <div className="card-juego-body">
        <h3 className="card-juego-titulo" onClick={handleViewDetail}>{game.title}</h3>
        <p className="card-juego-plataforma"><strong>Plataforma:</strong> {game.platform}</p>
        {game.genre && <p className="card-juego-genero"><strong>Género:</strong> {game.genre}</p>}
        <p className="card-juego-estado">
          <strong>Estado:</strong> <span className={statusClass}>{game.status}</span>
        </p>
        {game.score > 0 && (
          <p className="card-juego-puntuacion">
            <strong>Puntuación:</strong> {renderStars(game.score)}
          </p>
        )}
        {game.hoursPlayed > 0 && (
          <p className="card-juego-horas">
            <strong>Horas Jugadas:</strong> {game.hoursPlayed}
          </p>
        )}
      </div>
      <div className="card-juego-actions">
        <button className="btn btn-secondary" onClick={() => onEdit(game._id)}>Editar</button>
        <button className="btn btn-danger" onClick={() => onDelete(game._id)}>Eliminar</button>
      </div>
    </div>
  );
};

export default CardJuego;