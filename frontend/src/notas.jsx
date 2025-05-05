import React, { useEffect, useState } from 'react';
import './notas.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Notas() {
  const [notas, setNotas] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  // Función para obtener el ID del usuario desde el token JWT
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      // Extrae el payload del token (la parte del medio)
      const payload = token.split('.')[1];
      // Decodifica el payload de base64
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.id;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated()) {
      alert("Debes iniciar sesión para acceder a las notas.");
      navigate('/login');
      return;
    }

    // Obtener ID del usuario del token
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
      navigate('/login');
      return;
    }

    // Cargar notas específicas del usuario
    const notasKey = `notas_${userId}`;
    const stored = localStorage.getItem(notasKey);
    if (stored) {
      setNotas(JSON.parse(stored));
    }
    
    // Guardar la ruta de referencia cuando se monta el componente
    if (location.state?.from) {
      localStorage.setItem('lastNotesReferrer', location.state.from);
    }
  }, [location.state, navigate]);

  const handleRemove = (id) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
      navigate('/login');
      return;
    }

    const nuevasNotas = notas.filter(p => p.id !== id);
    setNotas(nuevasNotas);
    
    // Guardar notas con clave específica para el usuario
    const notasKey = `notas_${userId}`;
    localStorage.setItem(notasKey, JSON.stringify(nuevasNotas));
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
                <strong>{producto.nombre}</strong> – ${producto.precio?.toLocaleString()}
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