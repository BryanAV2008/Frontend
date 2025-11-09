import React, { useState, useEffect } from 'react';
import { createReview, getReviewById, updateReview } from '../api/reviewService';
import './ReviewForm.css';

const ReviewForm = ({ gameId, reviewIdToEdit, onReviewSaved, onCancelEdit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = Boolean(reviewIdToEdit);

  useEffect(() => {
    if (isEditing) {
      const fetchReview = async () => {
        setLoading(true);
        setError(null);
        try {
          const review = await getReviewById(reviewIdToEdit);
          setRating(review.rating);
          setComment(review.comment);
        } catch (err) {
          setError(err.message);
          console.error('Error fetching review for edit:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchReview();
    } else {
      // Limpiar el formulario si no estamos editando
      setRating(0);
      setComment('');
    }
  }, [reviewIdToEdit, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (rating === 0) {
      setError('Por favor, selecciona una puntuación.');
      setLoading(false);
      return;
    }

    const reviewData = {
      game: gameId,
      rating,
      comment
      // Aquí se podría añadir un 'user' si tuvieras autenticación
    };

    try {
      if (isEditing) {
        await updateReview(reviewIdToEdit, reviewData);
        alert('Reseña actualizada con éxito!');
      } else {
        await createReview(reviewData);
        alert('Reseña creada con éxito!');
      }
      onReviewSaved(); // Notificar al componente padre que se guardó la reseña
      setRating(0); // Restablecer el formulario
      setComment('');
      if (isEditing && onCancelEdit) {
        onCancelEdit(); // Si es una edición, cancelar el modo de edición
      }
    } catch (err) {
      setError(err.message);
      console.error('Error saving review:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <p>Cargando reseña para editar...</p>;

  return (
    <div className="review-form-container">
      <h3>{isEditing ? 'Editar Reseña' : 'Escribe tu Reseña'}</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rating">Puntuación:</label>
          <select id="rating" name="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
            <option value="">-- Selecciona una puntuación --</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} ⭐</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="comment">Comentario:</label>
          <textarea
            id="comment"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            placeholder="Comparte tu opinión detallada sobre el juego..."
            required
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar Reseña' : 'Publicar Reseña')}
          </button>
          {isEditing && (
            <button type="button" className="btn btn-secondary" onClick={onCancelEdit} disabled={loading}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;