// GAMETRACKER-Frontend/src/api/games.js
const API_BASE_URL = 'http://localhost:3000/api'; // Asegúrate de que esta URL sea correcta

export const getGames = async () => {
  const response = await fetch(`${API_BASE_URL}/games`);
  if (!response.ok) throw new Error('No se pudieron obtener los juegos.');
  return response.json();
};

export const getGameById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/games/${id}`);
  if (!response.ok) throw new Error('Juego no encontrado.');
  return response.json();
};

export const createGame = async (gameData) => {
  const response = await fetch(`${API_BASE_URL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameData),
  });
  if (!response.ok) throw new Error('No se pudo crear el juego.');
  return response.json();
};

// Función genérica para actualizar cualquier campo del juego (útil para EditGameScreen)
export const updateGame = async (id, gameData) => {
  // Asegurarse de que `rating` y `hoursPlayed` se conviertan a número
  const dataToSend = {
    ...gameData,
    rating: gameData.rating !== undefined ? Number(gameData.rating) : undefined, // Solo convertir si existe
    hoursPlayed: gameData.hoursPlayed !== undefined ? Number(gameData.hoursPlayed) : undefined, // Solo convertir si existe
  };

  const response = await fetch(`${API_BASE_URL}/games/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'No se pudo actualizar el juego.');
  }
  return response.json();
};

export const deleteGame = async (id) => {
  const response = await fetch(`${API_BASE_URL}/games/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('No se pudo eliminar el juego.');
  return response.json();
};

// Funciones específicas que tu TarjetaJuego.jsx ya usa, asegurando conversión de tipo
export const updateGameCompletedStatus = async (id, completedStatus) => {
    return updateGame(id, { completed: Boolean(completedStatus) }); // Asegurar booleano
};

export const updateGameRating = async (id, newRating) => {
    return updateGame(id, { rating: Number(newRating) }); // <-- ¡Aquí la conversión a número!
};

export const updateGameHoursPlayed = async (id, newHours) => {
    return updateGame(id, { hoursPlayed: Number(newHours) }); // <-- ¡Aquí la conversión a número!
};

// ... otras funciones de reviews o stats si están en este archivo