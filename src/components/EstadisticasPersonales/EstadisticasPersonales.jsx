import React, { useState, useEffect } from 'react';
import { getStats } from '../../api'; // Asegúrate de que esta ruta sea correcta
import './EstadisticasPersonales.css'; // Asegúrate de que esta ruta sea correcta

function EstadisticasPersonales() {
  // Estado inicial con valores por defecto
  const [stats, setStats] = useState({
    totalGames: 0,
    completedGames: 0,
    avgRating: null, // Lo inicializamos a null para que "N/A" aparezca si no hay datos
    totalHoursPlayed: 0,
    mostPlayedGenre: 'N/A',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStats(); // Realiza la llamada a la API

        // Procesar los datos recibidos para asegurar que los valores se muestren correctamente
        const processedData = {
          // Si totalGames es null, undefined o 0 (falsy), usa 0.
          // Si el backend devuelve un número, lo usa.
          totalGames: data.totalGames || 0,
          completedGames: data.completedGames || 0,
          totalHoursPlayed: data.totalHoursPlayed || 0,

          // Para avgRating:
          // Si data.avgRating es 0, null o undefined, lo convertimos a null
          // para que el JSX lo interprete como "sin valor" y muestre "N/A".
          // Si es un número > 0, lo mantiene.
          avgRating: (data.avgRating === 0 || data.avgRating == null) ? null : data.avgRating,

          // Para mostPlayedGenre:
          // Si data.mostPlayedGenre es null, undefined o una cadena vacía, usa 'N/A'.
          // De lo contrario, usa el valor del backend.
          mostPlayedGenre: data.mostPlayedGenre || 'N/A',
        };
        setStats(processedData);

      } catch (err) {
        console.error("Error al cargar las estadísticas:", err); // Log más detallado
        setError(new Error("No se pudieron cargar las estadísticas. Intenta de nuevo más tarde.")); // Mensaje más amigable
      } finally {
        setLoading(false);
      }
    };
    fetchStatsData();
  }, []); // El array vacío asegura que se ejecuta solo una vez al montar el componente

  // Renderizado condicional
  if (loading) {
    return <div className="loading-message">Cargando tus estadísticas...</div>;
  }

  if (error) {
    return <div className="error-message">{error.message}</div>;
  }

  // Renderizado de las estadísticas si no hay carga ni error
  return (
    <div className="estadisticas-personales-container">
      <h2>Mis Estadísticas de Juego</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Juegos</h3>
          {/* Estos valores ahora siempre serán números gracias al processedData */}
          <p>{stats.totalGames}</p>
        </div>
        <div className="stat-card">
          <h3>Juegos Completados</h3>
          <p>{stats.completedGames}</p>
        </div>
        <div className="stat-card">
          <h3>Puntuación Media</h3>
          {/* La lógica de renderizado utiliza el avgRating (que será null si no hay datos > 0) */}
          {stats.avgRating != null && stats.avgRating > 0 ? (
            <p>{stats.avgRating.toFixed(1)} / 5</p>
          ) : (
            <p className="na-text">N/A</p>
          )}
        </div>
        <div className="stat-card">
          <h3>Horas Jugadas</h3>
          <p>{stats.totalHoursPlayed}</p>
        </div>
        <div className="stat-card">
          <h3>Género Favorito</h3>
          {/* mostPlayedGenre ya está garantizado con 'N/A' si no hay valor */}
          <p>{stats.mostPlayedGenre}</p>
        </div>
      </div>
    </div>
  );
}

export default EstadisticasPersonales;