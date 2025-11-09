import React, { useEffect, useState, useCallback } from 'react';
import CardJuego from '../components/CardJuego';
import FilterSortControls from '../components/FilterSortControls'; // Importa el nuevo componente
import { getGames, deleteGame } from '../api/gameService';
import { useNavigate } from 'react-router-dom';
import './BibliotecaJuegos.css';

const BibliotecaJuegos = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los controles de filtro y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [sortBy, setSortBy] = useState('title'); // Campo para ordenar (ej. 'title', 'releaseDate', 'score')
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' o 'desc'

  const navigate = useNavigate();

  // Función para cargar los juegos desde la API con filtros y ordenamiento
  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus) params.status = filterStatus;
      if (filterGenre) params.genre = filterGenre;
      // Nota: El backend en gameController.js ya tiene un .sort({ title: 1 }) por defecto.
      // Si quieres ordenamiento dinámico por el frontend, tendrás que ajustar el backend
      // para aceptar `sortBy` y `sortOrder` como query params y aplicarlos en la consulta MongoDB.
      // Por ahora, el frontend puede hacer un ordenamiento local si lo deseas, o confiar en el backend.
      // Para un ordenamiento en el backend, los parámetros serían:
      // if (sortBy) params.sortBy = sortBy;
      // if (sortOrder) params.sortOrder = sortOrder;

      const data = await getGames(params);

      // Ordenamiento local si el backend no lo soporta de forma dinámica por query params
      const sortedData = data.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      setGames(sortedData);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener los juegos:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus, filterGenre, sortBy, sortOrder]); // Dependencias para useCallback

  useEffect(() => {
    fetchGames();
  }, [fetchGames]); // Vuelve a ejecutar cuando fetchGames cambia (que a su vez cambia con los filtros/orden)

  const handleEdit = (id) => {
    navigate(`/juegos/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego y todas sus reseñas asociadas?')) {
      try {
        await deleteGame(id);
        alert('Juego y sus reseñas eliminados con éxito.');
        fetchGames(); // Volver a cargar la lista de juegos
      } catch (err) {
        alert('Error al eliminar el juego: ' + err.message);
        console.error('Error al eliminar el juego:', err);
      }
    }
  };

  if (loading) return <p className="loading-message">Cargando tu biblioteca de juegos...</p>;
  if (error) return <div className="error-container"><p className="error-message">Error: {error}</p></div>;

  return (
    <div className="biblioteca-juegos-container">
      <h2>Mi Biblioteca de Videojuegos</h2>

      <div className="biblioteca-header-actions">
        <button onClick={() => navigate('/juegos/agregar')} className="btn btn-primary add-game-btn">
          Agregar Nuevo Juego
        </button>
      </div>

      <FilterSortControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterGenre={filterGenre}
        setFilterGenre={setFilterGenre}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        // Puedes pasarle opciones de géneros si los conoces o los extraes de los juegos existentes
        availableGenres={Array.from(new Set(games.map(game => game.genre).filter(Boolean)))}
      />

      {games.length === 0 && !loading && !error && (
        <p className="no-games-message">
          No hay juegos en tu biblioteca que coincidan con los filtros. ¡Agrega uno o ajusta tus criterios!
        </p>
      )}

      <div className="lista-juegos">
        {games.map((game) => (
          <CardJuego
            key={game._id}
            game={game}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BibliotecaJuegos;