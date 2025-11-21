// GAMETRACKER-Frontend/src/components/FormularioReseña/FormularioReseña.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById } from '../../api/games';
import { getReviewById, createReview, updateReview } from '../../api/reviews';
import './FormularioReseña.css';

import StarRating from '../StarRating/StarRating.jsx'; // Importación correcta del componente StarRating

function FormularioReseña() {
  const { id, gameId } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState({
    game: gameId || '',          // Guarda el ID del juego
    gameTitle: '',               // Título del juego para mostrar
    author: '',
    rating: 0,                   // Estado para la puntuación (0 por defecto)
    content: '',                 // Contenido de la reseña (este es el nombre interno del estado en el frontend)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameLoading, setGameLoading] = useState(false);

  // useEffect para cargar los datos de la reseña o del juego
  useEffect(() => {
    console.log("useEffect: Componente montado/actualizado. id:", id, "gameId:", gameId);
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (id) {
          // Modo edición: cargamos la reseña existente
          console.log("useEffect: Modo edición, cargando reseña con ID:", id);
          const existingReview = await getReviewById(id);
          
          // --- ¡¡¡CORRECCIÓN AQUÍ!!! ---
          // Accedemos a existingReview.game._id
          const gameData = await getGameById(existingReview.game._id); 
          
          setReview({
            game: existingReview.game._id, // También guarda el ID del juego, no el objeto completo
            gameTitle: gameData.title,
            author: existingReview.author || '',
            rating: existingReview.rating,
            comment: existingReview.comment, // <--- Esto sigue siendo un typo, debería ser content
            content: existingReview.comment, // Al cargar la reseña, el backend envía 'comment', lo mapeamos a 'content' del estado del frontend
          });
          console.log("useEffect: Reseña existente cargada:", existingReview);
        } else if (gameId) {
          // Modo creación: cargamos los datos del juego para mostrar el título
          console.log("useEffect: Modo creación, cargando juego con ID:", gameId);
          setGameLoading(true);
          const gameData = await getGameById(gameId);
          console.log("useEffect: Resultado de getGameById:", gameData);

          if (!gameData) {
            throw new Error("El juego especificado no fue encontrado.");
          }
          setReview(prev => ({ ...prev, game: gameId, gameTitle: gameData.title }));
          setGameLoading(false);
          console.log("useEffect: Estado del juego establecido:", gameData.title);
        }
      } catch (err) {
        console.error("useEffect: Error al cargar datos iniciales:", err);
        setError(new Error(`Error al cargar datos: ${err.message}.`));
      } finally {
        setLoading(false);
        console.log("useEffect: Carga inicial finalizada. Loading:", false);
      }
    };
    fetchInitialData();
  }, [id, gameId]); // Las dependencias son id y gameId

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`handleChange: Campo ${name} cambiado a: ${value}`);
    setReview(prevReview => ({
      ...prevReview,
      [name]: value
    }));
  };

  const handleRatingChange = (newRating) => {
    console.log("handleRatingChange: Puntuación seleccionada:", newRating);
    setReview(prevReview => ({
      ...prevReview,
      rating: newRating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit: Formulario enviado. Estado actual de la reseña:", review);
    setLoading(true);
    setError(null);

    // --- VALIDACIONES ---
    if (!review.game) {
      console.error("handleSubmit: Validación fallida - ID de juego requerido.");
      setError(new Error("Error: Se necesita un juego para crear/editar una reseña."));
      setLoading(false);
      return;
    }
    if (review.rating === 0) {
      console.error("handleSubmit: Validación fallida - Puntuación requerida (0).");
      setError(new Error("Error: Por favor, selecciona una puntuación (1-5 estrellas)."));
      setLoading(false);
      return;
    }
    if (!review.content.trim()) {
      console.error("handleSubmit: Validación fallida - Contenido de la reseña vacío.");
      setError(new Error("Error: Por favor, escribe el contenido de tu reseña."));
      setLoading(false);
      return;
    }
    // --- FIN VALIDACIONES ---

    const dataToSend = {
      game: review.game,
      rating: review.rating,
      comment: review.content.trim(), // *** CAMBIO CLAVE AQUÍ: Enviamos 'comment' al backend ***
      author: review.author.trim(),   // Siempre envía el autor, incluso si está vacío.
    };
    
    console.log("handleSubmit: Datos a enviar al backend:", dataToSend);

    try {
      if (id) {
        console.log("handleSubmit: Llamando a updateReview para ID:", id);
        await updateReview(id, dataToSend);
        alert('Reseña actualizada con éxito!');
      } else {
        console.log("handleSubmit: Llamando a createReview.");
        await createReview(dataToSend);
        alert('Reseña publicada con éxito!');
      }
      console.log("handleSubmit: Operación exitosa, redirigiendo a /reviews.");
      navigate('/reviews'); // Redirigir siempre después de una operación exitosa
    } catch (err) {
      console.error('handleSubmit: Error al guardar la reseña:', err);
      const errorMessage = err.response?.data?.message || err.message || `Error al ${id ? 'actualizar' : 'publicar'} la reseña.`;
      setError(new Error(errorMessage));
    } finally {
      setLoading(false);
      console.log("handleSubmit: Proceso de envío finalizado. Loading:", false);
    }
  };

  if (loading && (id || gameId) && (!review.gameTitle && !review.content && !error)) {
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
            name="content" // El nombre del estado y del input en el frontend sigue siendo 'content'
            value={review.content}
            onChange={handleChange}
            rows="8"
            required
            disabled={loading}
          ></textarea>
        </div>
        <button type="submit" className="btn-primary" disabled={loading || gameLoading || review.rating === 0 || !review.content.trim()}>
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