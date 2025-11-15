import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom'; // Estos imports están bien

// Importar componentes de las carpetas correspondientes
import BibliotecaJuegos from './components/BibliotecaJuegos/BibliotecaJuegos.jsx';
import TarjetaJuego from './components/Tarjetajuego/Tarjetajuego.jsx';
import FormularioJuego from './components/FormularioJuego/FormularioJuego.jsx';
import ListaReseñas from './components/ListaReseñas/ListaReseñas.jsx';
import FormularioReseña from './components/FormularioReseña/FormularioReseña.jsx';
import EstadisticasPersonales from './components/EstadisticasPersonales/EstadisticasPersonales.jsx';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>GameTracker</h1>
        <nav>
          <ul>
            {/* Asegúrate de que NavLink tenga la prop 'to' y 'className' */}
            <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Mi Biblioteca</NavLink></li>
            <li><NavLink to="/add-game" className={({ isActive }) => isActive ? "active" : ""}>Añadir Juego</NavLink></li>
            <li><NavLink to="/reviews" className={({ isActive }) => isActive ? "active" : ""}>Reseñas</NavLink></li>
            <li><NavLink to="/stats" className={({ isActive }) => isActive ? "active" : ""}>Estadísticas</NavLink></li>
          </ul>
        </nav>
      </header>

      <main className="app-main">
        {/* Las Routes y Route deben estar aquí */}
        <Routes>
          <Route path="/" element={<BibliotecaJuegos />} />
          <Route path="/game/:id" element={<TarjetaJuego isDetailPage={true} />} />
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