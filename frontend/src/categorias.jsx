import React from 'react';
import './categorias.css';
import logo from './assets/logos/logo.png';
import userIcon from './assets/logos/user icon.svg';
import notesIcon from './assets/logos/list icon.svg';
import { useNavigate } from 'react-router-dom';

// Importa tus imágenes para las categorías
import carnesImg from './assets/carnes/carnesBanner.png';
import aseoImg from './assets/aseo/aseoBanner.png';
import frutasVerdurasImg from './assets/verduras/fruits-header.avif';
import alcoholImg from './assets/home/alcohol.png';
import lacteosImg from './assets/lacteos/lacteos-banner.jpg';
import skincareImg from './assets/Skincare/skincare-banner.jpg';

function Categorias() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleNotesClick = () => {
    alert('Desplegando notas...');
  };

  // Datos de las categorías
  const categorias = [
    { id: 1, nombre: 'Carnes', imagen: carnesImg, ruta: '/carnes' },
    { id: 2, nombre: 'Aseo', imagen: aseoImg, ruta: '/aseo' },
    { id: 3, nombre: 'Frutas y Verduras', imagen: frutasVerdurasImg, ruta: '/frutasVerduras' },
    { id: 4, nombre: 'Alcohol', imagen: alcoholImg, ruta: '/alcohol' },
    {id: 5, nombre: 'Lácteos', imagen: lacteosImg, ruta: '/lacteos'},
    {id: 6, nombre: 'Skincare', imagen: skincareImg, ruta: '/skincare'},
    // Puedes agregar más categorías aquí
  ];

  const handleCategoriaClick = (ruta) => {
    navigate(ruta);
  };

  return (
    <>
    <div className="page-container">
      {/* Navbar igual al home */}
      <div className="navbar">
        <div className="logo-app">
          <img src={logo} alt="Logo" />
        </div>

        <div className="buttons">
          <button onClick={handleLoginClick} className="icon-button">
            <img src={userIcon} alt="Login" />
          </button>
          <button onClick={handleNotesClick} className="icon-button">
            <img src={notesIcon} alt="Notas" />
          </button>
        </div>
      </div>
      </div>

      {/* Contenido principal - Grid de categorías */}
    <main className = "content-wrap">
        <div className="categorias-container">
            <h1>Explora nuestras categorías</h1>
            <div className="categorias-grid">
            {categorias.map((categoria) => (
                <div 
                key={categoria.id}
                className="categoria-card"
                onClick={() => handleCategoriaClick(categoria.ruta)}
                style={{ backgroundImage: `url(${categoria.imagen})` }}
                >
                <div className="categoria-overlay"></div>
                <h2>{categoria.nombre}</h2>
                </div>
            ))}
            </div>
        </div>
    </main>
      {/* Footer igual al home */}
        <div className='footer-categorias'>
          <div className='footer-logo'>
            <img src={logo} alt="Logo" />
            <p>Pricen</p>
          </div>
          <div className='footer-links'>
            <div className='footer-column'>
              <h3>About Us</h3>
              <ul>
                <li><a href="/about">¿Quienes somos?</a></li>
                <li><a href="/preguntas-frecuentes">Preguntas-Frecuentes</a></li>
              </ul>
            </div>
            <div className='footer-column'>
              <h3>Servicios</h3>
              <ul>
                <li><a href="/ayuda">Ayuda</a></li>
                <li><a href="/categorias">Productos</a></li>
              </ul>
            </div>
            <div className='footer-column'>
              <h3>Aviso Legal</h3>
              <ul>
                <li><a href="/privacidad">Privacidad</a></li>
                <li><a href="/terminos-y-condiciones">Terminos y Condiciones</a></li>
              </ul>
            </div>  
          </div>
        </div>
    </>
  );
}

export default Categorias;