import React from 'react';
import './ListaResenas.css';

const ListaResenas = ({ reviews, onDeleteReview, onEditReview }) => {
  const renderStars = (rating) => {
    return '⭐'.repeat(rating || 0) + '☆'.repeat(5 - (rating || 0));
  };

  if (!reviews || reviews.length === 0) {
    return <p className="no-reviews-message">Aún no hay reseñas para este juego. ¡Sé el primero en escribir una!</p>;
  }

  return (
    <div className="lista-resenas-container">
      {reviews.map((review) => (
        <div key={review._id} className="resena-card">
          <div className="resena-header">
            <span className="resena-rating">{renderStars(review.rating)}</span>
            {/* Si tuvieras autenticación y nombre de usuario, lo mostrarías aquí */}
            {/* <span className="resena-author">por {review.user?.name || 'Anónimo'}</span> */}
          </div>
          <p className="resena-comment">{review.comment}</p>
          <p className="resena-info">Publicado el: {new Date(review.createdAt).toLocaleDateString()}</p>
          <div className="resena-acciones">
            <button onClick={() => onEditReview(review._id)} className="btn btn-secondary btn-sm">Editar</button>
            <button onClick={() => onDeleteReview(review._id)} className="btn btn-danger btn-sm">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaResenas;