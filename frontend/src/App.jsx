import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './assets/logos/logo.png';
import userIcon from './assets/logos/user icon.svg';
import notesIcon from './assets/logos/list icon.svg';
import searchIcon from './assets/logos/search.png';
import banner from './assets/home/banner-img.png';
import brilla from './assets/home/brilla.png';
import brilla2 from './assets/home/brilla2.png';
import cerveza1 from './assets/home/cerveza bahia.png';
import cerveza2 from './assets/home/cerveza2.png';
import cerveza3 from './assets/home/cerveza3.png';
import chocolatina from './assets/home/chocolatina.png';
import lomo from './assets/carnes/lomocerdo.png';
import d1logo from './assets/logos/d1logo.png';
import aralogo from './assets/logos/aralogo.png';
import exitologo from './assets/logos/exitologo.png';
import { useNavigate } from 'react-router-dom';

function App() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const products = [
    {id: 1, image: brilla, name: 'Detergente Brilla'},
    {id: 2, image: cerveza1, name: 'Cerveza Bahia'},
    {id: 3, image: cerveza2, name: 'Cerveza Club Colombia'},
    {id: 4, image: cerveza3, name: 'Cerveza Poker'},
    {id: 5, image: chocolatina, name: 'Chocolatina Jumbo'},
    {id: 6, image: lomo, name: 'Lomo de cerdo'},
    {id: 7, image: brilla2, name: 'Detergente Brilla'},
    {id: 8, image: cerveza3, name: 'Cerveza SI'},
  ];

  const duplicateProducts = [...products, ...products, ...products];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? duplicateProducts.length - 1 : prevIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === duplicateProducts.length - 1 ? 0 : prevIndex + 1);
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

  useEffect(() => {
    if (currentIndex >= products.length * 2) {
      setTimeout(() => {
        setCurrentIndex(products.length);
      }, 0);
    }
    else if (currentIndex <= 0) {
      setTimeout(() => {
        setCurrentIndex(products.length);
      }, 0);
    }
  }, [currentIndex, products.length]);

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

        {/* Productos */}
        <div className='productos-buscados'>
          <h2>¡Productos más buscados!</h2>
          <div className='carrusel'>
            <button className='prev' onClick={handlePrev}>
              &#10094;
            </button>
            <div className='carrusel-img'>
              {duplicateProducts.slice(currentIndex, currentIndex + 3).map((product, index) => (
                <div key={`${product.id}-${index}`} className='carrusel-item'>
                  <img src={product.image} alt={product.name} />
                  <p>{product.name}</p>
                </div>
              ))}
            </div>
            <button className='next' onClick={handleNext}>
              &#10095;
            </button>
          </div>
        </div>
        
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