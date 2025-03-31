import React, { useState, useEffect } from "react";
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./login.css";

const API_URL = "http://localhost:3000/api/usuarios"; // Asegúrate de que sea la URL correcta de tu backend

const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const toggleForm = () => setIsActive(!isActive);

  // 🔹 REGISTRO DE USUARIO
  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password_hash: password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registro exitoso. Ahora inicia sesión.");
        setIsActive(false); // Mueve al usuario a la pantalla de login
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Error en el registro:", error);
      alert("Hubo un problema con el registro.");
    }
  };

  // 🔹 INICIO DE SESIÓN
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Inicio de sesión exitoso.");
        localStorage.setItem("token", data.token); // 🔹 Guarda el token
        navigate("/"); // 🔹 Redirige al usuario a la página principal
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Error en el login:", error);
      alert("Hubo un problema con el inicio de sesión.");
    }
  };

  return (
    <div className={`container ${isActive ? "active" : ""}`} id="container">
      {/* Formulario de Registro */}
      <div className="form-container sign-up">
        <form onSubmit={handleRegister}>
          <h1>Crear una cuenta</h1>
          <div className="social-icons">
            <a href="#" className="icon"><FaGoogle /></a>
            <a href="#" className="icon"><FaFacebookF /></a>
            <a href="#" className="icon"><FaGithub /></a>
            <a href="#" className="icon"><FaLinkedinIn /></a>
          </div>
          <span>O usa tu email para registrarte</span>
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Crear cuenta</button>
        </form>
      </div>

      {/* Formulario de Login */}
      <div className="form-container sign-in">
        <form onSubmit={handleLogin}>
          <h1>Iniciar Sesión</h1>
          <div className="social-icons">
            <a href="#" className="icon"><FaGoogle /></a>
            <a href="#" className="icon"><FaFacebookF /></a>
            <a href="#" className="icon"><FaGithub /></a>
            <a href="#" className="icon"><FaLinkedinIn /></a>
          </div>
          <span>O usa tu correo y contraseña</span>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <a href="#">¿Olvidaste tu contraseña?</a>
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>

      {/* Panel de alternancia */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Bienvenido!</h1>
            <p>Registrate para usar todas las funcionalidades de la app o inicia sesión si ya tienes una cuenta!</p>
            <button className="hidden" onClick={toggleForm}>Iniciar sesión</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Bienvenido de vuelta!</h1>
            <p>Inicia sesión con tu correo y contraseña previamente registrados para acceder a tu perfil o registrarte con una cuenta nueva!</p>
            <button className="hidden" onClick={toggleForm}>Registrarse</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
