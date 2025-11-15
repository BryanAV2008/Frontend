// src/components/FormularioReseña/FormularioReseña.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById } from '../../api'; // Para obtener el título del juego
import { getReviewById, createReview, updateReview } from '../../api'; // Para CRUD de reseñas
import './FormularioReseña.css';
import { default as StarRating } from '../Tarjetajuego/Tarjetajuego.jsx'; // Importamos StarRating

function FormularioReseña() {
  const { id, gameId } = useParams(); // 'id' para editar reseña, 'gameId' para crear en un juego específico
  const navigate = useNavigate();
  const [review, setReview] = useState({
    game: gameId || '', // ID del juego asociado
    gameTitle: '', // Se llenará si se conoce el juego
    author: '',
    rating: 0,
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameLoading, setGameLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (id) {
          // Modo edición: cargar datos de la reseña existente
          const reviewData = await getReviewById(id);
          setReview(reviewData);
          // Si la reseña tiene un game ID, cargar el título del juego
          if (reviewData.game) {
              setGameLoading(true);
              const gameData = await getGameById(reviewData.game);
              setReview(prev => ({ ...prev, gameTitle: gameData.title }));
              setGameLoading(false);
          }
        } else if (gameId) {
          // Modo creación para un juego específico: cargar título del juego
          setGameLoading(true);
          const gameData = await getGameById(gameId);
          setReview(prev => ({ ...prev, game: gameId, gameTitle: gameData.title }));
          setGameLoading(false);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, gameId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview(prevReview => ({
      ...prevReview,
      [name]: value
    }));
  };

  const handleRatingChange = (newRating) => {
    setReview(prevReview => ({
      ...prevReview,
      rating: newRating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();//preveni cualquie evento por defecto
    setLoading(true);
    setError(null);

    // Asegurarse de que el game ID esté presente al crear
    if (!review.game && !id) {
        setError(new Error("Se necesita un juego para crear una reseña."));
        setLoading(false);
        return;
    }

    try {
      if (id) {
        await updateReview(id, review);
        alert('Reseña actualizada con éxito!');
      } else {
        await createReview(review);
        alert('Reseña publicada con éxito!');
      }
      navigate('/reviews'); // Redirigir a la lista de reseñas
    } catch (err) {
      setError(err);
      alert(`Error al ${id ? 'actualizar' : 'publicar'} la reseña: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && (id || gameId) && (!review.gameTitle && !review.content)) {
    return <div className="loading-message">Cargando reseña/juego...</div>;
  }
  if (error) return <div className="error-message">Error: {error.message}</div>;

  return (
    <div className="formulario-review-container">
      <h2>{id ? 'Editar Reseña' : `Escribir Reseña para ${gameLoading ? 'Cargando...' : (review.gameTitle || 'un Juego')}`}</h2>
      <form onSubmit={handleSubmit} className="formulario-review">
        {review.gameTitle && (
            <div className="form-group game-title-display">
                <label>Juego:</label>
                <p><strong>{review.gameTitle}</strong></p>
            </div>
        )}
        <div className="form-group">
          <label htmlFor="author">Tu nombre (opcional):</label>
          <input
            type="text"
            id="author"
            name="author"
            value={review.author}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="rating">Puntuación (1-5):</label>
          <StarRating rating={review.rating} onRatingChange={handleRatingChange} readOnly={loading} />
          {review.rating === 0 && <p className="rating-tip">Haz clic en una estrella para puntuar.</p>}
        </div>
        <div className="form-group">
          <label htmlFor="content">Tu reseña:</label>
          <textarea
            id="content"
            name="content"
            value={review.content}
            onChange={handleChange}
            rows="8"
            required
            disabled={loading}
          ></textarea>
        </div>
        <button type="submit" className="btn-primary" disabled={loading || gameLoading || review.rating === 0}>
          {loading ? 'Guardando...' : (id ? 'Guardar Cambios' : 'Publicar Reseña')}
        </button>
        <button type="button" className="btn-secondary" onClick={() => navigate(-1)} disabled={loading || gameLoading}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default FormularioReseña;