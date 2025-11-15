import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // <--- Esto es correcto
import App from './App.jsx';
import './index.css';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> {/* Envuelve App con Router */}
      <App />
    </Router>
  </React.StrictMode>,
);