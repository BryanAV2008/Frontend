// La URL de tu backend.
const API_BASE_URL = 'http://localhost:3000/api';

// Función auxiliar para manejar respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || `Error en la solicitud de reseñas: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Obtener todas las reseñas (opcionalmente filtradas por gameId)
export const getReviews = async (gameId = null) => {
  const url = gameId ? `${API_BASE_URL}/reviews?gameId=${gameId}` : `${API_BASE_URL}/reviews`;
  const response = await fetch(url);
  return handleResponse(response);
};

// Obtener una reseña por su ID
export const getReviewById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/reviews/${id}`);
  return handleResponse(response);
};

// Crear una nueva reseña
export const createReview = async (reviewData) => {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  return handleResponse(response);
};

// Actualizar una reseña existente
export const updateReview = async (id, reviewData) => {
  const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  return handleResponse(response);
};

// Eliminar una reseña
export const deleteReview = async (id) => {
  const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};