import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './assets/logos/logo.png';
import userIcon from './assets/logos/user icon.svg';
import notesIcon from './assets/logos/list icon.svg';
import searchIcon from './assets/logos/search.png';
import banner from './assets/home/banner-img.png';
import d1logo from './assets/logos/d1logo.png';
import aralogo from './assets/logos/aralogo.png';
import rewarded from './assets/logos/rewarded.svg';
import exitologo from './assets/logos/exitologo.png';
import { useNavigate } from 'react-router-dom';

function App() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getImage = (name, categoria = 'carnes') => {
    try {
      // Si es una URL completa, la devolvemos directamente
      if (name?.startsWith('http')) {
        return name;
      }
      
      // Para imágenes locales dinámicas por categoría
      return new URL(`/src/assets/${categoria}/${name}`, import.meta.url).href;
    } catch (error) {
      console.error(`Error cargando imagen ${name}:`, error);
      // Imagen por defecto según categoría o genérica
      return `/assets/${categoria}/default.png`;
    }
  };


  const [productosMasVistos, setProductosMasVistos] = useState([]);

  useEffect(() => {
    const fetchProductosMasVistos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/productos/mas-vistos?limit=8');
        const data = await response.json();
        setProductosMasVistos(data);
      } catch (error) {
        console.error('Error al obtener productos más vistos:', error);
      }
    };
  
    fetchProductosMasVistos();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? productosMasVistos.length - 1 : prevIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === productosMasVistos.length - 1 ? 0 : prevIndex + 1);
  };

    // Abre o cierra el sidebar (al hacer click en el menú hamburguesa)
    const handleNavBarClick = () => {
      setSidebarOpen((prev) => !prev);
    };
      // Función para redireccionar y cerrar el sidebar cuando se selecciona una categoría
    const handleNavBarSelect = (path) => {
      navigate(path);
      setSidebarOpen(false);
    };
  

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/api/usuarios/perfil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("No se pudo obtener el perfil");
        }

        const data = await res.json();
        setUsuario(data);
      } catch (error) {
        console.error("Error al obtener perfil:", error.message);
        setUsuario(null);
      }
    };

    fetchPerfil();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/resultados?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleNotesClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para acceder a las notas.");
      navigate('/login');
      return;
    }
    navigate('/notas', {state: { from: '/' }});
  };

  const handleCategoriasClick = () => {
    navigate('/categorias');
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombreUsuario");
    setIsLoggedIn(false);
    alert("Has cerrado sesión.");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <div className="navbar">
        {/* Botón de menú hamburguesa */}
        <div classname="navbar-left">
          {/*Botones */}
          <button className='menu-button' onClick={handleNavBarClick}>
            <span className="hamburger-icon"></span>
          </button>
        </div>
        {/* Logo a la izquierda */}
        <div className="logo-app">
          <img src={logo} alt="Logo" />
          <header>
            {usuario ? (
              <p>Hola, <strong>{usuario.nombre}</strong> 👋</p>
            ) : (
              <p>No has iniciado sesión</p>
            )}
          </header>
        </div>
        {/* Barra de búsqueda en el centro - Ahora funcional */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="¿Qué producto estás buscando?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <img src={searchIcon} alt="Buscar" />
          </button>
        </form>

        {/* Botón de categorías */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button classname="close-sidebar" onClick={handleNavBarClick}>
            &times;
          </button>
          <h3>Categorías</h3>
          <ul>
            <li onClick={() => handleNavBarSelect('/aseo')}>Aseo</li>
            <li onClick={() => handleNavBarSelect('/carnes')}>Carnes</li>
            <li onClick={() => handleNavBarSelect('/frutasVerduras')}>Frutas y verduras</li>
            <li onClick={() => handleNavBarSelect('/alcohol')}>Alcohol</li>
            </ul>
        </div>

        {/* Botón de gestión de productos (solo para admins) */}
        {usuario?.rol === 'admin' && (
        <div className="buttons">
          <button 
            onClick={() => navigate('/admin')} 
            className="icon-button admin-button"
            title="Gestión de productos"
          >
            🛠️
          </button>
        </div>
        )}    
      {/* Banner de recompensas */}
      <div className="reward-container">
        <button
          className="reward-button"
          onClick={() => navigate('/recompensas')}
        >
          <img src={rewarded} alt="Recompensas" />
        </button>
      </div>

        {/* Boton de Usuario */}
        <div className="user-dropdown">
          <button onClick={toggleDropdown} className="icon-button">
            <img src={userIcon} alt="Usuario" />
          </button>
          {showDropdown && isLoggedIn && (
            <div className="dropdown-menu">
              <button onClick={() => navigate('/perfil')}>Perfil</button>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
          {showDropdown && !isLoggedIn && (
            <div className="dropdown-menu">
              <button onClick={() => navigate('/login')}>Iniciar sesión</button>
            </div>
          )}
        </div>

        {/* Boton de notas */}
        <div className="buttons">
          <button onClick={handleNotesClick} className="icon-button">
            <img src={notesIcon} alt="Notas" />
          </button>
        </div>
      </div>

      {/* Contenido principal*/}
      <div className="main-content">
        {/* Banner */}
        <div className="banner">
          <div className="banner-text">
            <h1>Compara, ahorra y elige: ¡Todo en un solo lugar!</h1>
            <p>Encuentra las mejores ofertas en aseo, alimentos y tecnologia, siempre al mejor precio!</p>
            <button onClick={handleCategoriasClick} className="banner-button">¡Empezar a comparar!</button>
          </div>
          <div className="banner-img">
            <img src={banner} alt="Banner" /> 
          </div>
        </div>

        <div className="how-to-use-container">
          <button
            className="how-to-use-button"
            onClick={() => navigate('/ayuda')}
          >
            ¿Cómo usar?
          </button>
        </div>

      {/* Productos más vistos */}
      <div className='productos-buscados'>
              <h2>¡Productos más populares!</h2>
              <div className='carrusel'>
                {productosMasVistos.length > 0 ? (
                  <>
                    <button className='prev' onClick={handlePrev}>
                      &#10094;
                    </button>
                    <div className='carrusel-img'>
                      {productosMasVistos.slice(currentIndex, currentIndex + 3).map((producto) => (
                        <div key={producto.id} className='carrusel-item'>
                          <img 
                            src={getImage(producto.imagen)} 
                            alt={producto.nombre} 
                            onError={(e) => {
                              e.target.src = '/assets/carnes/default.png';
                            }}
                          />
                          <p>{producto.nombre}</p>
                          <span className="visitas-badge">
                            👁️ {producto.visitas_semana || 0} vistas
                          </span>
                          {producto.precio && (
                            <p className="precio">${producto.precio.toLocaleString()}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    <button className='next' onClick={handleNext}>
                      &#10095;
                    </button>
                  </>
                ) : (
                  <p>Cargando productos más populares...</p>
                )}
              </div>
            </div>


        <div className='linea-decorativa'></div>  
        {/* Supermercados */}
        <div className='supermercados-comparados'>
          <h2>Supermercados comparados</h2>
          <div className='linea-decorativa'></div>
          <div className='supermercados-lista'>
            <div className='supermercado'>
              <img src={d1logo} alt="D1" />
              <p>D1</p>
            </div>
            <div className='supermercado'>
              <img src={aralogo} alt="ARA" />
              <p>ARA</p>
            </div>
            <div className='supermercado'>
              <img src={exitologo} alt="exito" />
              <p>Exito</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
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
    </>
  );
}

export default App;