import React, { useState } from 'react';
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import './login.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    
  const [isActive, setIsActive] = useState(false);

      //Truco del almendruco para que el body solo afecte a esta pagina.
useEffect(() => {
    document.body.classList.add('login-page');
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);


  const toggleForm = () => {
    setIsActive(!isActive);
  };
  const navigate = useNavigate();
  const handleHomeClick = (event) => {
    event.preventDefault();
    navigate('/'); // Redirige al login
  }




  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      {/* Formulario de Registro */}
      <div className="form-container sign-up">
        <form>
          <h1>Crear una cuenta</h1>
          <div className="social-icons">
            <a href="#" className="icon"><FaGoogle /></a>
            <a href="#" className="icon"><FaFacebookF /></a>
            <a href="#" className="icon"><FaGithub /></a>
            <a href="#" className="icon"><FaLinkedinIn /></a>
          </div>
          <span>O usa tu email para registrarte</span>
          <input type="text" placeholder="Nombre" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Contraseña" />
          <button>Crear cuenta</button>
        </form>
      </div>

      {/* Formulario de Login */}
      <div className="form-container sign-in">
        <form onSubmit={handleHomeClick}>
          <h1>Iniciar Sesion</h1>
          <div className="social-icons">
            <a href="#" className="icon"><FaGoogle /></a>
            <a href="#" className="icon"><FaFacebookF /></a>
            <a href="#" className="icon"><FaGithub /></a>
            <a href="#" className="icon"><FaLinkedinIn /></a>
          </div>
          <span>O usa tu correo y contraseña</span>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Contraseña" />
          <a href="#">¿Olvidaste tu contraseña?</a>
          <button>Iniciar sesion</button>
        </form>
      </div>

      {/* Panel de alternancia */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Bienvenido!</h1>
            <p>Registrate para usar todas las funcionalidades de la app o inicia sesion si ya tienes una cuenta!</p>
            <button className="hidden" onClick={toggleForm}>Iniciar sesion</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Bienvenido de vuelta!</h1>
            <p>Inicia sesion con tu correo y contraseña previamente registrados para acceder a tu perfil o registrate con una cuenta nueva!</p>
            <button className="hidden" onClick={toggleForm}>Registrarse</button>
          </div>
        </div>
      </div>
    </div>
    
  );
  
};

export default Login;