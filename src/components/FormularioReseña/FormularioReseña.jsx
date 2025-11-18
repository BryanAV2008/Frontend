import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById } from '../../api'; // Para obtener el título del juego
import { getReviewById, createReview, updateReview } from '../../api'; 
import './FormularioReseña.css';
import { default as StarRating } from '../Tarjetajuego/TarjetaJuego.jsx'; 
// Componente para el formulario de añadir/editar reseñas
function FormularioReseña() {
  const { id, gameId } = useParams(); // 'id' para editar reseña, 'gameId' para crear en un juego específico
  const navigate = useNavigate();
  const [review, setReview] = useState({
    game: gameId || '', 
    gameTitle: '',      
    author: '',         
    rating: 0,
    content: '',        
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameLoading, setGameLoading] = useState(false);
// useEffect para cargar los datos de la reseña o del juego al montar el componente
  useEffect(() => {
  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
// Si estamos editando una reseña, cargar sus datos
    try {
      if (id) {
       
      } else if (gameId) {
        console.log("Modo creación. Intentando cargar juego con ID:", gameId); 
        setGameLoading(true);
        const gameData = await getGameById(gameId); 
        console.log("Resultado de getGameById:", gameData); 

        if (!gameData) { 
          throw new Error("El juego especificado no fue encontrado.");
        }

        setReview(prev => ({ ...prev, game: gameId, gameTitle: gameData.title }));
        setGameLoading(false);
      }
    } catch (err) {
      console.error("Error al cargar datos iniciales de la reseña o juego:", err); 
      setError(new Error(`Error: ${err.message}. Asegúrate de que el juego existe.`));
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
// Maneja el cambio de la calificación
  const handleRatingChange = (newRating) => {
    setReview(prevReview => ({
      ...prevReview,
      rating: newRating
    }));
  };
// Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Asegurarse de que el game ID esté presente al crear
    if (!review.game && !id) {
        setError(new Error("Se necesita un juego para crear una reseña."));
        setLoading(false);
        return;
    }

    // Construye el objeto de datos para enviar al backend
    const dataToSend = {
      game: review.game,
      rating: review.rating,
      comment: review.content, // <--- Mapeamos 'content' (frontend) a 'comment' (backend)
    };

    // Añade el autor solo si se ha introducido un valor
    if (review.author) {
      dataToSend.author = review.author;
    }
// Llama a la API para crear o actualizar la reseña
    try {
      if (id) {
        await updateReview(id, dataToSend); // Usamos 'dataToSend'
        alert('Reseña actualizada con éxito!');
      } else {
        await createReview(dataToSend); // Usamos 'dataToSend'
        alert('Reseña publicada con éxito!');
      }
      navigate('/reviews'); // Redirigir a la lista de reseñas
    } catch (err) {
      console.error('Error al guardar la reseña:', err); // Log más detallado
      // Si el backend devuelve un mensaje de error específico, intenta mostrarlo
      const errorMessage = err.response?.data?.message || err.message || `Error al ${id ? 'actualizar' : 'publicar'} la reseña.`;
      setError(new Error(errorMessage)); // Almacena el error en el estado
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
// Mostrar el mensaje de carga si estamos obteniendo datos
  if (loading && (id || gameId) && (!review.gameTitle && !review.content && !error)) {
    return <div className="loading-message">Cargando reseña/juego...</div>;
  }
  // Mostrar el mensaje de error si existe
  if (error) return <div className="error-message">Error: {error.message}</div>;

// Renderizado del formulario
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
          {/* El componente StarRating toma 'rating', 'onRatingChange' y 'readOnly' */}
          <StarRating rating={review.rating} onRatingChange={handleRatingChange} readOnly={loading} />
          {review.rating === 0 && <p className="rating-tip">Haz clic en una estrella para puntuar.</p>}
        </div>
        <div className="form-group">
          <label htmlFor="content">Tu reseña:</label>
          <textarea
            id="content"
            name="content" // El nombre del campo para el estado es 'content'
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