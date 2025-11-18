// src/api/stats.js
const API_BASE_URL = 'http://localhost:5000/api'; 
// Obtiene las estadísticas personales
export const getStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`); // Asume un endpoint /api/stats
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};