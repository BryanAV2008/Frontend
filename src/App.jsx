// src/App.jsx
import React from 'react';
// Asegúrate de importar `useNavigate` aquí:
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'; 

import BibliotecaJuegos from './components/Bibliotecajuegos/BibliotecaJuegos.jsx';
import TarjetaJuego from './components/Tarjetajuego/TarjetaJuego.jsx';
import FormularioJuego from './components/Formulariojuego/Formulariojuego.jsx';
import ListaReseñas from './components/ListaReseñas/ListaReseñas.jsx';
import FormularioReseña from './components/FormularioReseña/FormularioReseña.jsx';
import EstadisticasPersonales from './components/EstadisticasPersonales/EstadisticasPersonales.jsx';

// <--- IMPORTA LA FUNCIÓN DELETEGAME DESDE TU API DE JUEGOS --- >
// Asegúrate de que `src/api/games.js` exista y tenga `export const deleteGame = async (id) => {...}`
import { deleteGame } from './api/games.js'; 


// Componente principal de la aplicación
function App() {
  const navigate = useNavigate(); // <--- INICIALIZA useNavigate AQUÍ --- >

  // <--- DEFINE LA FUNCIÓN handleDeleteGame AQUÍ --- >
  const handleDeleteGame = async (gameId) => {
    // Confirmación al usuario antes de eliminar (opcional, pero recomendado)
    if (!window.confirm("¿Estás seguro de que quieres eliminar este juego?")) {
      return; // Si el usuario cancela, no hacemos nada
    }

    try {
      await deleteGame(gameId); // Llama a la API para eliminar
      alert('Juego eliminado con éxito.'); // Mensaje de éxito

      // Redirige a la página principal de juegos después de eliminar
      // Esto hará que el "cuadro de juego seleccionado" desaparezca.
      navigate('/'); // Redirigir a la ruta principal que muestra BibliotecaJuegos
      
    } catch (error) {
      console.error("Error al eliminar el juego:", error);
      alert('Hubo un error al eliminar el juego.'); // Mensaje de error
    }
  };


  return (
    <div className="app-container">
      <header className="app-header">
        <h1>GameTracker</h1>
        <nav>
          <ul>
            <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Mi Biblioteca</NavLink></li>
            <li><NavLink to="/add-game" className={({ isActive }) => isActive ? "active" : ""}>Añadir Juego</NavLink></li>
            <li><NavLink to="/reviews" className={({ isActive }) => isActive ? "active" : ""}>Reseñas</NavLink></li>
            <li><NavLink to="/stats" className={({ isActive }) => isActive ? "active" : ""}>Estadísticas</NavLink></li>
          </ul>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          {/* <--- PASA onDelete A BIBLIOTECAJUEGOS --- > */}
          <Route path="/" element={<BibliotecaJuegos onDelete={handleDeleteGame} />} />

          {/* <--- PASA onDelete A TARJETAJUEGO PARA LA VISTA DE DETALLE --- > */}
          <Route 
            path="/game/:id" 
            element={<TarjetaJuego isDetailPage={true} onDelete={handleDeleteGame} />} 
          />
          
          <Route path="/add-game" element={<FormularioJuego />} />
          <Route path="/edit-game/:id" element={<FormularioJuego />} />
          <Route path="/reviews" element={<ListaReseñas />} />
          <Route path="/add-review/:gameId?" element={<FormularioReseña />} />
          <Route path="/edit-review/:id" element={<FormularioReseña />} />
          <Route path="/stats" element={<EstadisticasPersonales />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 GameTracker. De Gamers para Gamers.</p>
      </footer>
    </div>
  );
}

export default App;