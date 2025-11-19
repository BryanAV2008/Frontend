import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getGameById, updateGameCompletedStatus, updateGameRating, updateGameHoursPlayed } from '../../api';
import './TarjetaJuego.css';
import placeholderImage from '../../assets/images/placeholder.png';

function StarRating({ rating, onRatingChange, readOnly = false }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hoverRating || rating) ? 'filled' : ''} ${readOnly ? 'read-only' : ''}`}
          onClick={() => !readOnly && onRatingChange(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TarjetaJuego({ game: initialGame, onDelete, onUpdate, isDetailPage = false }) {
  const { id } = useParams();
  const [game, setGame] = useState(initialGame);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // useEffect para cargar los detalles del juego si estamos en la página de detalle
  useEffect(() => {
    if (isDetailPage && id) {
      const fetchGameDetails = async () => {
        setLoading(true);
        try {
          const data = await getGameById(id);
          setGame(data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchGameDetails();
    } else {
      setGame(initialGame);
    }
  }, [id, isDetailPage, initialGame]);

  // Maneja el cambio del estado de completado
  const handleToggleCompleted = async () => {
    if (!game) return;
    try {
      setLoading(true);
      const updatedGame = await updateGameCompletedStatus(game._id, !game.completed);
      setGame(prev => ({ ...prev, completed: updatedGame.completed }));
      if (onUpdate) onUpdate(); // Notificar al padre (BibliotecaJuegos)
    } catch (err) {
      console.error("Error toggling completed status:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Maneja el cambio de la calificación
  const handleRatingChange = async (newRating) => {
    if (!game || newRating === game.rating) return;
    try {
      setLoading(true);
      const updatedGame = await updateGameRating(game._id, newRating);
      setGame(prev => ({ ...prev, rating: updatedGame.rating }));
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error updating rating:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Maneja el cambio de las horas jugadas
  const handleHoursPlayedChange = async (e) => {
    if (!game) return;
    const newHours = parseInt(e.target.value, 10);
    if (isNaN(newHours) || newHours < 0 || newHours === game.hoursPlayed) return;

    try {
      setLoading(true);
      const updatedGame = await updateGameHoursPlayed(game._id, newHours);
      setGame(prev => ({ ...prev, hoursPlayed: updatedGame.hoursPlayed }));
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error updating hours played:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el clic en eliminar (CON PREVENCIÓN DE REDIRECCIÓN)
  const handleDeleteClick = (event) => {
    event.stopPropagation(); // Detiene que el evento "suba" y sea capturado por padres
    event.preventDefault();  // Previene la acción por defecto de un Link si existiera un padre
    if (onDelete) {
      onDelete(game._id);
    }
  };

  if (loading && isDetailPage) return <div className="loading-message">Cargando detalles del juego...</div>;
  if (error && isDetailPage) return <div className="error-message">Error al cargar el juego: {error.message}</div>;
  if (!game) return <div className="no-game-found">Juego no encontrado.</div>;

  return (
    <div className={`tarjeta-juego ${isDetailPage ? 'detail-page' : ''}`}>
      {!isDetailPage && (
        <Link to={`/game/${game._id}`} className="game-link-overlay">
          <img src={game.coverImageUrl || placeholderImage} alt={game.title} className="game-cover" />
        </Link>
      )}
      {isDetailPage && (
        <img src={game.coverImageUrl || placeholderImage} alt={game.title} className="game-cover detail-cover" />
      )}

      <div className="game-info">
        <h3>{game.title}</h3>
        {isDetailPage && <p className="game-description">{game.description || 'No hay descripción disponible.'}</p>}
        <p><strong>Género:</strong> {game.genre || 'N/A'}</p>
        <p><strong>Plataforma:</strong> {game.platform || 'N/A'}</p>
        {game.releaseDate && <p><strong>Lanzamiento:</strong> {new Date(game.releaseDate).toLocaleDateString()}</p>}

        <div className="game-rating-section">
          <p><strong>Puntuación:</strong></p>
          <StarRating rating={game.rating} onRatingChange={handleRatingChange} readOnly={loading} />
        </div>

        <div className="game-status-section">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={game.completed}
              onChange={handleToggleCompleted}
              disabled={loading}
            />
            <span className="checkmark"></span>
            Completado
          </label>
        </div>

        <div className="game-hours-section">
          <label htmlFor={`hours-${game._id}`}><strong>Horas jugadas:</strong></label>
          <input
            id={`hours-${game._id}`}
            type="number"
            value={game.hoursPlayed || 0}
            onChange={handleHoursPlayedChange}
            min="0"
            disabled={loading}
            className="hours-input"
          />
        </div>
      </div>

      <div className="game-actions">
        <Link to={`/add-review/${game._id}`} className="btn-secondary">Escribir Reseña</Link>
        <Link to={`/edit-game/${game._id}`} className="btn-primary">Editar</Link>
        {onDelete && <button onClick={handleDeleteClick} className="btn-danger" disabled={loading}>Eliminar</button>}
      </div>
    </div>
  );
}

export default TarjetaJuego;