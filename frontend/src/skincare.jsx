import React, { useEffect, useState, useMemo } from 'react';
import './skincare.css';
import logo from './assets/logos/logo.png';
import homeIcon from './assets/logos/home icon.svg';
import userIcon from './assets/logos/user icon.svg';
import notesIcon from './assets/logos/list icon.svg';
import featuredProductImage from './assets/Skincare/skincare-banner.jpg';
import { useNavigate } from 'react-router-dom';

function Skincare() {
  const navigate = useNavigate();
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [productosMostrados, setProductosMostrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [grupoProductos, setGrupoProductos] = useState([]);
  const [indexProductoGrupo, setIndexProductoGrupo] = useState(0);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [cheapestProduct, setCheapestProduct] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [filtro, setFiltro] = useState('predeterminado');

  // Función para normalizar texto
  const normalizarTexto = (texto) => {
    return texto
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  // Agrupar productos por nombre y marca
  const productosAgrupados = useMemo(() => {
    const grupos = {};
    
    productosOriginales.forEach(producto => {
      const clave = `${normalizarTexto(producto.nombre)}-${normalizarTexto(producto.marca || '')}`;
      
      if (!grupos[clave]) {
        grupos[clave] = [];
      }
      grupos[clave].push(producto);
    });

    return grupos;
  }, [productosOriginales]);

  // Obtener productos únicos para mostrar
  const obtenerProductosUnicos = useMemo(() => {
    return Object.values(productosAgrupados).map(grupo => grupo[0]);
  }, [productosAgrupados]);

  // Verificar si un producto tiene variantes
  const tieneVariantes = (producto) => {
    const clave = `${normalizarTexto(producto.nombre)}-${normalizarTexto(producto.marca || '')}`;
    return productosAgrupados[clave]?.length > 1;
  };

  const fetchProductos = async (ordenar = null, direccion = null) => {
    try {
      let url = 'http://localhost:3000/api/productos/categoria/Skincare';
      
      if (ordenar && direccion) {
        url += `?ordenar=${ordenar}&direccion=${direccion}`;
      } else if (ordenar === 'supermercado') {
        url += `?ordenar=supermercado&direccion=asc`;
      } else if (ordenar === 'visitas') {
        url = 'http://localhost:3000/api/productos/mas-vistos?categoria=Skincare';
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      setProductosOriginales(data);
      
      if (data.length > 0 && ordenar !== 'visitas') {
        setFeaturedProduct(data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
    
    const fetchProductoMasEconomico = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/productos/economicos/Skincare');
        if (!response.ok) throw new Error('Error al cargar el producto más económico');
        const data = await response.json();
        setCheapestProduct(data);
      } catch (err) {
        console.error("Error al obtener el producto más económico:", err.message);
      }
    };

    fetchProductoMasEconomico();
  }, []);

  useEffect(() => {
    switch(filtro) {
      case 'precio-asc':
        fetchProductos('precio', 'asc');
        break;
      case 'precio-desc':
        fetchProductos('precio', 'desc');
        break;
      case 'nombre-asc':
        fetchProductos('nombre', 'asc');
        break;
      case 'nombre-desc':
        fetchProductos('nombre', 'desc');
        break;
      case 'supermercado':
        fetchProductos('supermercado');
        break;
      case 'visitas':
        fetchProductos('visitas');
        break;
      default:
        fetchProductos();
        break;
    }
  }, [filtro]);

  useEffect(() => {
    setProductosMostrados(obtenerProductosUnicos);
  }, [productosOriginales, obtenerProductosUnicos]);

  const isAuthenticated = () => !!localStorage.getItem('token');

  const handleAddToNotes = async (producto, cantidad = 1, e) => {
    if (e) e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para agregar productos.');
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      const res = await fetch('http://localhost:3000/api/usuario-producto', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: userId,
          producto_id: producto.id,
          cantidad: cantidad
        }),
      });

      if (res.ok) {
        alert("Producto añadido a tus notas.");
      } else {
        const responseText = await res.text();
        alert("Error al agregar producto: " + responseText);
      }
    } catch (err) {
      console.error("Error al agregar producto a notas:", err);
      alert("No se pudo agregar el producto.");
    }
  };

  const abrirModal = async (producto) => {
    try {
      const response = await fetch(`http://localhost:3000/api/productos/${producto.id}/incrementar-visitas`, {
        method: 'POST'
      });
      const data = await response.json();
      
      const clave = `${normalizarTexto(producto.nombre)}-${normalizarTexto(producto.marca || '')}`;
      setProductosOriginales(prev => 
        prev.map(p => {
          const pClave = `${normalizarTexto(p.nombre)}-${normalizarTexto(p.marca || '')}`;
          if (pClave === clave) {
            return { ...p, visitas_semana: data.visitas };
          }
          return p;
        })
      );
    } catch (error) {
      console.error("Error al incrementar visitas:", error);
    }

    const clave = `${normalizarTexto(producto.nombre)}-${normalizarTexto(producto.marca || '')}`;
    const variantes = productosAgrupados[clave] || [producto];
    
    setGrupoProductos(variantes);
    setIndexProductoGrupo(variantes.findIndex(p => p.id === producto.id));
    setProductoSeleccionado(producto);
    setCantidad(1);
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

  const getImage = (name) => `/src/assets/Skincare/${name}`;

  const handleHomeClick = () => navigate('/');
  const handleLoginClick = () => navigate('/login');
  const handleNotesClick = () => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para ver tus notas.');
      navigate('/login');
      return;
    }
    navigate('/notas', { state: { from: '/skincare' } });
  };

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="skincare-page">
      <header className="skincare-header">
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
            </button>
          </div>
          <button onClick={handleLoginClick} className="header-button">
            <img src={userIcon} alt="Perfil" />
          </button>
        </div>
      </header>

      <section className="hero-section-skincare">
        <div className="hero-content">
          <h1 className="hero-title">Skincare</h1>
          <h2 className="hero-subtitle">Cuida y protege tu piel</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar productos de skincare..."
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
              {featuredProduct.descripcion || "Producto de skincare de alta calidad"}
            </p>
            <button className="action-button" onClick={() => handleAddToNotes(featuredProduct)}>
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
              {cheapestProduct.descripcion || "La opción más económica en productos de skincare"}
            </p>
            <button className="action-button" onClick={() => handleAddToNotes(cheapestProduct)}>
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
        <div className="filtros-container">
          <h2 className="section-title">Nuestros productos</h2>
          <span>Filtros:</span>
          <select 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-select"
          >
            <option value="predeterminado">Predeterminado</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
            <option value="nombre-asc">Nombre: A-Z</option>
            <option value="nombre-desc">Nombre: Z-A</option>
            <option value="supermercado">Supermercado</option>
            <option value="visitas">Más visitados</option>
          </select>
        </div>
        <div className="products-grid">
          {productosMostrados.map((producto) => {
            const tieneVar = tieneVariantes(producto);
            return (
              <div
                key={producto.id}
                className="product-card"
                onClick={() => abrirModal(producto)}
              >
                <img src={getImage(producto.imagen)} alt={producto.nombre} />
                {tieneVar && <div className="product-asterisk">*</div>}
                <h3>{producto.nombre}</h3>
                <div className="visitas-badge">{producto.visitas_semana || 0} vistas</div>
                <p>{producto.supermercado_nombre}</p>
                <div className="product-meta">
                  <span className="product-price">
                    ${producto.precio?.toLocaleString()}
                  </span>
                  <span className="product-volume">
                    {producto.volumen} {producto.unidad_medida}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {mostrarModal && productoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={getImage(productoSeleccionado.imagen)}
              alt={productoSeleccionado.nombre}
              className="modal-image"
            />
            <h2>{productoSeleccionado.nombre}</h2>
            <p><strong>Descripción:</strong> {productoSeleccionado.descripcion || "Sin descripción"}</p>
            <p><strong>Tipo:</strong> {productoSeleccionado.tipo_skincare || "Producto de cuidado facial"}</p>
            <p><strong>Tipo de piel:</strong> {productoSeleccionado.tipo_piel || "Todo tipo de piel"}</p>
            <p><strong>Volumen:</strong> {productoSeleccionado.volumen} {productoSeleccionado.unidad_medida || "ml"}</p>
            <p><strong>Precio:</strong> ${productoSeleccionado.precio?.toLocaleString()}</p>
            <p><strong>Supermercado:</strong> {productoSeleccionado.supermercado_nombre}</p>

            <div className="cantidad-input">
              <label htmlFor="cantidad"><strong>Cantidad:</strong></label>
              <input
                type="number"
                id="cantidad"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
              />
            </div>

            <div className="modal-buttons">
              <button className="modal-add-button" onClick={() => {
                handleAddToNotes(productoSeleccionado, cantidad);
                cerrarModal();
              }}>
                ➕ Añadir a notas
              </button>
              <button className="modal-report-button" onClick={() => {
                cerrarModal();
                navigate('/reportar-precio', { state: { producto: productoSeleccionado } });
              }}>
                📝 Reportar precio
              </button>
              <button className="modal-close-button" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>

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
    </div>
  );
}

export default Skincare;