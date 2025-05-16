import React, { useEffect, useState } from 'react';
import './carnes.css';
import logo from './assets/logos/logo.png';
import homeIcon from './assets/logos/home icon.svg';
import userIcon from './assets/logos/user icon.svg';
import notesIcon from './assets/logos/list icon.svg';
import featuredProductImage from './assets/carnes/carnesBanner.png';
import cheapProductImage from './assets/carnes/lomocerdo.png';
import { useNavigate } from 'react-router-dom';

function Carnes() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notas, setNotas] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [grupoProductos, setGrupoProductos] = useState([]);
  const [indexProductoGrupo, setIndexProductoGrupo] = useState(0);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [cheapestProduct, setCheapestProduct] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/productos/categoria/carnes');
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        setProductos(data);

        if (data.length > 0) {
          setFeaturedProduct(data[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchProductoMasEconomico = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/productos/economicos/carnes');
        if (!response.ok) throw new Error('Error al cargar el producto más económico');
        const data = await response.json();
        setCheapestProduct(data);
      } catch (err) {
        console.error("Error al obtener el producto más económico:", err.message);
      }
    };

    const saved = localStorage.getItem('productosCarnes');
    if (saved) {
      setProductos(JSON.parse(saved));
      setLoading(false);
    } else {
      fetchProductos();
    }

    fetchProductos();
    fetchProductoMasEconomico();
  }, []);

  const isAuthenticated = () => !!localStorage.getItem('token');

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      const userId = getUserIdFromToken();
      if (userId) {
        const notasKey = `notas_${userId}`;
        const notasGuardadas = JSON.parse(localStorage.getItem(notasKey)) || [];
        setNotas(notasGuardadas);
      }
    }
  }, []);

  const handleAddToNotes = (producto, e) => {
    if (e) e.stopPropagation();
    
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para agregar productos.');
      navigate('/login');
      return;
    }
    
    const userId = getUserIdFromToken();
    if (!userId) {
      alert('Error al obtener el ID del usuario.');
      return;
    }

    const notasKey = `notas_${userId}`;
    const existentes = JSON.parse(localStorage.getItem(notasKey)) || [];
    
    if (existentes.find(p => p.id === producto.id)) {
      alert('Este producto ya está en tus notas.');
      return;
    }
    
    const actualizadas = [...existentes, producto];
    localStorage.setItem(notasKey, JSON.stringify(actualizadas));
    setNotas(actualizadas);
    alert('Producto añadido a tus notas.');
  };
  const [contadorVisitas, setContadorVisitas] = useState({});

  // Modificar la función abrirModal para incrementar el contador
  const abrirModal = async (producto) => {
    // Incrementar contador en el backend
    try {
      const response = await fetch(`http://localhost:3000/api/productos/${producto.id}/incrementar-visitas`, {
        method: 'POST'
      });
      const data = await response.json();
      
      // Actualizar el contador localmente
    // Actualiza el estado local
    setProductos(prev => prev.map(p => 
      p.id === producto.id ? {...p, visitas_semana: data.visitas} : p
    ));
    } catch (error) {
      console.error("Error al incrementar visitas:", error);
    }

    // Resto de la lógica del modal
    const similares = productos.filter(p =>
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

  const getImage = (name) => {
    try {
      return new URL(`/src/assets/carnes/${name}`, import.meta.url).href;
    } catch {
      return '/assets/carnes/default.png';
    }
  };

  const handleHomeClick = () => navigate('/');
  const handleLoginClick = () => navigate('/login');
  const handleNotesClick = () => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para ver tus notas.');
      navigate('/login');
      return;
    }
    navigate('/notas', { state: { from: '/carnes' } });
  };

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="meat-page">
      <header className="meat-header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="header-buttons">
          <button onClick={handleHomeClick} className="header-button">
            <img src={homeIcon} alt="Home" />
            <span>Home</span>
          </button>
          <div className="notes-wrapper">
            <button
              onClick={handleNotesClick}
              className="header-button notes-button"
              title="Mis notas"
            >
              <img src={notesIcon} alt="Notas" />
              {notas.length > 0 && (
                <span className="notes-badge">{notas.length}</span>
              )}
            </button>
          </div>
          <button onClick={handleLoginClick} className="header-button">
            <img src={userIcon} alt="Perfil" />
          </button>
        </div>
      </header>

      <section className="hero-section-carnes">
        <div className="hero-content">
          <h1 className="hero-title">Carnes</h1>
          <h2 className="hero-subtitle">Calidad en cada corte</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar cortes de carne..."
              className="search-input"
            />
            <button className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {featuredProduct && (
        <section className="featured-product">
          <div className="product-info">
            <h2>Producto más visto</h2>
            <p className="product-description">
              {featuredProduct.descripcion || "Lomo fino de res premium, madurado por 21 días para máximo sabor y terneza."}
            </p>
            <button 
              className="action-button"
              onClick={() => handleAddToNotes(featuredProduct)}
            >
              Anotar
            </button>
          </div>
          <div className="product-image-container">
            <img 
              src={getImage(featuredProduct.imagen) || featuredProductImage} 
              alt="Producto destacado" 
              className="product-image" 
            />
          </div>
          <div className="product-price">
            <span className="price">${featuredProduct.precio?.toLocaleString()}</span>
            <span className="store">{featuredProduct.supermercado_nombre || "Supermercado"}</span>
          </div>
        </section>
      )}

      {cheapestProduct && (
        <section className="cheap-product">
          <div className="product-image-container">
            <img
              src={getImage(cheapestProduct.imagen)}
              alt={cheapestProduct.nombre}
              className="product-image"
            />
          </div>
          <div className="product-info">
            <h2>Producto más económico</h2>
            <p className="product-description">
              {cheapestProduct.descripcion || "Este producto tiene el precio más bajo actualmente en la categoría."}
            </p>
            <button
              className="action-button"
              onClick={() => handleAddToNotes(cheapestProduct)}
            >
              Anotar
            </button>
          </div>
          <div className="product-price">
            <span className="price">${cheapestProduct.precio?.toLocaleString()}</span>
            <span className="store">{cheapestProduct.supermercado_nombre || "Supermercado"}</span>
          </div>
        </section>
      )}

      <section className="products-section">
        <h2 className="section-title">Nuestros productos</h2>
        <div className="products-grid"> 
          {productos.map((producto) => {
            const duplicados = productos.filter(
              p => p.nombre === producto.nombre && p.marca === producto.marca
            );
            const esDuplicado = duplicados.length > 1;
            return (
              <div
                key={producto.id}
                className="product-card"
                onClick={() => abrirModal(producto)}
              >
                <img src={getImage(producto.imagen)} alt={producto.nombre} />
                {esDuplicado && <div className="product-asterisk">*</div>}
                <h3>{producto.nombre}</h3>
                {/* Nuevo: Contador de visitas */}
                <div className="visitas-badge">
                {producto.visitas_semana || 0} vistas
                </div>
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
                    handleAddToNotes(producto, e);
                  }}
                  title="Añadir a notas"
                >
                  ➕
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {mostrarModal && productoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={getImage(productoSeleccionado.imagen)} alt={productoSeleccionado.nombre} className="modal-image" />
            <h2>{productoSeleccionado.nombre}</h2>
            <p><strong>Descripción:</strong> {productoSeleccionado.descripcion || "Sin descripción"}</p>
            <p><strong>Peso:</strong> {productoSeleccionado.peso} {productoSeleccionado.unidad_medida || "Sin peso"}</p>
            <p><strong>Precio:</strong> ${productoSeleccionado.precio?.toLocaleString()}</p>
            <p><strong>Supermercado:</strong> {productoSeleccionado.supermercado_nombre}</p>
            <button
              className="modal-add-button"
              onClick={() => {
                handleAddToNotes(productoSeleccionado);
                cerrarModal();
              }}
            >
              ➕ Añadir a notas
            </button>
            <button
              className="modal-report-button"
              onClick={() => {
                cerrarModal();
                navigate('/reportar-precio', { state: { producto: productoSeleccionado } });
              }}
            >
              📝 Reportar nuevo precio
            </button>
            <button className="modal-close-button" onClick={cerrarModal}>Cerrar</button>
            {grupoProductos.length > 1 && (
              <div className="slider-buttons">
                <button onClick={() => cambiarProductoGrupo(-1)}>←</button>
                <button onClick={() => cambiarProductoGrupo(1)}>→</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className='footer'>
        <div className='footer-logo'>
          <img src={logo} alt="Logo" />
          <p>Pricen</p>
        </div>
        <div className='footer-links'>
          <div className='footer-column'>
            <h3>About Us</h3>
            <ul>
              <li><a href="/about">¿Quienes somos?</a></li>
              <li><a href="/mission">Acerca de</a></li>
              <li><a href="/team">Nuestro equipo</a></li>
              <li><a href="/contact">Contactanos</a></li>
            </ul>
          </div>
          <div className='footer-column'>
            <h3>Services</h3>
            <ul>
              <li><a href="/services">¿Qué hacemos?</a></li>
              <li><a href="/products">Productos</a></li>
              <li><a href="/offers">Ofertas</a></li>
              <li><a href="/brands">Marcas</a></li>
            </ul>
          </div>
          <div className='footer-column'>
            <h3>Servicios</h3>
            <ul>
              <li><a href="/privacy">Privacidad</a></li>
              <li><a href="/terms">Términos y condiciones</a></li>
              <li><a href="/cookies">Cookies</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carnes;