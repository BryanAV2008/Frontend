import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createGame, getGameById, updateGame } from '../api/gameService';
import './FormularioJuego.css';

const FormularioJuego = () => {
  const [game, setGame] = useState({
    title: '',
    platform: '',
    genre: '',
    releaseDate: '',
    coverImage: '',
    status: 'Pendiente', // Valores predefinidos para select
    score: '', // Puntuación de 1 a 5
    hoursPlayed: ''
  });
  const [loading, setLoading] = useState(true); // Controla la carga inicial al editar
  const [submitting, setSubmitting] = useState(false); // Controla la carga al enviar el formulario
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Para editar, el ID vendrá en los parámetros de la URL

  const isEditing = Boolean(id); // Determina si estamos en modo edición

  useEffect(() => {
    if (isEditing) {
      const fetchGame = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getGameById(id);
          // Formatea la fecha para el input[type="date"]
          setGame({
            ...data,
            releaseDate: data.releaseDate ? new Date(data.releaseDate).toISOString().split('T')[0] : ''
          });
        } catch (err) {
          setError(err.message);
          console.error('Error al cargar el juego para editar:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchGame();
    } else {
      // Si no estamos editando, solo aseguramos que no haya estado de carga inicial
      setLoading(false);
    }
  }, [id, isEditing]); // Dependencias para useEffect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGame(prevGame => ({
      ...prevGame,
      [name]: (name === 'score' || name === 'hoursPlayed') && value !== '' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validaciones básicas antes de enviar
    if (!game.title.trim()) {
      setError('El título del juego es obligatorio.');
      setSubmitting(false);
      return;
    }
    if (!game.platform.trim()) {
      setError('La plataforma es obligatoria.');
      setSubmitting(false);
      return;
    }
    if (game.score !== '' && (game.score < 1 || game.score > 5)) {
      setError('La puntuación debe estar entre 1 y 5.');
      setSubmitting(false);
      return;
    }
    if (game.hoursPlayed !== '' && game.hoursPlayed < 0) {
      setError('Las horas jugadas no pueden ser negativas.');
      setSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await updateGame(id, game);
        alert('Juego actualizado con éxito!');
      } else {
        await createGame(game);
        alert('Juego agregado con éxito!');
      }
      navigate('/'); // Redirige a la biblioteca después de guardar
    } catch (err) {
      setError(err.message);
      console.error('Error al guardar el juego:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="loading-message">Cargando formulario...</p>;

  return (
    <div className="formulario-juego-container">
      <h2>{isEditing ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h2>
      {error && <div className="error-container"><p className="error-message">{error}</p></div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={game.title}
            onChange={handleChange}
            placeholder="Título del juego"
            required
            aria-required="true"
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
            placeholder="Ej: PC, PlayStation 5, Nintendo Switch"
            required
            aria-required="true"
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
            placeholder="Ej: RPG, Acción, Aventura"
          />
        </div>
        <div className="form-group">
          <label htmlFor="releaseDate">Fecha de Lanzamiento:</label>
          <input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={game.releaseDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="coverImage">URL Imagen de Portada:</label>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            value={game.coverImage}
            onChange={handleChange}
            placeholder="URL de la imagen (ej: https://example.com/cover.jpg)"
          />
          {game.coverImage && (
            <div className="image-preview">
              <p>Previsualización:</p>
              <img src={game.coverImage} alt="Portada del juego" />
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="status">Estado:</label>
          <select id="status" name="status" value={game.status} onChange={handleChange}>
            <option value="Pendiente">Pendiente</option>
            <option value="Jugando">Jugando</option>
            <option value="Completado">Completado</option>
            <option value="Abandonado">Abandonado</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="score">Puntuación (1-5):</label>
          <input
            type="number"
            id="score"
            name="score"
            value={game.score}
            onChange={handleChange}
            min="1"
            max="5"
            placeholder="Tu puntuación del 1 al 5"
          />
        </div>
        <div className="form-group">
          <label htmlFor="hoursPlayed">Horas Jugadas:</label>
          <input
            type="number"
            id="hoursPlayed"
            name="hoursPlayed"
            value={game.hoursPlayed}
            onChange={handleChange}
            min="0"
            placeholder="Total de horas jugadas"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Guardando...' : (isEditing ? 'Actualizar Juego' : 'Agregar Juego')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')} disabled={submitting}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioJuego;