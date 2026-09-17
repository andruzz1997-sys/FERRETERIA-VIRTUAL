import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './assets/styles/index.css';

/**
 * Punto de Entrada de la Aplicación React - FERREWEB
 * Enrutador HashRouter configurado para compatibilidad total con GitHub Pages
 * Evidencia: GA7-220501096-AA4-EV03
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
