import React, { useEffect, useState } from 'react';
import './notas.css';
import './carnes.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Notas() {
  const [notas, setNotas] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [grupoProductos, setGrupoProductos] = useState([]);
  const [indexProductoGrupo, setIndexProductoGrupo] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const getUserIdFromToken = () => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1])).id;
    } catch {
      return null;
    }
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!token || !userId) {
      alert("Debes iniciar sesión.");
      navigate('/login');
      return;
    }

    fetch(`http://localhost:3000/api/usuario-producto/${userId}`, { headers })
      .then(res => res.json())
      .then(data => setNotas(data))
      .catch(err => {
        console.error("Error al cargar notas:", err);
        alert("Error al cargar tus productos.");
      });

    if (location.state?.from) {
      localStorage.setItem('lastNotesReferrer', location.state.from);
    }
  }, [navigate, location.state, token, userId]);

  const handleRemove = async (productoId) => {
    try {
      await fetch(`http://localhost:3000/api/usuario-producto/${userId}/${productoId}`, {
        method: 'DELETE',
        headers,
      });
      setNotas(prev => prev.filter(p => p.id !== productoId));
      if (productoSeleccionado?.id === productoId) cerrarModal();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  const abrirModal = (producto) => {
    const similares = notas.filter(p =>
      p.nombre === producto.nombre && p.marca === producto.marca
    );
    setGrupoProductos(similares);
    setIndexProductoGrupo(similares.findIndex(p => p.id === producto.id));
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoSeleccionado(null);
    setGrupoProductos([]);
    setIndexProductoGrupo(0);
  };

  const cambiarProductoGrupo = (direccion) => {
    const nuevoIndex = (indexProductoGrupo + direccion + grupoProductos.length) % grupoProductos.length;
    setIndexProductoGrupo(nuevoIndex);
    setProductoSeleccionado(grupoProductos[nuevoIndex]);
  };

  const handleGoBack = () => {
    const lastPage = localStorage.getItem('lastNotesReferrer') || '/';
    navigate(lastPage);
  };

  const getImage = (name) => {
    try {
      return new URL(`/src/assets/${productoSeleccionado?.categoria || 'carnes'}/${name}`, import.meta.url).href;
    } catch {
      return '/assets/default.png';
    }
  };

  const total = notas.reduce((acc, producto) => {
    const precio = parseFloat(producto.precio);
    return acc + (isNaN(precio) ? 0 : precio);
  }, 0);

  return (
    <div className="notas-container">
      <div className="notas-header">
        <h2>📝 Mis Notas</h2>
        <button className="back-button" onClick={handleGoBack}>
          ← Volver
        </button>
      </div>

      {notas.length === 0 ? (
        <div className="empty-message">
          <p>📭 Tu lista de notas está vacía</p>
          <p>Agrega productos para comenzar a organizar tus compras</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {notas.map((producto) => {
              const duplicados = notas.filter(
                p => p.nombre === producto.nombre && p.marca === producto.marca
              );
              const esDuplicado = duplicados.length > 1;
              return (
                <div
                  key={producto.id}
                  className="product-card"
                  onClick={() => abrirModal(producto)}
                >
                  {esDuplicado && <div className="product-asterisk">*</div>}
                  <img src={getImage(producto.imagen)} alt={producto.nombre} />
                  <h3>{producto.nombre}</h3>
                  <div className="visitas-badge">{producto.visitas_semana || 0} vistas</div>
                  <p>{producto.supermercado_nombre}</p>
                  <div className="product-meta">
                    <span className="product-price">
                      ${producto.precio?.toLocaleString()}
                    </span>
                  </div>
                  <button
                    className="add-note-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(producto.id);
                    }}
                    title="Eliminar de notas"
                  >
                    ❌
                  </button>
                </div>
              );
            })}
          </div>

          <div className="total-precio">
            <h3>Total estimado:</h3>
            <span>${total.toLocaleString()}</span>
          </div>

          {mostrarModal && productoSeleccionado && (
            <div className="modal-overlay" onClick={cerrarModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img
                  src={getImage(productoSeleccionado.imagen)}
                  alt={productoSeleccionado.nombre}
                  className="modal-image"
                />
                <h2>{productoSeleccionado.nombre}</h2>
                <p><strong>Marca:</strong> {productoSeleccionado.marca || "Sin marca"}</p>
                <p><strong>Descripción:</strong> {productoSeleccionado.descripcion || "Sin descripción"}</p>
                <p><strong>Peso:</strong> {productoSeleccionado.peso} {productoSeleccionado.unidad_medida || ""}</p>
                <p><strong>Precio:</strong> ${productoSeleccionado.precio?.toLocaleString()}</p>
                <p><strong>Supermercado:</strong> {productoSeleccionado.supermercado_nombre}</p>
                <p><strong>Categoría:</strong> {productoSeleccionado.categoria}</p>
                
                <button
                  className="modal-report-button"
                  onClick={() => {
                    cerrarModal();
                    navigate('/reportar-precio', { state: { producto: productoSeleccionado } });
                  }}
                >
                  📝 Reportar nuevo precio
                </button>
                
                <button
                  className="modal-remove-button"
                  onClick={() => {
                    handleRemove(productoSeleccionado.id);
                    cerrarModal();
                  }}
                >
                  ❌ Eliminar de notas
                </button>
                
                <button className="modal-close-button" onClick={cerrarModal}>
                  ✕ Cerrar
                </button>
                
                {grupoProductos.length > 1 && (
                  <div className="slider-buttons">
                    <button onClick={() => cambiarProductoGrupo(-1)}>←</button>
                    <span>{indexProductoGrupo + 1} de {grupoProductos.length}</span>
                    <button onClick={() => cambiarProductoGrupo(1)}>→</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Notas;