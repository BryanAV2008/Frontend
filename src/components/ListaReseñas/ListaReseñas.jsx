// GAMETRACKER-Frontend/src/components/ListaReseñas/ListaReseñas.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <--- Añadimos 'useNavigate' aquí
import { getReviews, deleteReview } from '../../api/reviews'; // <--- Ruta corregida para 'reviews'
import './ListaReseñas.css';
// import { default as StarRating } from '../Tarjetajuego/TarjetaJuego.jsx'; // <--- ¡¡¡ELIMINA ESTA LÍNEA!!!
import StarRating from '../StarRating/StarRating'; // <--- ¡¡¡AÑADE ESTA LÍNEA!!! Ruta correcta para StarRating

// Componente para mostrar la lista de reseñas
function ListaReseñas() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // <--- Inicializamos useNavigate

// Función para obtener las reseñas desde la API
  const fetchAllReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReviews();
      setReviews(data);
      console.log("Reseñas cargadas:", data); // Para depuración
    } catch (err) {
      console.error("Error al cargar las reseñas:", err); // Añadido para mejor depuración
      setError(err);
    } finally {
      setLoading(false);
    }
  };
// useEffect para cargar las reseñas al montar el componente
  useEffect(() => {
    fetchAllReviews();
  }, []);
// Maneja la eliminación de una reseña
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter(review => review._id !== reviewId));
        alert('Reseña eliminada con éxito!'); // Mensaje de éxito
      } catch (err) {
        console.error("Error al eliminar la reseña:", err); // Añadido para mejor depuración
        setError(err);
        alert('Error al eliminar la reseña.');
      }
    }
  };

  if (loading) return <div className="loading-message">Cargando reseñas...</div>;
  if (error) return <div className="error-message">Error al cargar las reseñas: {error.message}</div>;

  return (
    <div className="lista-reviews-container">
      <h2>Todas las Reseñas</h2>
      {reviews.length === 0 ? (
        <p className="no-reviews-message">No hay reseñas disponibles. ¡Sé el primero en escribir una!</p>
      ) : (
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review._id} className="review-item">
              <h3>{review.gameTitle || 'Juego Desconocido'}</h3>
              <p className="review-author">Por: <strong>{review.author || 'Anónimo'}</strong></p>
              <div className="review-rating">
                <StarRating rating={review.rating} readOnly={true} />
              </div>
              {/* --- ¡¡¡CORRECCIÓN AQUÍ: review.comment en lugar de review.content!!! --- */}
              <p className="review-content">{review.comment || 'Sin comentario.'}</p> 
              <div className="review-actions">
                <Link to={`/edit-review/${review._id}`} className="btn-primary">Editar</Link>
                <button onClick={() => handleDeleteReview(review._id)} className="btn-danger" disabled={loading}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaReseñas;