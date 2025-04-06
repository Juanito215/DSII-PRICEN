import React, { useEffect } from 'react';
import './App.css';
import logo from './assets/logos/logo.png'; // Importa tu logo
import userIcon from './assets/logos/user icon.svg'; // Ícono de usuario
import notesIcon from './assets/logos/list icon.svg'; // Ícono de notas
import searchIcon from './assets/logos/search.png'; // Ícono de búsqueda
import banner from './assets/home/banner-img.png'; // Banner
import brilla from './assets/home/brilla.png'; // Banner
import brilla2 from './assets/home/brilla2.png'; // Banner
import cerveza1 from './assets/home/cerveza bahia.png'; // Banner
import cerveza2 from './assets/home/cerveza2.png'; // Banner
import cerveza3 from './assets/home/cerveza3.png'; // Banner
import chocolatina from './assets/home/chocolatina.png'; // Banner
import lomo from './assets/carnes/lomocerdo.png'; // Banner
import d1logo from './assets/logos/d1logo.png'; // Banner
import aralogo from './assets/logos/aralogo.png'; // Banner
import exitologo from './assets/logos/exitologo.png'; // Banner
import { useNavigate } from 'react-router-dom';

function App() {

  const [currentIndex, setCurrentIndex] = React.useState(0);

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

  //Truco del almendurco para efecto infinito en el carrusel
  const duplicateProducts = [...products, ...products, ...products];


  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? duplicateProducts.length - 1 : prevIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === duplicateProducts.length - 1 ? 0 : prevIndex + 1);
  };

  useEffect(() => {
    // Si llegamos al final derecho (duplicado)
    if (currentIndex >= products.length * 2) {
      setTimeout(() => {
        setCurrentIndex(products.length); // Reinicia al inicio "real" (no al 0 absoluto)
      }, 0);
    }
    // Si llegamos al inicio izquierdo (antes del 0)
    else if (currentIndex <= 0) {
      setTimeout(() => {
        setCurrentIndex(products.length); // Reinicia al final "real"
      }, 0);
    }
  }, [currentIndex, products.length]);

  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Redirige al login (puedes usar react-router-dom más adelante)
    navigate('/login');
  };

  const handleNotesClick = () => {
    // Despliega notas (por ahora vacío)
    alert('Desplegando notas...');
  };
  const handleCategoriasClick = () => {
    // Redirige a la página de categorías
    navigate('/categorias');
  }

  return (
    <>
      <div className="navbar">
        {/* Logo a la izquierda */}
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        {/* Barra de búsqueda en el centro */}
        <div className="search-bar">
          <input type="text" placeholder="¿Que producto estas buscando?" />
          <button className="search-button">
            <img src={searchIcon} alt="Buscar" />
          </button>
        </div>

        {/* Botones a la derecha */}
        <div className="buttons">
          <button onClick={handleLoginClick} className="icon-button">
            <img src={userIcon} alt="Login" />
          </button>
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

        {/* Productos */}
        <div className= 'productos-buscados'>
          <h2>¡Productos más buscados!</h2>
          <div className='carrusel'>
            <button className='prev' onClick={handlePrev}>
              &#10094;
            </button>
            <div className='carrusel-img'>
              {duplicateProducts.slice(currentIndex, currentIndex + 3).map((product, index) => (
                <div key={`${product.id}-${index}`} className= 'carrusel-item'>
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
        <div className = 'supermercados-comparados'>
          <h2>Supermercados comparados</h2>
          <div className = 'linea-decorativa'></div>
          <div className = 'supermercados-lista'>
            <div className = 'supermercado'>
              <img src={d1logo} alt="D1" />
              <p>D1</p>
            </div>
            <div className = 'supermercado'>
              <img src={aralogo} alt="ARA" />
              <p>ARA</p>
          </div>
            </div>
          <div className = 'supermercado'>
            <img src={exitologo} alt="exito" />
            <p>Exito</p>
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
                <li><a href= "/about">¿Quienes somos?</a></li>
                <li><a href= "/mission">Acerca de</a></li>
                <li><a href= "/team">Nuestro equipo</a></li>
                <li><a href= "/contact">Contactanos</a></li>
              </ul>
            </div>
            <div className='footer-column'>
              <h3>Services</h3>
              <ul>
                <li><a href= "/services">¿Qué hacemos?</a></li>
                <li><a href= "/products">Productos</a></li>
                <li><a href= "/offers">Ofertas</a></li>
                <li><a href= "/brands">Marcas</a></li>
              </ul>
              </div>
            <div className='footer-column'>
              <h3>Servicios</h3>
              <ul>
                <li><a href= "/privacy">Privacidad</a></li>
                <li><a href= "/terms">Términos y condiciones</a></li>
                <li><a href= "/cookies">Cookies</a></li>
              </ul>
            </div>  
          </div>
        </div>
    </div>
    </>
  );
}

export default App;