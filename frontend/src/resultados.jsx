import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './resultados.css';
import logo from './assets/logos/logo.png';
import homeIcon from './assets/logos/home icon.svg';
import userIcon from './assets/logos/user icon.svg';
import notesIcon from './assets/logos/list icon.svg';

function Resultados() {
  const location = useLocation();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [esCategoria, setEsCategoria] = useState(false);
  const query = new URLSearchParams(location.search).get('query');

  // Lista de categorías conocidas (debes actualizarla con tus categorías reales)
  const categoriasConocidas = ['carnes', 'aseo', 'frutas', 'verduras', 'alcohol', 'bebidas', 'lácteos'];

  useEffect(() => {
    const fetchProductos = async () => {
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

        if (categoriaEncontrada) {
          // Buscar como categoría
          const response = await fetch(`http://localhost:3000/api/productos/categoria/${categoriaEncontrada}`);
          if (!response.ok) throw new Error('Error al buscar productos por categoría');
          const data = await response.json();
          setProductos(data);
          setEsCategoria(true);
        } else {
          // Buscar como producto normal
          const response = await fetch(`http://localhost:3000/api/productos/buscar?query=${encodeURIComponent(query)}`);
          if (!response.ok) throw new Error('Error al buscar productos');
          const data = await response.json();
          setProductos(data);
          setEsCategoria(false);
        }
      } catch (err) {
        setError(err.message);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [query, navigate]);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleNotesClick = () => {
    navigate('/notas');
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
        <h1>
          {esCategoria 
            ? `Productos de la categoría: "${query}"` 
            : `Resultados para: "${query}"`
          }
        </h1>
        
        {productos.length === 0 ? (
          <p className="no-results">
            {esCategoria
              ? `No encontramos productos en la categoría "${query}"`
              : `No encontramos productos que coincidan con "${query}"`
            }
          </p>
        ) : (
          <>
            <p className="results-count">{productos.length} {productos.length === 1 ? 'resultado' : 'resultados'} encontrados</p>
            <div className="products-grid">
              {productos.map((producto) => (
                <div key={producto.id} className="product-card">
                  <img 
                    src={producto.imagen || '/default-product.png'} 
                    alt={producto.nombre} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = '/default-product.png';
                    }}
                  />
                  <h3>{producto.nombre}</h3>
                  <div className="product-info">
                    <span className="price">
                      ${producto.precio?.toLocaleString('es-CO') || 'N/A'}
                    </span>
                    <span className="store">
                      {producto.supermercado_nombre || 'Varios supermercados'}
                    </span>
                  </div>
                  <button 
                    className="add-to-notes"
                    onClick={() => handleAddToNotes(producto)}
                  >
                    Añadir a notas
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Resultados;