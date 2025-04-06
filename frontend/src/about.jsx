import React from 'react';
import './about.css';
import logo from './assets/logos/logo.png';
import userIcon from './assets/logos/user icon.svg';
import notesIcon from './assets/logos/list icon.svg';
import questionImage from './assets/logos/question.png';
import { useNavigate } from 'react-router-dom'; // 👈 Importamos el hook

const About = () => {
  const navigate = useNavigate(); // 👈 Hook para redirigir

  return (
    <div className="about-container">
      {/* Navbar */}
      <nav className="about-navbar">
        <div className="about-logo">
          <img src={logo} alt="Pricen Logo" />
          <span>Pricen</span>
        </div>
        <div className="about-icons">
          {/* 👇 Redirección al hacer click */}
          <img
            src={userIcon}
            alt="User Icon"
            onClick={() => navigate('/login')}
            style={{ cursor: 'pointer' }}
          />
          <img src={notesIcon} alt="Notes Icon" />
        </div>
      </nav>

      {/* Sección de About */}
      <div className="about-content">
        <div className="about-text">
          <h1>About Us</h1>
          <h2>¿Quienes somos?</h2>
          <p>
            Somos un equipo de estudiantes universitarios de la Universidad del Valle, quienes mediante orientación de los profesores
            vimos una enorme oportunidad de crear una página web útil y funcional para el diario.
          </p>
          <p>
            Pricen es un comparador de precios de productos de diferentes supermercados colombianos. Es muy útil, pues tiene funciones
            para añadir a las notas diferentes productos seleccionados previamente.
          </p>
        </div>
        <div className="about-image">
          <img src={questionImage} alt="Imagen representativa" />
        </div>
      </div>

      {/* Sección de Contacto */}
      <div className="contact-section">
        <h2>Contáctanos</h2>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" placeholder="Ingrese su nombre" />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input type="text" id="apellido" name="apellido" placeholder="Ingrese su apellido" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" placeholder="Ingrese su correo" />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea id="mensaje" name="mensaje" placeholder="Ingrese su mensaje"></textarea>
          </div>

          <button type="submit">Enviar</button>
        </form>
      </div>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-logo">
          <img src={logo} alt="Pricen Logo" />
          <p>Pricen</p>
        </div>
        <div className="footer-links">
          <div>
            <h3>About Us</h3>
            <ul>
              <li><a href="/about">¿Quienes somos?</a></li>
              <li><a href="#">¿Es gratuita la app?</a></li>
            </ul>
          </div>
          <div>
            <h3>Políticas</h3>
            <ul>
              <li><a href="#">Privacidad</a></li>
              <li><a href="#">Tratamiento de datos</a></li>
            </ul>
          </div>
          <div>
            <h3>Recompensas</h3>
            <ul>
              <li><a href="#">Cómo funciona</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
