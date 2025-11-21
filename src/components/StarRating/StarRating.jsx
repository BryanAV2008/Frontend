// src/components/StarRating/StarRating.jsx
import React, { useState } from 'react';
import './StarRating.css'; // Asegúrate de crear este archivo CSS también o mover los estilos

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

export default StarRating;