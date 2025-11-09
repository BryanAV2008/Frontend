import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">¡Página no encontrada!</h2>
      <p className="not-found-message">
        Lo sentimos, la página que estás buscando no existe.
      </p>
      <p className="not-found-cta">
        Puedes volver a la <Link to="/" className="not-found-link">Biblioteca de Juegos</Link>.
      </p>
      <div className="not-found-image">
        {/* Puedes añadir una imagen aquí, por ejemplo, un personaje de videojuego perdido */}
        <p>🎮</p>
      </div>
    </div>
  );
};

export default NotFound;