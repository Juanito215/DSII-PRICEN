// src/Resultados.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Resultados.css';
import logo from './assets/logos/logo.png';

function Resultados() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultados } = location.state || { resultados: [] };

  return (
    <div className="resultados-container">
      <div className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <h2>Pricen</h2>
        </div>
        <button className="volver-btn" onClick={() => navigate('/')}>
          ⬅ Volver al inicio
        </button>
      </div>

      <div className="contenido">
        <h1>Resultados de búsqueda</h1>
        {resultados.length > 0 ? (
          <div className="grid-resultados">
            {resultados.map((item) => (
              <div key={item.id} className="card-producto">
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
}

export default Resultados;
