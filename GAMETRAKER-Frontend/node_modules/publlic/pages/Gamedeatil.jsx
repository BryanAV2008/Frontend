// src/pages/GameDetail.jsx (Ajustado para la navegación)
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { getGameById, deleteGame } from '../api/gameService'; // Asume tus servicios API
// import { getReviews, deleteReview } from '../api/reviewService'; // Asume tus servicios API
// import ListasResenas from '../components/ListasResenas';
// import ReviewForm from '../components/ReviewForm';
import './GameDetail.css'; // Asegúrate de tener este archivo CSS o adapta los estilos

function GameDetail() {
  const { id } = useParams(); // ID del juego desde la URL
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingGame, setLoadingGame] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState(null);
  const [reviewToEdit, setReviewToEdit] = useState(null); // Para almacenar la reseña que se está editando

  // Función para cargar los detalles del juego
  const fetchGameDetails = useCallback(async () => {
    setLoadingGame(true);
    setError(null);
    try {
      // AQUÍ: Llama a tu API para obtener los detalles del juego
      // const data = await getGameById(id);
      // setGame(data);
      // Simulamos datos
      const simulatedGame = {
        id: id,
        title: 'The Witcher 3: Wild Hunt',
        platforms: ['PC', 'PS4', 'Nintendo Switch'],
        genres: ['RPG', 'Aventura'],
        developer: 'CD Projekt Red',
        publisher: 'CD Projekt',
        releaseDate: '2015-05-19',
        coverUrl: 'https://via.placeholder.com/250x350/1a1a1a/ffffff?text=Witcher3',
        synopsis: 'Un RPG de mundo abierto con una historia profunda, personajes memorables y un vasto mundo lleno de monstruos, misiones y decisiones morales. Sigue a Geralt de Rivia en su búsqueda para encontrar a Ciri, su hija adoptiva, mientras el mundo se prepara para una invasión masiva.',
        status: 'Completado',
        rating: 5,
        hoursPlayed: 200,
        // Añade más detalles que tu API devuelva
      };
      setGame(simulatedGame);
    } catch (err) {
      setError('Error al cargar los detalles del juego.');
      console.error(err);
    } finally {
      setLoadingGame(false);
    }
  }, [id]);

  // Función para cargar las reseñas del juego
  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      // AQUÍ: Llama a tu API para obtener las reseñas del juego
      // const data = await getReviews(id);
      // setReviews(data);
      // Simulamos reseñas
      const simulatedReviews = [
        { _id: 'r1', author: 'GamerPro', rating: 5, text: '¡Increíble juego, la historia es fantástica!', date: '2023-01-15' },
        { _id: 'r2', author: 'Juanito', rating: 4, text: 'Un poco largo, pero vale la pena.', date: '2023-03-20' },
      ];
      setReviews(simulatedReviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGameDetails();
    fetchReviews();
  }, [fetchGameDetails, fetchReviews]);

  const renderStars = (score) => {
    return '⭐'.repeat(score || 0) + '☆'.repeat(5 - (score || 0));
  };

  const handleDeleteGame = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${game.title}"?`)) {
      try {
        // AQUÍ: Llama a tu API para eliminar el juego
        // await deleteGame(id);
        alert('Juego eliminado (simulado).');
        navigate('/'); // Redirige a la biblioteca
      } catch (err) {
        console.error('Error al eliminar el juego:', err);
        alert('Hubo un error al eliminar el juego.');
      }
    }
  };

  const handleEditGame = () => {
    navigate(`/agregar-juego?gameId=${id}`); // Puedes pasar el ID como query param o usar una ruta como `/juego/:id/editar`
  };

  const handleAddOrUpdateReview = async (reviewData) => {
    // Lógica para añadir o actualizar una reseña
    console.log('Reseña guardada (simulado):', reviewData);
    setReviewToEdit(null); // Limpiar el formulario de edición
    fetchReviews(); // Refrescar las reseñas
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        // AQUÍ: Llama a tu API para eliminar la reseña
        // await deleteReview(reviewId);
        alert('Reseña eliminada (simulado).');
        fetchReviews(); // Refrescar las reseñas
      } catch (err) {
        console.error('Error al eliminar la reseña:', err);
        alert('Hubo un error al eliminar la reseña.');
      }
    }
  };

  const handleEditReview = (review) => {
    setReviewToEdit(review);
  };


  if (loadingGame) return <p>Cargando juego...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!game) return <p>Juego no encontrado.</p>;

  return (
    <div className="game-detail-container">
      <div className="game-header">
        <img src={game.coverUrl} alt={game.title} className="game-cover" />
        <div className="game-info">
          <h2>{game.title}</h2>
          <p><strong>Desarrollador:</strong> {game.developer}</p>
          <p><strong>Editor:</strong> {game.publisher}</p>
          <p><strong>Lanzamiento:</strong> {game.releaseDate}</p>
          <p><strong>Plataformas:</strong> {game.platforms.join(', ')}</p>
          <p><strong>Géneros:</strong> {game.genres.join(', ')}</p>
          <p><strong>Estado:</strong> {game.status}</p>
          <p><strong>Calificación:</strong> {renderStars(game.rating)}</p>
          <p><strong>Horas Jugadas:</strong> {game.hoursPlayed}</p>
          <div className="game-actions">
            <button onClick={handleEditGame} className="edit-button">Editar Juego</button>
            <button onClick={handleDeleteGame} className="delete-button">Eliminar Juego</button>
          </div>
        </div>
      </div>

      <div className="game-synopsis">
        <h3>Sinopsis</h3>
        <p>{game.synopsis}</p>
      </div>

      <div className="game-reviews-section">
        <h3>Reseñas</h3>
        {/* Aquí usarías tu componente ListasResenas */}
        {/* <ListasResenas reviews={reviews} onDelete={handleDeleteReview} onEdit={handleEditReview} /> */}
        {loadingReviews && <p>Cargando reseñas...</p>}
        {!loadingReviews && reviews.length === 0 && <p>Aún no hay reseñas para este juego.</p>}
        {!loadingReviews && reviews.length > 0 && (
          <div className="review-list">
            {reviews.map(review => (
              <div key={review._id} className="review-item">
                <p><strong>{review.author}</strong> - {renderStars(review.rating)}</p>
                <p>{review.text}</p>
                <p className="review-date">{review.date}</p>
                <button onClick={() => handleEditReview(review)}>Editar Reseña</button>
                <button onClick={() => handleDeleteReview(review._id)}>Eliminar Reseña</button>
              </div>
            ))}
          </div>
        )}

        <h4>Escribir Reseña</h4>
        {/* Aquí usarías tu componente ReviewForm */}
        {/* <ReviewForm onSubmit={handleAddOrUpdateReview} initialReview={reviewToEdit} /> */}
        <div className="review-form">
          <textarea
            placeholder="Escribe tu reseña aquí..."
            // value={reviewToEdit ? reviewToEdit.text : ''} // Si hay una reseña para editar
            // onChange={(e) => setReviewToEdit({...reviewToEdit, text: e.target.value})}
          ></textarea>
          <select
            // value={reviewToEdit ? reviewToEdit.rating : 0}
            // onChange={(e) => setReviewToEdit({...reviewToEdit, rating: parseInt(e.target.value)})}
          >
            {[0,1,2,3,4,5].map(num => <option key={num} value={num}>{num} estrellas</option>)}
          </select>
          <button onClick={() => handleAddOrUpdateReview({ /* Datos del formulario */ })}>
            {reviewToEdit ? 'Actualizar Reseña' : 'Publicar Reseña'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default GameDetail;