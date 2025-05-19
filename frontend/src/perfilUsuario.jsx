import React, { useState, useEffect } from 'react';
import './perfilUsuario.css';
import logo from './assets/logos/logo.png';
import userIcon from './assets/logos/user icon.svg';
import notesIcon from './assets/logos/list icon.svg';
import searchIcon from './assets/logos/search.png';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [usuario, setUsuario] = useState(null);
  const [totalPuntos, setTotalPuntos] = useState(0);
  const [historialPuntos, setHistorialPuntos] = useState([]);
  const [mostrarModalPass, setMostrarModalPass] = useState(false);
  const [nuevaPass, setNuevaPass] = useState('');
  const [confirmarPass, setConfirmarPass] = useState('');
  const [errorPass, setErrorPass] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:3000/api/usuarios/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('No autorizado');
        return res.json();
      })
      .then(data => {
        setUsuario(data);
        cargarPuntosYHistorial(token);
      })
      .catch(err => {
        console.error('Error al obtener perfil:', err);
        navigate('/login');
      });
  }, [navigate]);

  const cargarPuntosYHistorial = async (token) => {
    try {
      const [resTotal, resHistorial] = await Promise.all([
        fetch(`http://localhost:3000/api/historial/total`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:3000/api/historial/historial`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);

      if (!resTotal.ok || !resHistorial.ok) {
        throw new Error('Error al obtener puntos o historial');
      }

      const totalData = await resTotal.json();
      const historialData = await resHistorial.json();

      setTotalPuntos(totalData.totalPuntos || 0);
      setHistorialPuntos(historialData || []);
    } catch (error) {
      console.error('Error al cargar puntos o historial:', error);
    }
  };

  const abrirModalPass = () => {
    setMostrarModalPass(true);
    setNuevaPass('');
    setConfirmarPass('');
    setErrorPass('');
    setMensajeExito('');
  };

  const cerrarModalPass = () => {
    setMostrarModalPass(false);
  };

  return (
    <div className="profile-page">
      <div className="navbar">
        <div className="navbar-left">
          <button className="menu-button"><FaBars className="icon-menu" /></button>
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
          <button className="icon-button"><img src={userIcon} alt="Usuario" /></button>
          <button className="icon-button"><img src={notesIcon} alt="Notas" /></button>
        </div>
      </div>

      <main className="main-content">
        <aside className="sidebar"></aside>

        <section className="profile-section">
          <h2 className="profile-title">Mi Perfil</h2>

          <div className="profile-card">
            <div className="profile-row top-row">
              <div className="profile-info">
                <h3>Información Personal</h3>
                <div className="info-field">
                  <label>Nombre</label>
                  <div className="field-value"><span>{usuario?.nombre}</span></div>
                </div>
                <div className="info-field">
                  <label>Correo Electrónico</label>
                  <div className="field-value"><span>{usuario?.email}</span></div>
                </div>
              </div>
            </div>

            <div className="profile-row bottom-row">
              <div className="points">
                <h3>{totalPuntos}</h3>
                <p>Puntos acumulados</p>
              </div>
            </div>
          </div>

          <div className="historial-puntos">
            <h3>Historial de Puntos</h3>
            {historialPuntos.length === 0 ? (
              <p>No hay historial de puntos.</p>
            ) : (
              <ul>
                {Array.isArray(historialPuntos) && historialPuntos.length > 0 ? (
                  historialPuntos.map((registro, index) => (
                    <li key={index}>
                      <strong>{registro.puntos} puntos</strong> – {registro.descripcion} ({new Date(registro.fecha).toLocaleString()})
                    </li>
                  ))
                ) : (
                  <p>No hay historial de puntos disponible.</p>
                )}
              </ul>
            )}
          </div>

          <div className="profile-footer">
            <button className="change-password-button" onClick={abrirModalPass}>Cambiar Contraseña</button>
          </div>
        </section>
      </main>

      {mostrarModalPass && (
        <div className="modal-overlay" onClick={cerrarModalPass}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cambiar Contraseña</h3>

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaPass}
              onChange={(e) => setNuevaPass(e.target.value)}
              className="modal-input"
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmarPass}
              onChange={(e) => setConfirmarPass(e.target.value)}
              className="modal-input"
            />

            {errorPass && <p style={{ color: 'red' }}>{errorPass}</p>}
            {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}

            <div className="modal-buttons">
              <button className="btn-confirm" onClick={async () => {
                if (nuevaPass !== confirmarPass) {
                  setErrorPass('Las contraseñas no coinciden');
                  return;
                }

                const token = localStorage.getItem('token');
                try {
                  const res = await fetch('http://localhost:3000/api/usuarios/password', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ nuevaPassword: nuevaPass }),
                  });

                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message);

                  setMensajeExito('Contraseña actualizada con éxito');
                  setTimeout(() => cerrarModalPass(), 2000);
                } catch (error) {
                  setErrorPass('Error al actualizar la contraseña');
                }
              }}>
                Confirmar
              </button>
              <button className="btn-cancel" onClick={cerrarModalPass}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
