// src/components/StarRating/StarRating.jsx

import React, { useState, useEffect } from 'react';
import './StarRating.css';

function StarRating({ rating, onRatingChange, readOnly = false }) {
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    // Si el componente se vuelve readOnly, reseteamos el hoverRating
    if (readOnly) {
      setHoverRating(0);
    }
  }, [readOnly]);

  // Asegurémonos de que 'rating' siempre sea un número válido y no NaN.
  // Si no es un número válido, lo tratamos como 0 para que no se muestre ninguna estrella llena.
  const sanitizedRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;

  return (
    <div className={`star-rating ${readOnly ? 'read-only' : ''}`}>
      {[1, 2, 3, 4, 5].map((starValue) => {
        // La lógica para llenar las estrellas:
        // Si es readOnly, usamos directamente el rating sanitizado.
        // Si no es readOnly, usamos el hoverRating (si está activo) o el rating sanitizado.
        const valueToCompare = readOnly ? sanitizedRating : (hoverRating || sanitizedRating);
        const isFilled = starValue <= valueToCompare;

        return (
          <span
            key={starValue}
            className={`star ${isFilled ? 'filled' : ''}`}
            onClick={() => {
              if (!readOnly && onRatingChange) { // Solo permite click si no es readOnly y hay un handler
                onRatingChange(starValue);
              }
            }}
            onMouseEnter={() => {
              if (!readOnly) { // Solo permite hover si no es readOnly
                setHoverRating(starValue);
              }
            }}
            onMouseLeave={() => {
              if (!readOnly) { // Solo permite leave si no es readOnly
                setHoverRating(0);
              }
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default StarRating;