// src/components/ListaReseñas/ListaReseñas.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReviews, deleteReview } from '../../api'; // Importamos funciones de la API
import './ListaReseñas.css';
import { default as StarRating } from '../Tarjetajuego/Tarjetajuego.jsx'; // Importamos StarRating del componente TarjetaJuego

function ListaReseñas() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter(review => review._id !== reviewId));
      } catch (err) {
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
              <p className="review-content">{review.content}</p>
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