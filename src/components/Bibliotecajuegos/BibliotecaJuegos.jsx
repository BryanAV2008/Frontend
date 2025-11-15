import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TarjetaJuego from '../Tarjetajuego/Tarjetajuego.jsx';
import { getGames, deleteGame } from '../../api/index.js'; 
import './BibliotecaJuegos.css';

function BibliotecaJuegos() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAllGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGames();
      setGames(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGames();
  }, []);

  const handleDeleteGame = async (gameId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      try {
        await deleteGame(gameId);
        setGames(games.filter(game => game._id !== gameId));
      } catch (err) {
        setError(err);
        alert('Error al eliminar el juego.');
      }
    }
  };

  if (loading) return <div className="loading-message">Cargando tu biblioteca de juegos...</div>;
  if (error) return <div className="error-message">Error al cargar los juegos: {error.message}</div>;

  return (
    <div className="biblioteca-juegos-container">
      <h2>Mi Biblioteca de Juegos</h2>
      {games.length === 0 ? (
        <p className="no-games-message">No tienes juegos en tu biblioteca. ¡Añade algunos para empezar!</p>
      ) : (
        <div className="game-grid">
          {games.map(game => (
            <TarjetaJuego key={game._id} game={game} onDelete={handleDeleteGame} onUpdate={() => fetchAllGames()} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BibliotecaJuegos;