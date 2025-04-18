import React, { useEffect, useState } from 'react';
import './notas.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Notas() {
  const [notas, setNotas] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('notas');
    if (stored) {
      setNotas(JSON.parse(stored));
    }
    
    // Guardar la ruta de referencia cuando se monta el componente
    if (location.state?.from) {
      localStorage.setItem('lastNotesReferrer', location.state.from);
    }
  }, [location.state]);

  const handleRemove = (id) => {
    const nuevasNotas = notas.filter(p => p.id !== id);
    setNotas(nuevasNotas);
    localStorage.setItem('notas', JSON.stringify(nuevasNotas));
  };

  const handleGoBack = () => {
    const lastPage = localStorage.getItem('lastNotesReferrer') || '/';
    navigate(lastPage);
  };

  return (
    <div className="notas-container">
      <div className="notas-header">
        <h2>📝 Mis Notas</h2>
        <button className="back-button" onClick={handleGoBack}>
          ← Devolverse
        </button>
      </div>
      
      {notas.length === 0 ? (
        <p>No tienes productos en tus notas.</p>
      ) : (
        <ul className="notas-list">
          {notas.map((producto) => (
            <li key={producto.id} className="nota-item">
              <div>
                <strong>{producto.nombre}</strong> – ${producto.precio.toLocaleString()}
                <span className="nota-store"> ({producto.supermercado_nombre})</span>
              </div>
              <button className="remove-btn" onClick={() => handleRemove(producto.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notas;