const API_URL = 'http://localhost:3000/api/games'; // Asegúrate de que coincida con el puerto de tu backend

export const getGames = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('No se pudieron obtener los juegos');
  }
  return response.json();
};

export const getGameById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('No se pudo obtener el juego');
  }
  return response.json();
};

export const createGame = async (gameData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  });
  if (!response.ok) {
    throw new Error('No se pudo crear el juego');
  }
  return response.json();
};

export const updateGame = async (id, gameData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  });
  if (!response.ok) {
    throw new Error('No se pudo actualizar el juego');
  }
  return response.json();
};

export const deleteGame = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('No se pudo eliminar el juego');
  }
  return response.json();
};

// ... Repite un patrón similar para los servicios de reseñas (reviewService.js)