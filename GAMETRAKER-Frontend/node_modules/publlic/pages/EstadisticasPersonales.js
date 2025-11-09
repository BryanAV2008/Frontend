import React, { useEffect, useState, useCallback } from 'react';
import { getGames } from '../api/gameService';
import './EstadisticasPersonales.css';

const EstadisticasPersonales = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGamesForStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGames(); // Obtenemos todos los juegos para calcular las estadísticas
      setGames(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener juegos para estadísticas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGamesForStats();
  }, [fetchGamesForStats]);

  // --- Cálculos de Estadísticas ---
  const totalGames = games.length;
  const gamesByStatus = games.reduce((acc, game) => {
    acc[game.status] = (acc[game.status] || 0) + 1;
    return acc;
  }, {});

  const totalHoursPlayed = games.reduce((acc, game) => acc + (game.hoursPlayed || 0), 0);

  const topGenres = games.reduce((acc, game) => {
    if (game.genre) {
      const genres = game.genre.split(',').map(g => g.trim()).filter(Boolean); // Dividir por comas y limpiar
      genres.forEach(g => {
        acc[g] = (acc[g] || 0) + 1;
      });
    }
    return acc;
  }, {});
  const sortedGenres = Object.entries(topGenres).sort(([, a], [, b]) => b - a);

  const averageScore = games.filter(game => game.score > 0).reduce((acc, game) => acc + game.score, 0) /
                       games.filter(game => game.score > 0).length || 0;

  const gamesByPlatform = games.reduce((acc, game) => {
    if (game.platform) {
      acc[game.platform] = (acc[game.platform] || 0) + 1;
    }
    return acc;
  }, {});
  const sortedPlatforms = Object.entries(gamesByPlatform).sort(([, a], [, b]) => b - a);

  // Juegos mejor y peor calificados
  const gamesWithScores = games.filter(game => game.score > 0).sort((a, b) => b.score - a.score);
  const bestGames = gamesWithScores.slice(0, 3); // Top 3
  const worstGames = gamesWithScores.length > 3 ? gamesWithScores.slice(-3).reverse() : []; // Bottom 3, reverse for ascending score


  if (loading) return <p className="loading-message">Calculando tus estadísticas...</p>;
  if (error) return <div className="error-container"><p className="error-message">Error: {error}</p></div>;

  return (
    <div className="estadisticas-personales-container">
      <h2>Tus Estadísticas de Juego</h2>
      <p className="intro-message">Un vistazo rápido a tu biblioteca de videojuegos.</p>

      {totalGames === 0 ? (
        <p className="no-stats-message">
          Aún no tienes juegos en tu biblioteca. ¡Agrega algunos para ver tus estadísticas!
        </p>
      ) : (
        <div className="stats-grid">
          <div className="stat-card total-games">
            <h3>Total de Juegos</h3>
            <p className="stat-number">{totalGames}</p>
          </div>

          <div className="stat-card total-hours">
            <h3>Horas Jugadas</h3>
            <p className="stat-number">{totalHoursPlayed.toLocaleString()} horas</p>
          </div>

          <div className="stat-card avg-score">
            <h3>Puntuación Promedio</h3>
            <p className="stat-number">{averageScore.toFixed(1)} / 5</p>
          </div>

          <div className="stat-card status-distribution">
            <h3>Juegos por Estado</h3>
            <ul>
              {Object.entries(gamesByStatus).map(([status, count]) => (
                <li key={status}>
                  <span className={`status-${status.toLowerCase().replace(/\s/g, '-')}`}>{status}:</span> {count}
                </li>
              ))}
            </ul>
          </div>

          {sortedGenres.length > 0 && (
            <div className="stat-card top-genres">
              <h3>Géneros Favoritos</h3>
              <ol>
                {sortedGenres.map(([genre, count]) => (
                  <li key={genre}>{genre} ({count})</li>
                ))}
              </ol>
            </div>
          )}

          {sortedPlatforms.length > 0 && (
            <div className="stat-card top-platforms">
              <h3>Plataformas Principales</h3>
              <ol>
                {sortedPlatforms.map(([platform, count]) => (
                  <li key={platform}>{platform} ({count})</li>
                ))}
              </ol>
            </div>
          )}

          {bestGames.length > 0 && (
            <div className="stat-card best-games">
              <h3>Juegos Mejor Calificados</h3>
              <ul>
                {bestGames.map(game => (
                  <li key={game._id}>
                    {game.title} - {game.score} ⭐
                  </li>
                ))}
              </ul>
            </div>
          )}

          {worstGames.length > 0 && (
            <div className="stat-card worst-games">
              <h3>Juegos Peor Calificados</h3>
              <ul>
                {worstGames.map(game => (
                  <li key={game._id}>
                    {game.title} - {game.score} ⭐
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default EstadisticasPersonales;