import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById, deleteGame } from '../api/gameService';
import { getReviews, deleteReview } from '../api/reviewService';
import ListaResenas from '../components/ListaResenas';
import ReviewForm from '../components/ReviewForm';
import './GameDetail.css';

const GameDetail = () => {
  const { id } = useParams(); // ID del juego desde la URL
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingGame, setLoadingGame] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState(null);
  const [reviewToEdit, setReviewToEdit] = useState(null); // Para almacenar la reseña que se está editando

  const renderStars = (score) => {
    return '⭐'.repeat(score || 0) + '☆'.repeat(5 - (score || 0));
  };

  // Función para cargar los detalles del juego
  const fetchGameDetails = useCallback(async () => {
    setLoadingGame(true);
    setError(null);
    try {
      const data = await getGameById(id);
      setGame(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener detalles del juego:', err);
    } finally {
      setLoadingGame(false);
    }
  }, [id]);

  // Función para cargar las reseñas del juego
  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const data = await getReviews(id); // Obtener reseñas específicas para este gameId
      setReviews(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener reseñas del juego:', err);
    } finally {
      setLoadingReviews(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGameDetails();
    fetchReviews();
  }, [fetchGameDetails, fetchReviews]);

  const handleDeleteGame = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${game.title}" y todas sus reseñas?`)) {
      try {
        await deleteGame(id);
        alert('Juego eliminado con éxito.');
        navigate('/'); // Redirigir a la biblioteca principal
      } catch (err) {
        alert('Error al eliminar el juego: ' + err.message);
        console.error('Error al eliminar el juego:', err);
      }
    }
  };

  const handleEditGame = () => {
    navigate(`/juegos/editar/${id}`);
  };

  const handleReviewSaved = () => {
    fetchReviews(); // Recargar reseñas después de guardar
    setReviewToEdit(null); // Salir del modo de edición de reseña
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await deleteReview(reviewId);
        alert('Reseña eliminada con éxito.');
        fetchReviews(); // Recargar reseñas
      } catch (err) {
        alert('Error al eliminar la reseña: ' + err.message);
        console.error('Error al eliminar la reseña:', err);
      }
    }
  };

  const handleEditReview = (reviewId) => {
    setReviewToEdit(reviewId); // Establecer la reseña a editar
  };

  const handleCancelEditReview = () => {
    setReviewToEdit(null); // Cancelar la edición
  };

  if (loadingGame) return <p className="loading-message">Cargando detalles del juego...</p>;
  if (error) return <div className="error-container"><p className="error-message">Error: {error}</p></div>;
  if (!game) return <p className="no-data-message">Juego no encontrado.</p>;

  return (
    <div className="game-detail-container">
      <div className="game-info-section">
        <img
          src={game.coverImage || 'https://via.placeholder.com/300x400/007bff/ffffff?text=No+Cover'}
          alt={game.title}
          className="game-cover-image"
        />
        <div className="game-details">
          <h2>{game.title}</h2>
          <p><strong>Plataforma:</strong> {game.platform}</p>
          {game.genre && <p><strong>Género:</strong> {game.genre}</p>}
          {game.releaseDate && <p><strong>Lanzamiento:</strong> {new Date(game.releaseDate).toLocaleDateString()}</p>}
          <p><strong>Estado:</strong> <span className={`status-${game.status.toLowerCase().replace(/\s/g, '-')}`}>{game.status}</span></p>
          {game.score > 0 && <p><strong>Puntuación:</strong> {renderStars(game.score)}</p>}
          {game.hoursPlayed > 0 && <p><strong>Horas Jugadas:</strong> {game.hoursPlayed}</p>}

          <div className="game-actions">
            <button onClick={handleEditGame} className="btn btn-secondary">Editar Juego</button>
            <button onClick={handleDeleteGame} className="btn btn-danger">Eliminar Juego</button>
            <button onClick={() => navigate('/')} className="btn btn-info">Volver a la Biblioteca</button>
          </div>
        </div>
      </div>

      <div className="game-reviews-section">
        <h3>Sección de Reseñas</h3>
        {loadingReviews ? (
          <p className="loading-message">Cargando reseñas...</p>
        ) : (
          <>
            <ReviewForm
              gameId={id}
              reviewIdToEdit={reviewToEdit}
              onReviewSaved={handleReviewSaved}
              onCancelEdit={handleCancelEditReview}
            />
            <ListaResenas
              reviews={reviews}
              onDeleteReview={handleDeleteReview}
              onEditReview={handleEditReview}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default GameDetail;