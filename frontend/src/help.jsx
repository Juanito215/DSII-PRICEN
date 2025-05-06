import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './help.css';

// Logos e íconos
import logo from './assets/logos/logo.png';
import userIcon from './assets/logos/user icon.svg';
import notesIcon from './assets/logos/list icon.svg';

// Imágenes del carrusel
import signupImg from './assets/help/helpp/signup.png';
import loginImg from './assets/help/helpp/login.png';
import searchImg from './assets/help/helpp/search.png';
import priceImg from './assets/help/helpp/price.png';
import notesImg from './assets/help/helpp/notes.png';

export default function Ayuda() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const pasos = [
    {
      title: 'Regístrate',
      img: signupImg,
      desc: "Haz clic en 'Registrarse', completa tu correo, nombre y contraseña"
    },
    {
      title: 'Inicia sesión',
      img: loginImg,
      desc: 'Accede con tu correo y contraseña para ver todas las funciones'
    },
    {
      title: 'Busca productos',
      img: searchImg,
      desc: 'Usa la barra de búsqueda para encontrar el producto que te interesa'
    },
    {
      title: 'Selecciona producto',
      img: priceImg,
      desc: 'Selecciona el producto y añade el precio que viste en la tienda'
    },
    {
      title: 'Revisa tus notas',
      img: notesImg,
      desc: "En la sección 'Notas' revisa tus aportes y su puntuación"
    }
  ];

  const [current, setCurrent] = useState(0);
  const length = pasos.length;
  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);
  const goToSlide = (i) => setCurrent(i);

  const [startX, setStartX] = useState(null);
  const onTouchStart = (e) => setStartX(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextSlide();
    if (endX - startX > 50) prevSlide();
    setStartX(null);
  };

  return (
    <>
      {/* —— Navbar —— */}
      <header className="ayuda-navbar">
        <button className="menu-button">
          <span className="hamburger-icon"></span>
        </button>
        <img
          src={logo}
          alt="Pricen"
          className="logo"
          onClick={() => navigate('/')}
        />
        <div className="user-section">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="icon-button"
          >
            <img src={userIcon} alt="Usuario" className="icon-small" />
          </button>
          {showDropdown && (
            <div className="dropdown">
              {isLoggedIn ? (
                <>
                  <button onClick={() => navigate('/perfil')}>Perfil</button>
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </>
              ) : (
                <button onClick={() => navigate('/login')}>Iniciar sesión</button>
              )}
            </div>
          )}
          <button
            onClick={() => navigate('/notas')}
            className="icon-button"
          >
            <img src={notesIcon} alt="Notas" className="icon-small" />
          </button>
        </div>
      </header>

      {/* —— Sección de ayuda —— */}
      <section className="ayuda-section">
        <h2 className="carousel-title">Así de fácil es usar Pricen</h2>
        <div
          className="slider"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="slider-container"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {pasos.map((p, i) => (
              <div className="slide" key={i}>
                <img src={p.img} alt={p.title} />
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
          <button className="prev" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="next" onClick={nextSlide}>
            &#10095;
          </button>
        </div>

        <div className="indicators">
          {pasos.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === current ? 'active' : ''}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>

        <button className="cta-button" onClick={() => navigate('/')}>
          ¡Empezar a comprar!
        </button>
      </section>
    </>
  );
}
