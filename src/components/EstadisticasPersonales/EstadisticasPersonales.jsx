import React, { useState, useEffect } from 'react';
import { getStats } from '../../api'; 
import './EstadisticasPersonales.css';
// Componente para mostrar las estadísticas personales de juegos
function EstadisticasPersonales() {
  const [stats, setStats] = useState({
    totalGames: 0,
    completedGames: 0,
    avgRating: 0,
    totalHoursPlayed: 0,
    mostPlayedGenre: 'N/A',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
// useEffect para cargar las estadísticas al montar el componente
  useEffect(() => {
    const fetchStatsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatsData();
  }, []);
// Renderizado del componente
  if (loading) return <div className="loading-message">Cargando tus estadísticas...</div>;
  if (error) return <div className="error-message">Error al cargar las estadísticas: {error.message}</div>;
// Renderizado de las estadísticas
  return (
    <div className="estadisticas-personales-container">
      <h2>Mis Estadísticas de Juego</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Juegos</h3>
          <p>{stats.totalGames}</p>
        </div>
        <div className="stat-card">
          <h3>Juegos Completados</h3>
          <p>{stats.completedGames}</p>
        </div>
        <div className="stat-card">
          <h3>Puntuación Media</h3>
          <p>{stats.avgRating ? stats.avgRating.toFixed(1) : '0.0'} / 5</p>
        </div>
        <div className="stat-card">
          <h3>Horas Jugadas</h3>
          <p>{stats.totalHoursPlayed}</p>
        </div>
        <div className="stat-card">
          <h3>Género Favorito</h3>
          <p>{stats.mostPlayedGenre || 'N/A'}</p>
        </div>
        {}
      </div>
    </div>
  );
}

export default EstadisticasPersonales;