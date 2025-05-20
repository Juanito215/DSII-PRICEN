import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './resultados.css';
import logo from './assets/logos/logo.png';
import homeIcon from './assets/logos/home icon.svg';
import userIcon from './assets/logos/user icon.svg';
import notesIcon from './assets/logos/list icon.svg';

function Resultados() {
  const location = useLocation();
  const navigate = useNavigate();
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [productosMostrados, setProductosMostrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [esCategoria, setEsCategoria] = useState(false);
  const [filtro, setFiltro] = useState('predeterminado');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [grupoProductos, setGrupoProductos] = useState([]);
  const [indexProductoGrupo, setIndexProductoGrupo] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  const query = new URLSearchParams(location.search).get('query');

  // Lista de categorías conocidas
  const categoriasConocidas = ['carnes', 'aseo', 'frutas', 'verduras', 'alcohol', 'bebidas', 'lácteos'];

  // Función para normalizar texto (eliminar tildes y convertir a minúsculas)
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

  // Obtener productos únicos para mostrar (uno por grupo)
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
      if (!query) {
        navigate('/');
        return;
      }

      setLoading(true);
      setError(null);

      // Verificar si la búsqueda es una categoría conocida
      const categoriaEncontrada = categoriasConocidas.find(
        cat => cat.toLowerCase() === query.toLowerCase().trim()
      );

      let url = '';
      if (categoriaEncontrada) {
        // Buscar como categoría
        url = `http://localhost:3000/api/productos/categoria/${categoriaEncontrada}`;
        
        if (ordenar && direccion) {
          url += `?ordenar=${ordenar}&direccion=${direccion}`;
        } else if (ordenar === 'supermercado') {
          url += `?ordenar=supermercado&direccion=asc`;
        } else if (ordenar === 'visitas') {
          url = `http://localhost:3000/api/productos/mas-vistos?categoria=${categoriaEncontrada}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al buscar productos por categoría');
        const data = await response.json();
        setProductosOriginales(data);
        setEsCategoria(true);
      } else {
        // Buscar como producto normal
        url = `http://localhost:3000/api/productos/buscar?query=${encodeURIComponent(query)}`;
        
        if (ordenar && direccion) {
          url += `&ordenar=${ordenar}&direccion=${direccion}`;
        } else if (ordenar === 'supermercado') {
          url += `&ordenar=supermercado&direccion=asc`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al buscar productos');
        const data = await response.json();
        setProductosOriginales(data);
        setEsCategoria(false);
      }
    } catch (err) {
      setError(err.message);
      setProductosOriginales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Aplicar filtro cuando cambia
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
    // Actualizar productos mostrados cuando cambian los productos originales
    setProductosMostrados(obtenerProductosUnicos);
  }, [productosOriginales, obtenerProductosUnicos]);

  const abrirModal = async (producto) => {
    try {
      const response = await fetch(`http://localhost:3000/api/productos/${producto.id}/incrementar-visitas`, {
        method: 'POST'
      });
      const data = await response.json();
      
      // Actualizar contador de visitas en todos los productos del grupo
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

    // Obtener todas las variantes del producto
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

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleNotesClick = () => {
    navigate('/notas');
  };

  const getImageURL = (nombreArchivo, categoria) => {
    try {
      return new URL(`/src/assets/${categoria}/${nombreArchivo}`, import.meta.url).href;
    } catch (e) {
      return '/default-product.png';
    }
  };

  const handleAddToNotes = (producto) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para agregar productos a tus notas');
      navigate('/login');
      return;
    }

    const notasActuales = JSON.parse(localStorage.getItem('notas')) || [];
    const existe = notasActuales.some(p => p.id === producto.id);
    
    if (existe) {
      alert('Este producto ya está en tus notas');
      return;
    }

    const nuevasNotas = [...notasActuales, producto];
    localStorage.setItem('notas', JSON.stringify(nuevasNotas));
    alert(`"${producto.nombre}" añadido a tus notas`);
  };

  if (loading) {
    return (
      <div className="resultados-page">
        <header className="resultados-header">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <div className="header-buttons">
            <button onClick={handleHomeClick} className="header-button">
              <img src={homeIcon} alt="Home" />
              <span>Home</span>
            </button>
            <button onClick={handleNotesClick} className="header-button">
              <img src={notesIcon} alt="Notas" />
            </button>
            <button onClick={handleLoginClick} className="header-button">
              <img src={userIcon} alt="Perfil" />
            </button>
          </div>
        </header>
        <div className="loading">Buscando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resultados-page">
        <header className="resultados-header">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <div className="header-buttons">
            <button onClick={handleHomeClick} className="header-button">
              <img src={homeIcon} alt="Home" />
              <span>Home</span>
            </button>
            <button onClick={handleNotesClick} className="header-button">
              <img src={notesIcon} alt="Notas" />
            </button>
            <button onClick={handleLoginClick} className="header-button">
              <img src={userIcon} alt="Perfil" />
            </button>
          </div>
        </header>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="resultados-page">
      <header className="resultados-header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="header-buttons">
          <button onClick={handleHomeClick} className="header-button">
            <img src={homeIcon} alt="Home" />
            <span>Home</span>
          </button>
          <button onClick={handleNotesClick} className="header-button">
            <img src={notesIcon} alt="Notas" />
          </button>
          <button onClick={handleLoginClick} className="header-button">
            <img src={userIcon} alt="Perfil" />
          </button>
        </div>
      </header>

      <section className="search-results">
        <div className="filtros-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ marginRight: '20px' }}>
            {esCategoria 
              ? `Productos de la categoría: "${query}"` 
              : `Resultados para: "${query}"`
            }
          </h1>
          <span style={{ marginRight: '10px' }}>Filtros:</span>
          <select 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              backgroundColor: '#0b7684',
              color: 'white',
              cursor: 'pointer'
            }}
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
        
        {productosMostrados.length === 0 ? (
          <p className="no-results">
            {esCategoria
              ? `No encontramos productos en la categoría "${query}"`
              : `No encontramos productos que coincidan con "${query}"`
            }
          </p>
        ) : (
          <>
            <p className="results-count">{productosMostrados.length} {productosMostrados.length === 1 ? 'resultado' : 'resultados'} encontrados</p>
            <div className="products-grid">
              {productosMostrados.map((producto) => {
                const tieneVar = tieneVariantes(producto);
                return (
                  <div 
                    key={producto.id} 
                    className="product-card"
                    onClick={() => abrirModal(producto)}
                  >
                    <img 
                      src={getImageURL(producto.imagen, producto.categoria)} 
                      alt={producto.nombre}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = '/default-product.png';
                      }}
                    />
                    {tieneVar && <div className="product-asterisk">*</div>}
                    <h3>{producto.nombre}</h3>
                    <div className="product-info-resultados">
                      <span className="price">
                        ${producto.precio?.toLocaleString('es-CO') || 'N/A'}
                      </span>
                      <span className="store">
                        {producto.supermercado_nombre || 'Varios supermercados'}
                      </span>
                    </div>
                    <div className="visitas-badge">{producto.visitas_semana || 0} vistas</div>
                    <button 
                      className="add-to-notes"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToNotes(producto);
                      }}
                    >
                      Añadir a notas
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {mostrarModal && productoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={getImageURL(productoSeleccionado.imagen, productoSeleccionado.categoria)}
              alt={productoSeleccionado.nombre}
              className="modal-image"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/default-product.png';
              }}
            />
            <h2>{productoSeleccionado.nombre}</h2>
            <p><strong>Descripción:</strong> {productoSeleccionado.descripcion || "Sin descripción"}</p>
            <p><strong>Peso:</strong> {productoSeleccionado.peso} {productoSeleccionado.unidad_medida || "Sin peso"}</p>
            <p><strong>Precio:</strong> ${productoSeleccionado.precio?.toLocaleString('es-CO')}</p>
            <p><strong>Supermercado:</strong> {productoSeleccionado.supermercado_nombre}</p>

            <div className="cantidad-input">
              <label htmlFor="cantidad"><strong>Cantidad:</strong></label>
              <input
                type="number"
                id="cantidad"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                style={{ marginLeft: '10px', width: '60px' }}
              />
            </div>

            <button 
              className="modal-add-button" 
              onClick={(e) => {
                e.stopPropagation();
                handleAddToNotes(productoSeleccionado);
                cerrarModal();
              }}
            >
              ➕ Añadir a notas
            </button>
            <button className="modal-close-button" onClick={cerrarModal}>Cerrar</button>
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

export default Resultados;