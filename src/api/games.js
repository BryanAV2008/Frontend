const API_BASE_URL = 'http://localhost:3000/api'; 
// Obtiene los juegos
export const getGames = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/games`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
};
//obtiene el juego por id
export const getGameById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching game with ID ${id}:`, error);
    throw error;
  }
};
// Crea un nuevo juego
export const createGame = async (gameData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
};
// Actualiza un juego existente
export const updateGame = async (id, gameData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating game with ID ${id}:`, error);
    throw error;
  }
};
// Elimina un juego
export const deleteGame = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return { message: 'Game deleted successfully' };
  } catch (error) {
    console.error(`Error deleting game with ID ${id}:`, error);
    throw error;
  }
};
// Actualiza el estado de completado de un juego
export const updateGameCompletedStatus = async (id, completedStatus) => {
    try {
        const response = await fetch(`${API_BASE_URL}/games/${id}/completed`, {
            method: 'PATCH', // Usamos PATCH para actualizar parcialmente
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: completedStatus }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error updating completed status for game ${id}:`, error);
        throw error;
    }
};
// Actualiza la calificación de un juego
export const updateGameRating = async (id, rating) => {
    try {
        const response = await fetch(`${API_BASE_URL}/games/${id}/rating`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error updating rating for game ${id}:`, error);
        throw error;
    }
};
// Actualiza las horas jugadas de un juego
export const updateGameHoursPlayed = async (id, hoursPlayed) => {
    try {
        const response = await fetch(`${API_BASE_URL}/games/${id}/hoursPlayed`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hoursPlayed }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error updating hours played for game ${id}:`, error);
        throw error;
    }
};