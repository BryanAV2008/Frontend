const API_BASE_URL = 'http://localhost:3000/api'; 
// Obtiene las reseñas
export const getReviews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};
//obtiene la reseña por id
export const getReviewById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching review with ID ${id}:`, error);
    throw error;
  }
};
// Crea una nueva reseña
export const createReview = async (reviewData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};
// Actualiza una reseña existente
export const updateReview = async (id, reviewData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating review with ID ${id}:`, error);
    throw error;
  }
};
// Elimina una reseña
export const deleteReview = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return { message: 'Review deleted successfully' };
  } catch (error) {
    console.error(`Error deleting review with ID ${id}:`, error);
    throw error;
  }
};