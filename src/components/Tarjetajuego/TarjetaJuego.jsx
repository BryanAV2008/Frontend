// src/components/TarjetaJuego/TarjetaJuego.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getGameById, updateGameCompletedStatus, updateGameRating, updateGameHoursPlayed } from '../../api'; // Importamos API
import './TarjetaJuego.css';
import placeholderImage from '../../assets/images/placeholder.png'; // Importa tu imagen de placeholder

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
  const { id } = useParams(); // Obtiene el ID de la URL si es una página de detalle
  const [game, setGame] = useState(initialGame);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      setGame(initialGame); // Si no es página de detalle, usa el game pasado por prop
    }
  }, [id, isDetailPage, initialGame]);

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
        {onDelete && <button onClick={() => onDelete(game._id)} className="btn-danger" disabled={loading}>Eliminar</button>}
      </div>
    </div>
  );
}

export default TarjetaJuego;