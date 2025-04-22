import React from 'react';
import './perfilUsuario.css';
import logo from './assets/logos/logo.png';
import userIcon from './assets/logos/user icon.svg';
import notesIcon from './assets/logos/list icon.svg';
import searchIcon from './assets/logos/search.png';
import {
  FaBars
} from 'react-icons/fa';

const UserProfile = () => {

  const handleCategoriasClick = () => console.log("Categorías clickeado");
  const handleLoginClick   = () => console.log("Login clickeado");
  const handleNotesClick   = () => console.log("Notas clickeado");
  const handleChangePass   = () => console.log("Cambiar contraseña");

  return (
    <div className="profile-page">

      {/* NAVBAR */}
      <div className="navbar">
        <div className="navbar-left">
          <button className="menu-button" onClick={handleCategoriasClick}>
            <FaBars className="icon-menu" />
          </button>
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="¿Qué producto estás buscando?" />
          <button className="search-button">
            <img src={searchIcon} alt="Buscar" />
          </button>
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <aside className="sidebar">
          {/* puedes mantener o quitar este botón lateral */}
        </aside>

        <section className="profile-section">
          <h2 className="profile-title">Mi Perfil</h2>

          <div className="profile-card">
            <div className="profile-row top-row">
              <div className="profile-info">
                <h3>Información Personal</h3>

                <div className="info-field">
                  <label>Nombres</label>
                  <div className="field-value">
                    <span>Carlos</span>
                  </div>
                </div>

                <div className="info-field">
                  <label>Apellidos</label>
                  <div className="field-value">
                    <span>González</span>
                  </div>
                </div>

                <div className="info-field">
                  <label>Correo Electrónico</label>
                  <div className="field-value">
                    <span>carlos.gonzalez@example.com</span>
                  </div>
                </div>

                <div className="info-field">
                  <label>Número de Teléfono</label>
                  <div className="field-value">
                    <span>123-456-7890</span>
                  </div>
                </div>

                <div className="info-field">
                  <label>Dirección</label>
                  <div className="field-value">
                    <span>Calle Principal #123</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-row bottom-row">
              <div className="points">
                <h3>1200</h3>
                <p>Puntos</p>
              </div>
              <button className="save-button">
                Guardar Cambios
              </button>
            </div>
          </div>

          {/* NUEVO BOTÓN CAMBIAR CONTRASEÑA ABAJO */}
          <div className="profile-footer">
            <button
              className="change-password-button"
              onClick={handleChangePass}
            >
              Cambiar Contraseña
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
