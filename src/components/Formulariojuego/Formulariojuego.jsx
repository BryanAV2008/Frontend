// src/components/FormularioJuego/FormularioJuego.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById, createGame, updateGame } from '../../api'; // Importamos funciones de la API
import './FormularioJuego.css';

function FormularioJuego() {
  const { id } = useParams(); // ID si estamos editando
  const navigate = useNavigate();
  const [game, setGame] = useState({
    title: '',
    genre: '',
    platform: '',
    releaseDate: '',
    coverImageUrl: '',
    description: '',
    completed: false,
    hoursPlayed: 0,
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchGameToEdit = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getGameById(id);
          // Formatear la fecha para el input type="date"
          data.releaseDate = data.releaseDate ? new Date(data.releaseDate).toISOString().split('T')[0] : '';
          setGame(data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchGameToEdit();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGame(prevGame => ({
      ...prevGame,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await updateGame(id, game);
        alert('Juego actualizado con éxito!');
      } else {
        await createGame(game);
        alert('Juego añadido con éxito!');
      }
      navigate('/'); // Redirigir a la biblioteca después de guardar
    } catch (err) {
      setError(err);
      alert(`Error al ${id ? 'actualizar' : 'añadir'} el juego: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id && !game.title) return <div className="loading-message">Cargando juego para editar...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;

  return (
    <div className="formulario-juego-container">
      <h2>{id ? 'Editar Juego' : 'Añadir Nuevo Juego'}</h2>
      <form onSubmit={handleSubmit} className="formulario-juego">
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={game.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Género:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={game.genre}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="platform">Plataforma:</label>
          <input
            type="text"
            id="platform"
            name="platform"
            value={game.platform}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="releaseDate">Fecha de lanzamiento:</label>
          <input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={game.releaseDate}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="coverImageUrl">URL de la portada:</label>
          <input
            type="url"
            id="coverImageUrl"
            name="coverImageUrl"
            value={game.coverImageUrl}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={game.description}
            onChange={handleChange}
            rows="4"
            disabled={loading}
          ></textarea>
        </div>
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="completed"
            name="completed"
            checked={game.completed}
            onChange={handleChange}
            disabled={loading}
          />
          <label htmlFor="completed">Marcar como completado</label>
        </div>
        <div className="form-group">
          <label htmlFor="hoursPlayed">Horas jugadas:</label>
          <input
            type="number"
            id="hoursPlayed"
            name="hoursPlayed"
            value={game.hoursPlayed}
            onChange={handleChange}
            min="0"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="rating">Puntuación (0-5):</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={game.rating}
            onChange={handleChange}
            min="0"
            max="5"
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : (id ? 'Guardar Cambios' : 'Añadir Juego')}
        </button>
        <button type="button" className="btn-secondary" onClick={() => navigate(-1)} disabled={loading}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default FormularioJuego;